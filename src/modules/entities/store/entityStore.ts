import {defineStore} from 'pinia';
import {
    getEntities,
    getEntityData, getEntityInfo,
    idsFromQualifiedEntity,
    isPropertyId,
    parseEntityId,
    relatedEntityIds
} from "@/api/wikidata/wikidata";
import {Claim, Datavalue, EntityId, EntityMissingError, QualifiedEntityValue, SnakType} from "@/api/wikidata/types";
import {
    getExampleInstances, getExampleItems,
    getExampleSubclasses, getExampleValues, groupClaims,
    RELATED_PROPERTIES_THRESHOLD,
    RelatednessMapping, shouldRefresh, wikifyLink
} from "@/api/wikidata/sqid";
import {i18n} from "../../../plugins/all";
import {ClaimsMap} from "./claims/types";
import {EntitySiteLink, WBDatatype} from "@/api/wikidata/types";
import {EntityState} from "./types";
import {getRelatedStatements} from "@/api/wikidata/sparql";
import {idsFromExamples} from "./utils";
import {useStatisticsStore} from "@/store/statistics/statisticsStore";
import {useClassesStore} from "@/store/statistics/classes/classesStore";
import {usePropertiesStore} from "@/store/statistics/properties/propertiesStore";
import {useClaimsStore} from "./claims/claimsStore";
import {useTermsStore} from "./terms/termsStore";
import cloneDeep from "lodash/cloneDeep";

export interface EntityStoreState {
    entities: {
        [entityId: EntityId]: EntityState;
    };
}

export interface Entity {
    id: string
    images: any
    banner: any
    label: any
    aliases: any
    description: any
    kind: any
    propertyDatatype: any
    superProperties: any
    superClasses: any
    superClassesUsage: Map<EntityId, number>
    instanceClasses: any
    typicalProperties: any
    exampleItems: any
    exampleValues: any
    exampleInstances: any
    exampleSubclasses: any
    subclassesInstances: any
    subclassesSubclasses: any
    hierarchyStatistics: any
    timestamps: Map<EntityId, Date>,
    sitelinks: Map<EntityId, Map<string, EntitySiteLink>>,
    datatypes: { [key: string]: WBDatatype },
};

export const defaultEntity: Entity = {
    id: '',
    images: null,
    banner: null,
    label: null,
    aliases: null,
    description: null,
    kind: null,
    propertyDatatype: null,
    superProperties: null,
    superClasses: null,
    superClassesUsage: new Map<EntityId, number>(),
    instanceClasses: null,
    typicalProperties: null,
    exampleItems: null,
    exampleValues: null,
    exampleInstances: null,
    exampleSubclasses: null,
    subclassesInstances: null,
    subclassesSubclasses: null,
    hierarchyStatistics: null,
    timestamps: new Map<EntityId, Date>(),
    sitelinks: new Map<EntityId, Map<string, EntitySiteLink>>(),
    datatypes: {},
};

export const defaultEntityState: EntityState = {
    id: '',
    entity: cloneDeep(defaultEntity),
    loading: false,
    claims: null,
    reverseClaims: null,
    groupedClaims: null,
    groupedReverseClaims: null,
    propertyUsage: null,
    hierarchyStatistics: null,
    timestamps: new Map<EntityId, Date>(),
    sitelinks: new Map<EntityId, Map<string, EntitySiteLink>>(),
    datatypes: {}
};

export const useEntityStore = defineStore('entityStore', {
    /* state: (): EntityState => ({
        id: '',
        entity: cloneDeep(defaultEntity),
        loading: false,
        claims: null,
        reverseClaims: null,
        groupedClaims: null,
        groupedReverseClaims: null,
        propertyUsage: null,
        hierarchyStatistics: null,
        timestamps: new Map<EntityId, Date>(),
        sitelinks: new Map<EntityId, Map<string, EntitySiteLink>>(),
        datatypes: {}
    }), */
    state: (): EntityStoreState => ({
        entities: {}
    }),
    getters: {
        entityDataTimestamp: (state) => (entityId: EntityId) => {
            if (state.entities[entityId].timestamps.has(entityId)) {
                return state.entities[entityId].timestamps.get(entityId)!;
            }

            return new Date(0);
        },
        hasFreshData: (state) => (entityId: EntityId) => {
            let timestampCheck = null;
            if (state.entities[entityId].timestamps.has(entityId)) {
                timestampCheck = state.entities[entityId].timestamps.get(entityId)!;
            } else {
                timestampCheck = new Date(0);
            }
            return !shouldRefresh(timestampCheck.getTime());
        },
        hasSiteLink: (state) => (entityId: EntityId, wikiname: string) => {
            return state.entities[entityId].sitelinks.has(entityId) && state.entities[entityId].sitelinks.get(entityId)!.has(wikiname);
        },
        getSiteLink: (state) => (entityId: EntityId, wikiname: string) => {
            const sitelinks = state.entities[entityId].sitelinks.get(entityId);

            if (sitelinks === undefined) {
                return;
            }

            return sitelinks.get(wikiname);
        },
        getSiteLinkTitle: (state) => (entityId: EntityId, wikiname: string, queryEntityId: EntityId) => {
            if (state.entities[queryEntityId]?.sitelinks.has(entityId) && state.entities[queryEntityId]?.sitelinks.get(entityId)!.has(wikiname)) {
                const sitelinks = state.entities[queryEntityId]?.sitelinks?.get(entityId);

                if (sitelinks === undefined) {
                    return;
                }

                return sitelinks.get(wikiname);
            }
            return;
        },
        getWikipediaUrl() {
            return (entityId: EntityId, queryEntityId: EntityId) => {
                const wikiname = `${i18n.global.locale}wiki`;
                const title = this.getSiteLinkTitle(entityId, wikiname, queryEntityId);
                const url = useStatisticsStore().siteLinkUrl(wikiname, queryEntityId);

                if (!title || !url) {
                    return null;
                }
                // @ts-ignore
                return wikifyLink(url.replace('$1', title));
            }
        },
        getPropertyDatatype: (state) => (entityId: EntityId, queryEntityId: EntityId) => {
            console.log(state.entities[queryEntityId]);
            return state.entities[queryEntityId].datatypes[entityId]
        }
    },
    actions: {
        checkEntityStoreState(queryEntityId: EntityId) {
            if (!this.entities[queryEntityId]) {
                this.entities[queryEntityId] = cloneDeep(defaultEntityState);
            }
        },
        updateTimestamp(entityId: EntityId, queryEntityId: EntityId) {
            this.entities[queryEntityId].timestamps.set(entityId, new Date())
        },
        sitelinksLoaded({ entityId, sitelinks }: { entityId: EntityId,
                            sitelinks: Map<string, EntitySiteLink>,
                        }, queryEntityId: EntityId) {
            this.checkEntityStoreState(queryEntityId);
            this.entities[queryEntityId]?.sitelinks?.set(entityId, sitelinks)
        },
        datatypeLoaded({ entityId, datatype }: { entityId: EntityId,
                           datatype: WBDatatype,
                       }, queryEntityId: EntityId) {
            this.checkEntityStoreState(queryEntityId);
            Object.defineProperty(this.entities[queryEntityId].datatypes, entityId, { value: datatype,
                configurable: false })
        },
        datatypesLoaded(state: any, datatypes: { [key: string]: WBDatatype }) {
            for (const [propertyId, datatype] of Object.entries(datatypes)) {
                Object.defineProperty(state.datatypes, propertyId, { value: datatype,
                    configurable: false })
            }
        },
        async getEntityData(entityId: EntityId, queryEntityId: EntityId) {
            this.checkEntityStoreState(queryEntityId);
            const lang = i18n.global.locale;

            if (useTermsStore().hasTerms(entityId, lang, true, queryEntityId) &&
                useClaimsStore().hasClaims(entityId, queryEntityId)) {
                return { ...await useTermsStore().getTerms({entityId, lang}, queryEntityId),
                    claims: useClaimsStore().getClaims(entityId, queryEntityId),
                };
            }

            const langCode = lang || i18n.global.locale;
            const entityData = await getEntityData(entityId, langCode, true, queryEntityId)


            useClaimsStore().claimsLoaded(entityData.claims, queryEntityId);
            useTermsStore().termsLoaded({
                labels: entityData.labels,
                // @ts-ignore
                aliases: entityData.aliases,
                descriptions: entityData.descriptions,
            }, queryEntityId);
            this.sitelinksLoaded({
                entityId,
                sitelinks: entityData.sitelinks,
            }, queryEntityId);

            const datatype = entityData.datatype

            if (datatype) {
                this.datatypeLoaded({
                    entityId,
                    datatype
                }, queryEntityId);
            }

            return { ... await useTermsStore().getTerms({entityId, lang}, queryEntityId),
                claims: await useClaimsStore().getClaims(entityId, queryEntityId),
            }
        },
        async getPropertyDatatypes(entityIds: EntityId[], queryEntityId: EntityId) {
            this.checkEntityStoreState(queryEntityId);
            const missing = []

            for (const entityId of entityIds) {
                if (this.getPropertyDatatype(entityId, queryEntityId) === undefined) {
                    missing.push(entityId)
                }
            }

            if (missing.length) {
                const entityData = await getEntities(missing, ['info'])

                const datatypes: { [key: string]: WBDatatype } = {}
                for (const [entityId, data] of Object.entries(entityData)) {
                    if ('datatype' in data) {
                        datatypes[entityId] = data.datatype as WBDatatype
                    }
                }

                if (Object.keys(datatypes).length) {
                    for (const [propertyId, datatype] of Object.entries(datatypes)) {
                        Object.defineProperty(this.entities[queryEntityId].datatypes, propertyId, { value: datatype,
                            configurable: false })
                    }
                }
            }

            const result: { [key: string]: string } = {}

            for (const entityId of entityIds) {
                result[entityId] = this.getPropertyDatatype(entityId, queryEntityId)
            }

            return result
        },
        async getReverseClaims({}, entityId: EntityId) {
            const statements = await getRelatedStatements(entityId)
            const claims = new Map<EntityId, Claim[]>()

            for (const statement of statements) {
                const item = statement.item
                const { kind } = parseEntityId(item)

                const property = statement.property
                let propertyClaims = claims.get(property)

                if (propertyClaims === undefined) {
                    propertyClaims = []
                }

                const datavalue = {
                    type: 'wikibase-entityid',
                    value: {
                        'entity-type': kind,
                        'id': item,
                    },
                } as Datavalue

                const mainsnak = {
                    snaktype: 'value' as SnakType,
                    property: statement.property,
                    hash: '',
                    datavalue,
                    datatype: `wikibase-${kind}` as WBDatatype,
                }

                propertyClaims.push({
                    mainsnak,
                    type: 'statement',
                    id: statement.statement,
                    rank: statement.rank,
                    references: [],
                })

                claims.set(property, propertyClaims)
            }

            return claims
        },
        async getExampleInstances(entityId: EntityId) {
            return idsFromExamples(getExampleInstances, entityId);
        },
        async getExampleSubclasses(entityId: EntityId) {
            return idsFromExamples(getExampleSubclasses, entityId);
        },
        async getExampleItems(entityId: EntityId) {
            return idsFromExamples(getExampleItems, entityId);
        },
        async getExampleValues(entityId: EntityId) {
            return idsFromExamples(getExampleValues, entityId);
        },
        async doesEntityExist({}, entityId: EntityId) {
            try {
                await getEntityInfo(entityId)
            } catch (err) {
                if (err instanceof EntityMissingError) {
                    return false
                }

                // something else, re-throw
                throw err
            }

            return true
        },
        async updateEntityData(entityId: EntityId) {
            // @ts-ignore
            this.entities[entityId] = {};
            // @ts-ignore
            this.entities[entityId].entity = {};
            this.entities[entityId].loading = true;
            const {kind} = parseEntityId(entityId);
            if (this.entities[entityId].entity !== null) {
                // console.log('INSIDE?', this.entity);
                this.entities[entityId].entity.images = null;
                this.entities[entityId].entity.banner = null;
                this.entities[entityId].entity.kind = kind;
                this.entities[entityId].entity.propertyDatatype = null;
                this.entities[entityId].entity.superProperties = [];
                this.entities[entityId].entity.superClasses = [];
                this.entities[entityId].entity.superClassesUsage = new Map<EntityId, number>();
                this.entities[entityId].entity.instanceClasses = [];
                this.entities[entityId].entity.typicalProperties = [];
                this.entities[entityId].entity.exampleItems = [];
                this.entities[entityId].entity.exampleValues = [];
                this.entities[entityId].entity.exampleInstances = [];
                this.entities[entityId].entity.exampleSubclasses = [];
                this.entities[entityId].entity.subclassesInstances = {};
                this.entities[entityId].entity.subclassesSubclasses = {};
                this.entities[entityId].entity.datatypes = {};
            }
            this.entities[entityId].hierarchyStatistics = {
                directInstances: 0,
                directSubclasses: 0,
                allInstances: 0,
                allSubclasses: 0,
                superClasses: [],
                nonemptySubClasses: [],
                relatedProperties: [],
            };
            this.entities[entityId].propertyUsage = {
                items: 0,
                statements: 0,
                inQualifiers: 0,
                inReferences: 0,
                qualifiers: new Map<EntityId, number>(),
                classes: [],
            };
            this.entities[entityId].claims = null;
            this.entities[entityId].reverseClaims = null;
            this.entities[entityId].groupedClaims = null;
            this.entities[entityId].groupedReverseClaims = null;
            this.entities[entityId].datatypes = {};

            const record = await useClassesStore().getClassHierarchyRecord(entityId, entityId);
            console.log(record);
            console.log(record && this.entities[entityId].entity !== null);
            if (record && this.entities[entityId].entity !== null) {
                this.entities[entityId].hierarchyStatistics = record;
                const entityIds = record.superClasses.concat(record.nonemptySubClasses, record.relatedProperties);
                await useTermsStore().requestLabels({entityIds: entityIds, lang: i18n.global.locale}, entityId);

                const usage = await useClassesStore().getClassUsageCounts(record.nonemptySubClasses, entityId);
                for (const subclassId of record.nonemptySubClasses) {
                    const instances = usage.get(subclassId)!;
                    const subclasses = useClassesStore().getHierarchyRecord(subclassId, entityId)?.allSubclasses ?? null;

                    if (instances) {
                        this.entities[entityId].entity.subclassesInstances[`${subclassId}`] = instances;
                    }

                    if (subclasses) {
                        this.entities[entityId].entity.subclassesSubclasses[`${subclassId}`] = subclasses;
                    }
                }
            }
            console.log('SOM TU?');
            const examples = await this.getExampleItems(entityId);
            if (this.entities[entityId].entity !== null) {
                this.entities[entityId].entity.exampleItems = examples;
            }
            console.log('SOM TU? 2');
            const exampleValues = await this.getExampleValues(entityId);
            if (this.entities[entityId].entity !== null) {
                this.entities[entityId].entity.exampleValues = exampleValues;
            }

            const exampleInstances = await this.getExampleInstances(entityId);
            if (this.entities[entityId].entity !== null) {
                this.entities[entityId].entity.exampleInstances = exampleInstances;
            }

            const exampleSubclasses = await this.getExampleSubclasses(entityId);
            if (this.entities[entityId].entity !== null) {
                this.entities[entityId].entity.exampleSubclasses = exampleSubclasses;
            }

            usePropertiesStore().refreshRelatedProperties([entityId], entityId)
                .then((data: RelatednessMapping) => {
                    if (!(entityId in data)) {
                        return;
                    }

                    const related = Object.entries(data[entityId]).sort((left, right) => {
                        if (left[1] < right[1]) {
                            return 1;
                        } else if (left[1] > right[1]) {
                            return -1;
                        }
                        return 0;
                    })
                    const typical = [];

                    for (const [entityId, score] of related) {
                        if (score > RELATED_PROPERTIES_THRESHOLD) {
                            typical.push(entityId);
                        }
                    }

                    useTermsStore().requestLabels({entityIds: typical, lang: i18n.global.locale}, entityId);
                    this.entities[entityId].entity.typicalProperties = typical;
                })

            usePropertiesStore().getPropertyUsage(entityId, entityId)
                .then((usage) => {
                    if (usage === undefined) {
                        return;
                    }

                    this.entities[entityId].propertyUsage = usage;
                    const entityIds = ([] as string[]).concat(usage.classes);

                    for (const entityId of usage.qualifiers.keys()) {
                        entityIds.push(entityId);
                    }

                    return useTermsStore().requestLabels({entityIds, lang: i18n.global.locale}, entityId);
                });

            // await useTermsStore().requestLabels({entityIds: typical, lang: i18n.global.locale});
            console.log('SHOW ENT: ');
            const forwardClaims = await this.getEntityData(entityId, entityId)
                .then(async (data: any /* {
                    label: string
                    aliases: string[]
                    description: string
                    claims: ClaimsMap}*/) => {
                    console.log(data)
                    if (this.entities[entityId].entity !== null) {
                        // TODO KEEP COMMENTED OUT FOR NOW
                         if (data.label) {
                             this.entities[entityId].entity.label = data.label;
                        } else {
                             this.entities[entityId].entity.label = entityId;
                        }
                        this.entities[entityId].entity.aliases = data.aliases;
                        this.entities[entityId].entity.description = data.description;
                        this.entities[entityId].claims = data.claims;

                        const related = relatedEntityIds(this.entities[entityId].claims);
                        // @ts-ignore
                        await useTermsStore().requestLabels({entityIds: related, lang: i18n.global.locale}, entityId);

                        const properties = [] as string[];
                        // @ts-ignore
                        for (const entityId of related) {
                            if (isPropertyId(entityId as EntityId)) {
                                properties.push(entityId as string);
                            }
                        }

                        await this.getPropertyDatatypes(properties, entityId);

                        this.entities[entityId].entity.images = useClaimsStore().getImages(entityId, entityId);
                        this.entities[entityId].entity.banner = useClaimsStore().getBanner(entityId, entityId);
                        console.log(`SHOW KIND: ${kind}`);
                        if (kind === 'property') {
                            this.entities[entityId].entity.propertyDatatype = this.getPropertyDatatype(entityId, entityId) || null

                            const values = (useClaimsStore().getValuesForProperty(entityId, 'P1647', entityId) as QualifiedEntityValue[]) || []
                            this.entities[entityId].entity.superProperties = values
                        }

                        const superClasses = (useClaimsStore().getValuesForProperty(entityId, 'P279', entityId) as QualifiedEntityValue[]) || []
                        console.log(superClasses);
                        this.entities[entityId].entity.superClasses = superClasses
                        const getClassesUsage = await useClassesStore().getClassUsageCounts(this.entities[entityId].entity.superClasses.map((entity: any) => entity.value.id), entityId);
                        this.entities[entityId].entity.superClassesUsage = getClassesUsage;

                        const instanceClasses = (useClaimsStore().getValuesForProperty(entityId, 'P31', entityId) as QualifiedEntityValue[]) || []
                        this.entities[entityId].entity.instanceClasses = instanceClasses

                        const entityIds = ['P1647', 'P279', 'P31'].concat(
                            ...this.entities[entityId].entity.superProperties.map(idsFromQualifiedEntity),
                            ...this.entities[entityId].entity.superClasses.map(idsFromQualifiedEntity),
                            ...this.entities[entityId].entity.instanceClasses.map(idsFromQualifiedEntity))
                        await useTermsStore().requestLabels({entityIds, lang: i18n.global.locale}, entityId)
                    }
                });
            const reverseClaims = await this.getReverseClaims({},entityId)
                .then(async(claims: ClaimsMap) => {
                    this.entities[entityId].reverseClaims = claims;

                    const related = relatedEntityIds(claims);
                    // @ts-ignore
                    await useTermsStore().requestLabels({entityIds: related, lang: i18n.global.locale}, entityId);

                    const properties = [] as string[];

                    // @ts-ignore
                    for (const entityId of related) {
                        if (isPropertyId(entityId as EntityId)) {
                            properties.push(entityId as string);
                        }
                    }

                    await this.getPropertyDatatypes(properties, entityId);
                });
            Promise.all([forwardClaims,
                reverseClaims,
                usePropertiesStore().refreshClassification(entityId)])
                .then(() => {
                    const properties = []

                    for (const property of this.entities[entityId].claims!.keys()) {
                        properties.push(property)
                    }

                    for (const property of this.entities[entityId].reverseClaims!.keys()) {
                        properties.push(property)
                    }
                    return usePropertiesStore().refreshRelatedProperties(properties, entityId)
                }).then((scores) => {
                this.regroupClaims(scores, entityId);
            }).then(() => this.entities[entityId].loading = false)
        },
        regroupClaims(relatednessScores: RelatednessMapping, entityId: EntityId) {
            console.log(usePropertiesStore().propertyGroupsGetter(entityId, entityId));
            if (this.entities[entityId].claims) {
                this.entities[entityId].groupedClaims = groupClaims(this.entities[entityId].claims,
                    usePropertiesStore().propertyGroupsGetter,
                    relatednessScores,
                    entityId)
            }

            if (this.entities[entityId].reverseClaims) {
                this.entities[entityId].groupedReverseClaims = groupClaims(this.entities[entityId].reverseClaims,
                    usePropertiesStore().propertyGroupsGetter,
                    relatednessScores,
                    entityId)
            }
        }
    }
});

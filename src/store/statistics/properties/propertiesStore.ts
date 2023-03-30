import {defineStore} from 'pinia';
import {PropertiesState, PropertyClassification, PropertyStatistics} from "./types";
import {EntityId, SqidEntityStatistics} from "@/api/wikidata/types";
import {
    getChunkId,
    getPropertyClassification, getPropertyUsage,
    getRelatedPropertiesChunk, getUrlPatterns,
    RelatednessMapping, RelatednessScores,
    shouldRefresh
} from "@/api/wikidata/sqid";
import {useStatisticsStore} from "../statisticsStore";
import {parseEntityId} from "@/api/wikidata/wikidata";
import {ItemsStoreState} from "@/store/statistics/items/itemsStore";
import entity from "@/modules/entities/Entity.vue";
import Entity from "@/modules/entities/Entity.vue";
const mustRefresh = (lastRefresh: number) => {
    const now = new Date().getTime();
    return shouldRefresh(now - lastRefresh);
};

export interface PropertiesStoreState {
    entities: {
        [entityId: EntityId]: PropertiesState;
    };
}

export const usePropertiesStore = defineStore('propertiesStore', {
    /* state: (): PropertiesState => ({
        propertyGroups: {},
        propertiesByGroup: new Map<PropertyClassification, EntityId[]>(),
        classificationRefreshed: new Date(0),
        relatedPropertiesRefreshed: new Date(0),
        urlPatternsRefreshed: new Date(0),
        usageRefreshed: new Date(0),
        cachedRelatedPropertiesRefresh: 0,
        count: 0,
        countLabels: 0,
        countStatements: 0,
        countDescriptions: 0,
        countAliases: 0,
        urlPatterns: new Map<EntityId, string>(),
        usage: {}
    }), */
    state: (): PropertiesStoreState => ({
        entities: {}
    }),
    getters: {
        propertyGroupsGetter: (state) => (entityId: EntityId, queryEntityId: EntityId) => {
            const kind = ((state as any).entities[queryEntityId]?.propertyGroups[entityId] as PropertyClassification);
            console.log(kind);
            return kind as PropertyClassification;
        },
        propertiesInGroup: (state) => (group: PropertyClassification, entityId: EntityId) => state.entities[entityId]?.propertiesByGroup.get(group),
        mustRefreshClassification: (state) => (entityId: EntityId) => mustRefresh(state.entities[entityId].classificationRefreshed.getTime()),
        lastClassificationRefresh: (state) => (entityId: EntityId) => state.entities[entityId].classificationRefreshed.getTime(),
        mustRefreshRelatedProperties: (state) => (entityId: EntityId) => mustRefresh(state.entities[entityId].relatedPropertiesRefreshed.getTime()),
        lastRelatedPropertiesRefresh: (state) => (entityId: EntityId) => state.entities[entityId].relatedPropertiesRefreshed.getTime(),
        cachedRelatedPropertiesRefreshGetter: (state) => (entityId: EntityId) => state.entities[entityId].cachedRelatedPropertiesRefresh,
        mustRefreshUrlPatterns: (state) => (entityId: EntityId) => mustRefresh(state.entities[entityId].urlPatternsRefreshed.getTime()),
        lastUrlPatternsRefresh: (state) => (entityId: EntityId) => state.entities[entityId].urlPatternsRefreshed.getTime(),
        mustRefreshUsage: (state) => (entityId: EntityId) => mustRefresh(state.entities[entityId].usageRefreshed.getTime()),
        lastUsageRefresh: (state) => (entityId: EntityId) => state.entities[entityId].usageRefreshed.getTime(),
        countGetter: (state) => (entityId: EntityId) => state.entities[entityId].count,
        countLabelsGetter: (state) => (entityId: EntityId) => state.entities[entityId].countLabels,
        countStatementsGetter: (state) => (entityId: EntityId) => state.entities[entityId].countStatements,
        countDescriptionsGetter: (state) => (entityId: EntityId) => state.entities[entityId].countDescriptions,
        countAliasesGetter: (state) => (entityId: EntityId) => state.entities[entityId].countAliases,
        hasUrlPatternGetter: (state) => (entityId: EntityId, queryEntityId: EntityId) => state.entities[queryEntityId].urlPatterns.has(entityId),
        getUrlPatternGetter: (state) => (entityId: EntityId, queryEntityId: EntityId) => state.entities[queryEntityId].urlPatterns.get(entityId),
        getUsage: (state) => (entityId: EntityId, queryEntityId: EntityId) => state.entities[queryEntityId].usage[entityId]
    },
    actions: {
        checkPropertyStoreState(queryEntityId: EntityId) {
            if (!this.entities[queryEntityId]) {
                this.entities[queryEntityId] = {
                    propertyGroups: {},
                    propertiesByGroup: new Map<PropertyClassification, EntityId[]>(),
                    classificationRefreshed: new Date(0),
                    relatedPropertiesRefreshed: new Date(0),
                    urlPatternsRefreshed: new Date(0),
                    usageRefreshed: new Date(0),
                    cachedRelatedPropertiesRefresh: 0,
                    count: 0,
                    countLabels: 0,
                    countStatements: 0,
                    countDescriptions: 0,
                    countAliases: 0,
                    urlPatterns: new Map<EntityId, string>(),
                    usage: {}
                };
            }
        },
        refreshClassificationMutation(classification: Map<EntityId, PropertyClassification>, entityId: EntityId) {
            this.checkPropertyStoreState(entityId);
            const propertyGroups: any = new Object();
            const propertiesByGroup = new Map<PropertyClassification, EntityId[]>();

            // @ts-ignore
            for (const [entityId, kind] of classification) {
                let group = propertiesByGroup.get(kind);

                if (group === undefined) {
                    group = [];
                }

                group.push(entityId);
                propertiesByGroup.set(kind, group);
                Object.defineProperty(propertyGroups, entityId, { value: kind,
                    configurable: false,
                });
            }

            this.entities[entityId].propertiesByGroup = propertiesByGroup;
            // todo(mx): this should be a map, but that breaks vue-devtools
            this.entities[entityId].propertyGroups = Object.freeze(propertyGroups);
            this.entities[entityId].classificationRefreshed = new Date();
        },
        refreshRelatedPropertiesMutation(entityId: EntityId) {
            this.checkPropertyStoreState(entityId);
            this.entities[entityId].cachedRelatedPropertiesRefresh = this.lastRelatedPropertiesRefresh(entityId);
            this.entities[entityId].relatedPropertiesRefreshed = new Date();
        },
        refreshPropertyStatistics(counts: SqidEntityStatistics, entityId: EntityId) {
            this.entities[entityId].count = counts.c;
            this.entities[entityId].countLabels = counts.cLabels;
            this.entities[entityId].countStatements = counts.cStmts;
            this.entities[entityId].countDescriptions = counts.cDesc;
            this.entities[entityId].countAliases = counts.cAliases;
        },
        invalidateClassification(entityId: EntityId) {
            this.entities[entityId].classificationRefreshed = new Date(0);
            this.entities[entityId].propertyGroups = {}; // todo(mx): this should be a map, but that breaks vue-devtools
            this.entities[entityId].propertiesByGroup = new Map<PropertyClassification, EntityId[]>();
        },
        refreshUrlPatterns(urlPatterns: Map<EntityId, string>, entityId: EntityId) {
            this.checkPropertyStoreState(entityId);
            this.entities[entityId].urlPatterns = urlPatterns;
            this.entities[entityId].urlPatternsRefreshed = new Date();
        },
        refreshPropertyUsage(usage: {[key: string]: PropertyStatistics}, entityId: EntityId) {
            this.checkPropertyStoreState(entityId);
            this.entities[entityId].usage = usage;
            this.entities[entityId].usageRefreshed = new Date();
        },
        async refreshClassification(queryEntityId: EntityId) {
            this.checkPropertyStoreState(queryEntityId);
            if (!this.mustRefreshClassification(queryEntityId)) {
                return;
            }

            await useStatisticsStore().refresh(queryEntityId);

            const response = await getPropertyClassification(this.lastClassificationRefresh(queryEntityId))
            this.refreshClassificationMutation(response, queryEntityId);
        },
        async refreshRelatedProperties(propertyIds: EntityId[], queryEntityId: EntityId) {
            this.checkPropertyStoreState(queryEntityId);
            const mustRefresh = (queryEntityId: EntityId) => this.mustRefreshRelatedProperties(queryEntityId);
            const chunkIds = new Set<number>();

            for (const propertyId of propertyIds) {
                const { kind } = parseEntityId(propertyId);
                console.log('SHOW KIND', kind);
                if (kind === 'property') {
                    chunkIds.add(getChunkId(propertyId, 10));
                }
            }

            const requests = [];
            const timestamp = (queryEntityId: EntityId) => (mustRefresh(queryEntityId)
                ? this.lastRelatedPropertiesRefresh(queryEntityId)
                : this.cachedRelatedPropertiesRefreshGetter(queryEntityId));

            // @ts-ignore
            for (const chunkId of chunkIds) {
                requests.push(getRelatedPropertiesChunk(chunkId, timestamp(queryEntityId)));
            }

            const responses = await Promise.all(requests)

            if (mustRefresh(queryEntityId)) {
                this.refreshRelatedPropertiesMutation(queryEntityId);
            }

            const result: RelatednessMapping = {}

            for (const response of responses) {
                for (const [entityId, related] of Object.entries(response)) {
                    result[entityId] = related as RelatednessScores
                }
            }

            return result
        },
        async getUrlPattern(entityId: EntityId, queryEntityId: EntityId) {
            this.checkPropertyStoreState(queryEntityId);
            if (!this.mustRefreshUrlPatterns(queryEntityId)) {
                return this.getUrlPatternGetter(entityId, queryEntityId);
            }

            await useStatisticsStore().refresh(queryEntityId);

            const response = await getUrlPatterns(this.lastUrlPatternsRefresh(queryEntityId));
            this.refreshUrlPatterns(response, queryEntityId);

            return response.get(entityId);
        },
        async getPropertyUsage(entityId: EntityId, queryEntityId: EntityId) {
            this.checkPropertyStoreState(queryEntityId);
            if (!this.mustRefreshUsage(queryEntityId)) {
                return this.getUsage(entityId, queryEntityId);
            }

            await useStatisticsStore().refresh(queryEntityId);

            const response = await getPropertyUsage(this.lastUsageRefresh(queryEntityId));
            this.refreshPropertyUsage(response, queryEntityId);

            return this.getUsage(entityId, queryEntityId)
        }
    }
});

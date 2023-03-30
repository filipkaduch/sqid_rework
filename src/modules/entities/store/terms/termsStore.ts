import {defineStore} from 'pinia';
import {EntityId, LabelOptions, LabelsOptions, LangCode, MultilingualTermsMap, TermsState} from "./types";
import {addInflight, clearInflight, getPromise, getTerm, hasPromise, hasTerm, mergeTerms} from "./utils";
import {i18n} from "@/plugins/all";
import {getEntityData, getLabels} from "@/api/wikidata/wikidata";
import {ClassStatistics} from "@/store/statistics/classes/types";

export interface TermsStoreState {
    entities: {
        [entityId: EntityId]: TermsState;
    };
}
export const useTermsStore = defineStore('termsStore', {
    /* state: (): TermsState => ({
        labels: new Map<string, Map<string, string>>(),
        aliases: new Map<string, Map<string, string>>(),
        descriptions: new Map<string, Map<string, string>>(),
        inflightTerms: new Map<string, Map<string, Promise<string>>>(),
        inflightLabels: new Map<string, Map<string, Promise<string>>>()
    }), */
    state: (): TermsStoreState => ({
      entities: {}
    }),
    getters: {
        getEntityLabel: (state) => (entityId: string, lang?: string, fallback: boolean = true, queryEntityId: EntityId = '') => {
            return getTerm(state.entities[queryEntityId].labels, entityId, lang, fallback);
        },
        getAlias: (state) => (entityId: string, lang?: string, fallback: boolean = true, queryEntityId: EntityId = '') => {
            return getTerm(state.entities[queryEntityId].aliases, entityId, lang, fallback);
        },
        getDescription: (state) => (entityId: string, lang?: string, fallback: boolean = true, queryEntityId: EntityId = '') => {
            return getTerm(state.entities[queryEntityId].descriptions, entityId, lang, fallback);
        },
        getTermsGetter: (state) => (entityId: string, lang?: string, fallback: boolean = true, queryEntityId: EntityId = '') => {
            const label = getTerm(state.entities[queryEntityId].labels, entityId, lang, fallback);
            const aliases = getTerm(state.entities[queryEntityId].aliases, entityId, lang, fallback) || [];
            const description = getTerm(state.entities[queryEntityId].descriptions, entityId, lang, fallback);

            return {
                label,
                aliases,
                description,
            };
        },
        hasEntityLabel: (state) => (entityId: string, lang?: string, fallback: boolean = true, queryEntityId: EntityId = '') => {
            console.log(queryEntityId);
            return hasTerm(state.entities[queryEntityId]?.labels, entityId, lang, fallback) ?? false;
        },
        hasAlias: (state) => (entityId: string, lang?: string, fallback: boolean = true, queryEntityId: EntityId = '') => {
            return hasTerm(state.entities[queryEntityId].aliases, entityId, lang, fallback);
        },
        hasDescription: (state) => (entityId: string, lang?: string, fallback: boolean = true, queryEntityId: EntityId = '') => {
            return hasTerm(state.entities[queryEntityId].descriptions, entityId, lang, fallback);
        },
        hasTerms: (state) => (entityId: string, lang?: string, fallback: boolean = true, queryEntityId: EntityId = '') => {
            return (hasTerm(state.entities[queryEntityId]?.labels, entityId, lang, fallback) &&
                hasTerm(state.entities[queryEntityId]?.aliases, entityId, lang, fallback) &&
                hasTerm(state.entities[queryEntityId]?.descriptions, entityId, lang, fallback));
        },
        isLabelInflight: (state) => (entityId: string, lang?: string, fallback: boolean = true, queryEntityId: EntityId = '') => {
            return hasPromise(state.entities[queryEntityId].inflightLabels, entityId, lang, fallback)
        },
        isTermsInflight: (state) => (entityId: string, lang?: string, fallback: boolean = true, queryEntityId: EntityId = '') => {
            return hasPromise(state.entities[queryEntityId].inflightTerms, entityId, lang, fallback)
        },
        getLabelPromise: (state) => (entityId: string, lang?: string, fallback: boolean = true, queryEntityId: EntityId = '') => {
            return getPromise(state.entities[queryEntityId].inflightLabels, entityId, lang, fallback)
        },
        getTermsPromise: (state) => (entityId: string, lang?: string, fallback: boolean = true, queryEntityId: EntityId = '') => {
            return getPromise(state.entities[queryEntityId].inflightTerms, entityId, lang, fallback)
        }
    },
    actions: {
        checkEntityState(entityId: EntityId) {
            console.log(!this.entities[entityId]);
            if (!this.entities[entityId]) {
                this.entities[entityId] = {
                    labels: new Map<string, Map<string, string>>(),
                    aliases: new Map<string, Map<string, string>>(),
                    descriptions: new Map<string, Map<string, string>>(),
                    inflightTerms: new Map<string, Map<string, Promise<string>>>(),
                    inflightLabels: new Map<string, Map<string, Promise<string>>>()
                };
            }
        },
        labelsLoaded(labels: MultilingualTermsMap, entityId: EntityId) {
            this.checkEntityState(entityId);
            this.entities[entityId].labels = mergeTerms(this.entities[entityId].labels, labels)
            this.entities[entityId].inflightLabels = clearInflight(this.entities[entityId].inflightLabels, labels)
        },
        aliasesLoaded(aliases: MultilingualTermsMap, entityId: EntityId) {
            this.entities[entityId].aliases = mergeTerms(this.entities[entityId].aliases, aliases)
        },
        descriptionsLoaded(descriptions: MultilingualTermsMap, entityId: EntityId) {
            this.entities[entityId].descriptions = mergeTerms(this.entities[entityId].descriptions, descriptions)
        },
        termsLoaded(terms: {
            labels: MultilingualTermsMap,
            aliases: MultilingualTermsMap,
            descriptions: MultilingualTermsMap,
        }, entityId: EntityId) {
            this.checkEntityState(entityId);
            this.entities[entityId].labels = mergeTerms(this.entities[entityId].labels, terms.labels)
            this.entities[entityId].aliases = mergeTerms(this.entities[entityId].aliases, terms.aliases)
            this.entities[entityId].descriptions = mergeTerms(this.entities[entityId].descriptions, terms.descriptions)
            this.entities[entityId].inflightTerms = clearInflight(this.entities[entityId].inflightTerms, terms.labels)
        },
        termsRequested(flight: {
            entities: EntityId[],
            lang: LangCode,
            promise: Promise<string>,
        }, entityId: EntityId) {
            this.checkEntityState(entityId);
            this.entities[entityId].inflightTerms = addInflight(this.entities[entityId].inflightTerms, flight.entities, flight.lang, flight.promise)
        },
        labelsRequested(flight: {
            entities: EntityId[],
            lang: LangCode,
            promise: Promise<string>,
        }, entityId: EntityId) {
            this.checkEntityState(entityId);
            this.entities[entityId].inflightLabels = addInflight(this.entities[entityId].inflightLabels, flight.entities, flight.lang, flight.promise)
        },
        async getLabel(opts: LabelOptions, queryEntityId: EntityId) {
            this.checkEntityState(queryEntityId);
            const entityId = opts.entityId;
            const lang = opts.lang || i18n.global.locale;

            if (this.hasEntityLabel(entityId, lang, false, queryEntityId)) {
                return this.getEntityLabel(entityId, lang, true, queryEntityId);
            }

            if (this.isLabelInflight(entityId, lang, true, queryEntityId)) {
                const loadedTerms = await this.getLabelPromise(entityId, lang, true, queryEntityId)
                const langCode = lang || i18n.global.locale
                const theTerms = loadedTerms.get(langCode)

                if (theTerms !== undefined) {
                    const label = theTerms.get(entityId)

                    if (label !== undefined) {
                        return label
                    }
                }

                return entityId
            }

            const promise = getLabels([entityId], lang || undefined) ;
            console.log('PROMISE VALUE: ', promise);
            this.labelsRequested({
                entities: [entityId],
                lang,
                promise,
            }, queryEntityId);
            const labels = await promise;
            console.log(labels);
            this.labelsLoaded(labels, queryEntityId);

            return this.getEntityLabel(entityId, lang, true, queryEntityId)
        },
        async requestLabels(opts: LabelsOptions, queryEntityId: EntityId) {
            console.log(`THIS RECEIVED: ${queryEntityId}`);
            this.checkEntityState(queryEntityId);
            const entityIds = opts.entityIds;
            const lang = opts.lang || i18n.global.locale;
            const missingLabels = [];

            for (const entityId of entityIds) {
                if ((!this.hasEntityLabel(entityId, lang, false, queryEntityId) &&
                    !this.isLabelInflight(entityId, lang, true, queryEntityId))) {
                    missingLabels.push(entityId);
                }
            }

            if (missingLabels.length === 0) {
                return;
            }

            const promise = getLabels(missingLabels, lang || undefined);
            this.labelsRequested({
                entities: missingLabels,
                lang,
                // @ts-ignore
                promise,
            }, queryEntityId);
        },
        async getTerms(opts: LabelOptions, queryEntityId: EntityId) {
            this.checkEntityState(queryEntityId);
            const entityId = opts.entityId;
            const lang = opts.lang || i18n.global.locale;
            if (this.hasTerms(entityId, lang, false, queryEntityId)) {
                return this.getTermsGetter(entityId, lang, true, queryEntityId);
            }

            if (this.isTermsInflight(entityId, lang)) {
                const loadedData = await this.getTermsPromise(entityId, lang, true, queryEntityId);
                const langCode = lang || i18n;

                let label = entityId;
                let aliases: string[] = [];
                let description = '';

                const loadedLabels = loadedData.labels.get(langCode);
                if (loadedLabels !== undefined) {
                    const theLabel = loadedLabels.get(entityId);

                    if (theLabel !== undefined) {
                        label = theLabel;
                    }
                }

                const loadedAliases = loadedData.aliases.get(langCode)
                if (loadedAliases !== undefined) {
                    const theAliases = loadedAliases.get(entityId);

                    if (theAliases !== undefined) {
                        aliases = theAliases;
                    }
                }

                const loadedDescriptions = loadedData.descriptions.get(langCode)
                if (loadedDescriptions !== undefined) {
                    const theDescription = loadedDescriptions.get(entityId);

                    if (theDescription !== undefined) {
                        description = theDescription;
                    }
                }

                return {
                    label,
                    aliases,
                    description,
                };
            }

            const promise = getEntityData(entityId, lang || undefined, true, queryEntityId);
            this.termsRequested({
                entities: [entityId],
                lang,
                // @ts-ignore
                promise,
            }, entityId);
            const entityData = await promise;
            this.termsLoaded({
                labels: entityData.labels,
                // @ts-ignore
                aliases: entityData.aliases,
                descriptions: entityData.descriptions,
            }, entityId);

            return this.getTermsGetter(entityId, lang);
        }
    }
});



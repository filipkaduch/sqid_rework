import {defineStore} from 'pinia';
import {ItemsState} from "./types";
import {EntityId, SqidEntityStatistics} from "@/api/wikidata/types";

export interface ItemsStoreState {
    entities: {
        [entityId: EntityId]: ItemsState;
    };
}

export const useItemsStore = defineStore('itemsStore', {
    /* state: (): ItemsState => ({
        count: 0,
        countStatements: 0,
        countLabels: 0,
        countDescriptions: 0,
        countAliases: 0
    }), */
    state: (): ItemsStoreState => ({
       entities: {}
    }),
    getters: {
        countGetter: (state) => (entityId: EntityId) => state.entities[entityId].count,
        countLabelsGetter: (state) => (entityId: EntityId) => state.entities[entityId].countLabels,
        countStatementsGetter: (state) => (entityId: EntityId) => state.entities[entityId].countStatements,
        countDescriptionsGetter: (state) => (entityId: EntityId) => state.entities[entityId].countDescriptions,
        countAliasesGetter: (state) => (entityId: EntityId) => state.entities[entityId].countAliases
    },
    actions: {
        refreshItemStatistics(counts: SqidEntityStatistics, entityId: EntityId) {
            this.entities[entityId].count = counts.c;
            this.entities[entityId].countLabels = counts.cLabels;
            this.entities[entityId].countStatements = counts.cStmts;
            this.entities[entityId].countDescriptions = counts.cDesc;
            this.entities[entityId].countAliases = counts.cAliases;
        }
    }
});

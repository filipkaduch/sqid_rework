import {defineStore} from 'pinia';
import {ClassesState, ClassStatistics} from "./types";
import {EntityId} from "@/api/wikidata/types";
import {getChunkId, getClassHierarchyChunk, shouldRefresh} from "@/api/wikidata/sqid";
import {useStatisticsStore} from "@/store/statistics/statisticsStore";

export interface ClassesStoreState {
    entities: {
        [entityId: EntityId]: ClassesState;
    };
}

export const useClassesStore = defineStore('classesStore', {
    /* state: (): ClassesState => ({
        hierarchy: new Map<EntityId, ClassStatistics>(),
        hierarchyRefreshed: new Date(0),
        cachedHierarchyRefreshVariable: 0,
    }), */
    state: (): ClassesStoreState => ({
        entities: {}
    }),
    getters: {
        lastHierarchyRefresh: (state) => (selectedEntityId: EntityId) => state.entities[selectedEntityId].hierarchyRefreshed.getTime(),
        mustRefreshHierarchy: (state) => (selectedEntityId: EntityId) => {
            const now = new Date().getTime()
            return shouldRefresh(now - state.entities[selectedEntityId].hierarchyRefreshed.getTime());
        },
        cachedHierarchyRefresh: (state) => (selectedEntityId: EntityId) => state.entities[selectedEntityId].cachedHierarchyRefreshVariable,
        hasHierarchyRecord: (state) => (entityId: EntityId, selectedEntityId: EntityId) => state.entities[selectedEntityId].hierarchy.has(entityId),
        getHierarchyRecord: (state) => (entityId: EntityId, selectedEntityId: EntityId) => state.entities[selectedEntityId].hierarchy.get(entityId)
    },
    actions: {
        async getClassHierarchyRecord(entityId: EntityId, selectedEntityId: EntityId) {
            const mustRefresh = this.mustRefreshHierarchy;
            if (!this.entities[selectedEntityId]) {
                this.entities[selectedEntityId] = {
                    hierarchy: new Map<EntityId, ClassStatistics>(),
                    hierarchyRefreshed: new Date(0),
                    cachedHierarchyRefreshVariable: 0,
                };
            }
            if (!mustRefresh && this.hasHierarchyRecord(entityId, selectedEntityId)) {
                return this.getHierarchyRecord(entityId, selectedEntityId)!;
            }


            await useStatisticsStore().refresh(selectedEntityId);

            const chunkId = getChunkId(entityId, 1000)
            const timestamp = (mustRefresh(selectedEntityId)
                ? this.lastHierarchyRefresh
                : this.cachedHierarchyRefresh);

            const response = await getClassHierarchyChunk(chunkId, timestamp(selectedEntityId));

            if (mustRefresh(selectedEntityId)) {
                this.entities[selectedEntityId].cachedHierarchyRefreshVariable = this.entities[selectedEntityId].hierarchyRefreshed.getTime();
                this.entities[selectedEntityId].hierarchyRefreshed = new Date();
            }

            for (const [entityId, record] of response) {
                this.entities[selectedEntityId].hierarchy.set(entityId, record);
            }
            return response.get(entityId)!;
        },
        async getClassUsageCounts(entityIds: EntityId[], selectedEntityId: EntityId) {
            if (!this.entities[selectedEntityId]) {
                this.entities[selectedEntityId] = {
                    hierarchy: new Map<EntityId, ClassStatistics>(),
                    hierarchyRefreshed: new Date(0),
                    cachedHierarchyRefreshVariable: 0,
                };
            }
            const entities = new Set(entityIds)
            const staleIds = new Set<EntityId>()
            const mustRefresh = this.mustRefreshHierarchy

            for (const entityId of entityIds) {
                if (mustRefresh(selectedEntityId) || !this.hasHierarchyRecord(entityId, selectedEntityId)) {
                    staleIds.add(entityId)
                }
            }

            const staleChunks = new Set<number>()
            const timestamp = (mustRefresh(selectedEntityId)
                ? this.lastHierarchyRefresh
                : this.cachedHierarchyRefresh)

            for (const entityId of staleIds) {
                staleChunks.add(getChunkId(entityId, 1000))
            }

            const requests = []

            for (const chunkId of staleChunks) {
                requests.push(getClassHierarchyChunk(chunkId, timestamp(selectedEntityId)))
            }

            const responses = await Promise.all(requests)

            for (const response of responses) {
                for (const [entityId, record] of responses) {
                    // @ts-ignore
                    this.entities[selectedEntityId].hierarchy.set(entityId, record)
                }
            }

            if (mustRefresh(selectedEntityId)) {
                this.entities[selectedEntityId].cachedHierarchyRefreshVariable = this.entities[selectedEntityId].hierarchyRefreshed.getTime();
                this.entities[selectedEntityId].hierarchyRefreshed = new Date();
            }

            const result = new Map<EntityId, number>()

            for (const entityId of result) {
                result.set(entityId.toString(), this.getHierarchyRecord(entityId.toString(), selectedEntityId)!.allInstances)
            }

            return result
        }
    }
});

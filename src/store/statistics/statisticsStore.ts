import {defineStore} from 'pinia';
import {SiteName, SqidSiteLink, StatisticsState} from "./types";
import {getStatistics, shouldRefresh} from "@/api/wikidata/sqid";
import {EntityId} from "@/api/wikidata/types";

export interface StatisticsStoreState {
    entities: {
        [entityId: EntityId]: StatisticsState;
    };
}
export const useStatisticsStore = defineStore('statisticsStore', {
    /* state: (): StatisticsState => ({
        dumpDate: new Date(0),
        classesDate: new Date(0),
        refreshedDate: new Date(0),
        propertiesDate: new Date(0),
        sitelinks: 0,
        sites: new Map<SiteName, SqidSiteLink>()
    }), */
    state: (): StatisticsStoreState => ({
       entities: {}
    }),
    getters: {
        dumpTimestamp: (state) => (entityId: EntityId) => state.entities[entityId].dumpDate.getTime(),
        classesTimestamp: (state) => (entityId: EntityId) => state.entities[entityId].classesDate.getTime(),
        propertiesTimestamp: (state) => (entityId: EntityId) => state.entities[entityId].propertiesDate.getTime(),
        lastRefresh: (state) => (entityId: EntityId) => state.entities[entityId].refreshedDate.getTime(),
        siteLinkCount: (state) => (entityId: EntityId) => state.entities[entityId].sitelinks,
        siteLinkUrl: (state) => (wikiname: string, entityId: EntityId) => {
            const sitelink = state.entities[entityId]?.sites?.get(wikiname);

            if (sitelink === undefined) {
                return null;
            }

            return sitelink.u;
        },
        shouldCheckForUpdate: (state) => (entityId: EntityId) => {
            const now = new Date().getTime()
            const lastUpdate = Math.max(
                state.entities[entityId].dumpDate.getTime(),
                state.entities[entityId].classesDate.getTime(),
                state.entities[entityId].propertiesDate.getTime());
            const timeSinceLastRefresh = now - state.entities[entityId].refreshedDate.getTime();
            const timeSinceLastUpdate = now - lastUpdate;

            return shouldRefresh(timeSinceLastRefresh, timeSinceLastUpdate);
        }
    },
    actions: {
        async refresh(queryEntityId: EntityId) {
            this.entities[queryEntityId] = {
                dumpDate: new Date(0),
                classesDate: new Date(0),
                refreshedDate: new Date(0),
                propertiesDate: new Date(0),
                sitelinks: 0,
                sites: new Map<SiteName, SqidSiteLink>()
            };
            if (!this.shouldCheckForUpdate) {
                return;
            }

            const response = await getStatistics(this.lastRefresh(queryEntityId));

            const dump = Date.parse(response.dumpDate);
            const classes = Date.parse(response.classUpdate);
            const properties = Date.parse(response.propertyUpdate);

            if ((dump > this.dumpTimestamp(queryEntityId)) ||
                (classes > this.classesTimestamp(queryEntityId)) ||
                (properties > this.propertiesTimestamp(queryEntityId))) {
                // have new data, update everything
                const dumpDate = new Date(dump);
                const classUpdate = new Date(classes);
                const propertyUpdate = new Date(properties);
                const sites = new Map<SiteName, SqidSiteLink>(Object.entries(response.sites));
                const update = {
                    dates: {
                        dumpDate,
                        classUpdate,
                        propertyUpdate,
                    },
                    sites: {
                        siteLinkCount: response.siteLinkCount,
                        sites,
                    },
                };

                this.entities[queryEntityId].refreshedDate = new Date();
                this.entities[queryEntityId].dumpDate = update.dates.dumpDate;
                this.entities[queryEntityId].classesDate = update.dates.classUpdate;
                this.entities[queryEntityId].propertiesDate = update.dates.propertyUpdate;
                this.entities[queryEntityId].sitelinks = update.sites.siteLinkCount;
                this.entities[queryEntityId].sites = update.sites.sites;

                // commit('properties/invalidateClassification', {})
                // commit('properties/refreshPropertyStatistics', response.propertyStatistics)
                // commit('items/refreshItemStatistics', response.itemStatistics)
            } else {
                this.entities[queryEntityId].refreshedDate = new Date()
            }
        }
    }
});

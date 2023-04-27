import {defineStore} from 'pinia';
import {EntityId} from "@/api/wikidata/types";
import {cloneDeep} from "lodash";
import {defaultQuery, generateGuid} from "./utils";
export enum DataSourceType {
    SECURITY_DOMAIN = 'securityDomain',
    WIKIDATA = 'wikiData',
    CVE_DOMAIN = 'cveDomain'
}

export interface QueriesState {
    loading: boolean
    queries: Query[]
    selectedQuery: Query
}

export interface Query {
    id: string
    loading: boolean
    searched: boolean
    opened?: boolean
    order?: number
    dataSource: DataSourceType | null
    entityId?: EntityId
    name?: string
}

export const useQueriesStore = defineStore('queriesStore', {
    state: (): QueriesState => ({
        selectedQuery: {} as any,
        loading: false,
        queries: []
    }),
    getters: {
        getQuery: (state) => (queryId: string) => state.queries.find((query: Query) => query.id === queryId),
        getAllQueries: (state) => state.queries,
        loadingQueries: (state) => state.loading
    },
    actions: {
        addQuery() {
            const newQuery = cloneDeep(defaultQuery);
            newQuery.id = generateGuid();
            newQuery.order = this.queries.length;
            this.queries.push(newQuery);
            return newQuery.id;
        },
        selectQuery(queryId: string) {
            this.selectedQuery = this.queries.find((query: Query) => query.id === queryId);
        },
        setQueryDataSource(queryId: string, dataSource: DataSourceType) {
            const query = this.queries.find((query: Query) => query.id === queryId);
            if (query) {
                query.dataSource = dataSource;
            }
        },
        deleteQuery(queryId: string) {
            const tempFilteredQueries = cloneDeep(this.queries.filter((query: Query) => query.id !== queryId));
            this.queries = cloneDeep(tempFilteredQueries.map((query, index) => {
                delete query.order;
                return {
                    ...query,
                    order: index
                }
            }));
        }
    }
});

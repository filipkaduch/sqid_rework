import {computed} from 'vue';
import {useQueriesStore} from "../store/queriesStore";
import {DATA_SOURCES, dataSources} from "@/util/consts/dataSources";
import {defaultMalware, useMalwaresStore} from "@/modules/malwares/store/malwaresStore";
import {useEntityStore} from "@/modules/entities/store/entityStore";
import cloneDeep from "lodash/cloneDeep";
import {getName} from "@/api/malwares/sparql";

export default function() {
    const queriesStore = useQueriesStore();
    const queries = computed(() => queriesStore.queries);
    const selectQuery = (queryId: string) => {
        queriesStore.selectQuery(queryId);
    };

    const createQuery = (id: string, dataSource: string) => {
        if (id && !queriesStore.queries.find((query) => query.entityId === id)) {
            const queryId = queriesStore.addQuery();
            if (dataSource === DATA_SOURCES.SECURITY_DOMAIN) {
                // @ts-ignore
                queriesStore.queries.find((query) => query.id === queryId).dataSource = dataSources[0];
                // @ts-ignore
                queriesStore.queries.find((query) => query.id === queryId).entityId = id;
                // @ts-ignore
                queriesStore.queries.find((query) => query.id === queryId).searched = true;
                // @ts-ignore
                queriesStore.queries.find((query) => query.id === queryId).opened = true;
                useMalwaresStore().malwares[id] = cloneDeep(defaultMalware);
                useMalwaresStore().malwares[id].id = id;
                // await useMalwaresStore().updateMalwareData(id);
            } else {
                // useEntityStore().updateEntityData(id);
            }
        }
    };

    return {
        queries,
        selectQuery,
        createQuery
    };
}

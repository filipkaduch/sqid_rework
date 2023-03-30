import {computed} from 'vue';
import {useEntityStore} from "@/modules/entities/store/entityStore";

export default function() {
    const entitiesStore = useEntityStore();
    const entity = computed(() => entitiesStore.entity);

    const entityGroupedClaims = computed(() => entitiesStore.groupedClaims);
    const entityClaims = computed(() => entitiesStore.claims);

    const isLoading = computed(() => {
        return entitiesStore.loading;
    });

    return {
        entity,
        entityGroupedClaims,
        entityClaims,
        isLoading
    };
}

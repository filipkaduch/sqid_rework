<template>
	<ds-toggle-bar :items="attributesButtons" :default="attributesFilterType" @selected="setFilter($event)" />
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue';
import {useDataExploreStore} from '@/modules/explorer/store/dataExplore';
import {dataTypes} from '@/util/queryBuilder';
import useDataType from '@/components/main/Table/composables/useDataType';

export default defineComponent({
	name: 'AttributeFilterButtons',
	props: {
		size: {
			type: Number,
			default: 20
		}
	},
	setup() {
		const dataExploreStore = useDataExploreStore();
		const setFilter = (filter?: string | null) => {
			const datasetExplore = dataExploreStore.explorationGroups[dataExploreStore.selectedExplorationGroupId]
				.datasetExplores[dataExploreStore.selectedDatasetExplorationId];
			datasetExplore.attributes.filteredByType = filter;
		};
		const attributesFilterType = computed(() => dataExploreStore.getAttributes.filteredByType);
		const {getIcon} = useDataType();
		const attributesButtons: {icon?: string, label?: string, value?: string | null}[] = [
			{
				label: 't_all',
				value: null
			},
			{
				icon: getIcon(dataTypes.NUMBER),
				value: dataTypes.NUMBER
			},
			{
				icon: getIcon(dataTypes.TEXT),
				value: dataTypes.TEXT
			},
			{
				icon: getIcon(dataTypes.DATETIME),
				value: dataTypes.DATETIME
			}
		];
		return {
			attributesFilterType,
			attributesButtons,
			setFilter
		};
	}
});

</script>


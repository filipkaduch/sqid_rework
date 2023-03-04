<template>
	<filter-select-new
		:source="source"
		:widget-instance-id="selectedWidgetInstanceId"
		:columns="filteredAttributeList" />
</template>

<script lang="ts">
import {computed, defineComponent, onMounted} from 'vue';
import useExplorerChart from '@/modules/explorer/composables/useExplorerChart';
import useAttributes from '@/modules/explorer/composables/useAttributes';
import FilterSelectNew from '@/modules/widget/components/widget-controls/filter/FilterSelectNew.vue';
import {useStore} from 'vuex';
import {DATASOURCE_TYPES} from '@/modules/dataset/utils/datasetUtils';
import {isEmpty} from 'lodash';
import {useDataExploreStore} from '@/modules/explorer/store/dataExplore';
import {chartConstants} from '@/util/consts/chartsConstants';

export default defineComponent({
	components: {
		FilterSelectNew
	},
	setup() {
		const store = useStore();
		const {attributeList, datasetDetailColumns, catalogDetailColumns} = useAttributes();
		const {widgetMetrics, widgetDimensions, selectedWidgetInstanceId} = useExplorerChart();
		const dataExploreStore = useDataExploreStore();
		const usedAttributes = computed(() => dataExploreStore.getUsedAttributes ?? []);

		const filteredAttributeList = computed(() => attributeList.value?.map((attr) => ({...attr, selected: usedAttributes.value.some((item) => item.name === attr.name)}))
			.sort((val1, val2) => val1.name.localeCompare(val2.name)) ?? []);

		const widgetConfiguration = computed(() => store.getters['widgetInstances/configuration'](selectedWidgetInstanceId.value));
		const datasetId = computed(() => widgetConfiguration?.value?.data?.datasetId);
		const catalogItemId = computed(() => widgetConfiguration?.value?.data?.catalogItemId);

		onMounted(() => {
			if (!attributeList.value.length) {
				if (datasetDetailColumns.value) {
					setAttributes(datasetDetailColumns.value);
				} else if (catalogDetailColumns.value) {
					setAttributes(catalogDetailColumns.value);
				}
			}
		});

		// TODO MOVE TO SOME UTILS
		const setAttributes = (val: any) => {
			if (!isEmpty(val) && isEmpty(dataExploreStore.getAttributes.list)) {
				const newAttributes = val.map((col: any, index: number) => {
					const additionalData: any = {};
					const metric = widgetMetrics.value.find((elm: {aggregation: string, column: string}) => elm.column === col.name);
					const dimension = widgetDimensions.value.find((elm: {function: string, column: string}) => elm.column === col.name);

					if (metric) {
						additionalData.selected = chartConstants.dataConfiguration.METRIC;
						additionalData.aggregation = metric.aggregation;
					}

					if (dimension) {
						additionalData.selected = chartConstants.dataConfiguration.DIMENSION;
						additionalData.function = dimension.function;
					}

					return {
						name: col.name,
						displayName: col.displayName,
						index,
						favorite: false,
						...additionalData,
						type: col.dataType,
						uniqueValuesCount: col.uniqueValuesCount
					};
				});
				dataExploreStore.addAttributeList(newAttributes);
			}
		};

		const source = computed(() => ({
			type: datasetId.value ? DATASOURCE_TYPES.DATASET : DATASOURCE_TYPES.CATALOG_ITEM,
			id: datasetId.value ? datasetId.value : catalogItemId.value
		}));

		return {
			selectedWidgetInstanceId,
			widgetConfiguration,
			datasetId,
			catalogItemId,
			source,
			filteredAttributeList
		};
	}
});
</script>

<style scoped>

</style>

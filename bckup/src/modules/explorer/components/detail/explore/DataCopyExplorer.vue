<template>
	<ds-box
		flex-type="column"
		class="max-width max-height">
		<app-loading class="h-100 max-height" :loading="loading">
			<ds-table
				v-if="tableHeader"
				class="h-100"
				:table-header="tableHeader"
				:table-rows="tableRows"
				:sticky-header="true"
				:numberOfItemsPerPage="numberOfItemsPerPage"
				:data-table="true" />
		</app-loading>
	</ds-box>
</template>

<script lang="ts">
import {ref, computed, defineComponent, onMounted, Ref, watch} from 'vue';
import {TableHeader} from '@/components/main/consts/interfaces';
import useDataset, {RawData} from '@/modules/dataset/composables/useDataset';
import useExplorerChart from '@/modules/explorer/composables/useExplorerChart';
import AppLoading from '@/components/design/AppLoading.vue';
import isEqual from 'lodash/isEqual';
import {TELLSTORY_ROW_ID} from '@/modules/dataset/utils/dataset';
import {useStore} from 'vuex';

export interface PaginatedData extends RawData {
	page: number;
	recordsPerPage: number;
}
export default defineComponent({
	components: {
		AppLoading
	},
	props: {
		datasetId: {
			type: String,
			default: null
		},
		catalogItemId: {
			type: String,
			default: null
		},
		numberOfItemsPerPage: {
			type: Number,
			default: 100
		}
	},
	setup(props) {
		const store = useStore();
		const {explore, catalogs, selectedWidgetInstanceId} = useExplorerChart();
		const {loadTableData} = useDataset();

		const dataset = computed(() => explore.value.datasets.find((item: any) => item.id === props.datasetId));
		const catalog = computed(() => catalogs.value.find((item: any) => item.id === props.catalogItemId));

		const filter = computed(() => store.getters['widgetInstances/configuration'](selectedWidgetInstanceId.value)?.staticFilter);

		watch(filter, async(value) => {
			// Check filters for change (when widgetId is changed, filter is changed to)
			const id = props.datasetId ? props.datasetId : props.catalogItemId;
			const datasetFilters = datasets.value[id]?.filters ?? null;
			if (!isEqual(value, datasetFilters)) {
				loading.value = true;
				const tableData = await loadTableData(dataset.value ?? catalog.value, 0, props.numberOfItemsPerPage, value);
				datasets.value = {...datasets.value, [id]: {...tableData, page: 1, recordsPerPage: props.numberOfItemsPerPage, filters: value}};
				loading.value = false;
			}
		});

		const datasets: Ref<any> = ref({});
		const loading = ref(false);
		onMounted(async() => {
			loading.value = true;
			const tableData = await loadTableData(dataset.value ?? catalog.value, 0, props.numberOfItemsPerPage, filter.value);

			if (tableData) {
				const id = props.datasetId ? props.datasetId : props.catalogItemId;
				datasets.value = {...datasets.value, [id]: {...tableData, page: 1, recordsPerPage: props.numberOfItemsPerPage, filters: filter.value}};
			}
			loading.value = false;
		});
		const tableHeader = computed(() => {
			if (activeDataset.value) {
				return activeDataset.value?.columns.reduce((data: TableHeader[], item: any) => {
					if (item.reference !== TELLSTORY_ROW_ID) {
						data.push({
							name: getItemName(item.reference),
							type: item.dataType
						});
					}
					return data;
				}, []);
			}
			return null;
		});

		const getItemName = (columnName: string) => {
			let column = null;
			if (dataset.value) {
				column = dataset.value.columns.find((col: any) => col.name === columnName);
			} else if (catalog.value) {
				column = catalog.value.attributes.find((col: any) => col.name === columnName);
			}
			return column?.displayName ?? columnName;
		};

		watch(() => props.datasetId, async(val) => {
			if (!datasets.value[val]) {
				const tableData = await loadTableData(dataset?.value, 0, props.numberOfItemsPerPage, filter.value);
				if (tableData) {
					datasets.value = {...datasets.value, [props.datasetId]: {...tableData, page: 1, recordsPerPage: props.numberOfItemsPerPage, filters: filter.value}};
				}
			}
		});

		watch(() => props.catalogItemId, async(val) => {
			if (!datasets.value[val]) {
				const tableData = await loadTableData(catalog.value, 0, props.numberOfItemsPerPage, filter.value);
				if (tableData) {
					datasets.value = {...datasets.value, [props.catalogItemId]: {...tableData, page: 1, recordsPerPage: props.numberOfItemsPerPage, filters: filter.value}};
				}
			}
		});

		const activeDataset = computed(() => datasets.value[props.datasetId ?? props.catalogItemId]);

		const tableRows = computed(() => activeDataset.value.rows);

		return {
			tableHeader,
			tableRows,
			loading,
			dataset,
			selectedWidgetInstanceId
		};
	}
});
</script>

<style lang="scss" scoped>
.max-width {
	width: 100%;
	// 64px is padding from left and right, 65px is size of left navbar
	//width: calc(100vw - 64px - 65px);
}

.max-height {
	height: calc(100vh - 210px);
	max-height: calc(100vh - 210px);
}
</style>

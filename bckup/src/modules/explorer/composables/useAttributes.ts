import {computed} from 'vue';
import {useDataExploreStore} from '@/modules/explorer/store/dataExplore';
import useExplorerChart from '@/modules/explorer/composables/useExplorerChart';
import store from '@/plugins/store';
import {DatasetColumn} from '@/modules/dataset/store/types';
import {TELLSTORY_ROW_ID} from '@/modules/dataset/utils/dataset';

// eslint-disable-next-line func-names
export default function() {
	const dataExploreStore = useDataExploreStore();

	const attributeList = computed(() => dataExploreStore.getAttributes.list);
	const {explore, catalogs, selectedWidgetInstanceId, dataConfiguration, selectedWidget} = useExplorerChart();

	const dataset = computed(() => {
		if (explore.value && dataExploreStore.selectedDataExploration?.datasetId) {
			return explore.value.datasets.find((item: any) => item.id === dataExploreStore.selectedDataExploration?.datasetId);
		}
		return {};
	});

	const catalogDetail = computed(() => catalogs.value?.find((item: any) => item.id === dataExploreStore?.selectedDataExploration?.catalogItemId) ?? null);
	const datasetDetail = computed(() => explore.value?.datasets?.find((item: any) => item.id === dataExploreStore?.selectedDataExploration?.datasetId) ?? null);

	const datasetDetailColumns
		= computed(() : DatasetColumn[] => dataset.value?.columns ? dataset.value?.columns.filter((data:DatasetColumn) => data.name !== TELLSTORY_ROW_ID) : []);
	const datasetDataForColumn = (columnIndex: number) => store.getters['widgetData/getColumnData'](selectedWidgetInstanceId.value ?? '', columnIndex);

	const catalogDetailColumns = computed(() => catalogDetail.value?.attributes);
	const widgetData = computed(() => store.getters['widgetData/data'](selectedWidgetInstanceId.value));
	const widgetRawData = computed(() => store.getters['widgetData/rawData'](selectedWidgetInstanceId.value));
	const datasetColumnType = (columnId: string) => dataset?.value?.columns?.find((col: any) => col.name === columnId)?.dataType;
	const catalogColumnType = (columnName: string) => catalogDetail?.value?.attributes?.find((column: any) => column.name === columnName)?.dataType;

	const getOrdering = computed(() => {
		if (dataConfiguration.value?.orderBy && dataConfiguration.value?.orderBy.length > 0) {
			return dataConfiguration.value?.orderBy;
		}
		if (dataConfiguration.value?.ranking && dataConfiguration.value?.ranking[0]?.definition?.orderBy.length > 0) {
			return dataConfiguration.value?.ranking[0]?.definition?.orderBy;
		}
		return null;
	});
	const getFormatting = computed(() => selectedWidget.value?.configuration?.options?.selectedFormat ?? {});

	const starIcon = (isFavorite: boolean) => {
		if (isFavorite) {
			return [
				'fas',
				'star'
			];
		}
		return [
			'fal',
			'star'
		];
	};
	return {
		starIcon,
		attributeList,
		datasetDetail,
		catalogDetail,
		datasetDetailColumns,
		catalogDetailColumns,
		datasetDataForColumn,
		widgetData,
		widgetRawData,
		datasetColumnType,
		catalogColumnType,
		getOrdering,
		getFormatting
	};
}

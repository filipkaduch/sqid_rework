import store from '@/plugins/store';
import {dataTypes, dateTypes, filterLogic, filterTypes, numberTypes, textTypes} from '@/util/queryBuilder';
import {
	dateFiltersOperations,
	numberFiltersOperations,
	numberInputs,
	stringFiltersOperations,
	lastCurrentDateOptions,
	filterValueConsts
} from '@/modules/widget/components/widget-controls/filter/consts';
import {WIDGET_INSTANCE_GETTERS, WIDGET_INSTANCE_STORE_NAME} from '@/modules/widget/store/widgetInstances/types';
import {computed} from 'vue';
import {DATASOURCE_TYPES} from '@/modules/dataset/utils/datasetUtils';
import {widgetServices} from '@/modules/widget/widgetServices';

// eslint-disable-next-line func-names
export default function() {
	const useMultiselect = (filter: any) => textTypes.includes(filter.dataType) && filter.metadata.type === filterTypes.SIMPLE_ARRAY_COLUMN_VALUE;

	const useTextInput = (filter: any) => textTypes.includes(filter.dataType) && [filterLogic.LIKE, filterLogic.ILIKE].includes(filter.logic);

	const useNumberInput = (filter: any) => numberTypes.includes(filter.dataType) && numberInputs.includes(filter.logic);

	const useRangeNumberInput = (filter: any) => numberTypes.includes(filter.dataType) && filter.metadata.type === filterTypes.GROUP;

	const useDatePicker = (filter: any) => dateTypes.includes(filter.dataType)
		&& filter.metadata.type !== filterTypes.GROUP
		&& ![filterValueConsts.IN_CURRENT, filterValueConsts.IN_LAST].includes(filter.metadata.value);

	const useRangeDatePicker = (filter: any) => dateTypes.includes(filter.dataType) && filter.metadata.type === filterTypes.GROUP;

	const useLastCurrentDatePicker = (filter: any) => dateTypes.includes(filter.dataType)
		&& filter.metadata.type === filterTypes.SIMPLE_COLUMN_VALUE
		&& [filterValueConsts.IN_CURRENT, filterValueConsts.IN_LAST].includes(filter.metadata.value);

	const useComponent = (filter: any) => {
		if (useTextInput(filter)) {
			return 'ds-input';
		} else if (useNumberInput(filter)) {
			return 'ds-input';
		} else if (useDatePicker(filter)) {
			return 'ds-datepicker';
		} else if (useLastCurrentDatePicker(filter)) {
			return 'ds-select';
		}
		return null;
	};

	const propsToBind = (filter: any, source: {type: any, id: string}) => {
		if (useTextInput(filter)) {
			return {
				value: filter?.value ?? null,
				debounce: true,
				type: 'text'
			};
		} else if (useNumberInput(filter)) {
			return {
				value: filter?.value ?? null,
				debounce: true,
				type: 'number'
			};
		} else if (useDatePicker(filter)) {
			return {
				value: filter?.value ?? null,
				placeholder: 't_noDate',
				class: 'mb-1'
			};
		} else if (useLastCurrentDatePicker(filter)) {
			return {
				items: lastCurrentDateOptions(filter),
				initialValue: getInitialValueForLastCurrent(filter) ?? null,
				placement: 'bottom'
			};
		}

		return null;
	};

	const valuesForMultiselect = (async(filter: any, source: {type: any, id: string}, searchValue: string | null = null) => {
		const sourceInfo = findSource(source);
		const columns = source.type === DATASOURCE_TYPES.DATASET ? sourceInfo.columns : sourceInfo.attributes;
		const columnToUse = columns.find((column: any) => column.name === filter.columnReference);
		if (columnToUse.mostCommonValues && !searchValue) {
			// We got most common values in format {value: quantity, value2 : quaintity}
			const valueIndex = 0;
			const quantityIndex = 1;
			// And we need to sort it by quantity
			const sortedEntries = Object.entries(columnToUse.mostCommonValues).sort((first: any, second: any) => first[quantityIndex] - second[quantityIndex]).reverse();
			return sortedEntries.map((item: any) => ({value: item[valueIndex], selectLabel: item[valueIndex]}));
		}

		let preAggFilter = [] as any;

		if (searchValue) {
			preAggFilter = [
				{
					columnReference: columnToUse.name,
					logic: filterLogic.LIKE,
					type: filterTypes.SIMPLE_COLUMN_VALUE,
					negate: false,
					value: `%${searchValue}%`
				}
			];
		}

		const config = {
			...(source.type === DATASOURCE_TYPES.DATASET ? {datasetInfoId: sourceInfo.info.datasetInfoId} : {}),
			...(source.type === DATASOURCE_TYPES.CATALOG_ITEM ? {catalogItemId: sourceInfo.id} : {}),
			dataObjectSource: source.type,
			dimensions: [
				{
					column: {
						name: columnToUse.name,
						alias: 'Dimension1'
					},
					function: 'NO-CHANGE'
				}
			],
			metrics: [],
			filters: {
				preAggregation: preAggFilter,
				postAggregation: []
			},
			ranking: [],
			limit: 10,
			offset: 0,
			orderBy: [],
			features: null
		};
		const response = await widgetServices.fetchData(config);
		return response.data.rows.map((value: any) => ({value: value[0], selectLabel: value[0]}));
	});

	const operationsBasedOnAttribute = (dataType: any) => {
		if (dataType === dataTypes.TEXT) {
			return stringFiltersOperations;
		} else if (numberTypes.includes(dataType)) {
			return numberFiltersOperations;
		} else if (dateTypes.includes(dataType)) {
			return dateFiltersOperations;
		}

		return [];
	};

	const getInitialValues = (filter: any) => filter.value?.map((item: any) => ({value: item, selectLabel: item})) ?? [];
	const getInitialValueForLastCurrent = (filter: any) => lastCurrentDateOptions(filter).find((item) => item.value === filter?.value)?.selectLabel ?? null;

	const getIconNameFromDataType = (dataType: any) => {
		if (numberTypes.includes(dataType)) {
			return 'icon-number-datatype';
		} else if (dateTypes.includes(dataType)) {
			return 'icon-date-datatype';
		} else if (textTypes.includes(dataType)) {
			return 'icon-text-datatype';
		}
		return null;
	};

	const selectedWidgetId = computed(() => store.getters[`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_GETTERS.SELECTED_WIDGET_INSTANCE_ID}`]);
	const widgetConfiguration = computed(() => store.getters[`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_GETTERS.CONFIGURATION}`](selectedWidgetId.value));
	const storyDatasets = computed(() => store.getters['storyDetail/story']?.datasets ?? []);
	const storyCatalogItems = computed(() => store.getters['storyDetail/catalogItems'] ?? []);
	const findSource = (source: {type: any, id: string}) => {
		if (source.type === DATASOURCE_TYPES.DATASET) {
			return storyDatasets.value.find((dataset: any) => dataset.id === source.id) ?? null;
		}
		return storyCatalogItems.value.find((dataset: any) => dataset.id === source.id) ?? null;
	};

	const visualizationType = computed(() => store.getters['storyDetail/story']?.storyType);

	return {
		useMultiselect,
		useTextInput,
		useNumberInput,
		useRangeNumberInput,
		useDatePicker,
		useRangeDatePicker,
		useLastCurrentDatePicker,
		selectedWidgetId,
		widgetConfiguration,
		storyDatasets,
		storyCatalogItems,
		findSource,
		visualizationType,
		useComponent,
		propsToBind,
		getIconNameFromDataType,
		operationsBasedOnAttribute,
		valuesForMultiselect,
		getInitialValues
	};
}

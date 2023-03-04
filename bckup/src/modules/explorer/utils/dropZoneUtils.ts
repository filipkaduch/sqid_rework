import {numberTypes, dataTypes, textTypes, CUSTOM_METRIC, isFormattable, metricDefinition} from '@/util/queryBuilder';
import {Attribute, DraggedAttribute, useDataExploreStore} from '@/modules/explorer/store/dataExplore';
import {chartConstants} from '@/util/consts/chartsConstants';
import {allowedAggregations} from '@/util/aggregations';
import useAttributes from '@/modules/explorer/composables/useAttributes';
import {getFormatter} from '@/util/formatingUtil';
import cloneDeep from 'lodash/cloneDeep';
import store from '@/plugins/store';
import i18n from '@/plugins/i18n';
const {t} = i18n.global;

const allowedMetricTypes = [...numberTypes, ...textTypes, dataTypes.BOOL, ...dataTypes.DATE_TYPE, CUSTOM_METRIC];
const allowedDimensionsTypes = Object.values(dataTypes);
const dataExploreStore = useDataExploreStore();
const {datasetColumnType, datasetDataForColumn, catalogColumnType, getOrdering, getFormatting, catalogDetail, datasetDetail} = useAttributes();

interface CurrentAttributes {
	metrics: Attribute[]
	dimensions: Attribute[]
}

export const getOrderingToRemove = (dataConfiguration: any) => {
	const orderByAlias = dataConfiguration.orderBy?.[0]?.columnAlias;
	const numberIndex = orderByAlias?.search(/[0-9]/) ?? -1;
	if (numberIndex !== -1) {
		let orderByType = dataConfiguration.orderBy?.[0].columnAlias.substr(0, numberIndex);
		orderByType = orderByType.charAt(0).toLowerCase() + orderByType.slice(1);
		const orderIndex = parseInt(orderByAlias.substr(orderByType.length), 10) - 1;
		return {orderIndex, orderByType};
	}
	return {orderIndex: -1, orderByType: null};
};

export const isMetricDragAllowed = (attribute: DraggedAttribute, {metrics, dimensions}: CurrentAttributes) => {
	let allowed = false;
	if (dimensions.length >= 2 && metrics.length === 1) {
		return allowed;
	}
	// if dataType is allowed in metrics;
	if (allowedMetricTypes.includes(attribute.type)) {
		allowed = true;
	}
	return allowed;
};
export const isDimensionDragAllowed = (attribute: DraggedAttribute, {metrics, dimensions}: CurrentAttributes) => {
	let allowed = false;
	// more than 2 dimensions are not allowed
	// only one dimension is allowed with multiple metrics
	if (dimensions.length === 2 || (metrics.length >= 2 && dimensions.length === 1)) {
		return allowed;
	}
	// if dataType is allowed in dimensions;
	if (allowedDimensionsTypes.includes(attribute.type)) {
		allowed = true;
	}
	return allowed;
};

export const axisDataMap = {
	dimension0: 'xAxis',
	dimension1: 'yAxis',
	metric: 'metric'
};

export const formatAggregations = (aggregations: any, aggregation: string) => aggregations.map((aggr: any) => ({
	value: aggr.value,
	selectLabel: aggr.label,
	...(aggregation === aggr.value ? {selected: aggregation} : {}),
	...('disabled' in aggr ? {disabled: aggr.disabled} : {}),
	group: t('explorer.dropZone.aggregation')
}));

export const removeFormattingOnAttribute = (formatting: any, widgetId: string, type: string, index: number) => {
	// @ts-ignore
	if (getFormatting.value[axisDataMap[`${type}${index}`]]) {
		const newSelectedFormat = cloneDeep(getFormatting.value);
		// @ts-ignore
		delete newSelectedFormat[axisDataMap[`${type}${index}`]];
		store.dispatch('widgetInstances/setOption', {
			widgetInstanceId: widgetId,
			optionName: 'selectedFormat',
			value: newSelectedFormat
		});
	}
};

export const getDropzoneBg = (draggedAttr: DraggedAttribute | null, isAllowed: boolean) => draggedAttr
	? isAllowed ? 'ds-bg-interaction-100' : 'ds-bg-separate-content-0'
	: 'ds-bg-interaction-0';

export const isDropzoneDisabled = (draggedAttr: DraggedAttribute | null, isAllowed: boolean) => draggedAttr ? !isAllowed : false;

// eslint-disable-next-line max-params
export const mapFormattingToData = (data: any, dataType: string, option: string, index: number, selectedFormat: null, numberBucketing: any, forceFormat: boolean = false) => {
	const isMetric = option === chartConstants.dataConfiguration.METRIC;
	const indexedOption = `${option}${index}`;
	// @ts-ignore
	const mappedOption = axisDataMap[isMetric ? option : indexedOption];
	const formatter = getFormatter(
		isMetric ? dataTypes.INT : dataType,
		indexedOption,
		mappedOption,
		null,
		selectedFormat
	);

	if (!selectedFormat || !selectedFormat?.[mappedOption] || !isFormattable(option, dataType) || numberBucketing) {
		return data;
	}
	const formatted = data.map((item: string|number|number[]|string[]) => {
		if (isMetric) {
			// @ts-ignore
			return [formatter(item[0])];
		}
		return [formatter(item)];
	});
	return formatted;
};

export const moveIndexes = (attributes: Attribute[]): number => {
	let indexMover = attributes?.length ?? 0;
	// TODO EVENTUALLY ADD ANOTHER CONDITION FOR TIMELINE INDEX
	// eslint-disable-next-line max-depth
	if (attributes.find((dim: Attribute) => dim.numberOfBuckets)) {
		indexMover += 1;
	}
	return indexMover;
};

// TODO: rename
export const mapAttributesToLists = (data: any): Attribute[] => {
	if (data) {
		const dim: Attribute[] = data.dimensions?.map((dimension: any, index: number) => {
			const columnType = datasetColumnType(dimension.column) ?? catalogColumnType(dimension.column);

			let displayName = null;
			if (datasetDetail.value) {
				displayName = datasetDetail.value?.columns.find((column: any) => column.name === dimension.column)?.displayName;
			} else if (catalogDetail.value) {
				displayName = catalogDetail.value?.attributes.find((column: any) => column.name === dimension.column)?.displayName;
			}

			return {
				name: dimension.column,
				displayName,
				index,
				selected: chartConstants.dataConfiguration.DIMENSION,
				type: columnType,
				data: mapFormattingToData(
					datasetDataForColumn(index), columnType, chartConstants.dataConfiguration.DIMENSION, index,
					getFormatting.value, dimension.numberOfBuckets
				),
				function: dimension.function,
				numberOfBuckets: dimension.numberOfBuckets,
				bucketsDatetime: dimension?.bucketType ?? dimension?.extractType ?? null,
				aggregations: [],
				...(getOrdering.value?.[0]?.columnAlias === `Dimension${index + 1}` ? {orderBy: getOrdering.value} : {}),
				// @ts-ignore
				selectedFormat: getFormatting.value[axisDataMap?.[`${chartConstants.dataConfiguration.DIMENSION}${index}`]],
				// @ts-ignore
				uniqueValuesCount: dataExploreStore.getAttributes?.list.find((attrs: Attribute) => attrs.name === dimension.column)?.uniqueValuesCount
			};
		});
		const met: Attribute[] = data.metrics?.map((metric: any, index: number) => {
			const columnType = datasetColumnType(metric.column) ?? catalogColumnType(metric.column) ?? CUSTOM_METRIC;
			const columnIndex = index + moveIndexes(data.dimensions);

			let displayName = null;
			if (datasetDetail.value) {
				displayName = datasetDetail.value?.columns.find((column: any) => column.name === metric.column)?.displayName;
			} else if (catalogDetail.value) {
				displayName = catalogDetail.value?.attributes.find((column: any) => column.name === metric.column)?.displayName;
			}

			return {
				name: metric.column,
				displayName: displayName ?? metric.column,
				index,
				selected: chartConstants.dataConfiguration.METRIC,
				type: columnType,
				data: mapFormattingToData(datasetDataForColumn(columnIndex), columnType, chartConstants.dataConfiguration.METRIC, index, getFormatting.value, false),
				...(columnType === CUSTOM_METRIC
					? {
						customExpressionEnabled: metric.customExpressionEnabled,
						customExpression: metric.customExpression,
						customColumnName: metric.column,
						id: metric.id
					}
					: {
						aggregation: metric.aggregation,
						aggregations: allowedAggregations(columnType, true).map((aggregation: string) => ({
							selectLabel: aggregation,
							label: aggregation,
							value: aggregation,
							...(aggregation === metricDefinition.C_SUM ? {disabled: isCumSumDisabled(dim)} : {})
						})),
						// @ts-ignore
						uniqueValuesCount: dataExploreStore.getAttributes?.list?.find((attrs: Attribute) => attrs.name === metric.column)?.uniqueValuesCount
					}),
				selectedFormat: getFormatting.value[chartConstants.dataConfiguration.METRIC],
				...(getOrdering.value?.[0]?.columnAlias === `Metric${index + 1}` ? {orderBy: getOrdering.value} : {})
			};
		});
		return [...(dim ?? []), ...(met ?? [])];
	}
	return [];
};

const isCumSumDisabled = (dim: any) => !(dim.length === 1 && (dim[0].type === dataTypes.DATE || dim[0].type === dataTypes.DATETIME));

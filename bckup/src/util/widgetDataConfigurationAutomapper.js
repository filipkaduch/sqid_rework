import {columnUsageType, columnVisibilityState, dataTypes, dimensionDefinition, isDataType, metricDefinition, ordering, geoValues} from '@/util/queryBuilder';
import {widgetTypes} from '@/util/consts/widgetTypes';
import {datasetService} from '@/modules/dataset/datasetService';

const defaultPriorityList = [
	dataTypes.TEXT,
	dataTypes.TEXT_NOT_NULL,
	dataTypes.DATETIME,
	dataTypes.DATE
];
const defaultMetricPriorityList = [
	dataTypes.INT,
	dataTypes.LONG,
	dataTypes.FLOAT
];
const defaultDatePriorityList = [dataTypes.DATETIME, dataTypes.DATE];
const mapperConfigOptions = [
	'count',
	'min'
];

const compareColumnTypes = (type1, type2, priorityList) => {
	const type1Priority = priorityList.indexOf(type1);
	const type2Priority = priorityList.indexOf(type2);
	if (type1Priority === -1 && type2Priority === -1) {
		return 0;
	}
	if (type1Priority === -1) {
		return 1;
	}
	if (type2Priority === -1) {
		return -1;
	}
	return type1Priority - type2Priority;
};

// eslint-disable-next-line no-unused-vars
const checkLatLon = (type, datasetColumns, index) => {
	let returnValue = -1;
	for (let i = index; i < datasetColumns.length; i++) {
		const iterator = datasetColumns[i]?.mostCommonValues ?? datasetColumns[i].displayName;
		let checker = 0;
		Object.keys(iterator).every((key) => {
			if (type === 'lat' && (parseFloat(iterator[key]) > 90.0 || parseFloat(iterator[key]) < -90.0)) {
				return false;
			} else if (type === 'lon' && (parseFloat(iterator[key]) > 180.0 || parseFloat(iterator[key]) < -180.0)) {
				return false;
			}
			checker += 1;
			return true;
		});
		if (checker === Object.keys(iterator).length) {
			returnValue = i;
			break;
		}
	}
	return returnValue === -1 ? null : datasetColumns[returnValue];
};

// eslint-disable-next-line max-statements,complexity,max-lines-per-function
const dataColumnsAutomap = (widgetDataConfiguration, datasetColumns, type, widgetType = null) => {
	const mappedData = [];
	for (let i = 0; i < mapperConfigOptions.length; i++) {
		const option = mapperConfigOptions[i];
		const numOfColumns = datasetColumns.length;
		if (widgetDataConfiguration?.[type]?.[option]) {
			for (let j = 0; j < widgetDataConfiguration[type][option]; j++) {
				const datasetColumn = datasetColumns[j % numOfColumns];
				let longitudeDatasetColumn = datasetColumns[(j + 1) % numOfColumns];
				if (j === 1 && datasetColumns[(j + 1) % numOfColumns].dataType !== 'FLOAT') {
					longitudeDatasetColumn = checkLatLon(geoValues.LON, datasetColumns, (j + 1) % numOfColumns);
				}
				const data = {};
				if (type === columnUsageType.DIMENSIONS) {
					// eslint-disable-next-line max-depth
					if (widgetDataConfiguration?.mapType) {
						data.function = dimensionDefinition.GEO_POI_GRID;
					} else if (widgetDataConfiguration?.histogram) {
						data.numberOfBuckets = widgetDataConfiguration?.buckets.default;
						data.function = dimensionDefinition.BUCKET_VALUE;
					} else {
						data.function = dimensionDefinition.NO_CHANGE;
					}
					if (widgetDataConfiguration?.dimensions?.showTopValues && type === columnUsageType.DIMENSIONS
						&& j === widgetDataConfiguration[type][option] - 1 && widgetTypes.TOP_VALUES_CHARTS.includes(widgetType)) {
						data.topValues = {
							count: 10,
							direction: ordering.ASC
						};
					}
				} else {
					data.aggregation = datasetColumns.length > 0 && isDataType(dataTypes.NUMBER, datasetColumn.dataType)
						? metricDefinition.SUM
						: metricDefinition.COUNT;
					// TODO: just for release need to be posted to mapping fnc like default aggregation
					if (widgetType === widgetTypes.INSIGHT && data.aggregation === metricDefinition.SUM) {
						data.aggregation = metricDefinition.AVG;
					}
				}
				if (widgetDataConfiguration?.mapType) {
					data.longitudeColumnName = datasetColumns.length > 0 ? longitudeDatasetColumn.name : null;
					data.latitudeColumnName = datasetColumns.length > 0 ? checkLatLon(geoValues.LAT, datasetColumns, j % numOfColumns)?.name : null;
					// TODO: load from widgetMetaData
					data.zoom = 16;
				}
				data.column = datasetColumns.length > 0 ? datasetColumn.name : null;
				mappedData.push(data);
			}
			return mappedData;
		}
	}
	return mappedData;
};
const getPriorityList = (type, widgetDataConfiguration) => {
	switch (type) {
		case columnUsageType.DIMENSIONS:
			return widgetDataConfiguration.priorityList ? widgetDataConfiguration.priorityList : defaultPriorityList;
		case columnUsageType.METRICS:
			return defaultMetricPriorityList;
		case columnUsageType.DATE:
			return defaultDatePriorityList;
	}
	return defaultPriorityList;
};
const sortColumns = (columns, priorityList) => columns.slice()
	.sort((column1, column2) => compareColumnTypes(
		column1.dataType,
		column2.dataType,
		priorityList
	));

const widgetDataConfigurationAutomapper = async(widgetDataConfiguration, story, widgetType = null) => {
	const {datasets} = story;
	let columnsFiltered = [];
	let dataset = null;
	let id = null;
	if (story.catalogItems.length > 0) {
		id = story.catalogItems[0].catalogItemId;
		const response = await datasetService.getCatalogItemsDetail(id);
		columnsFiltered = response[0].attributes;
		dataset = false;
	} else {
		columnsFiltered = datasets[0].columns.filter((column) => column.visibilityState !== columnVisibilityState.INTERNAL);
		([{id}] = datasets);
		dataset = true;
	}

	const sortedDimensionColumns = sortColumns(columnsFiltered, getPriorityList(columnUsageType.DIMENSIONS, widgetDataConfiguration));
	const sortedMetricColumns = sortColumns(columnsFiltered, getPriorityList(columnUsageType.METRICS, widgetDataConfiguration));
	let dateColumn = {};
	if (widgetType === widgetTypes.INSIGHT) {
		const sortedDateColumn = sortColumns(columnsFiltered, getPriorityList(columnUsageType.DATE, widgetDataConfiguration));
		dateColumn = {
			date: {
				column: dataColumnsAutomap(widgetDataConfiguration, sortedDateColumn, columnUsageType.DATE, widgetType)[0].column,
				datasetId: datasets[0].id
			}
		};
	}
	return {
		...(dataset ? {datasetId: id} : {catalogItemId: id}),
		configuration: {
			version: 'default/v0',
			dimensions: dataColumnsAutomap(widgetDataConfiguration, sortedDimensionColumns, columnUsageType.DIMENSIONS, widgetType),
			metrics: dataColumnsAutomap(widgetDataConfiguration, sortedMetricColumns, columnUsageType.METRICS, widgetType),
			...dateColumn,
			limit: widgetDataConfiguration.limit?.default ?? 10,
			orderBy: widgetDataConfiguration.orderBy ?? [],
			lastValueColumn: widgetDataConfiguration.lastValueColumn ?? false
		}
	};
};

export default widgetDataConfigurationAutomapper;

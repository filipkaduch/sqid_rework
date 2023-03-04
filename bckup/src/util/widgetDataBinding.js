import {dimensionDefinition} from '@/util/queryBuilder';

const mapFunctionOptions = (columnData) => {
	switch (columnData.function) {
		case dimensionDefinition.BUCKET_VALUE:
			return {numberOfBuckets: columnData.numberOfBuckets};
		case dimensionDefinition.BUCKET_DATE:
			return {bucketType: columnData.bucketsDatetime};
		case dimensionDefinition.EXTRACT_DATE:
			return {extractType: columnData.bucketsDatetime};
	}
	return {};
};
const mapFunctionOptionsConfiguration = (configuration) => {
	switch (configuration.function) {
		case dimensionDefinition.BUCKET_VALUE:
			return {numberOfBuckets: configuration.numberOfBuckets};
		case dimensionDefinition.BUCKET_DATE:
			return {bucketsDatetime: configuration.bucketType};
		case dimensionDefinition.EXTRACT_DATE:
			return {bucketsDatetime: configuration.extractType};
	}
	return {};
};

export const mapDimensionAxes = (widgetData) => ({
	column: widgetData.column,
	function: widgetData.function ?? dimensionDefinition.NO_CHANGE,
	...(mapFunctionOptions(widgetData)),
	...(widgetData.topValues ? {topValues: widgetData.topValues} : widgetData.topValues === null ? {topValues: null} : {})
});

export const mapMetricAxes = (widgetData) => ({
	column: widgetData.column,
	aggregation: widgetData.function,
	customExpressionEnabled: widgetData.customExpressionEnabled,
	customExpression: widgetData.customExpression,
	customColumnName: widgetData.customColumnName,
	...(widgetData.id ? {id: widgetData.id} : {})
});

export const mapPoiAxes = (lonData, latData) => ({
	longitudeColumnName: lonData.column,
	latitudeColumnName: latData.column,
	bucketsMap: 'PoiDistinct'
});

export const mapLonLatAxes = (lonData, latData, zoom = null) => ({
	function: dimensionDefinition.GEO_POI_GRID,
	latitudeColumnName: latData.column,
	longitudeColumnName: lonData.column,
	...(zoom === null ? {} : {zoom})
});

export const mapDimensionAxesConfiguration = (configuration, binding) => ({
	dataset: binding?.datasetId ?? binding?.catalogItemId,
	column: configuration.column,
	function: configuration.function ?? null,
	...(mapFunctionOptionsConfiguration(configuration)),
	...(configuration.topValues ? {topValues: configuration.topValues} : {})
});

export const mapMetricAxesConfiguration = (configuration, binding) => ({
	dataset: binding?.datasetId ?? binding?.catalogItemId,
	column: configuration.column,
	function: configuration.aggregation,
	customExpressionEnabled: configuration.customExpressionEnabled,
	customExpression: configuration.customExpression,
	customColumnName: configuration.customColumnName,
	...(configuration.id ? {id: configuration.id} : {})
});

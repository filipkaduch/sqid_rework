import {
	dataTypes,
	dimensionDefinition,
	filterLogic,
	filterTypes,
	metricDefinition,
	ordering
} from '@/util/queryBuilder';
import {logicConstants, operationConstants} from '@/util/consts/logicConstants';
import {chartConstants} from '@/util/consts/chartsConstants';

const mapFunctionOptions = (dimensionConfiguration) => {
	switch (dimensionConfiguration.function) {
		case dimensionDefinition.BUCKET_VALUE:
			return {numberOfBuckets: dimensionConfiguration.numberOfBuckets};
		case dimensionDefinition.BUCKET_DATE:
			return {bucketType: dimensionConfiguration.bucketType};
		case dimensionDefinition.EXTRACT_DATE:
			return {extractType: dimensionConfiguration.extractType};
	}
	return {};
};

export const mapRanking = (widgetConfiguration, metadataConfig) => {
	const isTimeline = Boolean(widgetConfiguration.configuration.timeline);
	const metricOrder = widgetConfiguration.configuration.orderBy?.[0]?.order ?? ordering.ASC;
	const configurationOrderBy = widgetConfiguration.configuration.orderBy;
	return {
		definition: {
			partitionBy: [isTimeline ? 'Timeline' : `Dimension${metadataConfig.rankingIndex + 1}`],
			orderBy: configurationOrderBy && configurationOrderBy.length > 0 ? configurationOrderBy : [...(isTimeline ? [] : [{columnAlias: 'Metric1', order: metricOrder}])]
		},
		count: widgetConfiguration.configuration.limit ?? 10,
		ignoreNulls: widgetConfiguration.configuration.orderBy === null
			? false
			: widgetConfiguration.configuration.orderBy && widgetConfiguration.configuration.orderBy.length > 0,
		columnReference: isTimeline ? 'TimelineRanking' : `Dimension${metadataConfig.rankingIndex + 1}Ranking`
	};
};

// eslint-disable-next-line max-lines-per-function
const mapFilterGroup = (filters, index, filterClauses, clauseIndex) => {
	if (index < 0) {
		return [];
	}
	return [
		...(clauseIndex < 0
			? filters.slice(0, index + 1).map((filter) => {
				if (filter.custom === true) {
					return {
						type: filterTypes.RAW_FILTER,
						...(Array.isArray(filter.values)
							? typeof filter.values === 'undefined'
								? {values: filter.value}
								: {values: filter.values}
							: typeof filter.values === 'undefined'
								? {value: filter.value}
								: {value: filter.values})
					};
				} else if (filter.logic === logicConstants.IN_RANGE || filter.logic === logicConstants.NOT_IN_RANGE) {
					return {
						type: filterTypes.GROUP,
						operator: operationConstants.AND,
						negate: Boolean(filter.logic === logicConstants.NOT_IN_RANGE),
						clauses: [
							{
								type: filterTypes.SIMPLE_COLUMN_VALUE,
								logic: logicConstants.EGREATER_THAN,
								columnReference: filter.columnReference,
								value: typeof filter.values === 'undefined' ? filter.value.split('–')[0].trim() : filter.values.split('–')[0].trim()
							},
							{
								type: filterTypes.SIMPLE_COLUMN_VALUE,
								logic: logicConstants.ELESS_THAN,
								columnReference: filter.columnReference,
								value: typeof filter.values === 'undefined' ? filter.value.split('–')[1].trim() : filter.values.split('–')[1].trim()
							}
						]
					};
				}
				return {
					type: Array.isArray(filter.values) ? filterTypes.SIMPLE_ARRAY_COLUMN_VALUE : filterTypes.SIMPLE_COLUMN_VALUE,
					...(Array.isArray(filter.values) ? {} : {logic: filter.logic}),
					negate: Boolean(filter.logic === logicConstants.NOT_IN || filter.logic === logicConstants.NOT_LIKE
						|| (filters[0].logic === logicConstants.GREATER_THAN && filters[0].negate)),
					columnReference: filter.columnReference,
					...(Array.isArray(filter.values)
						? typeof filter.values === 'undefined'
							? {values: filter.value}
							: {values: filter.values}
						: typeof filter.values === 'undefined'
							? {value: filter.value}
							: {value: filter.values})
				};
			})
				.reverse()

			: filters[index].custom === true
				? [
					{
						type: filterTypes.RAW_FILTER,
						...(Array.isArray(filters[index].values)
							? typeof filters[index].values === 'undefined'
								? {values: filters[index].value}
								: {values: filters[index].values}
							: typeof filters[index].values === 'undefined'
								? {value: filters[index].value}
								: {value: filters[index].values})
					},
					{
						type: filterTypes.GROUP,
						operator: filterClauses[clauseIndex],
						clauses: mapFilterGroup(filters, index - 1, filterClauses, clauseIndex - 1)
					}
				]
				: filters[index].logic === logicConstants.NOT_IN_RANGE || filters[index].logic === logicConstants.IN_RANGE
					? [
						{
							type: filterTypes.GROUP,
							operator: operationConstants.AND,
							negate: Boolean(filters[index].logic === logicConstants.NOT_IN_RANGE),
							clauses: [
								{
									type: filterTypes.SIMPLE_COLUMN_VALUE,
									logic: logicConstants.EGREATER_THAN,
									columnReference: filters[index].columnReference,
									value: typeof filters[index].values === 'undefined' ? filters[index].value.split('–')[0].trim() : filters[index].values.split('–')[0].trim()
								},
								{
									type: filterTypes.SIMPLE_COLUMN_VALUE,
									logic: logicConstants.ELESS_THAN,
									columnReference: filters[index].columnReference,
									value: typeof filters[index].values === 'undefined' ? filters[index].value.split('–')[1].trim() : filters[index].values.split('–')[1].trim()
								}
							]
						},
						{
							type: filterTypes.GROUP,
							operator: filterClauses[clauseIndex],
							clauses: mapFilterGroup(filters, index - 1, filterClauses, clauseIndex - 1)
						}
					]
					: [
						{
							type: Array.isArray(filters[index].values) ? filterTypes.SIMPLE_ARRAY_COLUMN_VALUE : filterTypes.SIMPLE_COLUMN_VALUE,
							...(Array.isArray(filters[index].values) ? {} : {logic: filters[index].logic}),
							negate: Boolean(filters[index].logic === logicConstants.NOT_IN || filters[index].logic === logicConstants.NOT_LIKE
								|| (filters[0].logic === logicConstants.GREATER_THAN && filters[0].negate)),
							columnReference: filters[index].columnReference,
							...(Array.isArray(filters[index].values)
								? typeof filters[index].values === 'undefined'
									? {values: filters[index].value}
									: {values: filters[index].values}
								: typeof filters[index].values === 'undefined'
									? {value: filters[index].value}
									: {value: filters[index].values})
						},
						{
							type: filterTypes.GROUP,
							operator: filterClauses[clauseIndex],
							clauses: mapFilterGroup(filters, index - 1, filterClauses, clauseIndex - 1)
						}
					])
	];
};

// eslint-disable-next-line max-lines-per-function
export const recursiveFilters = (filters, filterClauses) => {
	const filterConfiguration = {
		preAggregation: [],
		postAggregation: [],
		version: 'default/v0'
	};

	if (filters.length === 1) {
		if (filters[0].logic === logicConstants.NOT_IN_RANGE || filters[0].logic === logicConstants.IN_RANGE) {
			filterConfiguration.preAggregation.push({
				type: filterTypes.GROUP,
				operator: operationConstants.AND,
				negate: Boolean(filters[0].logic === logicConstants.NOT_IN_RANGE),
				clauses: [
					{
						type: filterTypes.SIMPLE_COLUMN_VALUE,
						logic: logicConstants.EGREATER_THAN,
						columnReference: filters[0].columnReference,
						value: typeof filters[0].values === 'undefined' ? filters[0].value.split('–')[0].trim() : filters[0].values.split('–')[0].trim()
					},
					{
						type: filterTypes.SIMPLE_COLUMN_VALUE,
						logic: logicConstants.ELESS_THAN,
						columnReference: filters[0].columnReference,
						value: typeof filters[0].values === 'undefined' ? filters[0].value.split('–')[1].trim() : filters[0].values.split('–')[1].trim()
					}
				]
			});
		} else if (filters[0].custom === true) {
			filterConfiguration.preAggregation.push({
				type: filterTypes.RAW_FILTER,
				...(Array.isArray(filters[0].values)
					? typeof filters[0].values === 'undefined'
						? {values: filters[0].value}
						: {values: filters[0].values}
					: typeof filters[0].values === 'undefined'
						? {value: filters[0].value}
						: {value: filters[0].values})
			});
		} else {
			filterConfiguration.preAggregation.push({
				type: Array.isArray(filters[0].values) ? filterTypes.SIMPLE_ARRAY_COLUMN_VALUE : filterTypes.SIMPLE_COLUMN_VALUE,
				...(Array.isArray(filters[0].values) ? {} : {logic: filters[0].logic}),
				negate: Boolean(filters[0].logic === logicConstants.NOT_IN_RANGE
					|| filters[0].logic === logicConstants.NOT_IN
					|| filters[0].logic === logicConstants.NOT_LIKE
					|| (filters[0].logic === logicConstants.GREATER_THAN && filters[0].negate)),
				columnReference: filters[0].columnReference,
				...(Array.isArray(filters[0].values)
					? typeof filters[0].values === 'undefined'
						? {values: filters[0].value}
						: {values: filters[0].values}
					: typeof filters[0].values === 'undefined'
						? {value: filters[0].value}
						: {value: filters[0].values})
			});
		}
	} else {
		filterConfiguration.preAggregation.push({
			type: filterTypes.GROUP,
			operator: filterClauses[filterClauses.length - 1],
			clauses: mapFilterGroup(filters, filters.length - 1, filterClauses, filterClauses.length - 2)
		});
	}

	return filterConfiguration;
};

// eslint-disable-next-line max-lines-per-function
export const mapFilters = (widgetConfiguration, filters, topValues) => {
	const topValueFilters = topValues.map((topValuesEntry) => ({
		type: filterTypes.SIMPLE_ARRAY_COLUMN_VALUE,
		columnReference: topValuesEntry.column,
		negate: false,
		values: topValuesEntry.values
	}));

	const dynamicFilters = filters.dynamicFilter.map((filter) => getDynamicFilters(filter));

	const globalFilters = prepareGlobalFilters(filters?.globalFilter, widgetConfiguration);

	return {
		preAggregation: topValueFilters
			.concat(dynamicFilters.flat(1))
			.concat(globalFilters?.preAggregation ?? [])
			.concat(filters.staticFilter?.preAggregation ?? [])
			.concat(filters.drillDownFilter?.filter ?? []),
		postAggregation: []
	};
};

const getDynamicFilters = (filter) => {
	const result = [];
	if (filter.values.every((value) => value.length === 1)) {
		result.push({
			type: filterTypes.SIMPLE_ARRAY_COLUMN_VALUE,
			logic: filterLogic.EQUAL,
			negate: false,
			columnReference: filter.columnName,
			values: filter.values.flat(1)
		});
	} else {
		result.push({
			type: filterTypes.GROUP,
			operator: filterLogic.OR,
			clauses: filter.values.map((filterValue) => ({
				type: filterTypes.GROUP,
				operator: filterLogic.AND,
				clauses: [
					{
						type: filterTypes.SIMPLE_COLUMN_VALUE,
						logic: filterLogic.LESSER_OR_EQUAL,
						negate: false,
						columnReference: filter.columnName,
						value: Math.max(filterValue[0], filterValue[1])
					},
					{
						type: filterTypes.SIMPLE_COLUMN_VALUE,
						logic: filterLogic.GREATER_OR_EQUAL,
						negate: false,
						columnReference: filter.columnName,
						value: Math.min(filterValue[0], filterValue[1])
					}
				]
			}))
		});
	}
	return result;
};

// eslint-disable-next-line no-unused-vars
export const prepareGlobalFilters = (filters, widgetConfiguration) => {
	const globalFilters = [];

	if (filters !== null && Array.isArray(filters) && widgetConfiguration !== null) {
		filters.forEach((element) => {
			Object.entries(element.columnReference).forEach((key) => {
				if (key.length > 1
					&& typeof key !== 'undefined'
					&& (key[0] === widgetConfiguration?.datasetId || key[0] === widgetConfiguration?.catalogItemId)
					&& element.active === true) {
					key[1].forEach((val) => {
						const newFilter = {};
						newFilter.logic = element.logic === 'LAST'
							? '>'
							: element.logic;
						newFilter.columnReference = val;
						newFilter.values = typeof element.value === 'undefined'
							? element.values
							: element.value;
						globalFilters.push(newFilter);
					});
				}
			});
		});

		const value = {preAggregation: globalFilters};
		if (value.preAggregation.length > 0) {
			return recursiveFilters(value.preAggregation, ['AND']);
		}
		return value;
	}
	return [];
};

const mapCSum = (widgetConfiguration) => ({
	definition: {
		orderBy: widgetConfiguration.configuration.orderBy?.length > 0
			? widgetConfiguration.configuration.orderBy
			: [],
		...(widgetConfiguration?.configuration?.dimensions.length > 1
			? {partitionBy: [chartConstants.dataConfiguration.DIMENSION1_C]}
			: {})
	}
});


// eslint-disable-next-line max-lines-per-function,complexity
const widgetDataConfigMapper = (widgetConfiguration, story, filters, metadataConfig = null, topValues = []) => {
	const {datasets} = story;

	// If dataset does not exist then abandon function
	if (!widgetConfiguration.datasetId && !widgetConfiguration.catalogItemId) {
		return null;
	}

	const useRanking = (widgetConfiguration.configuration?.timeline
	|| (Number.isInteger(metadataConfig?.rankingIndex) && widgetConfiguration.configuration?.dimensions.length > 1)) && widgetConfiguration.configuration?.metrics.length > 0;
	const requestConfiguration = {
		...(widgetConfiguration.datasetId
			? {
				datasetInfoId: datasets.find((dataset) => dataset.id === widgetConfiguration.datasetId)?.info?.datasetInfoId,
				dataObjectSource: 'DATA-STORIES-DATASET'
			}
			: {}),
		...(widgetConfiguration.catalogItemId
			? {
				catalogItemId: widgetConfiguration.catalogItemId,
				dataObjectSource: 'CATALOG-ITEM'
			}
			: {}),
		dimensions: (widgetConfiguration.configuration?.dimensions ?? []).map((dimension, index) => dimension?.latitudeColumnName
			? {
				latitudeColumn: {
					name: dimension.latitudeColumnName,
					alias: `Dimension${index + 1}Lat`
				},
				longitudeColumn: {
					name: dimension.longitudeColumnName,
					alias: `Dimension${index + 1}Lon`
				},
				function: dimension.function,
				zoom: dimension.zoom,
				...(mapFunctionOptions(dimension))
			}
			: {
				column: {
					name: dimension.column,
					alias: `Dimension${index + 1}`
				},
				function: dimension.function,
				...(mapFunctionOptions(dimension))
			})
			.concat(widgetConfiguration.configuration?.timeline
				? [
					{
						column: {
							name: widgetConfiguration.configuration.timeline.column,
							alias: 'Timeline'
						},
						function: widgetConfiguration.configuration.timeline.function,
						...(mapFunctionOptions(widgetConfiguration.configuration.timeline))
					}
				]
				: [])
			.concat(widgetConfiguration.configuration?.lastValueColumn
				? [
					{
						column: {
							name: widgetConfiguration.configuration.lastValueColumn.column,
							alias: 'LastValue'
						},
						function: dimensionDefinition.NO_CHANGE
					}
				]
				: []),
		...(metadataConfig?.histogram
			? {
				metrics: [
					{
						column: {
							name: widgetConfiguration.configuration?.dimensions?.[0]?.column,
							alias: 'Metric1'
						},
						aggregation: metricDefinition.COUNT
					}
				]
			}
			: {
				metrics: (widgetConfiguration.configuration?.metrics ?? []).map((metric, index) => ({
					...(metric.customExpressionEnabled
						? {
							expression: metric.customExpression,
							virtualColumn: {
								alias: `Metric${index + 1}`,
								dataType: dataTypes.FLOAT
							}
						}
						: {
							column: {
								name: metric.column,
								alias: `Metric${index + 1}`
							},
							aggregation: metric.aggregation === metricDefinition.C_SUM ? 'CUM-SUM' : metric.aggregation,
							...(metric.aggregation === metricDefinition.C_SUM
								? mapCSum(widgetConfiguration)
								: {})
						}
					)
				}))
			}),
		filters: {
			...mapFilters(widgetConfiguration, filters, topValues)
		},
		ranking: useRanking
			? [mapRanking(widgetConfiguration, metadataConfig)]
			: (
				widgetConfiguration.configuration?.lastValueColumn
					? [
						{
							definition: {
								partitionBy: widgetConfiguration.configuration.dimensions?.[0]?.latitudeColumnName
									? [
										'Dimension1Lat',
										'Dimension1Lon'
									]
									: ['Dimension1'],
								orderBy: [
									{
										columnAlias: 'LastValue',
										order: ordering.DESC
									}
								],
								ignoreNulls: true
							},
							count: 1,
							columnReference: 'LastValueRanking'
						}
					]
					: []
			),
		...(useRanking ? {} : {limit: widgetConfiguration.configuration?.limit ?? 10}),
		offset: widgetConfiguration.configuration?.offset ?? 0,
		orderBy: !useRanking && widgetConfiguration.configuration?.orderBy?.length > 0
			? widgetConfiguration.configuration.orderBy
			: [],
		features: null
	};
	if (filters.drillDownFilter?.forceBucket) {
		requestConfiguration.dimensions[0].bucketType = filters.drillDownFilter.forceBucket;
	}
	return requestConfiguration;
};

export default widgetDataConfigMapper;

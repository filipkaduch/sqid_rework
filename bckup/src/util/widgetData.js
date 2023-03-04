import {findIndex} from 'lodash';
import {widgetTypes} from '@/util/consts/widgetTypes';
import {chartConstants} from '@/util/consts/chartsConstants';
import i18n from '@/plugins/i18n';
const {t} = i18n.global;
const labelFormatter = (data) => `${data === null ? '<NULL>' : data}`;

export const dimensionLabel = (dimension, dataType) => {
	if (Array.isArray(dataType)) {
		return `[${labelFormatter(dimension[0])} - ${labelFormatter(dimension[1])}]`;
	}
	return labelFormatter(dimension);
};

export const cleanLastValueIndexForDataset = (data) => {
	const lastValueIndex = data.columns.findIndex((col) => col.reference === 'LastValue');
	if (lastValueIndex > -1) {
		for (const row of data.rows) {
			row.splice(lastValueIndex, 1);
			row.splice(row.length - 1, 1);
		}
	}
	return data.rows;
};

export const cleanBucketingIndex = (context, data) => {
	let datasetSource = null;
	const bucketingIndex = context.indexes[`${chartConstants.dataConfiguration.BUCKET_NUMBER}`];
	if (bucketingIndex) {
		datasetSource = data.rows.map((row) => {
			row.splice(bucketingIndex.index, 1);
			return row;
		});
	} else {
		datasetSource = data.rows;
	}
	return datasetSource;
};

export const metricLabel = (metrics, index, context = null) => {
	if (!metrics) {
		return '';
	}
	const metric = metrics[index];

	const columns = getColumns(context);

	const metricDisplayName = columns?.find((column) => column?.name === metric?.column)?.displayName ?? null;


	return metric ? (metric.aggregation ? `${metric.aggregation}(${metricDisplayName ?? metric.column})` : metricDisplayName ?? metric.column) : '';
};

export const getAlias = (index, metrics, enums, context = null) => {
	let i = parseInt(index, 10);
	if (i !== 0) {
		i -= 1;
	}
	const name = `Metric${i + 1}`;
	return enums?.metricAliases?.[name] || metricLabel(metrics, i, context);
};

export const getMetricAlias = (name, metrics, enums, context = null) => {
	if (name === 't_MetricAverage' || name === 't_Average') {
		return t(name);
	}
	let i = parseInt(name, 10);
	i += 1;
	return getAlias(i, metrics, enums, context);
};

export const calcSum = (series, notHidden) => {
	let sum = 0;
	const {length} = notHidden;
	for (const item of series) {
		if (length === 0 || length === series.length || findIndex(notHidden, (entry) => entry[0] === item.name) !== -1) {
			sum += item.data[0];
		}
	}

	return sum;
};

export const calcPercentage = (value, sum) => {
	const percentage = value / sum * 100;
	if (percentage < 1) {
		return '';
	}
	return `${(percentage).toFixed(2)}%`;
};

export const hexToRGB = (hex) => {
	const red = parseInt(hex.slice(1, 3), 16);
	const green = parseInt(hex.slice(3, 5), 16);
	const blue = parseInt(hex.slice(5, 7), 16);

	return `rgb(${red}, ${green}, ${blue})`;
};


// eslint-disable-next-line complexity,max-params,max-lines-per-function
export const displayColorPicker = (dimensionsCount, metricsCount, index, dimension, widgetType, indexOfMetric = null) => {
	switch (widgetType) {
		// Multi-metrics widgets, where metric is the colored series
		case widgetTypes.DATA_TABLE:
		case widgetTypes.MULTISERIES_FORMULA:
		case widgetTypes.LINE_CHART:
			return indexOfMetric === index;

		// Charts with first dimension being the colored series
		case widgetTypes.PIE_CHART:
		case widgetTypes.DOUGHNUT_CHART:
		case widgetTypes.COMPARISON_CHART:
			return dimension === chartConstants.dataConfiguration.DIMENSION0;

		// Charts with second dimension being the colored series
		case widgetTypes.BAR_MULTISERIES:
		case widgetTypes.LINE_MULTISERIES:
		case widgetTypes.SPARKLINE:
			return dimension === chartConstants.dataConfiguration.DIMENSION1;

		// Bar charts with option to recolor all series or one by one
		// (color picker on metric by default or in case of just 1 metric -> recolor one by one on dimension or all on metric)
		case widgetTypes.BAR_CHART:
		case widgetTypes.CATEGORY_BAR:
			return (indexOfMetric === index)
				|| (dimension === chartConstants.dataConfiguration.DIMENSION0 && metricsCount === 1);

		// Sparkline pie which displays color picker based on the received data
		// (2+ metrics -> color picker on metrics, 2 dimensions -> color picker on second dimension)
		case widgetTypes.SPARKLINE_PIE:
			return (metricsCount >= 1 && indexOfMetric !== null && dimensionsCount === 1)
				|| (dimensionsCount > 1 && dimension === chartConstants.dataConfiguration.DIMENSION1);

		// Bubble chart which displays color picker based on the received data
		// (2 dimensions -> color picker on metric, 3 dimensions -> color picker on third dimension)
		case widgetTypes.BUBBLE_CHART:
			return (dimensionsCount === 2 && indexOfMetric === index)
				|| (dimensionsCount > 2 && dimension === chartConstants.dataConfiguration.DIMENSION2);

		case widgetTypes.SPIDER_CHART:
			return (indexOfMetric === index);
		default:
			return false;
	}
};

export const getDisplayName = (name, context) => {
	const columns = getColumns(context);

	return columns?.find((column) => column.name === name)?.displayName ?? name;
};

const getColumns = (context) => {
	const {catalogItems, datasets} = context.story;

	let columns = null;

	if (context?.widgetConfigurationData?.catalogItemId) {
		columns = catalogItems.find((catalog) => catalog.id === context.widgetConfigurationData.catalogItemId)?.attributes;
	} else if (context?.widgetConfigurationData?.datasetId) {
		columns = datasets.find((dataset) => dataset.id === context.widgetConfigurationData.datasetId)?.columns;
	}

	return columns;
};

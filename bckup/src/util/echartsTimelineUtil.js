import {dimensionLabel} from '@/util/widgetData';
import {getFormatter} from '@/util/formatingUtil';
import {chartConstants} from '@/util/consts/chartsConstants';

// eslint-disable-next-line max-params,max-statements, max-lines-per-function
export const mapTimeline = (data, configuration, context, metricIndex, timelineDimensionIndex, mapData) => {
	const temp = {};
	const totals = {};
	for (const row of data.rows) {
		const timelineDimension = row[timelineDimensionIndex];
		const label = dimensionLabel(timelineDimension);
		if (!temp[label]) {
			temp[label] = [];
		}
		if (!totals[label]) {
			totals[label] = 0;
		}

		temp[label].push(row);
		totals[label] += row[metricIndex];
	}
	const resultSet = {
		columns: data.columns
	};
	const timelineData = [];
	const timelineSeries = [];
	const metricFormatter = getFormatter(
		data.columns[metricIndex].dataType,
		'metric0',
		'yAxis',
		configuration.options.enums,
		configuration.options.selectedFormat
	);
	// eslint-disable-next-line guard-for-in
	for (const key in temp) {
		resultSet.rows = temp[key];
		const series = {series: mapData(resultSet, context, configuration)};
		if (series) {
			series.title = [
				{
					text: `Total: ${metricFormatter(totals[key])}`
				}
			];

			timelineData.push(key);
			timelineSeries.push(series);
		}
	}
	return {
		timelineData,
		timelineSeries
	};
};

// eslint-disable-next-line no-unused-vars,max-lines-per-function
export const mapTimelineDataset = (data, configuration, context, metricIndex) => {
	const temp = {};
	const totals = {};
	const timelineData = [];
	const timelineDatasets = [];
	for (const row of data.rows) {
		const label = dimensionLabel(row[context.indexes.Timeline.index]);
		if (!temp[label]) {
			temp[label] = [];
		}
		if (!totals[label]) {
			totals[label] = 0;
		}

		temp[label].push(row);
		totals[label] += row[metricIndex];
	}
	const header = configuration.data.configuration.dimensions.map((dimension) => dimension.column)
		.concat(configuration.data.configuration.metrics.map((metric) => metric.column));
	header.push('TimelineRanking');
	header.splice(1, 0, 'Timeline');
	// eslint-disable-next-line no-unused-vars
	const metricFormatter = getFormatter(
		data.columns[metricIndex].dataType,
		'metric0',
		'yAxis',
		configuration.options.enums,
		configuration.options.selectedFormat
	);
	// eslint-disable-next-line guard-for-in,no-unused-vars
	for (const key in temp) {
		temp[key].unshift(header);
		timelineDatasets.push({
			dataset: {
				source: temp[key]
			},
			graphic: {
				type: 'text',
				bottom: configuration?.options?.horizontal ? '25%' : '85%',
				left: chartConstants.chartConst.RIGHT,
				right: '8%',
				z: 0,
				padding: 0,
				style: {
					text: `Total: ${metricFormatter(totals[key])}`,
					font: `bold ${configuration.options?.timeline?.fontSize}px "Roboto"`,
					fill: 'rgba(0,0,0,0.3)'
				}
			}
		});
		timelineData.push(key);
	}
	return {
		timelineData,
		timelineDatasets,
		timelineSeries: mapTimelineSeries(configuration, context)
	};
};

export const mapTimelineSeries = (configuration, context) => {
	const timelineSeries = [];
	const header = configuration.data.configuration.dimensions.map((dimension) => dimension.column)
		.concat(configuration.data.configuration.metrics.map((metric) => metric.column));
	for (let i = 1; i < header.length; i++) {
		timelineSeries.push({
			type: 'bar',
			name: i.toString(),
			itemStyle: {
				color: (param) => {
					const colorIndex = header.length > 2 ? param.seriesIndex : param.dataIndex;
					return context.colors.theme[colorIndex];
				}
			},
			encode: {
				x: configuration?.options?.horizontal ? header[i] : header[0],
				y: configuration?.options?.horizontal ? header[0] : header[i]
			},
			realtimeSort: true,
			stack: configuration?.options?.stacked,
			barWidth: configuration?.data?.configuration?.metrics.length > 1 ? '' : configuration?.options?.barGap ? '' : '82%',
			barCategoryGap: configuration?.options?.barGap ? '0' : null,
			barGap: configuration?.options?.barGap ? '0' : null
		});
	}
	return timelineSeries;
};

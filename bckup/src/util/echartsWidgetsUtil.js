import {dataTypes, isDataType, numberTypes} from '@/util/queryBuilder';
import {metricLabel} from '@/util/widgetData';
import {chartConstants, MAX_COLORS} from '@/util/consts/chartsConstants';
import {cloneDeep, findIndex} from 'lodash';
import i18n from '@/plugins/i18n';
const {t} = i18n.global;
import {rgbLinearShade} from '@/util/colors/shade';

export const addAverageBucketing = (series, context, options) => {
	const data = new Array(series[0].data.length);
	for (let i = 0; i < series[0].data.length; i++) {
		let sum = 0;
		let count = 0;

		for (let j = 0; j < series.length; j++) {
			if (series[j].name !== 't_Average') {
				sum += series[j].data[i] ?? 0;
				count += 1;
			}
		}

		data[i] = (sum / count).toFixed(2);
	}

	series.push({
		type: 'line',
		name: 't_MetricAverage',
		stack: options?.stacked ?? null,
		areaStyle: options?.stacked ? {} : null,
		smooth: options?.smoothLine ?? false,
		itemStyle: {
			color: context.colors.theme[series.length]
		},
		showSymbol: options.graphSymbols === true ? true : series[0].data.length === 1,
		symbolSize: series[0].data.length === 1 ? 10 : 4,
		data
	});
	return series;
};

export const addAverageBucketingLineMultiseries = (data, configuration) => {
	const tmp = [];
	const dataLength = (configuration.options.averageLineAll) ? data.length - 1 : data.length;

	for (let i = 1; i < data[0].length; i++) {
		let sum = 0;
		for (let j = 1; j < dataLength; j++) {
			const value = (typeof data[j][i] === 'undefined' || data[j][i] === null) ? 0 : parseFloat(data[j][i], 10);
			sum += value;
		}
		tmp[i] = sum;
	}

	for (let i = 0; i < tmp.length; i++) {
		tmp[i] = (tmp[i] / (dataLength - 1)).toFixed(2).toString();
	}
	tmp[0] = t('t_MetricAverage');
	data.push(tmp);
	return data;
};


export const addAverageBucketingRace = (data, configuration) => {
	let sum = 0;

	for (let i = 1; i < data.length; i++) {
		const value = (typeof data[i][2] === 'undefined' || data[i][2] === null) ? 0 : parseFloat(data[i][2], 10);
		sum += value;
		if (i % configuration.data.configuration?.limit === 0) {
			data.splice(i, 0, [
				data[i][0],
				t('t_MetricAverage'),
				(sum / (configuration.data.configuration?.limit)).toFixed(2).toString(),
				configuration.data.configuration?.limit + 1
			]);
			sum = 0;
		}
	}
	return data;
};


export const addAverageAll = (series, context, options) => {
	let sum = 0;
	let count = 0;
	for (let i = 0; i < series.length; i++) {
		if (series[i].name !== 't_MetricAverage') {
			count += series[i].data.length;
			for (let j = 0; j < series[i].data.length; j++) {
				sum += series[i].data[j] ?? 0;
			}
		}
	}

	const avg = (sum / count).toFixed(2);
	const data = new Array(series[0].data.length);
	data.fill(avg);
	series.push({
		type: 'line',
		name: 't_Average',
		stack: options?.stacked ?? null,
		areaStyle: options?.stacked ? {} : null,
		smooth: options?.smoothLine ?? false,
		itemStyle: {
			color: context.colors.theme[series.length]
		},
		showSymbol: options.graphSymbols === true ? true : series[0].data.length === 1,
		symbolSize: series[0].data.length === 1 ? 10 : 4,
		data
	});
	return series;
};

export const addAverageAllLineMultiseries = (data) => {
	const tmp = [];
	let sum = 0;
	let count = 0;

	for (let i = 1; i < data[0].length; i++) {
		for (let j = 1; j < data.length; j++) {
			const value = (typeof data[j][i] === 'undefined' || data[j][i] === null) ? 0 : parseFloat(data[j][i], 10);
			sum += value;
			count += 1;
		}
	}
	for (let i = 0; i < data[0].length; i++) {
		tmp[i] = (sum / count).toFixed(2).toString();
	}
	tmp[0] = t('t_Average');
	data.push(tmp);
	return data;
};


export const addAverageAllRace = (data, configuration) => {
	let sum = 0;
	let count = 0;

	for (let i = 1; i < data.length; i++) {
		const value = (typeof data[i][2] === 'undefined' || data[i][2] === null) ? 0 : parseFloat(data[i][2], 10);
		sum += value;
		count += 1;
	}

	for (let i = 1; i < data.length; i++) {
		if (i % configuration.data.configuration?.limit === 0) {
			data.splice(i, 0, [
				data[i][0],
				t('t_Average'),
				(sum / count).toFixed(2).toString(),
				configuration.data.configuration?.limit + 1
			]);
		}
	}

	return data;
};

export const stackToMax = (series) => {
	const sums = [];
	for (let i = 0; i < series[0].data.length; i++) {
		for (let j = 0; j < series.length; j++) {
			// eslint-disable-next-line max-depth
			if (!sums[i]) {
				sums[i] = 0;
			}

			sums[i] += series[j].data[i].value < 0 ? -series[j].data[i].value : series[j].data[i].value;
		}

		for (let j = 0; j < series.length; j++) {
			series[j].data[i].value /= sums[i];
		}
	}
	return series;
};

export const stackToMaxDataset = (dataset, hiddenIndexes = []) => {
	const tmp = [];
	for (let i = 1; i < dataset.length; i++) {
		let sum = 0;
		for (let j = 1; j < dataset[i].length; j++) {
			if (!hiddenIndexes.includes(j)) {
				const val = dataset[i][j];
				sum += val < 0 ? -val : val;
			}
		}
		tmp[i] = sum;
	}

	for (let i = 1; i < dataset.length; i++) {
		for (let j = 1; j < dataset[i].length; j++) {
			if (!hiddenIndexes.includes(j)) {
				dataset[i][j] = (parseFloat(dataset[i][j]) / tmp[i]);
			}
		}
	}
	return dataset;
};

export const stackToMaxMultiseries = (data) => {
	const tmp = [];
	for (let i = 1; i < data[0].length; i++) {
		let sum = 0;
		for (let j = 1; j < data.length; j++) {
			const item = data[j][i];
			const value = (typeof item === 'undefined' || item === null || item === '<NULL>') ? 0 : parseFloat(item);
			sum += value;
		}
		tmp[i] = sum;
	}

	for (let i = 1; i < data[0].length; i++) {
		for (let j = 1; j < data.length; j++) {
			data[j][i] = (parseFloat(data[j][i]) / tmp[i]);
		}
	}
	return data;
};

export const getAlias = (metric, index, enums = null, context = null) => {
	if (index === 't_Average' || index === 't_MetricAverage') {
		return t(index);
	}
	let idx = 0;
	if (isNaN(index)) {
		// 0 based idx
		idx = metric.findIndex((item) => item.column === index);
	} else {
		// 0 based idx (created)
		idx = parseInt(index, 10) - 1;
	}

	const name = `Metric${idx + 1}`;

	return enums?.metricAliases?.[name] || metricLabel(metric, idx, context);
};

export const checkColoring = (coloring, metricsLength) => (coloring && metricsLength === 1);

export const checkCumSum = (configuration) => (configuration.data?.configuration?.orderBy?.length === 0
	&& configuration.data?.configuration?.metrics.some((el) => el.aggregation === 'C-SUM'));

export const replaceUndefinedValues = (data) => {
	for (let i = 1; i < data[0].length; i++) {
		for (let j = 1; j < data.length; j++) {
			const value = (data[j][i] === null || isNaN(data[j][i])) ? 0 : parseFloat(data[j][i], 10);
			data[j][i] = value.toString();
		}
	}
	return data;
};

export const getColumnsCount = (count) => {
	if (count > 6) {
		return 3;
	} else if (count <= 6 && count >= 3) {
		return 4;
	} else if (count === 2) {
		return 6;
	} else if (count === 1) {
		return 12;
	}
	return 4;
};


/* Method which is called before returning computed data for chart, it iterates over data and returns selected style for data,
 	 the result varies based on single/multi representation of series */
export const selectDataMultiseries = (data, selectedData) => {
	const tempData = cloneDeep(data);
	if (tempData && tempData.dataset && selectedData.length > 0) {
		for (let i = 0; i < tempData.dataset.source.length; i++) {
			const isSelected = selectedData.some((filter) => filter[0] === tempData.dataset.source[i]?.subdimension);
			const usedColor = tempData.colors?.coloring?.[chartConstants.dataConfiguration.DIMENSION1]?.[tempData.series[i].name] ?? tempData.colors.theme[i];
			tempData.series[i].selected = isSelected;
			tempData.series[i].itemStyle.color = isSelected ? rgbLinearShade(0.6, usedColor) : usedColor;
		}
	}
	return tempData;
};


export const selectDataBarMultiseries = (data, selectedData) => {
	const tempData = cloneDeep(data);
	if (tempData && tempData.dataset && selectedData.length > 0) {
		for (let i = 0; i < tempData.series.length; i++) {
			const isSelected = selectedData.some((filter) => filter[0] === tempData.series[i].name);
			const usedColor = tempData.colors?.coloring?.[chartConstants.dataConfiguration.DIMENSION1]?.[tempData.series[i].name] ?? tempData.colors.theme[i];
			tempData.series[i].selected = isSelected;
			tempData.series[i].itemStyle.color = isSelected ? rgbLinearShade(0.6, usedColor) : usedColor;
		}
	}
	return tempData;
};

const isArrayEqual = (arr, item) => arr.some((ele) => JSON.stringify(ele) === JSON.stringify(item));
export const selectionArrayComparer = (selectedData, item) => isArrayEqual(selectedData, item.value.slice(0, item.value.length > 2 ? -1 : 2));

export const selectData = (data, selectedData, colors, comparer = null) => {
	if (selectedData.length > 0) {
		for (let i = 0; i < data.series[0].data.length; i++) {
			const item = data.series[0].data[i];
			const itemName = typeof item.name === 'number' ? item.name.toString() : item.name;
			const isSelected = comparer ? comparer(selectedData, item) : findIndex(selectedData, (selected) => (selected[0] === itemName)) !== -1;
			const color = colors.metadata?.dimensionColoring
				? (colors?.coloring?.[chartConstants.dataConfiguration.DIMENSION0]?.[itemName] ?? colors.theme[i])
				: colors?.coloring?.[chartConstants.dataConfiguration.METRIC0] ?? colors.theme[0];
			data.series[0].data[i].selected = isSelected;
			if (typeof data.series[0].data[i].itemStyle === 'undefined') {
				data.series[0].data[i].itemStyle = {};
			}
			data.series[0].data[i].itemStyle.color = isSelected ? rgbLinearShade(0.6, color) : color;
		}
	}
	return data;
};
export const selectDataDataset = (data, selectedData, colors, comparer = null) => {
	if (data?.series) {
		for (const item of data.series) {
			item.itemStyle = {
				color: (params) => {
					// base chart have len 2 (metric and dimension). When is timeline is +2 (Timeline and TimelineRanking)
					// that is limit 4 for single series charts color setting
					const multipleMetrics = data.series.length > 1;
					let usedColor = null;
					if (multipleMetrics) {
						usedColor = colors.coloring?.[`metric${params.seriesIndex}`] ?? colors.theme[params.seriesIndex % MAX_COLORS];
					} else {
						usedColor = colors.coloring?.dimension0?.[params.name] ?? colors.coloring?.[`metric${params.seriesIndex}`] ?? colors.theme[params.seriesIndex % MAX_COLORS];
					}
					const itemName = typeof params.name === 'number' ? params.name.toString() : params.name;
					const isSelected = comparer ? comparer(selectedData, item) : findIndex(selectedData, (selected) => (selected[0] === itemName)) !== -1;
					return isSelected ? rgbLinearShade(0.6, usedColor) : usedColor;
				}
			};
		}
	}
	return data;
};

export const selectDataComparison = (data, selectedData) => {
	if (data && selectedData.length > 0) {
		for (let i = 0; i < data.series.length; i++) {
			const isSelected = findIndex(selectedData, (selected) => (selected[0] === data.series[i].name)) !== -1;
			const usedColor = data.colors?.coloring?.[chartConstants.dataConfiguration.DIMENSION0]?.[data.series[i].name] ?? data.colors.theme[i];
			data.series[i].color = isSelected ? rgbLinearShade(0.6, usedColor) : usedColor;
			data.series[i].borderColor = usedColor;
		}
	}
	return data;
};

export const getColorRanage = (configuration, context) => {
	if (configuration?.options?.setGreenColorScale) {
		return chartConstants.rgColorScale;
	} else if (configuration?.options?.setPlasmaColorScale) {
		return chartConstants.pColorScale;
	}
	return [
		context.colors.theme[1],
		'rgb(255, 255, 255)',
		context.colors.theme[0]
	];
};

export const getEchartAxisType = (datatype) => {
	if (isDataType(datatype, dataTypes.TEXT)) {
		return 'category';
	} else if (numberTypes.includes(datatype)) {
		return 'value';
	}
	return 'category';
};


export const createSelectedLegend = (dimensions, inc = false, metric = false) => {
	const selLegend = {};
	if (dimensions && !dimensions.timelineData) {
		for (let i = 0; i < dimensions.length; i++) {
			const dim = dimensions[i];
			if (dim?.name === 't_MetricAverage' || dim?.name === 't_Average') {
				selLegend[dim.name] = true;
			} else {
				selLegend[metric ? inc ? i + 1 : i : dim] = true;
			}
		}
	}
	return selLegend;
};


export const getSelectedLegend = (configuration, inc = false) => {
	const selectedIndex = [];
	if (configuration) {
		// eslint-disable-next-line guard-for-in
		for (const key in configuration) {
			if (configuration[key]) {
				selectedIndex.push(inc ? key + 1 : key);
			}
		}
	}
	return selectedIndex;
};


export const getSplitLineColors = (configuration, transparent = false) => {
	const splitLineColors = [];
	for (let i = 0; i < configuration.data.configuration?.limit + 1; i++) {
		if (i === 0) {
			splitLineColors.push(chartConstants.colors.axis);
		} else if (i === configuration.data.configuration?.limit || i > 50) {
			splitLineColors.push(chartConstants.colors.split);
		} else {
			splitLineColors.push(transparent ? 'transparent' : chartConstants.colors.split);
		}
	}
	return splitLineColors;
};

export const getSplitLineColorsMultiseries = (data, transparent = false) => {
	const splitLineColors = [];
	for (let i = 0; i < data.rows.length + 10; i++) {
		if (i === 0) {
			splitLineColors.push(chartConstants.colors.axis);
		} else if (i === data.rows.length) {
			splitLineColors.push(chartConstants.colors.split);
		} else {
			splitLineColors.push(transparent ? 'transparent' : chartConstants.colors.split);
		}
	}
	return splitLineColors;
};


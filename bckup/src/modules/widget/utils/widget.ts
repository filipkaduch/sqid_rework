import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import store from '@/plugins/store';
import {chartConstants} from '@/util/consts/chartsConstants';

export const getDataIndexes = (dataColumns: any) => {
	const result: any = {};
	for (let i = 0; i < dataColumns.length; i++) {
		result[dataColumns[i].reference] = {
			index: i
		};
	}
	return result;
};

export const updateEnumName: any = (dimension: string, key: string, value: any, cleanedValue: any): any => {
	const tempValue = cloneDeep(cleanedValue);
	const keyAsString = key.toString();

	if (tempValue[dimension]) {
		tempValue[dimension][keyAsString] = value;
	} else {
		tempValue[dimension] = {};
		tempValue[dimension][keyAsString] = value;
	}
	return tempValue;
};

export const getMetricPlaceholderValue = (metric: any, dataset: any) => {
	// Get columns or attributes based on source
	const columns = dataset?.attributes ?? dataset.columns;
	// Get display name
	const metricDisplayName = columns.find((column: any) => column.name === metric.column)?.displayName;

	return metric ? (metric.aggregation ? `${metric.aggregation} (${metricDisplayName ?? metric.column})` : metricDisplayName ?? metric.column) : null;
};

export const setupEnums = (oldEnumValue: any, metric?: any, dimension?: any, metrics?: any, rawData?: any): any => {
	const newEnumValue: any = {};

	if (metric) {
		newEnumValue.metricAliases = {};
		if (metrics) {
			const setMetricAliases = (name: string) => {
				newEnumValue.metricAliases[name] = oldEnumValue?.metricAliases?.[name] ?? '';
			};

			if (typeof metrics === 'object' && typeof [metrics][0] !== 'undefined') {
				if (typeof [metrics][0].length === 'undefined') {
					setMetricAliases('Metric1');
				} else {
					[metrics][0].forEach((met: any, i: number) => {
						setMetricAliases(`Metric${i + 1}`);
					});
				}
			} else {
				metrics.forEach((met: any, i: number) => {
					setMetricAliases(`Metric${i + 1}`);
				});
			}
		}
	}

	const dimensionArray = Array.isArray(dimension) ? dimension : [dimension];
	if (dimensionArray?.length && dimensionArray[0]) {
		// eslint-disable-next-line consistent-return
		dimensionArray.forEach((dim: string) => {
			const dimIndex = parseInt(dim.substr(9, dim.length), 10);
			const tempElement = rawData?.columns?.find((el: any) => el.reference === `Dimension${dimIndex + 1}`);
			const dataIndex = rawData?.columns?.indexOf(tempElement);
			if (typeof dataIndex === 'undefined') {
				return null;
			}
			const data = [...new Set(rawData.rows.map((it: any) => it[dataIndex]))];
			const enums: any = {};

			data.forEach((key: any) => {
				const intervalKey = Array.isArray(key) ? `${Math.round(key[0] * 1e3) / 1e3} - ${Math.round(key[1] * 1e3) / 1e3}` : null;
				if (key === null || key === 'null') {
					enums['<NULL>'] = oldEnumValue?.[dim]?.['<NULL>'] ?? '';
				} else {
					enums[intervalKey ? intervalKey : key] = oldEnumValue?.[dim]?.[intervalKey ? intervalKey : key] ?? '';
				}
			});

			newEnumValue[dim] = enums;
		});
	}

	if (oldEnumValue?.mapping) {
		newEnumValue.mapping = {...oldEnumValue.mapping};
	}

	// If there is a deprecated formatting in enums which wasn't translated
	// into our desired value in previous steps we try to get the value by our old
	// mapping format. After editing the old version of enum the old mapping gets deleted
	Object.keys(chartConstants.enumsCompatibilityMapping).forEach((key: string) => {
		// @ts-ignore
		if (Array.isArray(chartConstants.enumsCompatibilityMapping[key])) {
			// @ts-ignore
			chartConstants.enumsCompatibilityMapping[key].forEach((enumVal: any) => {
				if (oldEnumValue && oldEnumValue[enumVal] && newEnumValue[key]) {
					if (Object.values(oldEnumValue[enumVal]).filter((el) => el !== '').length
						> Object.values(newEnumValue[key]).filter((el) => el !== '').length) {
						newEnumValue[key] = merge(newEnumValue[key], oldEnumValue[enumVal]);
					}
				}
			});
		}
	});

	return newEnumValue;
};

export const setOption = (widgetInstanceId: any, optionName: string, value: any) => store.dispatch('widgetInstances/setOption', {
	widgetInstanceId,
	optionName,
	value
});

import type {EChartsOption} from 'echarts';

export const mergeOptions = (widgetOptions: EChartsOption, defaultOptions:EChartsOption, widgetInstanceId: string) => {
	const localOpt = cloneDeep(widgetOptions);
	const merged = merge(localOpt, defaultOptions);
	// @ts-ignore missing attr in echart
	merged.grid.top = widgetOptions.grid?.top ? widgetOptions.grid?.top : merged.grid?.top;
	// @ts-ignore missing attr in echart
	merged.grid.bottom = widgetOptions.grid?.bottom ? widgetOptions.grid?.bottom : merged.grid?.bottom;
	// @ts-ignore missing attr in echart
	merged.grid.left = widgetOptions.grid?.left ? widgetOptions.grid?.left : merged.grid?.left;
	// @ts-ignore missing attr in echart
	merged.grid.right = widgetOptions.grid?.right ? widgetOptions.grid?.right : merged.grid?.right;
	return merged;
};
export const getXYaxisGrid = (options: any, timeline: any = false) => ({
	top: options?.title || timeline ? 52 : 0,
	bottom: options?.showLegend && options?.legendPosition === chartConstants.chartConst.BOTTOM ? 60 : 40,
	left: options?.showLegend
		? options?.legendPosition === chartConstants.chartConst.LEFT
			? `${options?.legendGridWidth ?? 30}%`
			: 80
		: 80,
	right: options?.showLegend
		? options?.legendPosition === chartConstants.chartConst.RIGHT
			? `${options?.legendGridWidth ?? 30}%`
			: 80
		: 60
});

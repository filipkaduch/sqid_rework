import {widgetTypes} from '@/util/consts/widgetTypes';

export const isFormulaConfig = (dimensionsCount: number, metricsCount: number) => dimensionsCount === 0 && metricsCount === 1;
export const isHistogramConfig = (dimensionsCount: number, metricsCount: number) => dimensionsCount === 1 && metricsCount === 0;
export const isScatterChartConfig = (dimensionsCount: number, metricsCount: number) => dimensionsCount === 2 && metricsCount === 0;
const isMultiseriesConfig = (dimensionsCount: number, metricsCount: number) => dimensionsCount === 2 && metricsCount === 1;
const isSingleSeriesConfig = (dimensionsCount: number, metricsCount: number) => dimensionsCount === 1 && metricsCount >= 1;
export const formulaFlow = (dimensionsCount: number, metricsCount: number) => {
	if (isSingleSeriesConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.BAR_CHART;
	}
	return widgetTypes.TEXT_FORMULA;
};
export const histogramFlow = (dimensionsCount: number, metricsCount: number) => {
	if (isFormulaConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.TEXT_FORMULA;
	}
	if (isSingleSeriesConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.BAR_CHART;
	}
	if (dimensionsCount > 1) {
		return widgetTypes.SCATTER_CHART;
	}
	return widgetTypes.HISTOGRAM;
};
export const scatterChartFlow = (dimensionsCount: number, metricsCount: number) => {
	if (isMultiseriesConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.BAR_MULTISERIES;
	}
	if (isSingleSeriesConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.BAR_CHART;
	}
	if (isHistogramConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.HISTOGRAM;
	}
	if (isSingleSeriesConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.BAR_CHART;
	}
	return widgetTypes.SCATTER_CHART;
};
export const barChartFlow = (dimensionsCount: number, metricsCount: number) => {
	if (isFormulaConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.TEXT_FORMULA;
	}
	if (isHistogramConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.HISTOGRAM;
	}
	if (isMultiseriesConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.BAR_MULTISERIES;
	}
	return widgetTypes.BAR_CHART;
};
export const barMultiseriesChartFlow = (dimensionsCount: number, metricsCount: number) => {
	if (isSingleSeriesConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.BAR_CHART;
	}
	if (isHistogramConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.SCATTER_CHART;
	}
	return widgetTypes.BAR_MULTISERIES;
};
export const calendarHeatmapFlow = (dimensionsCount: number, metricsCount: number) => {
	if (isFormulaConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.TEXT_FORMULA;
	}
	if (isHistogramConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.HISTOGRAM;
	}
	if (isMultiseriesConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.BAR_MULTISERIES;
	}
	if (isSingleSeriesConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.BAR_CHART;
	}
	return widgetTypes.CALENDAR_HEATMAP;
};

export const pieChartsFlow = (dimensionsCount: number, metricsCount: number, usedType: string) => {
	if (isFormulaConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.TEXT_FORMULA;
	}
	if (isHistogramConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.HISTOGRAM;
	}
	if (isMultiseriesConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.BAR_MULTISERIES;
	}
	if (isSingleSeriesConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.BAR_CHART;
	}
	return usedType;
};
export const sparklineDonutFlow = (dimensionsCount: number, metricsCount: number) => {
	if (isFormulaConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.TEXT_FORMULA;
	}
	if (isHistogramConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.HISTOGRAM;
	}
	if (isMultiseriesConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.SPARKLINE_PIE;
	}
	return widgetTypes.SPARKLINE_PIE;
};
export const lineChartFlow = (dimensionsCount: number, metricsCount: number) => {
	if (isFormulaConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.TEXT_FORMULA;
	}
	if (isHistogramConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.HISTOGRAM;
	}
	if (isMultiseriesConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.LINE_MULTISERIES;
	}
	return widgetTypes.LINE_CHART;
};
export const categoryChartFlow = (dimensionsCount: number, metricsCount: number) => {
	if (isFormulaConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.TEXT_FORMULA;
	}
	if (isHistogramConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.HISTOGRAM;
	}
	if (isMultiseriesConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.BAR_MULTISERIES;
	}
	return widgetTypes.CATEGORY_BAR;
};
export const comparisonChartFlow = (dimensionsCount: number, metricsCount: number) => {
	if (isFormulaConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.TEXT_FORMULA;
	}
	if (isHistogramConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.HISTOGRAM;
	}
	if (isMultiseriesConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.BAR_MULTISERIES;
	}
	if (isSingleSeriesConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.BAR_CHART;
	}
	return widgetTypes.COMPARISON_CHART;
};
export const spiderChartFlow = (dimensionsCount: number, metricsCount: number) => {
	if (isFormulaConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.TEXT_FORMULA;
	}
	if (isHistogramConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.HISTOGRAM;
	}
	return widgetTypes.SPIDER_CHART;
};
export const lineTimeChartFlow = (dimensionsCount: number, metricsCount: number) => {
	if (isFormulaConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.TEXT_FORMULA;
	}
	if (isHistogramConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.HISTOGRAM;
	}
	if (isMultiseriesConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.LINE_MULTISERIES;
	}
	if (isSingleSeriesConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.LINE_CHART;
	}
	return widgetTypes.LINE_COMPARISON;
};
export const lineMultiseriesFlow = (dimensionsCount: number, metricsCount: number) => {
	if (isSingleSeriesConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.LINE_CHART;
	}
	if (dimensionsCount > 1) {
		return widgetTypes.SCATTER_CHART;
	}
	return widgetTypes.LINE_MULTISERIES;
};
export const heatmapChartFlow = (dimensionsCount: number, metricsCount: number) => {
	if (isSingleSeriesConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.BAR_CHART;
	}
	if (dimensionsCount > 1) {
		return widgetTypes.SCATTER_CHART;
	}
	return widgetTypes.HEATMAP_CHART;
};
export const bubbleChartFlow = (dimensionsCount: number, metricsCount: number) => {
	if (isSingleSeriesConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.BAR_CHART;
	}
	if (dimensionsCount > 1) {
		return widgetTypes.SCATTER_CHART;
	}
	return widgetTypes.BUBBLE_CHART;
};

// eslint-disable-next-line complexity
export const getWidgetFlowType = (wtuid: string, dimensionsCount: number, metricsCount: number) => {
	if (isFormulaConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.TEXT_FORMULA;
	}
	if (isHistogramConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.HISTOGRAM;
	}
	if (isScatterChartConfig(dimensionsCount, metricsCount)) {
		return widgetTypes.SCATTER_CHART;
	}
	switch (wtuid) {
		case widgetTypes.TEXT_FORMULA:
			return formulaFlow(dimensionsCount, metricsCount);
		case widgetTypes.HISTOGRAM:
			return histogramFlow(dimensionsCount, metricsCount);
		case widgetTypes.SCATTER_CHART:
			return scatterChartFlow(dimensionsCount, metricsCount);
		case widgetTypes.BAR_CHART:
			return barChartFlow(dimensionsCount, metricsCount);
		case widgetTypes.BAR_MULTISERIES:
			return barMultiseriesChartFlow(dimensionsCount, metricsCount);
		case widgetTypes.CALENDAR_HEATMAP:
			return calendarHeatmapFlow(dimensionsCount, metricsCount);
		case widgetTypes.PIE_CHART || widgetTypes.DOUGHNUT_CHART:
			return pieChartsFlow(dimensionsCount, metricsCount, wtuid);
		case widgetTypes.SPARKLINE_PIE:
			return sparklineDonutFlow(dimensionsCount, metricsCount);
		case widgetTypes.LINE_CHART:
			return lineChartFlow(dimensionsCount, metricsCount);
		case widgetTypes.CATEGORY_BAR:
			return categoryChartFlow(dimensionsCount, metricsCount);
		case widgetTypes.COMPARISON_CHART:
			return comparisonChartFlow(dimensionsCount, metricsCount);
		case widgetTypes.SPIDER_CHART:
			return spiderChartFlow(dimensionsCount, metricsCount);
		case widgetTypes.LINE_COMPARISON:
			return lineTimeChartFlow(dimensionsCount, metricsCount);
		case widgetTypes.LINE_MULTISERIES:
			return lineMultiseriesFlow(dimensionsCount, metricsCount);
		case widgetTypes.HEATMAP_CHART:
			return heatmapChartFlow(dimensionsCount, metricsCount);
		case widgetTypes.BUBBLE_CHART:
			return bubbleChartFlow(dimensionsCount, metricsCount);
	}
	return wtuid;
};

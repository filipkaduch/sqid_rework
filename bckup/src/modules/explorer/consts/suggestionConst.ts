import {widgetTypes} from '@/util/consts/widgetTypes';
import i18n from '@/plugins/i18n';
const {t} = i18n.global;
import {dataTypes} from '@/util/queryBuilder';

export const chartSelection = {
	[`${t('widgetCategories.magnitudeRanking')}`]: [
		{name: 'widgetTypes.widget_column_chart_basic_title', type: widgetTypes.BAR_CHART},
		{name: 'widgetTypes.widget_column_chart_multiseries_title', type: widgetTypes.BAR_MULTISERIES},
		{name: 'widgetTypes.widget_category_chart_basic_title', type: widgetTypes.CATEGORY_BAR},
		{name: 'widgetTypes.widget_comparison_chart_title', type: widgetTypes.COMPARISON_CHART}
	],
	[`${t('widgetCategories.distribution')}`]:
		[
			{name: 'widgetTypes.widget_histogram_chart_title', type: widgetTypes.HISTOGRAM},
			{name: 'widgetTypes.widget_histogram_selection_chart_title', type: widgetTypes.HISTOGRAM_SELECTION},
			{name: 'widgetTypes.widget_spider_chart_title', type: widgetTypes.SPIDER_CHART},
			{name: 'widgetTypes.widget_calendar_heatmap_title', type: widgetTypes.CALENDAR_HEATMAP}
		],
	[`${t('widgetCategories.correlation')}`]:
		[
			{name: 'widgetTypes.widget_scatter_chart_title', type: widgetTypes.SCATTER_CHART},
			{name: 'widgetTypes.widget_heatmap_chart_title', type: widgetTypes.HEATMAP_CHART},
			{name: 'widgetTypes.widget_bubble_chart_title', type: widgetTypes.BUBBLE_CHART}
		],
	[`${t('widgetCategories.changeOverTime')}`]:
		[
			{name: 'widgetTypes.widget_line_chart_single_title', type: widgetTypes.LINE_CHART},
			{name: 'widgetTypes.widget_line_chart_multiseries_title', type: widgetTypes.LINE_MULTISERIES},
			{name: 'widgetTypes.widget_line_time_comparison_title', type: widgetTypes.LINE_COMPARISON}
		],
	[`${t('widgetCategories.partToWhole')}`]:
		[
			{name: 'widgetTypes.widget_pie_chart_basic_title', type: widgetTypes.PIE_CHART},
			{name: 'widgetTypes.widget_pie_chart_doughnut_title', type: widgetTypes.DOUGHNUT_CHART},
			{name: 'widgetTypes.widget_sparkline_doughnut_title', type: widgetTypes.SPARKLINE_PIE}
		]
	// TODO KEEP HIDDEN FOR NOW
	/* [`${t('widgetCategories.spatial')}`]:
		[
			{name: 'widgetTypes.widget_hexagon_map_title', type: widgetTypes.HEXAGON_MAP},
			{name: 'widgetTypes.widget_arc_map_title', type: widgetTypes.ARC_MAP},
			{name: 'widgetTypes.widget_heatmap_map_title', type: widgetTypes.HEATMAP_MAP},
			{name: 'widgetTypes.widget_map_scatter_title', type: widgetTypes.SCATTER_MAP}
		] */
};

export const chartSelectionTooltips = {
	[`${t('widgetCategories.magnitudeRanking')}`]: `${t('widgetCategories.magnitudeRankingTooltip')}`,
	[`${t('widgetCategories.distribution')}`]: `${t('widgetCategories.distributionTooltip')}`,
	[`${t('widgetCategories.correlation')}`]: `${t('widgetCategories.correlationTooltip')}`,
	[`${t('widgetCategories.changeOverTime')}`]: `${t('widgetCategories.changeOverTimeTooltip')}`,
	[`${t('widgetCategories.partToWhole')}`]: `${t('widgetCategories.partToWholeTooltip')}`
};

export interface widgetType {
	chart: string, value: string, dataType?: undefined|string[]
}
export const widgetSingleSeriesTypes: widgetType[] = [
	{
		chart: 'widget_line_chart_single',
		value: 'widgetTypes.widget_line_chart_title'
	},
	{
		chart: 'widget_column_chart_basic',
		value: 'widgetTypes.widget_Bar_chart_title'
	},
	{
		chart: 'widget_category_chart_basic',
		value: 'widgetTypes.widget_category_chart_basic_title'
	},
	{
		chart: 'widget_pie_chart_basic',
		value: 'widgetTypes.widget_pie_chart_basic_title'
	},
	{
		chart: 'widget_pie_chart_doughnut',
		value: 'widgetTypes.widget_pie_chart_doughnut_title'
	},
	{
		chart: 'widget_histogram_chart',
		value: 'widgetTypes.widget_histogram_chart_title'
	},
	{
		chart: 'widget_histogram_selection_chart',
		value: 'widgetTypes.widget_histogram_selection_chart_title'
	},
	{
		chart: 'widget_comparison_chart',
		value: 'widgetTypes.widget_comparison_chart_title'
	}
];
export const widgetMultiSeriesTypes: widgetType[] = [
	{
		chart: widgetTypes.LINE_MULTISERIES,
		value: 'widgetTypes.widget_line_chart_multiseries_title'
	},
	{
		chart: widgetTypes.BAR_MULTISERIES,
		value: 'widgetTypes.widget_column_chart_multiseries_title'
	},
	{
		chart: widgetTypes.HEATMAP_CHART,
		value: 'widgetTypes.widget_heatmap_chart_title'
	},
	{
		chart: widgetTypes.BUBBLE_CHART,
		value: 'widgetTypes.widget_bubble_chart_title'
	},
	{
		chart: widgetTypes.SPARKLINE,
		value: 'widgetTypes.widget_sparkline_title'
	},
	{
		chart: widgetTypes.SPARKLINE_PIE,
		value: 'widgetTypes.widget_sparkline_doughnut_title'
	}
];
export const editMetric: string[] = [
	'widget_pie_chart_basic',
	'widget_pie_chart_doughnut',
	'widget_histogram_chart',
	'widget_histogram_selection_chart'
];

export const singleSeries: string = 'singleSeries';
export const multiSeries: string = 'multiSeries';

export const getWidgetCategory = (widgetType: string): string|null => {
	if (widgetSingleSeriesTypes.find((el) => el.chart === widgetType)) {
		return singleSeries;
	}
	if (widgetMultiSeriesTypes.find((el) => el.chart === widgetType)) {
		return multiSeries;
	}
	return null;
};

export const singleMetricSingleDimWidgets: widgetType[] = [
	{
		chart: widgetTypes.LINE_CHART,
		value: 'widgetTypes.widget_line_chart_title'
	},
	{
		chart: widgetTypes.BAR_CHART,
		value: 'widgetTypes.widget_Bar_chart_title'
	},
	{
		chart: widgetTypes.CATEGORY_BAR,
		value: 'widgetTypes.widget_category_chart_basic_title'
	},
	{
		chart: widgetTypes.PIE_CHART,
		value: 'widgetTypes.widget_pie_chart_basic_title'
	},
	{
		chart: widgetTypes.DOUGHNUT_CHART,
		value: 'widgetTypes.widget_pie_chart_doughnut_title'
	},
	{
		chart: widgetTypes.SPARKLINE_PIE,
		value: 'widgetTypes.widget_sparkline_doughnut_title'
	},
	{
		chart: widgetTypes.HISTOGRAM,
		value: 'widgetTypes.widget_histogram_chart_title'
	},
	{
		chart: widgetTypes.HISTOGRAM_SELECTION,
		value: 'widgetTypes.widget_histogram_selection_chart_title'
	},
	{
		chart: widgetTypes.COMPARISON_CHART,
		value: 'widgetTypes.widget_comparison_chart_title'
	},
	{
		chart: widgetTypes.SPIDER_CHART,
		value: 'widgetTypes.widget_spider_chart_title'
	},
	{
		chart: widgetTypes.LINE_COMPARISON,
		value: 'widgetTypes.widget_line_time_comparison_title',
		dataType: [dataTypes.DATETIME, dataTypes.DATE, dataTypes.DATE_TYPE]
	},
	{
		chart: widgetTypes.CALENDAR_HEATMAP,
		value: 'widgetTypes.widget_calendar_heatmap_title',
		dataType: [dataTypes.DATETIME, dataTypes.DATE, dataTypes.DATE_TYPE]
	}
];

export const singleMetricMultiDimWidgets: widgetType[] = [
	{
		chart: widgetTypes.SPARKLINE,
		value: 'widgetTypes.widget_sparkline_title'
	},
	{
		chart: widgetTypes.SPARKLINE_PIE,
		value: 'widgetTypes.widget_sparkline_doughnut_title'
	},
	{
		chart: widgetTypes.LINE_MULTISERIES,
		value: 'widgetTypes.widget_line_chart_multiseries_title'
	},
	{
		chart: widgetTypes.BAR_MULTISERIES,
		value: 'widgetTypes.widget_column_chart_multiseries_title'
	},
	{
		chart: widgetTypes.HEATMAP_CHART,
		value: 'widgetTypes.widget_heatmap_chart_title'
	},
	{
		chart: widgetTypes.BUBBLE_CHART,
		value: 'widgetTypes.widget_bubble_chart_title'
	}
];

export const multiMetricsSingleDimWidgets: widgetType[] = [
	{
		chart: widgetTypes.LINE_CHART,
		value: 'widgetTypes.widget_line_chart_title'
	},
	{
		chart: widgetTypes.BAR_CHART,
		value: 'widgetTypes.widget_Bar_chart_title'
	},
	{
		chart: widgetTypes.CATEGORY_BAR,
		value: 'widgetTypes.widget_category_chart_basic_title'
	},
	{
		chart: widgetTypes.SPARKLINE_PIE,
		value: 'widgetTypes.widget_sparkline_doughnut_title'
	},
	{
		chart: widgetTypes.SPIDER_CHART,
		value: 'widgetTypes.widget_spider_chart_title'
	},
	{
		chart: widgetTypes.CALENDAR_HEATMAP,
		value: 'widgetTypes.widget_calendar_heatmap_title',
		dataType: [dataTypes.DATETIME, dataTypes.DATE, dataTypes.DATE_TYPE]
	}
];
export const noMetricMultiDimWidgets: widgetType[] = [
	{
		chart: widgetTypes.SCATTER_CHART,
		value: 'widgetTypes.widget_scatter_chart_title'
	}
];


export const getWidgetsByDataConfig = (dimensionsCount: number, metricsCount: number, wtuid: string): widgetType[]|null => {
	if (metricsCount > 1 && dimensionsCount === 1) {
		return multiMetricsSingleDimWidgets;
	} else if (metricsCount === 1 && dimensionsCount === 1) {
		return singleMetricSingleDimWidgets;
	} else if (metricsCount === 1 && dimensionsCount > 1) {
		return singleMetricMultiDimWidgets;
	} else if (metricsCount === 0 && dimensionsCount === 2) {
		return noMetricMultiDimWidgets;
	}
	return null;
};


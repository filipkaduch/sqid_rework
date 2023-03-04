export const dataWidgets = {
	DATA_TABLE: 'widget_data_table',
	LINE_CHART: 'widget_line_chart_single',
	LINE_MULTISERIES: 'widget_line_chart_multiseries',
	LINE_COMPARISON: 'widget_line_time_comparison',
	BAR_CHART: 'widget_column_chart_basic',
	BAR_MULTISERIES: 'widget_column_chart_multiseries',
	CATEGORY_BAR: 'widget_category_chart_basic',
	PIE_CHART: 'widget_pie_chart_basic',
	COMPARISON_CHART: 'widget_comparison_chart',
	HISTOGRAM: 'widget_histogram_chart',
	SPARKLINE_PIE: 'widget_sparkline_doughnut',
	SPARKLINE: 'widget_sparkline',
	HEATMAP_CHART: 'widget_heatmap_chart',
	BUBBLE_CHART: 'widget_bubble_chart',
	SCATTER_CHART: 'widget_scatter_chart',
	HEATMAP_MAP: 'widget_heatmap_map',
	ARC_MAP: 'widget_arc_map',
	HEXAGON_MAP: 'widget_hexagon_map',
	SCATTER_MAP: 'widget_map_scatter',
	COUNTRY_MAP_NEW: 'widget_country_map_new',
	CALENDAR_HEATMAP: 'widget_calendar_heatmap',
	SPIDER_CHART: 'widget_spider_chart'
};

export const textWidgets = {
	TEXT_PARAGRAPH: 'widget_text_paragraph',
	TEXT_HEADING_ONE: 'widget_text_heading_one',
	TEXT_HEADING_TWO: 'widget_text_heading_two'
};

export const widgetTypes = {
	HISTOGRAM_SELECTION: 'widget_histogram_selection_chart',
	TEXT_FORMULA: 'widget_text_formula',
	NOTIFICATION_FORMULA: 'widget_notification_formula',
	MULTISERIES_FORMULA: 'widget_multiseries_formula',
	INSIGHT: 'widget_insight_formula',
	EXPLAINER: 'widget_explainer',
	FILE_STATS: 'widget_file_statistics',
	FILTER_BUTTONS: 'widget_filter_buttons',
	DOUGHNUT_CHART: 'widget_pie_chart_doughnut',
	HERO_IMAGE: 'widget_hero_image',
	COUNTRY_MAP: 'widget_country_map',
	TEXT_INPUT: 'widget_text_input',
	WIDGET_PAGE: 'widget_page',
	...textWidgets,
	...dataWidgets,
	PIE_CHARTS: [
		'widget_pie_chart_basic',
		'widget_pie_chart_doughnut'
	],
	BAR_CHARTS: [
		'widget_column_chart_basic',
		'widget_category_chart_basic',
		'widget_column_chart_multiseries'
	],
	MAPS: [
		'widget_arc_map',
		'widget_hexagon_map',
		'widget_map_scatter',
		'widget_heatmap_map',
		'widget_country_map_new'
	],
	LINE_CHARTS: [
		'widget_line_chart_single',
		'widget_line_chart_multiseries'
	],
	MULTISERIES_CHARTS: [
		'widget_line_chart_multiseries',
		'widget_column_chart_multiseries'
	],
	FORMULA_WIDGETS: [
		'widget_text_formula',
		'widget_explainer',
		'widget_notification_formula',
		'widget_multiseries_formula'
	],
	TOP_VALUES_CHARTS: [
		'widget_line_chart_multiseries',
		'widget_column_chart_multiseries',
		'widget_sparkline_doughnut'
	],
	MULTI_METRICS: [
		'widget_line_chart_single',
		'widget_column_chart_basic',
		'widget_category_chart_basic'
	]
};

export const echartsTypes = [
	'widget_column_chart_basic',
	'widget_category_chart_basic',
	'widget_column_chart_multiseries',
	'widget_bubble_chart',
	'widget_calendar_heatmap',
	'widget_comparison_chart',
	'widget_country_map_new',
	'widget_heatmap_chart',
	'widget_histogram_chart',
	'widget_histogram_selection_chart',
	'widget_line_chart_single',
	'widget_line_chart_multiseries',
	'widget_line_time_comparison',
	'widget_pie_chart_basic',
	'widget_pie_chart_doughnut',
	'widget_scatter_chart',
	'widget_sparkline',
	'widget_sparkline_doughnut',
	'widget_spider_chart'
];

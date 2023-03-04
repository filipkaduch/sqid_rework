const blacklist = [
	'widget_text_formula',
	'widget_notification_formula',
	'widget_insight_formula',
	'widget_file_statistics',
	'widget_explainer',
	'widget_histogram_chart',
	'widget_histogram_selection_chart'
];

const map = {};

blacklist.forEach((type) => {
	map[type] = 1;
});

export default map;

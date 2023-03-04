export const configuration = {
	data: {
		dimensions: {
			count: 1
		},
		metrics: {
			count: 1
		},
		limit: {
			default: 10,
			maxValue: 50
		}
	},
	colors: {
		dimensionColoring: true
	},
	timeline: {
		interval: 30000,
		fontSize: 24
	}
};
export const initialize = {
	size: {
		width: 450,
		height: 300
	}
};
export const widgetGroup = {
	group: 'chart',
	subGroup: 'chart_pie'
};

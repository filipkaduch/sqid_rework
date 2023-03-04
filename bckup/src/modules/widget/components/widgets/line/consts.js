export const initialize = {
	size: {
		width: 450,
		height: 300
	}
};

export const widgetGroup = {
	group: 'chart',
	subGroup: 'chart_line'
};

export const configuration = {
	data: {
		dimensions: {
			count: 1
		},
		metrics: {
			min: 1,
			cSum: true
		},
		limit: {
			default: 10,
			maxValue: 10000
		}
	},
	timeline: {
		interval: 30000,
		fontSize: 24
	}
};

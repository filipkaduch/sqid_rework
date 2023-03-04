export const configuration = {
	data: {
		dimensions: {
			count: 1
		},
		metrics: {
			count: 1
		},
		limit: {
			default: 3,
			maxValue: 5
		}
	},
	colors: {
		dimensionColoring: true
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
	subGroup: 'chart_usecases'
};

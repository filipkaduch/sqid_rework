export const configuration = {
	data: {
		dimensions: {
			count: 1
		},
		metrics: {
			count: 1
		},
		limit: {
			default: 1000,
			maxValue: 5000
		},
		priorityList: ['FLOAT'],
		mapType: true
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
	group: 'map',
	subGroup: 'map_satellite'
};

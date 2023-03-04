export const configuration = {
	data: {
		dimensions: {
			count: 1
		},
		metrics: {
			count: 1
		},
		limit: {
			default: 5000,
			maxValue: 5000
		},
		priorityList: ['FLOAT'],
		mapType: true
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

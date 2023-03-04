export const configuration = {
	data: {
		dimensions: {
			count: 2
		},
		metrics: {
			count: 1
		},
		limit: {
			default: 10,
			maxValue: 10000
		},
		priorityList: [
			'DATETIME',
			'DATE',
			'TEXT'
		]
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

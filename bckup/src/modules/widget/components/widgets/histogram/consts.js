export const configuration = {
	data: {
		dimensions: {
			count: 1,
			hideBucketing: true
		},
		buckets: {
			default: 10,
			maxValue: 30
		},
		priorityList: [
			'INT',
			'LONG',
			'FLOAT'
		],
		histogram: true
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

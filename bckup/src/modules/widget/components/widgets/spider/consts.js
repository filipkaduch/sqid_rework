export const configuration = {
	data: {
		dimensions: {
			min: 1
		},
		metrics: {
			min: 1
		},
		limit: {
			default: 10,
			maxValue: 50
		},
		rankingIndex: 0,
		sparklinePie: true
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

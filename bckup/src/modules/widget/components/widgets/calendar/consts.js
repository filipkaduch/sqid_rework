export const configuration = {
	data: {
		dimensions: {
			count: 1
		},
		metrics: {
			min: 1
		},
		limit: {
			default:
				20,
			maxValue:
				10000
		},
		priorityList: ['DATETIME', 'DATE'],
		orderBy:
			[
				{
					columnAlias: 'Dimension1',
					order: 'ASC'
				}
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

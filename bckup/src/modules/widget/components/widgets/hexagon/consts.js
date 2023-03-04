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

export const hexagonColorRange = [
	[
		1,
		152,
		189
	],
	[
		73,
		227,
		206
	],
	[
		216,
		254,
		181
	],
	[
		254,
		237,
		177
	],
	[
		254,
		173,
		84
	],
	[
		209,
		55,
		78
	]
];

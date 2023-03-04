export const sectionStackingModes = Object.freeze({
	ANIMATED: 'animated',
	ONE_ROW_TWO_COLUMN: '1x2',
	TWO_ROW_ONE_COLUMN: '2x1',
	TWO_ROW_TWO_COLUMN: '2x2',
	TWO_ROW_TWO_COLUMN_TOP_LARGE: '2x2-1t',
	TWO_ROW_TWO_COLUMN_BOTTOM_LARGE: '2x2-1b',
	TWO_ROW_TWO_COLUMN_RIGHT_LARGE: '2x2-1r',
	TWO_ROW_TWO_COLUMN_LEFT_LARGE: '2x2-1l',
	ONE_ROW_TWO_COLUMN_TWO_THIRDS_VS_ONE_THIRD: '1x2_2/3,1/3'
});
export const stackingPaddingClassMap = {
	[sectionStackingModes.ONE_ROW_TWO_COLUMN]: [
		'stacked-left',
		'stacked-right'
	],
	[sectionStackingModes.TWO_ROW_TWO_COLUMN]: [
		'stacked-left',
		'stacked-right',
		'stacked-left',
		'stacked-right'
	],
	[sectionStackingModes.TWO_ROW_ONE_COLUMN]: [
		'stacked-left',
		'stacked-left'
	],
	[sectionStackingModes.TWO_ROW_TWO_COLUMN_TOP_LARGE]: [
		'stacked-left',
		'stacked-left',
		'stacked-right'
	],
	[sectionStackingModes.TWO_ROW_TWO_COLUMN_RIGHT_LARGE]: [
		'stacked-left',
		'stacked-right',
		'stacked-left'
	],
	[sectionStackingModes.TWO_ROW_TWO_COLUMN_LEFT_LARGE]: [
		'stacked-left',
		'stacked-right',
		'stacked-right'
	],
	[sectionStackingModes.TWO_ROW_TWO_COLUMN_BOTTOM_LARGE]: [
		'stacked-left',
		'stacked-right',
		'stacked-left'
	],
	[sectionStackingModes.ONE_ROW_TWO_COLUMN_TWO_THIRDS_VS_ONE_THIRD]: [
		'stacked-left',
		'stacked-right'
	]
};
export default {
	[sectionStackingModes.ANIMATED]: {
		title: 'Animated',
		icon: [
			'fas',
			'play'
		],
		configuration: [
			{
				size: {
					height: 1,
					width: 1
				},
				position: {
					x: 0,
					y: 0
				}
			}
		]
	},
	// 1 row, 2 columns
	[sectionStackingModes.ONE_ROW_TWO_COLUMN]: {
		title: '1x2',
		icon: null,
		configuration: [
			{
				size: {
					height: 1,
					width: 0.5
				},
				position: {
					x: 0,
					y: 0
				}
			},
			{
				size: {
					height: 1,
					width: 0.5
				},
				position: {
					x: 0.5,
					y: 0
				}
			}
		]
	},
	// 2 rows, 1 column
	[sectionStackingModes.TWO_ROW_ONE_COLUMN]: {
		title: '2x1',
		icon: null,
		configuration: [
			{
				size: {
					height: 0.5,
					width: 1
				},
				position: {
					x: 0,
					y: 0
				}
			},
			{
				size: {
					height: 0.5,
					width: 1
				},
				position: {
					x: 0,
					y: 0.5
				}
			}
		]
	},
	[sectionStackingModes.TWO_ROW_TWO_COLUMN]: {
		title: '2x2',
		icon: null,
		configuration: [
			{
				size: {
					height: 0.5,
					width: 0.5
				},
				position: {
					x: 0,
					y: 0
				}
			},
			{
				size: {
					height: 0.5,
					width: 0.5
				},
				position: {
					x: 0.5,
					y: 0
				}
			},
			{
				size: {
					height: 0.5,
					width: 0.5
				},
				position: {
					x: 0,
					y: 0.5
				}
			},
			{
				size: {
					height: 0.5,
					width: 0.5
				},
				position: {
					x: 0.5,
					y: 0.5
				}
			}
		]
	},
	// 2 columns, left column large (1 widget) + right column split into 2 rows
	[sectionStackingModes.TWO_ROW_TWO_COLUMN_LEFT_LARGE]: {
		title: '2x2 (1 left)',
		icon: null,
		configuration: [
			{
				size: {
					height: 1,
					width: 0.5
				},
				position: {
					x: 0,
					y: 0
				}
			},
			{
				size: {
					height: 0.5,
					width: 0.5
				},
				position: {
					x: 0.5,
					y: 0
				}
			},
			{
				size: {
					height: 0.5,
					width: 0.5
				},
				position: {
					x: 0.5,
					y: 0.5
				}
			}
		]
	},
	// 2 columns, right column split into 2 rows + right column large (1 widget)
	[sectionStackingModes.TWO_ROW_TWO_COLUMN_RIGHT_LARGE]: {
		title: '2x2 (1 right)',
		icon: null,
		configuration: [
			{
				size: {
					height: 0.5,
					width: 0.5
				},
				position: {
					x: 0,
					y: 0
				}
			},
			{
				size: {
					height: 1,
					width: 0.5
				},
				position: {
					x: 0.5,
					y: 0
				}
			},
			{
				size: {
					height: 0.5,
					width: 0.5
				},
				position: {
					x: 0,
					y: 0.5
				}
			}
		]
	},
	// 2 rows, top row split into 2 columns + bottom row large (1 widget)
	[sectionStackingModes.TWO_ROW_TWO_COLUMN_BOTTOM_LARGE]: {
		title: '2x2 (1 bottom)',
		icon: null,
		configuration: [
			{
				size: {
					height: 0.5,
					width: 0.5
				},
				position: {
					x: 0,
					y: 0
				}
			},
			{
				size: {
					height: 0.5,
					width: 0.5
				},
				position: {
					x: 0.5,
					y: 0
				}
			},
			{
				size: {
					height: 0.5,
					width: 1
				},
				position: {
					x: 0,
					y: 0.5
				}
			}
		]
	},
	// 2 rows, bottom row split into 2 columns + top row large (1 widget)
	[sectionStackingModes.TWO_ROW_TWO_COLUMN_TOP_LARGE]: {
		title: '2x2 (1 top)',
		icon: null,
		configuration: [
			{
				size: {
					height: 0.5,
					width: 1
				},
				position: {
					x: 0,
					y: 0
				}
			},
			{
				size: {
					height: 0.5,
					width: 0.5
				},
				position: {
					x: 0,
					y: 0.5
				}
			},
			{
				size: {
					height: 0.5,
					width: 0.5
				},
				position: {
					x: 0.5,
					y: 0.5
				}
			}
		]
	},
	// 1 row, 2 columns (2/3 vs 1/3)
	[sectionStackingModes.ONE_ROW_TWO_COLUMN_TWO_THIRDS_VS_ONE_THIRD]: {
		title: '1x2 (2/3 & 1/3)',
		icon: null,
		configuration: [
			{
				size: {
					height: 1,
					width: 2 / 3
				},
				position: {
					x: 0,
					y: 0
				}
			},
			{
				size: {
					height: 1,
					width: 1 / 3
				},
				position: {
					x: 2 / 3,
					y: 0
				}
			}
		]
	}
};

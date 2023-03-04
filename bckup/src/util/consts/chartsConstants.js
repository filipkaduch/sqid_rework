export const MAX_COLORS = 29;

export const chartConstants = {
	chartConst: Object.freeze({
		VERTICAL: 'vertical',
		HORIZONTAL: 'horizontal',
		SLOPING: 'sloping',
		BOTTOM: 'bottom',
		MIDDLE: 'middle',
		TOP: 'top',
		CENTER: 'center',
		RIGHT: 'right',
		LEFT: 'left',
		VALUE: 'value',
		CATEGORY: 'category',
		SCROLL: 'scroll',
		PLAIN: 'plain',
		INSIDE: 'inside',
		INSIDE_RIGHT: 'insideRight',
		INSIDE_LEFT: 'insideLeft',
		OUTSIDE: 'outside',
		DASHED: 'dashed',
		SOLID: 'solid'
	}),
	dataConfiguration: Object.freeze({
		DIMENSION: 'dimension',
		DIMENSION0: 'dimension0',
		DIMENSION1: 'dimension1',
		DIMENSION2: 'dimension2',
		DIMENSION2_C: 'Dimension2',
		METRIC: 'metric',
		METRIC0: 'metric0',
		METRIC1: 'Metric1',
		BUCKET_NUMBER: 'Dimension1_bucket_number',
		X_AXIS: 'xAxis',
		Y_AXIS: 'yAxis',
		TIMELINE: 'Timeline'
	}),
	enumsCompatibilityMapping: {
		dimension0: [
			'categoryX',
			'columnX'
		],
		dimension1: [
			'categoryY',
			'columnY'
		],
		metric: 'metricAliases'
	},
	labelPosition: [
		{
			text: 't_top',
			value: 'top'
		},
		{
			text: 't_inside',
			value: 'inside'
		}
	],
	labelPositionHorizontal: [
		{
			text: 't_right',
			value: 'right'
		},
		{
			text: 't_insideRight',
			value: 'insideRight'
		},
		{
			text: 't_inside',
			value: 'inside'
		}
	],
	barBorderRadiusHorizontal: [
		0,
		5,
		5,
		0
	],
	barBorderRadius: [
		5,
		5,
		0,
		0
	],
	colors: {
		axis: '#8CA4B0',
		split: '#C9D4DA',
		legend: '#8988AA',
		legend2: '#36363A',
		inActiveColor: '#808189'
	},
	rgColorScale: [
		'#a50026',
		'#f17044',
		'#fee090',
		'#bee47b',
		'#59b65f',
		'#006837'
	],
	pColorScale: [
		'#440154',
		'#410967',
		'#932567',
		'#DC5039',
		'#FBA40A',
		'#FCFEA4'
	]
};

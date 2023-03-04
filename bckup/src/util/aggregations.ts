import {dataTypes} from '@/util/queryBuilder';

export const aggregations = {
	COUNT: {
		caption: 'COUNT',
		icon: [
			'fal',
			'plus'
		]
	},
	SUM: {
		caption: 'SUM',
		icon: [
			'fal',
			'sigma'
		]
	},
	AVG: {
		caption: 'AVG',
		icon: [
			'fal',
			'tilde'
		]
	},
	MAX: {
		caption: 'MAX',
		icon: [
			'fal',
			'long-arrow-up'
		]
	},
	MIN: {
		caption: 'MIN',
		icon: [
			'fal',
			'long-arrow-down'
		]
	},
	'COUNT-DISTINCT': {
		caption: 'DISTINCT',
		icon: [
			'fal',
			'long-arrow-down'
		]
	},
	'C-SUM': {
		caption: 'C-SUM',
		icon: [
			'fal',
			'long-arrow-down'
		]
	}
};

export const safeAggregation = 'COUNT';

export const allowedAggregations = (dataType: string, cSum: boolean = false): string[] => {
	switch (dataType) {
		case dataTypes.INT:
		case dataTypes.LONG:
		case dataTypes.FLOAT:
		case dataTypes.NUMBER:
			return [
				'SUM',
				'COUNT',
				'AVG',
				'MAX',
				'MIN',
				'COUNT-DISTINCT',
				...cSum ? ['C-SUM'] : []
			];
		case dataTypes.DATETIME:
		case dataTypes.DATE:
			return [
				'COUNT',
				'MAX',
				'MIN',
				'COUNT-DISTINCT'
			];
		case dataTypes.TEXT:
		case dataTypes.TEXT_NOT_NULL:
			return [
				'COUNT',
				'COUNT-DISTINCT'
			];
		default:
			return ['COUNT'];
	}
};

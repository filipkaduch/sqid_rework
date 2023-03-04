import {echartsDefaultControls, labelRotate, xAxisNumberOfCharacter} from '@/modules/widget/echartsWidgetControls';

export const initialize = {
	size: {
		width: 450,
		height: 300
	}
};

export const configuration = {
	data: {
		dimensions: {
			count: 2,
			max: 3
		},
		metrics: {
			count: 1
		},
		limit: {
			default: 10,
			maxValue: 10000
		},
		rankingIndex: 0
	}
};

export const options = {
	...echartsDefaultControls(true),
	labelRotate,
	xAxisNumberOfCharacter: xAxisNumberOfCharacter(2)
};

import {getEnum} from '@/util/formatingUtil';

export const configuration = {
	data: {
		dimensions: {
			count: 1,
			showTopValues: true
		},
		metrics: {
			count: 1
		},
		limit: {
			default: 10,
			maxValue: 50
		},
		rankingIndex: 0
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
	subGroup: 'chart_pie'
};

export const titleFormat = (value, formatter, enums) => {
	const enumVal = getEnum(enums, 'dimension0', value);
	if (enumVal) {
		return enumVal === value
			? formatter(value)
			: enumVal;
	}
	return value;
};

export const getChartHeight = (count) => {
	if (count > 6) {
		return 'height: 250px';
	} else if (count <= 6 && count > 3) {
		return 'height: 300px';
	} else if (count <= 3) {
		return 'height: 500px';
	}
	return 'height: 500px';
};

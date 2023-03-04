export const configuration = {
	data: {
		dimensions: {
			count: 1
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
	subGroup: 'chart_line'
};

export const getDataIndexTimeComparison = (rawData, date) => {
	let resultIndex = null;
	rawData.rows.forEach((item, index) => {
		const tmpDate = new Date(item[0]);
		tmpDate.setHours(0);
		const tmpDate2 = new Date(date);
		tmpDate2.setHours(0);
		if (tmpDate.toDateString() === tmpDate2.toDateString()) {
			resultIndex = index;
		}
	});
	return resultIndex;
};

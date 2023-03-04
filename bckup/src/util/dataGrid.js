import {dataTypes, isDataType} from '@/util/queryBuilder';
import endOfMonth from 'date-fns/endOfMonth';
import endOfToday from 'date-fns/endOfToday';
import endOfWeek from 'date-fns/endOfWeek';
import isSameDay from 'date-fns/isSameDay';
import isWithinInterval from 'date-fns/isWithinInterval';
import startOfMonth from 'date-fns/startOfMonth';
import startOfWeek from 'date-fns/startOfWeek';
import subDays from 'date-fns/subDays';
import subWeeks from 'date-fns/subWeeks';

/* eslint-disable id-length */
const locale = navigator?.language ?? 'en-us';
const dateFormatter = new Intl.DateTimeFormat(locale);
const numberFormatter = new Intl.NumberFormat(locale);
const percentFormatter = new Intl.NumberFormat(locale, {
	style: 'percent',
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
});

export const format = (value, type) => {
	if (typeof value === 'undefined' || value === null || value === '') {
		return '<NULL>';
	}

	if (type === 'date') {
		return dateFormatter.format(new Date(value));
	}
	if (type === 'number') {
		if (Array.isArray(value) && value.length > 1) {
			return `${value[0]} - ${value[1]}`;
		}
		return numberFormatter.format(value);
	}
	if (type === 'percent') {
		return percentFormatter.format(value);
	}
	return value;
};

export const getType = (type) => {
	if (isDataType(dataTypes.DATE_TYPE, type)) {
		return 'date';
	}
	if (isDataType(dataTypes.TEXT, type)) {
		return 'string';
	}
	if (isDataType(dataTypes.NUMBER, type)) {
		return 'number';
	}
	return null;
};

export const filterFunctions = {
	'>': {
		types: ['number'],
		filter: (a, b) => a > b
	},
	'>=': {
		types: ['number'],
		filter: (a, b) => a >= b
	},
	'<': {
		types: ['number'],
		filter: (a, b) => a < b
	},
	'<=': {
		types: ['number'],
		filter: (a, b) => a <= b
	},
	'==': {
		types: [
			'string',
			'number'
		],
		filter: (a, b) => String(a) === String(b)
	},
	'!=': {
		types: [
			'string',
			'number'
		],
		filter: (a, b) => String(a) !== String(b)
	},
	contains: {
		types: ['string'],
		filter: (a, b) => a.toLowerCase().indexOf(b.toLowerCase()) !== -1
	},
	startsWith: {
		types: ['string'],
		filter: (a, b) => a.toLowerCase().startsWith(b.toLowerCase())
	},
	endsWith: {
		types: ['string'],
		filter: (a, b) => a.toLowerCase().endsWith(b.toLowerCase())
	},
	isEmpty: {
		types: [
			'string',
			'number'
		],
		hasValue: false,
		filter: (a) => !a
	},
	today: {
		types: ['date'],
		hasValue: false,
		filter: (date) => isSameDay(date, new Date())
	},
	tomorrow: {
		types: ['date'],
		hasValue: false,
		filter: (date) => {
			const tomorrow = subDays(new Date(), -1);
			return isSameDay(date, tomorrow);
		}
	},
	yesterday: {
		types: ['date'],
		hasValue: false,
		filter: (date) => {
			const yesterday = subDays(new Date(), 1);
			return isSameDay(date, yesterday);
		}
	},
	thisWeek: {
		types: ['date'],
		hasValue: false,
		filter: (date) => {
			const today = new Date();
			return isWithinInterval(date, {
				start: startOfWeek(today),
				end: endOfWeek(today)
			});
		}
	},
	lastWeek: {
		types: ['date'],
		hasValue: false,
		filter: (date) => {
			const lastWeek = subWeeks(new Date(), 1);
			return isWithinInterval(date, {
				start: startOfWeek(lastWeek),
				end: endOfWeek(lastWeek)
			});
		}
	},
	thisMonth: {
		types: ['date'],
		hasValue: false,
		filter: (date) => {
			const today = new Date();
			return isWithinInterval(date, {
				start: startOfMonth(today),
				end: endOfMonth(today)
			});
		}
	},
	lastMonth: {
		types: ['date'],
		hasValue: false,
		filter: (date) => {
			const today = new Date();
			today.setMonth(today.getMonth() - 1);
			return isWithinInterval(date, {
				start: startOfMonth(today),
				end: endOfMonth(today)
			});
		}
	},
	last7Days: {
		types: ['date'],
		hasValue: false,
		filter: (date) => isWithinInterval(date, {
			start: subDays(new Date(), 7),
			end: endOfToday()
		})
	},
	last14Days: {
		types: ['date'],
		hasValue: false,
		filter: (date) => isWithinInterval(date, {
			start: subDays(new Date(), 14),
			end: endOfToday()
		})
	},
	last30Days: {
		types: ['date'],
		hasValue: false,
		filter: (date) => isWithinInterval(date, {
			start: subDays(new Date(), 30),
			end: endOfToday()
		})
	},
	max: {
		types: ['number'],
		hasValue: false,
		aggregate: true,
		init: (data, key) => {
			if (data.length === 1) {
				return data[0];
			}

			let temp = data[0][key];
			for (let i = 0; i < data.length; i++) {
				if (data[i][key] > temp) {
					temp = data[i][key];
				}
			}

			return temp;
		},
		filter: (a, b) => a === b
	},
	min: {
		types: ['number'],
		hasValue: false,
		aggregate: true,
		init: (data, key) => {
			if (data.length === 1) {
				return data[0];
			}

			let temp = data[0][key];
			for (let i = 0; i < data.length; i++) {
				if (data[i][key] < temp) {
					temp = data[i][key];
				}
			}

			return temp;
		},
		filter: (a, b) => a === b
	}
};

export const filterOptions = {};
// eslint-disable-next-line guard-for-in
for (const key in filterFunctions) {
	const {types} = filterFunctions[key];

	for (const type of types) {
		if (!filterOptions[type]) {
			filterOptions[type] = [];
		}

		filterOptions[type].push({
			name: key,
			...filterFunctions[key]
		});
	}
}

export const aggregateFunctions = {
	count: (data) => data.length,
	countUnique(data, {type}) {
		if (type === 'date') {
			return (new Set(data.map((date) => format(date, 'date')))).size;
		}
		return (new Set(data)).size;
	},
	countEmpty(data) {
		return data.filter((a) => !a).length;
	},
	countNotEmpty(data) {
		return data.filter((a) => Boolean(a)).length;
	},
	percentEmpty(data) {
		return data.filter((a) => !a).length / data.length;
	},
	percentNotEmpty(data) {
		return data.filter((a) => Boolean(a)).length / data.length;
	},
	sum(data) {
		return data.reduce((a, b) => a + b, 0);
	},
	average(data) {
		const sum = this.sum(data);
		return (sum / data.length).toFixed(4);
	},
	median(data) {
		if (data.length === 0) {
			return 0;
		}

		const values = [...data].sort();
		const half = Math.floor(values.length / 2);

		if (values.length % 2) {
			return values[half];
		}

		return (values[half - 1] + values[half]) / 2.0;
	},
	max: (data) => Math.max.apply(null, data),
	min: (data) => Math.min.apply(null, data),
	range: (data) => Math.max.apply(null, data) - Math.min.apply(null, data)
};

export const aggregateOptions = {
	string: [
		'none',
		'count',
		'countUnique',
		'countEmpty',
		'countNotEmpty',
		'percentEmpty',
		'percentNotEmpty'
	],
	number: [
		'none',
		'count',
		'countUnique',
		'countEmpty',
		'countNotEmpty',
		'percentEmpty',
		'percentNotEmpty',
		'sum',
		'average',
		'median',
		'min',
		'max',
		'range'
	],
	date: [
		'none',
		'count',
		'countUnique',
		'countEmpty',
		'countNotEmpty',
		'percentEmpty',
		'percentNotEmpty'
	]
};

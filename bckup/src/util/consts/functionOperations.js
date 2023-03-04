import {dataTypes} from '@/util/queryBuilder';
import {i18n} from '@/plugins/all';
const {t} = i18n.global;

export const functionOperations = {
	greaterThan: {
		text: t('filters.GreaterThan'),
		label: '>',
		icon: 'icon-greater-than',
		dataType: [
			dataTypes.INT,
			dataTypes.FLOAT,
			dataTypes.LONG,
			dataTypes.DATETIME,
			dataTypes.DATE
		]
	},
	lessThan: {
		text: t('filters.LessThan'),
		label: '<',
		icon: 'icon-less-than',
		dataType: [
			dataTypes.INT,
			dataTypes.FLOAT,
			dataTypes.LONG,
			dataTypes.DATETIME,
			dataTypes.DATE
		]
	},
	equals: {
		text: t('filters.Equals'),
		label: '=',
		icon: 'icon-equal',
		dataType: [
			dataTypes.TEXT,
			dataTypes.INT,
			dataTypes.FLOAT,
			dataTypes.LONG,
			dataTypes.DATETIME,
			dataTypes.DATE,
			dataTypes.BOOL
		]
	},
	notEqual: {
		text: t('filters.notEqual'),
		label: '!=',
		icon: 'icon-not-equal',
		dataType: [
			dataTypes.TEXT,
			dataTypes.INT,
			dataTypes.FLOAT,
			dataTypes.LONG,
			dataTypes.DATETIME,
			dataTypes.DATE,
			dataTypes.BOOL
		]
	},
	like: {
		text: t('filters.isLike'),
		label: 'LIKE',
		dataType: [dataTypes.TEXT]
	},
	notLike: {
		text: t('filters.notLike'),
		label: 'ILIKE',
		dataType: [dataTypes.TEXT]
	},
	in: {
		text: t('filters.isContainedIn'),
		label: 'IN',
		icon: 'icon-in',
		dataType: [
			dataTypes.TEXT,
			dataTypes.INT,
			dataTypes.FLOAT,
			dataTypes.LONG,
			dataTypes.DATETIME,
			dataTypes.DATE
		]
	},
	notIn: {
		text: t('filters.notContainedIn'),
		label: 'NOT IN',
		icon: 'icon-not-in',
		dataType: [
			dataTypes.TEXT,
			dataTypes.INT,
			dataTypes.FLOAT,
			dataTypes.LONG,
			dataTypes.DATETIME,
			dataTypes.DATE
		]
	},
	inRange: {
		text: t('filters.inRange'),
		label: 'IN RANGE',
		dataType: [
			dataTypes.INT,
			dataTypes.FLOAT,
			dataTypes.LONG,
			dataTypes.DATETIME,
			dataTypes.DATE
		]
	},
	notInRange: {
		text: t('filters.notInRange'),
		label: 'NOT IN RANGE',
		dataType: [
			dataTypes.INT,
			dataTypes.FLOAT,
			dataTypes.LONG,
			dataTypes.DATETIME,
			dataTypes.DATE
		]
	},
	isEmpty: {
		text: t('filters.isEmpty'),
		label: 'IS EMPTY',
		pseudo: '=',
		dataType: [
			dataTypes.DATETIME,
			dataTypes.DATE,
			dataTypes.INT,
			dataTypes.FLOAT,
			dataTypes.LONG
		]
	},
	isNotEmpty: {
		text: t('filters.isNotEmpty'),
		label: 'IS NOT EMPTY',
		pseudo: '!=',
		dataType: [
			dataTypes.DATETIME,
			dataTypes.DATE,
			dataTypes.INT,
			dataTypes.FLOAT,
			dataTypes.LONG
		]
	},
	last: {
		text: t('filters.LastValue'),
		label: 'LAST',
		dataType: [dataTypes.DATETIME, dataTypes.DATE]
	},
	notInLast: {
		text: t('filters.notInLastValue'),
		label: 'NOT IN LAST',
		pseudo: 'LAST',
		dataType: [dataTypes.DATETIME, dataTypes.DATE]
	}
};

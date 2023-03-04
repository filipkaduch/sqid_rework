import {chartConstants} from '@/util/consts/chartsConstants';

export const bucketing = Object.freeze({
	NULL: null,
	SECONDS: 'SECONDS',
	MINUTES: 'MINUTES',
	HOURS: 'HOURS',
	DAYS: 'DAYS',
	WEEKS: 'WEEKS',
	MONTHS: 'MONTHS',
	QUARTERS: 'QUARTERS',
	YEARS: 'YEARS'
});

export const extracting = Object.freeze({
	NULL: null,
	SECOND: 'SECOND',
	MINUTE: 'MINUTE',
	HOUR: 'HOUR',
	DAY_OF_WEEK: 'DAY-OF-WEEK',
	DAY_OF_MONTH: 'DAY-OF-MONTH',
	DAY_OF_YEAR: 'DAY-OF-YEAR',
	WEEK: 'WEEK',
	MONTH: 'MONTH',
	QUARTER: 'QUARTER',
	YEAR: 'YEAR'
});

export const ordering = Object.freeze({
	ASC: 'ASC',
	DESC: 'DESC'
});

export const metricDefinition = Object.freeze({
	NO_CHANGE: 'NO-CHANGE',
	COUNT: 'COUNT',
	COUNT_DISTINCT: 'COUNT-DISTINCT',
	SUM: 'SUM',
	C_SUM: 'C-SUM',
	AVG: 'AVG',
	MIN: 'MIN',
	MAX: 'MAX'
});

export const dimensionDefinition = Object.freeze({
	BUCKET_VALUE: 'BUCKET-VALUE',
	BUCKET_DATE: 'BUCKET-DATE',
	EXTRACT_DATE: 'EXTRACT-DATE',
	NO_CHANGE: 'NO-CHANGE',
	GEO_POI_GRID: 'GEO-POI-GRID',
	GEO_TILE: 'GEO-TILE'
});

export const columnVisibilityState = Object.freeze({
	INTERNAL: 'INTERNAL',
	PUBLIC: 'PUBLIC'
});

export const columnUsageType = Object.freeze({
	DIMENSIONS: 'dimensions',
	METRICS: 'metrics',
	DATE: 'date'
});

export const geoValues = {
	LAT: 'lat',
	LON: 'lon'
};

export const filterTypes = Object.freeze({
	GROUP: 'GROUP',
	SIMPLE_COLUMN_VALUE: 'SIMPLE-COLUMN-VALUE',
	SIMPLE_ARRAY_COLUMN_VALUE: 'SIMPLE-ARRAY-COLUMN-VALUE',
	RAW_FILTER: 'RAW'
});
export const filterLogic = Object.freeze({
	AND: 'AND',
	OR: 'OR',
	EQUAL: '=',
	NOT_EQUAL: '!=',
	LESSER: '<',
	LESSER_OR_EQUAL: '<=',
	GREATER: '>',
	GREATER_OR_EQUAL: '>=',
	LIKE: 'LIKE',
	ILIKE: 'ILIKE',
	IS_EMPTY: 'IS EMPTY',
	IS_NOT_EMPTY: 'IS NOT EMPTY'
});

export const dataTypes = Object.freeze({
	INT: 'INT',
	LONG: 'LONG',
	FLOAT: 'FLOAT',
	DATETIME: 'DATETIME',
	DATE: 'DATE',
	TEXT_NOT_NULL: 'TEXT-NOT-NULL',
	BOOL: 'BOOL',
	TEXT: 'TEXT',
	NUMBER: 'NUMBER',
	DATE_TYPE: 'DATE_TYPE'
});

export const CUSTOM_METRIC = 'CUSTOM-METRIC';

export const sharingOptions = Object.freeze({
	GEN2_PERSONS_GROUPS: 'GEN2-PERSONS-GROUPS',
	PUBLIC_LINK: 'PUBLIC-LINK',
	PERSON: 'Person',
	GROUP_ROLE: 'Group',
	USER: 'USER',
	USER_GROUP: 'USER-GROUP'
});

export const numberTypes = Object.freeze([
	dataTypes.INT,
	dataTypes.LONG,
	dataTypes.FLOAT
]);

export const textTypes = Object.freeze([
	dataTypes.TEXT,
	dataTypes.TEXT_NOT_NULL
]);

export const dateTypes = Object.freeze([
	dataTypes.DATE,
	dataTypes.DATETIME
]);

export const isFormattable = (selected, dataType) => isDataType(dataTypes.DATE_TYPE, dataType)
	|| isDataType(dataTypes.NUMBER, dataType)
	|| selected === chartConstants.dataConfiguration.METRIC;

export const isDataType = (type, selected) => {
	if (type === dataTypes.NUMBER) {
		return numberTypes.includes(selected);
	}
	if (type === dataTypes.TEXT) {
		return textTypes.includes(selected);
	}
	if (type === dataTypes.DATE_TYPE) {
		return dateTypes.includes(selected);
	}
	return selected === type;
};

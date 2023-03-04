import {dataTypes, dateTypes, filterLogic, filterTypes, numberTypes} from '@/util/queryBuilder';
import {
	dateFiltersOperations, filterValueConsts, filterVersions,
	numberFiltersOperations, stringFiltersOperations
} from '@/modules/widget/components/widget-controls/filter/consts';
import {startOfMonth, startOfQuarter, startOfToday, startOfWeek, startOfYear, subDays, subMonths, subQuarters, subWeeks, subYears} from 'date-fns';
import {isString} from 'lodash';

// Function to load filters
export const loadFilters = (filter: any, attributes = null, groupOperation = null) => {
	// For every filter (max 2 of them)
	// eslint-disable-next-line max-statements
	const result = filter.reduce((arr: any, item: any) => {
		if (item.type === filterTypes.GROUP) {
			// If filter contains logic with range, create filter
			if (isRangeFilter(item.clauses)) {
				// If we have attribues (meaning its old version of filters default/v0 we need to find dataType)
				let calculatedDataType = null;
				if (attributes) {
					calculatedDataType = attributes.find((att: any) => item.clauses[0].columnReference === att.value).dataType;
				}

				arr.push({
					columnReference: item.clauses[0].columnReference,
					logic: [item.clauses[0].logic, item.clauses[1].logic],
					value: [item.clauses[0].value, item.clauses[1].value],
					operationSelected: item?.operationSelected ?? true,
					dataType: item?.dataType ?? calculatedDataType,
					groupOperation: item?.groupOperation ?? groupOperation,
					metadata: item?.metadata ?? findRangeMetadata(item.clauses[0], calculatedDataType)
				});
				return arr;
			}
			// Recursively loop to other filter.clauses
			const nestedResult = loadFilters(item.clauses, attributes, item?.operator ?? groupOperation);
			const concatedArray = arr.concat(nestedResult);
			return concatedArray;
		}

		// If its not group filter just add it
		let calculatedDataType = null;
		if (attributes) {
			calculatedDataType = attributes.find((att: any) => item.columnReference === att.value).dataType;
		}

		if (filterNotSuported(item, calculatedDataType)) {
			if (calculatedDataType === dataTypes.TEXT) {
				const newItemData = remapNotSuportedTextFilter(item, groupOperation);
				arr.push(newItemData);
				return arr;
			} else if (numberTypes.includes(calculatedDataType) || dateTypes.includes(calculatedDataType)) {
				const newItemData = remapNotSuportedNumberDateFilter(item, calculatedDataType, groupOperation);
				return arr.concat(newItemData);
			}
		}

		arr.push({
			columnReference: item.columnReference,
			logic: item.logic ?? null,
			value: item.value ?? item.values,
			operationSelected: item?.operationSelected ?? true,
			dataType: item?.dataType ?? calculatedDataType,
			groupOperation: item?.groupOperation ?? groupOperation,
			metadata: item?.metadata ?? findMedatata(item, calculatedDataType)
		});
		return arr;
	}, []);
	return result;
};

const isRangeFilter = (filters: any) => filters[0].logic === filterLogic.GREATER_OR_EQUAL && filters[1].logic === filterLogic.LESSER_OR_EQUAL;

// Function to find correct range filter from operations based on dataType
const findRangeMetadata = (filter: any, dataType: any) => {
	if (numberTypes.includes(dataType)) {
		return numberFiltersOperations.find((item) => item.type === filterTypes.GROUP && item.negate === (filter.negate ?? false));
	} else if (dateTypes.includes(dataType)) {
		return dateFiltersOperations.find((item) => item.type === filterTypes.GROUP && item.negate === (filter.negate ?? false));
	}
	return null;
};

// Function to find correct filter from operations based on dataType
const findMedatata = (filter: any, dataType: any) => {
	if (dataType === dataTypes.TEXT) {
		return stringFiltersOperations.find((item) => isSame(filter, item));
	} else if (numberTypes.includes(dataType)) {
		return numberFiltersOperations.find((item) => isSame(filter, item));
	} else if (dateTypes.includes(dataType)) {
		return dateFiltersOperations.find((item) => isSame(filter, item));
	}
	return null;
};

const isSame = (filter: any, item: any) => {
	const sameType = item.type === filter.type;
	const sameLogic = item.logic === (filter?.logic ?? null);
	const sameNegate = item.negate === (filter.negate ?? false);
	const sameNoPicker = (item?.noPicker ?? null) === (filter.values ?? filter.value ? null : true);
	return sameType && sameLogic && sameNegate && sameNoPicker;
};

const filterNotSuported = (filter: any, dataType: any) => {
	if (dataType === dataTypes.TEXT) {
		// Check if its = or != as we need to remap it to "contains in" because we are not longer supporting it
		if (filter.type === filterTypes.SIMPLE_COLUMN_VALUE
			&& [filterLogic.EQUAL, filterLogic.NOT_EQUAL].includes(filter.logic)
			&& isString(filter.value)) {
			return true;
		}
		return false;
	} else if (numberTypes.includes(dataType) || dateTypes.includes(dataType)) {
		// Check if its "contains in" because we are not longer supporting it for numbers and dates
		if (filter.type === filterTypes.SIMPLE_ARRAY_COLUMN_VALUE
			&& Array.isArray(filter.values)) {
			return true;
		}
		return false;
	}
	return false;
};

// Function to remap Equal(=) and Not equal(!=) to SIMPLE-ARRAY-COLUMN-VALUE
const remapNotSuportedTextFilter = (filter: any, groupOperation: any) => {
	const negate = filter.logic === filterLogic.NOT_EQUAL;
	return {
		columnReference: filter.columnReference,
		logic: null,
		value: [filter.value],
		operationSelected: true,
		dataType: dataTypes.TEXT,
		groupOperation: filter?.groupOperation ?? groupOperation,
		metadata: stringFiltersOperations.find((item) => item.type === filterTypes.SIMPLE_ARRAY_COLUMN_VALUE && item.negate === negate)
	};
};

const remapNotSuportedNumberDateFilter = (filter: any, dataType: any, groupOperation: any) => filter.values.map((value: any, index: number) => {
	let metadata = null;
	let valueToSave = null;
	if (numberTypes.includes(dataType)) {
		metadata = numberFiltersOperations.find((item: any) => item.type === filterTypes.SIMPLE_COLUMN_VALUE
			&& (filter.negate ? item.logic === filterLogic.NOT_EQUAL : item.logic === filterLogic.EQUAL));
		valueToSave = parseFloat(value);
	} else if (dateTypes.includes(dataType)) {
		metadata = dateFiltersOperations.find((item: any) => item.type === filterTypes.SIMPLE_COLUMN_VALUE
		&& (filter.negate ? item.logic === filterLogic.NOT_EQUAL : item.logic === filterLogic.EQUAL));
		valueToSave = value;
	}

	return {
		columnReference: filter.columnReference,
		logic: filterLogic.EQUAL,
		value: valueToSave,
		operationSelected: true,
		dataType,
		groupOperation: index === filter.values.length - 1 ? groupOperation : filterLogic.OR,
		metadata
	};
});

export const makeClause = (filters: any): Object => {
	// If we have empty filters return []
	if (Array.isArray(filters) && !filters.length) {
		return [];
	}

	// If there are more then one filter we need to group them
	if (Array.isArray(filters) && filters.length > 1) {
		return {
			type: filterTypes.GROUP,
			clauses: [
				makeClause(filters[0]),
				makeClause(filters.length === 2 ? filters[1] : filters.slice(1))
			],
			operator: filters[0].groupOperation
		};
	}

	// If Its ranged filter map it to group filter
	if (filters.metadata.type === filterTypes.GROUP) {
		return {
			clauses: [
				{
					columnReference: filters.columnReference,
					logic: filters.logic[0],
					type: filters.metadata.subType,
					value: filters.value[0]
				},
				{
					columnReference: filters.columnReference,
					logic: filters.logic[1],
					type: filters.metadata.subType,
					value: filters.value[1]
				}
			],
			negate: filters.metadata.negate,
			operator: filters.metadata.operator,
			type: filters.metadata.type
		};
	}

	// If its in last filter for date map value based on filter
	if (filters.metadata.value === filterValueConsts.IN_LAST) {
		const newValue = getInLastDateValue(filters.value);
		filters.value = newValue?.toISOString();
	}
	if (filters.metadata.value === filterValueConsts.IN_CURRENT) {
		const newValue = getInCurrentDateValue(filters.value);
		filters.value = newValue?.toISOString();
	}

	return {
		columnReference: filters.columnReference,
		logic: filters.logic,
		type: filters.metadata.type,
		negate: filters.metadata.negate,
		...(Array.isArray(filters.value) ? {values: filters.value} : {value: filters.value})
	};
};

const getInCurrentDateValue = (value: string) => {
	switch (value) {
		case filterValueConsts.DAY:
			return startOfToday();

		case filterValueConsts.WEEK_US:
			return startOfWeek(new Date(), {weekStartsOn: 0});

		case filterValueConsts.WEEK_EU:
			return startOfWeek(new Date(), {weekStartsOn: 1});

		case filterValueConsts.MONTH:
			return startOfMonth(new Date());

		case filterValueConsts.QUARTER:
			return startOfQuarter(new Date());

		case filterValueConsts.YEAR:
			return startOfYear(new Date());
		default:
			return null;
	}
};

const getInLastDateValue = (value: string) => {
	switch (value) {
		case filterValueConsts.DAY:
			return subDays(new Date(), 1);

		case filterValueConsts.WEEK:
			return subWeeks(new Date(), 1);

		case filterValueConsts.MONTH:
			return subMonths(new Date(), 1);

		case filterValueConsts.QUARTER:
			return subQuarters(new Date(), 1);

		case filterValueConsts.YEAR:
			return subYears(new Date(), 1);
		default:
			return null;
	}
};

export const mapFiltersForFetchData = (filters: any) => {
	const filterVersion = filters?.version;

	let staticFiltersToSave = null;
	if (filterVersion === filterVersions.DEFAULT_v0) {
		staticFiltersToSave = filters;
	} else if (filterVersion === filterVersions.DEFAULT_v1 && filters.preAggregation) {
		const preAggFilters = filters.preAggregation.length === 1 ? filters.preAggregation[0] : filters.preAggregation;
		staticFiltersToSave = {
			postAggregation: [],
			preAggregation: makeClause(preAggFilters),
			version: filterVersions.DEFAULT_v1
		};
	} else if (filterVersion === filterVersions.DEFAULT_v1 && Object.keys(filters).length === 1) {
		staticFiltersToSave = {
			postAggregation: [],
			preAggregation: [],
			version: filterVersions.DEFAULT_v1
		};
	} else {
		staticFiltersToSave = filters;
	}
	return staticFiltersToSave;
};

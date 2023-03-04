import cloneDeep from 'lodash/cloneDeep';
import omit from 'lodash/omit';
import {chartConstants} from '@/util/consts/chartsConstants';
import {dataTypes} from '@/util/queryBuilder';
import {getMetricAlias} from '@/util/widgetData';

const numberFormattingOptions = {
	NOTATION: 'notation',
	MAX_FRACTION_DIGITS: 'maximumFractionDigits',
	CURRENCY: 'currency',
	MIN_FRACTION_DIGITS: 'minimumFractionDigits'
};

const formatBucketsLabel = (value) => {
	const interval = cloneDeep(JSON.parse(value.replace(' - ', ',')));
	return `${Math.round(interval[0] * 1e3) / 1e3} - ${Math.round(interval[1] * 1e3) / 1e3}`;
};

const isNumberFormat = (format) => numberFormattingOptions.CURRENCY in format
	|| numberFormattingOptions.MAX_FRACTION_DIGITS in format
	|| numberFormattingOptions.NOTATION in format;

const smartTrim = (string, maxLength) => {
	if (!string || maxLength < 1 || string.length <= maxLength) {
		return string;
	}
	if (maxLength === 1) {
		return `${string.substring(0, 1)}\u2026`;
	}
	const midpoint = Math.ceil(string.length / 2);
	const toRemove = string.length - maxLength;
	const leftStrip = Math.ceil(toRemove / 2);
	const rightStrip = toRemove - leftStrip;
	return `${string.substring(0, midpoint - leftStrip)}\u2026${string.substring(midpoint + rightStrip)}`;
};

export const removeOldFormat = (realEnums, option, metricKey) => {
	const cleanedEnums = cloneDeep(realEnums);
	if (option === 'metricAliases') {
		if (realEnums[option]) {
			cleanedEnums[option] = omit(realEnums[option], metricKey);
		}
	} else {
		chartConstants.enumsCompatibilityMapping[option].forEach((mapping) => {
			if (realEnums[mapping]) {
				delete Object.assign(cleanedEnums, {[option]: cleanedEnums[mapping]})[mapping];
			}
		});
	}
	return cleanedEnums;
};

export const getEnum = (enums, option, key, fallback = key) => {
	let returnVal = null;
	if (enums?.[option]) {
		returnVal = enums?.[option]?.[key] ?? fallback;
	} else {
		Object.keys(chartConstants.enumsCompatibilityMapping).forEach((enumsKey) => {
			if (Array.isArray(chartConstants.enumsCompatibilityMapping[enumsKey])) {
				chartConstants.enumsCompatibilityMapping[enumsKey].forEach((elem) => {
					if (enums?.[elem] && option === enumsKey) {
						returnVal = enums?.[elem]?.[key] ?? fallback;
					}
				});
			}
		});
	}
	if (returnVal === '' || returnVal === null) {
		return key;
	}
	return returnVal;
};

const trimDate = (formatFunction, maxLength, useTrim) => {
	const formatted = formatFunction;
	return useTrim ? smartTrim(formatted, maxLength) : formatted;
};

// eslint-disable-next-line max-lines-per-function
export const getFormatter = (dataType, option, axis = option, enums = null, selectedFormat = null, advancedOptions = {}) => {
	const {
		transformValue = (value) => {
			if (value === '' || value === null) {
				return '<NULL>';
			}
			return value;
		},
		tooltip = false,
		shortLabel = false,
		maxLength = 6
	} = advancedOptions;
	let options = selectedFormat?.[axis] ?? {};
	switch (Array.isArray(dataType) ? dataType[0] : dataType) {
		case dataTypes.DATETIME:
		case dataTypes.DATE: {
			return ((value) => {
				const valueTransformed = transformValue(value);
				if (option === 'timeline') {
					options = {
						day: 'numeric',
						month: 'short',
						year: 'numeric'
					};
				}
				const intlFormatter = new Intl.DateTimeFormat(options?.locale ? options.locale : 'default', options);
				const enumeration = getEnum(enums, option, valueTransformed, null);
				const useTrimCondition = (shortLabel && !tooltip);
				if (enumeration !== null && Object.keys(options).length === 0 && (enumeration !== valueTransformed)) {
					if (useTrimCondition) {
						return smartTrim(enumeration, maxLength);
					}
					return enumeration;
				}
				try {
					return trimDate(intlFormatter.format(new Date(valueTransformed)), maxLength, useTrimCondition);
				} catch {
					try {
						return trimDate(intlFormatter.format(new Date(valueTransformed * 1000)), maxLength, useTrimCondition);
					} catch {
						return trimDate(valueTransformed?.toString() ?? valueTransformed, maxLength, useTrimCondition);
					}
				}
			});
		}
		case dataTypes.INT:
		case dataTypes.LONG:
		case dataTypes.FLOAT: {
			if (Array.isArray(dataType)) {
				return (value) => {
					const valueTransformed = transformValue(value);
					const enumToFind = typeof valueTransformed === 'string' ? valueTransformed.replace(',', ' - ') : valueTransformed;
					const enumeration = getEnum(enums, option, enumToFind, null);
					if (enumeration !== null) {
						return enumeration;
					}
					return valueTransformed;
				};
			}
			return (value) => {
				const valueTransformed = transformValue(value);
				if (option !== chartConstants.dataConfiguration.METRIC) {
					if ((option === chartConstants.dataConfiguration.DIMENSION0
						|| option === chartConstants.dataConfiguration.DIMENSION1) && isNumberFormat(options)) {
						if (options.currency === 'CZK') {
							const intlFormatter = new Intl.NumberFormat('default', {minimumFractionDigits: 2});
							return `Kč ${intlFormatter.format(valueTransformed)}`;
						}
						const intlFormatter = new Intl.NumberFormat('default', options);
						return intlFormatter.format(valueTransformed);
					}
					const enumeration = getEnum(enums, option, valueTransformed, null);
					if (enumeration && enumeration.length > 0) {
						if (shortLabel && !tooltip) {
							return smartTrim(enumeration, maxLength);
						}
						return enumeration;
					}
				}
				if (typeof valueTransformed === 'string' && valueTransformed.includes('-')) {
					return formatBucketsLabel(valueTransformed);
				}
				if (isNaN(valueTransformed)) {
					return '-';
				}
				if (options.currency === 'CZK') {
					const intlFormatter = new Intl.NumberFormat('default', {minimumFractionDigits: 2});
					return `Kč ${intlFormatter.format(valueTransformed)}`;
				}
				const intlFormatter = new Intl.NumberFormat('default', options);
				return intlFormatter.format(valueTransformed);
			};
		}
		case dataTypes.TEXT: {
			return (value) => {
				const result = getEnum(enums, option, transformValue(value));
				if (shortLabel && !tooltip) {
					return smartTrim(result, maxLength);
				}
				return result;
			};
		}
	}
	return (value) => getEnum(enums, option, transformValue(value));
};

export const tooltipFormatterLine = (params, metrics, enums, columnFormatter, metricFormatter, context) => {
	if (params?.[0]?.componentType === 'series') {
		return `${columnFormatter(params[0].name)}<br>
					${params.map((param) => {
		const testAverage = param.seriesName === 't_MetricAverage' || param.seriesName === 't_Average';
		return `${param.marker}${getMetricAlias(testAverage ? param.seriesName : param.seriesIndex, metrics, enums, context)}: ${metricFormatter(param.value)}`;
	}).join('<br>')}`;
	}
	return '';
};

export const tooltipFormatterComparison
	= (params, metrics, enums, metricFormatter) => `${params.marker} ${getEnum(enums, 'dimension0', params.seriesName)}: ${metricFormatter(params.value)}`;

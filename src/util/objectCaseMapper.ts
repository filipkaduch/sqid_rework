import {camelCase, isArray, isObject, mapKeys, mapValues, snakeCase, lowerCase, upperFirst} from 'lodash';

export const objectCaseStyles = Object.freeze({
	CAMEL_CASE: 'camel-case ',
	SNAKE_CASE: 'snake-case',
	SENTENCE_CASE: 'sentence-case'
});

export const objectCaseMapper = (value, caseStyle) => {
	if (isArray(value)) {
		return value.map((innerObj) => objectCaseMapper(innerObj, caseStyle));
	}
	if (isObject(value)) {
		// translate to normal sentence mode
		if (caseStyle === objectCaseStyles.SENTENCE_CASE) {
			return mapValues(mapKeys(
				value,
				(val, key) => upperFirst(lowerCase(key))
			), (val) => objectCaseMapper(val, caseStyle));
		}
		return mapValues(mapKeys(
			value,
			(val, key) => (caseStyle === objectCaseStyles.CAMEL_CASE ? /^[a-z]+(?:_[a-z]+)*$/u : /^[a-z]+(?:[A-Z][a-z]*)*$/u).test(key)
				? (caseStyle === objectCaseStyles.CAMEL_CASE ? camelCase(key) : snakeCase(key))
				: key
		), (val) => objectCaseMapper(val, caseStyle));
	}
	if (caseStyle === objectCaseStyles.SENTENCE_CASE) {
		return upperFirst(lowerCase(value));
	}
	return value;
};

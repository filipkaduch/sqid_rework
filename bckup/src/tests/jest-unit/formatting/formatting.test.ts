import 'ts-jest';
import {getFormatter} from '@/util/formatingUtil.js';
import {correctNumberFormat, correctCurrencyFormat, correctDateFormat} from './mockData';
import {numberFormatOptions, currencyFormatOptions, dateFormatOptionsTest} from '@/modules/widget/components/widget-controls/consts/formatOptions';
import {TranslateResult} from 'vue-i18n';
import {describe, it, expect} from 'vitest';

const testNumber = 1000;
const testDate = '2019-12-31T00:00:00+00:00';

// eslint-disable-next-line max-lines-per-function
describe('Formatting tests', () => {
	numberFormatOptions.forEach((option: {
		value: null | {
			maximumFractionDigits?: number | undefined,
			minimumFractionDigits?: number | undefined,
			style?: string | undefined,
			notation?: string | undefined
		},
		text: string | TranslateResult}) => {
		it(`Format number: ${option.text.toString()}`, () => {
			const numbersFormatter = getFormatter(
				'INT',
				'dimension0',
				'xAxis',
				// @ts-ignore
				{},
				{
					xAxis: option.value
				}
			);

			const result = numbersFormatter(testNumber);
			expect(result).not.toBeNull();
			expect(result).toEqual(correctNumberFormat[option.text.toString()]?.correct);
		});
	});

	currencyFormatOptions.forEach((option: {
		value: null | {
			style?: string | undefined,
			currency?: string | undefined
		},
		text: string | TranslateResult}) => {
		it(`Format currency: ${option.text}`, () => {
			const currencyFormatter = getFormatter(
				'INT',
				'dimension0',
				'xAxis',
				// @ts-ignore
				{},
				{
					xAxis: option.value
				}
			);

			const result = currencyFormatter(testNumber);
			expect(result).not.toBeNull();
			expect(result).toEqual(correctCurrencyFormat[option.text.toString()]?.correct);
		});
	});
	dateFormatOptionsTest.forEach((option: {
		value: null | {
			year?: string | undefined,
			day?: string | undefined,
			month?: string | undefined,
			weekday?: string | undefined,
			hour?: string | undefined,
			minute?: string | undefined,
			locale?: string | undefined
		},
		text: string|TranslateResult}) => {
		it(`Format datetime: ${option.text}`, () => {
			const dateFormatter = getFormatter(
				'DATETIME',
				'dimension0',
				'xAxis',
				// @ts-ignore
				{},
				{
					xAxis: {...option.value, locale: 'en-US'}
				}
			);
			const result = dateFormatter(testDate);
			expect(result).not.toBeNull();
			expect(result).toEqual(correctDateFormat[option.text.toString()]?.correct);
		});
	});
});

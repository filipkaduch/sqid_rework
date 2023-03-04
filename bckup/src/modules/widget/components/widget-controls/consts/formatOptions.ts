import i18n from '@/plugins/i18n';
const {t} = i18n.global;
import {FormatOption} from '@/modules/widget/components/widget-controls/consts/formatTypes';

export const numberFormatOptions = [
	{
		value: null,
		text: t('numberFormat.selectNumberFormat')
	},
	{
		value: {
			maximumFractionDigits: 0
		},
		text: t('numberFormat.integer'),
		short: '1'
	},
	{
		value: {
			maximumFractionDigits: 2,
			minimumFractionDigits: 2
		},
		text: t('numberFormat.twoDecPlaces'),
		short: '.12'
	},
	{
		value: {
			maximumFractionDigits: 4,
			minimumFractionDigits: 4
		},
		text: t('numberFormat.fourDecPlaces'),
		short: '.1234'
	},
	{
		value: {
			style: 'percent',
			maximumFractionDigits: 2
		},
		text: t('numberFormat.percent'),
		short: '%'
	},
	{
		value: {
			notation: 'compact'
		},
		text: t('numberFormat.milionsBilions'),
		short: 'M/B'
	}
];

export const currencyFormatOptions = [
	{
		value: null,
		text: t('numberFormat.selectCurrency')
	},
	{
		value: {
			style: 'currency',
			currency: 'EUR'
		},
		short: 'EUR',
		text: t('numberFormat.euro')
	},
	{
		value: {
			style: 'currency',
			currency: 'USD'
		},
		short: 'USD',
		text: t('numberFormat.usDollar')
	},
	{
		value: {
			style: 'currency',
			currency: 'CZK'
		},
		short: 'CZK',
		text: t('numberFormat.czechCrown')
	},
	{
		value: {
			style: 'currency',
			currency: 'GBP'
		},
		short: 'GBP',
		text: t('numberFormat.britishPound')
	},
	{
		value: {
			style: 'currency',
			currency: 'JPY'
		},
		short: 'JPY',
		text: t('numberFormat.yen')
	},
	{
		value: {
			style: 'currency',
			currency: 'AUD'
		},
		short: 'AUD',
		text: t('numberFormat.australianDollar')
	}
];

export const dateFormatOptionsTest = [
	{
		value: null,
		text: t('dateFormat.selectFormat')
	},
	{
		value: {
			year: 'numeric'
		},
		short: 'Year',
		text: t('dateFormat.year')
	},
	{
		value: {
			day: 'numeric',
			month: 'short'
		},
		short: 'Day Mon',
		text: t('dateFormat.dayMonth')
	},
	{
		value: {
			weekday: 'long'
		},
		short: 'Day of the week',
		text: t('dateFormat.dayOfWeek')
	},
	{
		value: {
			month: 'long'
		},
		short: 'Month',
		text: t('dateFormat.month')
	},
	{
		value: {
			month: 'long',
			year: 'numeric'
		},
		short: 'Month YYYY',
		text: t('dateFormat.monthYear')
	},
	{
		value: {
			month: '2-digit',
			day: '2-digit',
			year: 'numeric',
			locale: 'en-US'
		},
		short: 'MM/DD/YYYY',
		text: t('dateFormat.usFormat')
	},
	{
		value: {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		},
		short: 'DD/Mon/YYYY',
		text: t('dateFormat.dayMonthShortYear')
	},
	{
		value: {
			day: 'numeric',
			month: 'numeric',
			year: 'numeric',
			locale: 'en-GB'
		},
		short: 'DD/MM/YYYY',
		text: t('dateFormat.dayMonthNumericYear')
	}
];

export const dateFormatOptions = [
	{
		value: null,
		text: t('dateFormat.selectFormat')
	},
	{
		value: {
			year: 'numeric'
		},
		short: 'Year',
		text: t('dateFormat.year')
	},
	{
		value: {
			day: 'numeric',
			month: 'short'
		},
		short: 'Day Mon',
		text: t('dateFormat.dayMonth')
	},
	{
		value: {
			weekday: 'long'
		},
		short: 'Day of the week',
		text: t('dateFormat.dayOfWeek')
	},
	{
		value: {
			month: 'long'
		},
		short: 'Month',
		text: t('dateFormat.month')
	},
	{
		value: {
			month: 'long',
			year: 'numeric'
		},
		short: 'Month YYYY',
		text: t('dateFormat.monthYear')
	},
	{
		value: {
			month: '2-digit',
			day: '2-digit',
			year: 'numeric',
			locale: 'en-US'
		},
		short: 'MM/DD/YYYY',
		text: t('dateFormat.usFormat')
	},
	{
		value: {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		},
		short: 'DD/Mon/YYYY',
		text: t('dateFormat.dayMonthShortYear')
	},
	{
		value: {
			day: 'numeric',
			month: 'numeric',
			year: 'numeric',
			locale: 'en-GB'
		},
		short: 'DD/MM/YYYY',
		text: t('dateFormat.dayMonthNumericYear')
	},
	{
		value: {
			day: 'numeric',
			month: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: 'numeric'
		},
		short: 'DD/MM/YYYY HH/MM',
		text: t('dateFormat.dayMonthYearTime')
	}
];

export const formatOptionsFormatted = numberFormatOptions.map((formatOption: FormatOption) => ({
	selectLabel: formatOption.text,
	label: formatOption.text,
	value: formatOption.value,
	short: formatOption.short,
	group: t('numberFormat.numberFormat')
}))
	.concat(currencyFormatOptions.map((currencyOption: FormatOption) => ({
		selectLabel: currencyOption.text,
		label: currencyOption.text,
		value: currencyOption.value,
		short: currencyOption.short,
		group: t('numberFormat.currencyFormat')
	})))
	.filter((formatOption) => formatOption.value !== null);

export const dateFormatOptionsFormatted = dateFormatOptions.map((formatOption: FormatOption) => ({
	selectLabel: formatOption?.text,
	value: formatOption?.value
})).filter((formatOption) => formatOption.value !== null);

import i18n from '@/plugins/i18n';
const {t} = i18n.global;

export const correctNumberFormat = {
	[`${t('numberFormat.selectNumberFormat')}`]: {
		correct: '1,000'
	},
	[`${t('numberFormat.integer')}`]: {
		correct: '1,000'
	},
	[`${t('numberFormat.twoDecPlaces')}`]: {
		correct: '1,000.00'
	},
	[`${t('numberFormat.fourDecPlaces')}`]: {
		correct: '1,000.0000'
	},
	[`${t('numberFormat.percent')}`]: {
		correct: '100,000%'
	},
	[`${t('numberFormat.milionsBilions')}`]: {
		correct: '1K'
	}
};

export const correctCurrencyFormat = {
	[`${t('numberFormat.selectCurrency')}`]: {
		correct: '1,000'
	},
	[`${t('numberFormat.euro')}`]: {
		correct: '€1,000.00'
	},
	[`${t('numberFormat.usDollar')}`]: {
		correct: '$1,000.00'
	},
	[`${t('numberFormat.czechCrown')}`]: {
		correct: 'Kč 1,000.00'
	},
	[`${t('numberFormat.britishPound')}`]: {
		correct: '£1,000.00'
	},
	[`${t('numberFormat.yen')}`]: {
		correct: '¥1,000'
	},
	[`${t('numberFormat.australianDollar')}`]: {
		correct: 'A$1,000.00'
	}
};

export const correctDateFormat = {
	[`${t('dateFormat.selectFormat')}`]: {
		correct: '12/31/2019'
	},
	[`${t('dateFormat.year')}`]: {
		correct: '2019'
	},
	[`${t('dateFormat.dayMonth')}`]: {
		correct: 'Dec 31'
	},
	[`${t('dateFormat.dayOfWeek')}`]: {
		correct: 'Tuesday'
	},
	[`${t('dateFormat.month')}`]: {
		correct: 'December'
	},
	[`${t('dateFormat.monthYear')}`]: {
		correct: 'December 2019'
	},
	[`${t('dateFormat.dayMonthShortYear')}`]: {
		correct: 'Dec 31, 2019'
	},
	[`${t('dateFormat.usFormat')}`]: {
		correct: '12/31/2019'
	},
	[`${t('dateFormat.dayMonthNumericYear')}`]: {
		correct: '12/31/2019'
	}
	/* [`${t('dateFormat.dayMonthYearTime')}`]: {
		correct: '1/1/2020, 12:00 AM'
	} */
};

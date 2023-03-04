import i18n from '@/plugins/i18n';
const {t} = i18n.global;
import cronstrue from 'cronstrue/i18n';
import {isValidCron} from 'cron-validator';

export const schedulingUnits = Object.freeze({
	MINUTE: 'MINUTE ',
	HOUR: 'HOUR',
	DAY: 'DAY'
});

export enum SchedulingType {
	DISABLED = 'disabled',
	HOUR = 'hour',
	DAY = 'day',
	WEEK = 'week',
	CRON = 'cron',
}

export const schedulingOptions = {
	[SchedulingType.DISABLED]: null,
	[SchedulingType.HOUR]: {
		type: 'PERIODIC',
		refreshUnit: schedulingUnits.HOUR,
		refreshInterval: 1
	},
	[SchedulingType.DAY]: {
		type: 'PERIODIC',
		refreshUnit: schedulingUnits.DAY,
		refreshInterval: 1
	},
	[SchedulingType.WEEK]: {
		type: 'PERIODIC',
		refreshUnit: schedulingUnits.DAY,
		refreshInterval: 7
	},
	[SchedulingType.CRON]: null
};

export const getNextScheduledText = (selectedSchedulingType: any, cronString: string, currentDateTime = new Date()) => {
	const locale = navigator?.language ?? 'en-us';
	const dateFormatter = new Intl.DateTimeFormat(locale, {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric'
	});

	switch (selectedSchedulingType) {
		case SchedulingType.HOUR:
			currentDateTime.setTime(currentDateTime.getTime() + (60 * 60 * 1000));
			break;
		case SchedulingType.DAY:
			currentDateTime.setDate(currentDateTime.getDate() + 1);
			break;
		case SchedulingType.WEEK:
			currentDateTime.setDate(currentDateTime.getDate() + 7);
			break;
		case SchedulingType.CRON:
			return isValidCron(cronString)
				? cronstrue.toString(cronString, {locale: locale.trim().split(/-|_/u)[0]})
				: t('datasetUpload.enterValidCron');
	}
	return `Next at ${dateFormatter.format(currentDateTime)}`;
};

export const getSchedulingObj = (schedulingType: SchedulingType, cronString: string): any => {
	if (schedulingType === SchedulingType.CRON) {
		return {
			type: 'CRON',
			cron: cronString
		};
	}
	return schedulingOptions[schedulingType];
};

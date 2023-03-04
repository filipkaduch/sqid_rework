import {testUnits} from '@/util/consts/timeUnit';

export const filterConsts = Object.freeze({
	NULL: null,
	UNDEFINED: 'undefined',
	METRIC: 'metric',
	DIRECTION_UP: 'up',
	DIRECTION_DOWN: 'down'
});

export const getDateMapping = (value, unit) => {
	let dateOffset = 0;
	switch (unit) {
		case testUnits.DAYS: {
			dateOffset = (24 * 60 * 60 * 1000) * parseInt(value, 10);
			break;
		}
		case testUnits.WEEKS: {
			dateOffset = (24 * 60 * 60 * 1000) * (parseInt(value, 10) * 7);
			break;
		}
		case testUnits.MONTHS: {
			dateOffset = (24 * 60 * 60 * 1000) * (parseInt(value, 10) * 30);
			break;
		}
	}

	const myDate = new Date();
	myDate.setTime(myDate.getTime() - dateOffset);
	const date = new Intl.DateTimeFormat('en', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).format(myDate);

	return `${date.toString().replaceAll('/', '-')}`;
};

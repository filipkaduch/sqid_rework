import {schedulingUnits} from '@/modules/dataset/utils/datasetUtils';

export default [
	{
		value: null,
		text: 'Disable auto-update'
	},
	{
		value: {
			unit: schedulingUnits.HOUR,
			value: 1
		},
		text: 'Every hour'
	},
	{
		value: {
			unit: schedulingUnits.DAY,
			value: 1
		},
		text: 'Every day'
	},
	{
		value: {
			unit: schedulingUnits.DAY,
			value: 7
		},
		text: 'Every week'
	}
];

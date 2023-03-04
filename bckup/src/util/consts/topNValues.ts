import {ordering} from '@/util/queryBuilder';
export const topNOptions = [
	{label: '10', value: 10},
	{label: '20', value: 20},
	{label: '30', value: 30},
	{label: '50', value: 50},
	{label: '100', value: 100},
	{label: 'all', value: null}
];

export const orderOptions = [
	{label: ordering.DESC, value: ordering.DESC, icon: 'ds-icon-chevron-down'},
	{label: ordering.ASC, value: ordering.ASC, icon: 'arrow-up'}
];

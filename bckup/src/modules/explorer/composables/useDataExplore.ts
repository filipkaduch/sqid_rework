import {explorationData, explorationReport} from '@/modules/explorer/consts/consts';

// eslint-disable-next-line func-names
export default function() {
	const exploreOptions = [
		{
			label: 'explorer.dataView',
			value: explorationData
		},
		{
			label: 'explorer.reportView',
			value: explorationReport
		}
	];
	return {exploreOptions};
}

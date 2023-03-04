export const dynamicFilterModes = Object.freeze({
	DISABLED: 'DISABLED',
	SAME_DATASET: 'SAME_DATASET',
	ALL_DATASETS: 'ALL_DATASETS'
});

export const dynamicFilterModeTitles = Object.freeze({
	[dynamicFilterModes.DISABLED]: 't_disabled',
	[dynamicFilterModes.SAME_DATASET]: 't_sameDataset',
	[dynamicFilterModes.ALL_DATASETS]: 't_allDatasets'
});

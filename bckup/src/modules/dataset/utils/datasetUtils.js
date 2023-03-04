export const schedulingUnits = Object.freeze({
	MINUTE: 'MINUTE ',
	HOUR: 'HOUR',
	DAY: 'DAY'
});

export const jobTypes = Object.freeze({
	PROCESS_URL_LINK: 'ProcessUrlLink',
	PROCESS_GOOGLE_SHEET: 'ProcessGoogleSheet',
	PROCESS_CSV_FILE: 'ProcessCsvFile',
	PROCESS_DQ_RULE: 'DqMpRuleAttrValidity',
	PROCESS_DQ_ATTR: 'DqCiAttrRuleValidity'
});

export const DATASOURCE_TYPES = Object.freeze({
	DATASET: 'DATA-STORIES-DATASET',
	CATALOG_ITEM: 'CATALOG-ITEM'
});

export const DATASOURCES = {
	DATASETS: 'datasets',
	CATALOG_ITEMS: 'catalogItems'
};


export const updateDatasetStatusInterval = 4567;

export const formatBytes = (number) => {
	if (number < 1000) {
		return `${number} B`;
	}
	const kiloBytes = Math.round((number / (10 ** 3)));
	if (kiloBytes < 100) {
		return `${kiloBytes} KB`;
	} else if (kiloBytes >= 100 && kiloBytes < 1000000) {
		return `${Math.ceil((number / (10 ** 6)))} MB`;
	}
	return `${Math.round((number / (10 ** 9))) / 100} GB`;
};

export const getFormData = (requestFields, file) => {
	if (requestFields !== null && file !== null) {
		const formData = new FormData();
		formData.append('x-amz-meta-ts-dataset-id', requestFields['x-amz-meta-ts-dataset-id']);
		formData.append('x-amz-meta-ts-created-by', requestFields['x-amz-meta-ts-created-by']);
		formData.append('x-amz-meta-ts-created-at', requestFields['x-amz-meta-ts-created-at']);
		formData.append('key', requestFields.key);
		formData.append('x-amz-algorithm', requestFields['x-amz-algorithm']);
		formData.append('x-amz-credential', requestFields['x-amz-credential']);
		formData.append('x-amz-date', requestFields['x-amz-date']);
		formData.append('policy', requestFields.policy);
		formData.append('x-amz-signature', requestFields['x-amz-signature']);
		formData.append('file', file);
		return formData;
	}
	return null;
};

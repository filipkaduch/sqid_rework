export const DATASET_STORE_NAME = 'datasets';
export const DATASET_GETTERS = {
	LOADING: 'loading',
	LOADING_NEXT_PAGE: 'loadingNextPage',
	TOTAL_RECORDS: 'totalRecords',
	DATASETS: 'datasets',
	UPDATING_STATUS: 'updatingStatus',
	SCHEDULED_JOBS: 'scheduledJobs',
	RUNNING_JOBS: 'runningJobs',
	ERROR: 'error',
	LAST_PAGE: 'lastPage',
	DATASET: 'dataset'
};
export const DATASET_MUTATIONS = {
	START_LOADING: 'startLoading',
	START_LOADING_NEXT_PAGE: 'startLoadingNextPage',
	STOP_LOADING: 'stopLoading',
	SET_UPDATING_STATUS: 'setUpdatingStatus',
	SET_RUNNING_JOBS: 'setRunningJobs',
	NEXT_PAGE: 'nextPage',
	ADD_SCHEDULED_JOBS: 'addScheduledJobs',
	ADD_DATASETS: 'addDatasets',
	UPDATE_DATASET_STATUS: 'updateDatasetStatus',
	REMOVE_DATASET: 'removeDataset',
	SET_ERROR: 'setError',
	SET_SEARCH: 'setSearch',
	RESET: 'reset'
};
export const DATASET_ACTIONS = {
	LOAD_NEXT_PAGE: 'loadNextPage',
	UPDATE_STATUS: 'updateStatus',
	LOAD_NEXT_SCHEDULED_JOBS: 'loadNextScheduledJobs',
	RESET: 'reset'
};
export interface DatasetDetail {
	[datasetId: string]: {
		loading: boolean,
		dataset: any,
		tableData: any,
		pagination: {
			page: number,
			recordsPerPage: number
		}
	}
}

export interface DatasetColumn {
	dataType: string;
	mostCommonValue: string;
	mostCommonValues: { [id: number]: string };
	name: string;
	nullValuesCount: number;
	ordering: number;
	sourceName: string;
	displayName: string;
	uniqueValuesCount: number;
	visibilityState: string;
}

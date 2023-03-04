import {DATASET_ACTIONS, DATASET_GETTERS, DATASET_MUTATIONS} from '@/modules/dataset/store/types';
import {datasetService} from '@/modules/dataset/datasetService';
import {statisticsService} from '@/modules/homepage/statisticsService';
import {notify} from '@kyvg/vue3-notification';
import i18n from '@/plugins/i18n/index';
const {t} = i18n.global;

const getInitialState = () => ({
	loading: false,
	loadingNextPage: false,
	page: 0,
	pageLength: 10,
	totalRecords: null,
	datasets: [],
	scheduledJobs: {},
	runningJobs: [],
	error: null,
	updatingStatus: false,
	search: ''
});

export default {
	namespaced: true,
	state: getInitialState(),
	getters: {
		[DATASET_GETTERS.LOADING]: (state) => state.loading,
		[DATASET_GETTERS.LOADING_NEXT_PAGE]: (state) => state.loadingNextPage,
		[DATASET_GETTERS.TOTAL_RECORDS]: (state) => state.totalRecords,
		[DATASET_GETTERS.DATASETS]: (state) => state.datasets,
		[DATASET_GETTERS.UPDATING_STATUS]: (state) => state.updatingStatus,
		[DATASET_GETTERS.SCHEDULED_JOBS]: (state) => state.scheduledJobs,
		[DATASET_GETTERS.RUNNING_JOBS]: (state) => state.runningJobs,
		[DATASET_GETTERS.ERROR]: (state) => state.error,
		[DATASET_GETTERS.LAST_PAGE]: (state) => state.page * state.pageLength >= (state.totalRecords ?? 0),
		[DATASET_GETTERS.DATASET]: (state) => (id) => state.datasets.find((dataset) => dataset.id === id)
	},
	mutations: {
		[DATASET_MUTATIONS.START_LOADING](state) {
			state.loading = true;
			state.error = null;
		},
		[DATASET_MUTATIONS.START_LOADING_NEXT_PAGE](state) {
			state.loadingNextPage = true;
			state.error = null;
		},
		[DATASET_MUTATIONS.STOP_LOADING](state) {
			state.loading = false;
			state.loadingNextPage = false;
		},
		[DATASET_MUTATIONS.SET_UPDATING_STATUS](state, isUpdating) {
			state.updatingStatus = isUpdating;
		},
		[DATASET_MUTATIONS.SET_RUNNING_JOBS](state, runningJobs) {
			state.runningJobs = runningJobs;
		},
		[DATASET_MUTATIONS.NEXT_PAGE](state) {
			state.page += 1;
		},
		[DATASET_MUTATIONS.ADD_SCHEDULED_JOBS](state, jobs) {
			// eslint-disable-next-line guard-for-in
			for (const datasetId in jobs) {
				state.scheduledJobs[datasetId] = jobs[datasetId];
			}
		},
		[DATASET_MUTATIONS.ADD_DATASETS](state, {totalRecords, datasets}) {
			state.totalRecords = totalRecords;
			state.datasets = state.datasets.concat(datasets.map((dataset) => ({
				...dataset,
				createdAt: new Date(dataset.createdAt),
				updatedAt: new Date(dataset.updatedAt),
				status: dataset.info?.externalRunnerJobRun?.status ?? null
			})));
			state.loading = false;
			state.loadingNextPage = false;
		},
		[DATASET_MUTATIONS.UPDATE_DATASET_STATUS](state, payload) {
			const datasetIndex = state.datasets.findIndex((dataset) => dataset.id === payload.datasetId);
			if (datasetIndex > -1) {
				if (payload.jobStatus) {
					state.datasets[datasetIndex].latestScheduledJobRun = payload.jobStatus;
				}
				if (payload.datasetInfo) {
					state.datasets[datasetIndex].info = payload.datasetInfo;
				}
			}
		},
		[DATASET_MUTATIONS.REMOVE_DATASET](state, id) {
			const index = state.datasets.findIndex((dataset) => dataset.id === id);
			state.datasets.splice(index, 1);
		},
		[DATASET_MUTATIONS.SET_ERROR](state, error) {
			state.error = error;
			state.loading = false;
			state.loadingNextPage = false;
		},
		[DATASET_MUTATIONS.SET_SEARCH](state, search) {
			state.search = search;
		},
		[DATASET_MUTATIONS.RESET](state) {
			Object.assign(state, getInitialState());
		}
	},
	actions: {
		// eslint-disable-next-line max-lines-per-function
		async [DATASET_ACTIONS.LOAD_NEXT_PAGE]({commit, state, getters, dispatch}, payload = {
			reset: false,
			orderByField: null,
			orderByDir: null,
			limit: null
		}) {
			if (!(!payload.reset && (getters.lastPage || getters.error))) {
				if (state.page === 0 || payload.reset) {
					commit(DATASET_MUTATIONS.RESET);
					commit(DATASET_MUTATIONS.START_LOADING);
				} else {
					commit(DATASET_MUTATIONS.START_LOADING_NEXT_PAGE);
				}
				commit(DATASET_MUTATIONS.NEXT_PAGE);
				if (payload.reset && payload.search) {
					commit(DATASET_MUTATIONS.SET_SEARCH, payload.search);
				}
				const data = await datasetService.getDatasets({
					params: {
						searchTerm: payload.search,
						limit: payload.limit ? payload.limit : state.pageLength,
						offset: (state.page - 1) * state.pageLength,
						orderByDir: payload.orderByDir,
						orderByField: payload.orderByField
					}
				});
				if (data.data) {
					const datasetIds = data.data.map((dataset) => dataset.id);
					const datasetsStoriesCount = await statisticsService.getDatasetsStoriesCount(datasetIds);
					commit(DATASET_MUTATIONS.ADD_DATASETS, {
						totalRecords: data.pagination.count,
						datasets: data.data.map((dataset) => ({
							...dataset,
							storyCount: datasetsStoriesCount[dataset.id]
						}))
					});
					try {
						dispatch(DATASET_ACTIONS.LOAD_NEXT_SCHEDULED_JOBS, data.data.map((dataset) => dataset.id));
					} catch (err) {
						commit(DATASET_MUTATIONS.SET_ERROR, err?.response?.data?.message ?? 'Can\'t load datasets');
					}
				}
				commit(DATASET_MUTATIONS.STOP_LOADING);
			}
		},
		async [DATASET_ACTIONS.UPDATE_STATUS]({commit, getters}) {
			if (!getters.updatingStatus) {
				commit(DATASET_MUTATIONS.SET_UPDATING_STATUS, true);
				const data = await datasetService.getDatasetActiveJobs();
				const runningJobs = Object.keys(data);
				const difference = getters.runningJobs.filter((datasetId) => !runningJobs.includes(datasetId));
				for (const datasetId of difference) {
					// eslint-disable-next-line no-await-in-loop
					const dataset = await datasetService.getDatasetById(datasetId);
					commit(DATASET_MUTATIONS.UPDATE_DATASET_STATUS, {
						datasetId,
						jobStatus: dataset.latestScheduledJobRun,
						datasetInfo: dataset.info
					});
				}
				commit(DATASET_MUTATIONS.SET_RUNNING_JOBS, runningJobs);
				runningJobs.forEach((datasetId) => {
					commit('datasetCreate/setUploadDatasetProgress', {
						datasetId,
						progress: null
					}, {root: true});
					commit(DATASET_MUTATIONS.UPDATE_DATASET_STATUS, {
						datasetId,
						jobStatus: data[datasetId][0]
					});
				});
				commit(DATASET_MUTATIONS.SET_UPDATING_STATUS, false);
			}
		},
		async [DATASET_ACTIONS.LOAD_NEXT_SCHEDULED_JOBS]({commit}, datasetIds) {
			try {
				const jobs = await datasetService.nextSheduledJobs({
					params: {
						datasetIds: datasetIds.join(',')
					}
				});
				commit(DATASET_MUTATIONS.ADD_SCHEDULED_JOBS, jobs);
			} catch (error) {
				notify({
					type: 'danger',
					text: error?.response?.data?.error?.message ?? t('t_UnexpectedError'),
					duration: 5000
				});
			}
		},
		[DATASET_ACTIONS.RESET]({commit}) {
			commit(DATASET_MUTATIONS.RESET);
		}
	}
};

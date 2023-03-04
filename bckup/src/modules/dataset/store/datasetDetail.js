import {dimensionDefinition, ordering} from '@/util/queryBuilder';
import axios from 'axios';
import {TELLSTORY_ROW_ID} from '@/modules/dataset/utils/dataset';

const getInitialState = () => ({
	loading: false,
	dataset: null,
	error: null,
	tableData: null,
	tableError: null,
	tableLoading: false,
	tableLoadingMore: false,
	tableDataEnd: false,
	page: 0,
	pageLength: 40
});

export default {
	namespaced: true,
	state: getInitialState(),
	getters: {
		loading: (state) => state.loading,
		dataset: (state) => state.dataset,
		datasetColumn: (state) => (columnName) => state.dataset?.columns.find((col) => col.name === columnName) ?? null,
		error: (state) => state.error,
		tableData: (state) => state.tableData,
		tableError: (state) => state.tableError,
		tableLoading: (state) => state.tableLoading,
		tableLoadingMore: (state) => state.tableLoadingMore,
		tableDataEnd: (state) => state.tableDataEnd
	},
	mutations: {
		startLoading(state) {
			state.loading = true;
		},
		setDataset(state, dataset) {
			state.dataset = dataset;
			state.loading = false;
		},
		setError(state, error) {
			state.error = error;
			state.loading = false;
		},
		startTableLoading(state) {
			state.tableLoading = true;
		},
		startTableLoadingMore(state) {
			state.tableLoadingMore = true;
		},
		setTableData(state, tableData) {
			state.tableDataEnd = (!tableData || tableData.rows.length < state.pageLength);
			if (!state.tableData) {
				for (let i = 0; i < tableData.columns.length; i++) {
					for (let j = 0; j < state.dataset.columns.length; j++) {
						if (tableData.columns[i].reference === state.dataset.columns[j].name) {
							tableData.columns[i].visibilityState = state.dataset.columns[j].visibilityState;
							break;
						}
					}
				}
			}
			if (!tableData || !state.tableData) {
				state.tableData = tableData;
			} else {
				state.tableData.rows = state.tableData.rows.concat(tableData.rows);
			}
			state.tableLoading = false;
			state.tableLoadingMore = false;
		},
		setTableError(state, error) {
			state.TableError = error;
			state.TableLoading = false;
		},
		nextPage(state) {
			state.page += 1;
		},
		reset(state) {
			Object.assign(state, getInitialState());
		}
	},
	actions: {
		loadDataset({commit, dispatch}, id) {
			commit('reset');
			commit('startLoading');

			return axios.get(`/v0/datasets/${id}`)
				.then(({data}) => {
					commit('setDataset', data.data);
					return dispatch('loadTableData');
				})
				.catch(({response}) => {
					commit('setError', response?.data?.message ?? 'Can\'t load dataset');
					return Promise.resolve();
				});
		},
		loadTableData({commit, state}) {
			if (state.tableDataEnd) {
				return Promise.resolve();
			}

			if (state.page === 0) {
				commit('startTableLoading');
			} else {
				commit('startTableLoadingMore');
			}
			commit('nextPage');

			if (state.dataset.info === null) {
				commit('setTableError', true);
				return Promise.resolve();
			}

			const dimensions = state.dataset.columns.map((obj) => ({
				function: dimensionDefinition.NO_CHANGE,
				column: {
					name: obj.name,
					alias: obj.name
				}
			}));

			return axios.post('/v0/queries/fetch-data', {
				datasetInfoId: state.dataset.info.datasetInfoId,
				dimensions,
				metrics: [],
				ranking: [],
				limit: state.pageLength,
				offset: (state.page - 1) * state.pageLength,
				orderBy: [
					{
						columnAlias: TELLSTORY_ROW_ID,
						order: ordering.ASC
					}
				]
			})
				.then(({data}) => {
					commit('setTableData', data.data);
				})
				.catch(({response}) => {
					commit('setTableError', response?.data?.message ?? true);
					commit('setTableData', null);
					return Promise.resolve();
				});
		},
		loadDatasetDetail({commit}, id) {
			return axios.get(`/v0/datasets/${id}`)
				.then(({data}) => {
					commit('setDataset', data.data);
				})
				.catch(({response}) => {
					commit('setError', response?.data?.message ?? 'Can\'t load dataset');
					return Promise.resolve();
				});
		}
	}
};

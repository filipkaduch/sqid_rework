/* eslint-disable max-lines-per-function */
import axios from 'axios';
import {evaluateStatus} from '@/util/insightsUtil';
import {status} from '@/util/consts/status';
import router from '@/plugins/router';
import {privateRouteName} from '@/modules/story/components/presenter/consts';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';

const createLoadDataTimeout = (insightId, commit, dispatch) => {
	axios.get(`/v0/insights/results/${insightId}/latest`)
		.then(({data}) => {
			if (evaluateStatus(data.data) || (data.data?.results?.length === 0 && data.data?.status === status.CACHED)) {
				if (data.data.status === status.ERROR) {
					commit('setError', {
						insightId,
						error: 't_CantLoadData'
					});
				} else {
					commit('setData', {
						insightId,
						data: data.data
					});
				}
				commit('setDataUpdateTimeout', {
					insightId,
					timeout: null
				});
			} else {
				commit('setDataUpdateTimeout', {
					insightId,
					timeout: setTimeout(() => {
						createLoadDataTimeout(insightId, commit, dispatch);
					}, 3000)
				});
			}
		})
		.catch(() => {
			commit('setError', {
				insightId,
				error: 't_CantLoadData'
			});
		});
};

const getInitialState = () => ({
	insights: {}
});

export default {
	namespaced: true,
	state: getInitialState(),
	getters: {
		config: (state) => (insightId) => state.insights[insightId]?.config ?? null,
		configUpdateTimeout: (state) => (insightId) => state.insights[insightId]?.configUpdateTimeout ?? null,
		dataUpdateTimeout: (state) => (insightId) => state.insights[insightId]?.dataUpdateTimeout ?? null,
		data: (state) => (insightId) => state.insights[insightId]?.data ?? null,
		loading: (state) => (insightId) => state.insights[insightId]?.loading ?? false,
		error: (state) => (insightId) => state.insights[insightId]?.error ?? null
	},
	mutations: {
		setConfig(state, payload) {
			if (Object.keys(state.insights).includes(payload.insightId)) {
				state.insights[payload.insightId].config = payload.config;
				state.insights[payload.insightId].loading = false;
			} else {
				state.insights[payload.insightId] = {
					config: payload.config,
					data: null,
					loading: false,
					error: null
				};
			}
		},
		setDataUpdateTimeout(state, payload) {
			if (Object.keys(state.insights).includes(payload.insightId)) {
				state.insights[payload.insightId].dataUpdateTimeout = payload.timeout;
			} else {
				state.insights[payload.insightId] = {
					dataUpdateTimeout: payload.timeout,
					config: null,
					data: null,
					loading: false,
					error: null
				};
			}
		},
		setConfigUpdateTimeout(state, payload) {
			if (Object.keys(state.insights).includes(payload.insightId)) {
				state.insights[payload.insightId].configUpdateTimeout = payload.timeout;
			} else {
				state.insights[payload.insightId] = {
					configUpdateTimeout: payload.timeout,
					config: null,
					data: null,
					loading: false,
					error: null
				};
			}
		},
		setData(state, payload) {
			if (Object.keys(state.insights).includes(payload.insightId)) {
				state.insights[payload.insightId].data = payload.data;
				state.insights[payload.insightId].loading = false;
			} else {
				state.insights[payload.insightId] = {
					config: null,
					data: payload.data,
					loading: false,
					error: null
				};
			}
		},
		startLoading(state, insightId) {
			if (Object.keys(state.insights).includes(insightId)) {
				state.insights[insightId].loading = true;
			} else {
				state.insights[insightId] = {
					config: null,
					data: null,
					loading: true,
					error: null
				};
			}
		},
		setError(state, payload) {
			if (Object.keys(state.insights).includes(payload.insightId)) {
				state.insights[payload.insightId].loading = false;
				state.insights[payload.insightId].error = payload.error;
			} else {
				state.insights[payload.insightId] = {
					config: null,
					data: null,
					loading: false,
					error: payload.error
				};
			}
		},
		reset(state) {
			Object.assign(state, getInitialState());
		}
	},
	actions: {
		createNewInsight({commit, dispatch}, config) {
			return new Promise((resolve, reject) => {
				axios.post('/v0/insights/configurations/', config)
					.then(({data}) => {
						commit('setConfig', {
							insightId: data.data.id,
							config: data.data
						});

						dispatch('loadInsightData', data.data.id);
						resolve(data.data.id);
					})
					.catch(() => {
						reject();
					});
			});
		},
		async loadInsightConfig({commit, dispatch}, insightId) {
			commit('startLoading', insightId);
			const {data} = await axios.get(`/v0/insights/configurations/${insightId}`);
			commit('setConfig', {
				insightId: data.data.id,
				config: data.data
			});
			await dispatch('loadInsightData', data.data.id);
		},
		updateInsightConfig({commit, dispatch, getters}, payload) {
			if (!isEqual(
				payload.config,
				pick(getters.config(payload.insightId), [
					'availabilityMode',
					'configuration',
					'datasetId',
					'name',
					'type'
				])
			)) {
				if (getters.configUpdateTimeout(payload.insightId) !== null) {
					clearTimeout(getters.configUpdateTimeout(payload.insightId));
				}
				commit('setConfigUpdateTimeout', {
					insightId: payload.insightId,
					timeout: setTimeout(() => {
						commit('startLoading', payload.insightId);

						axios.put(`/v0/insights/configurations/${payload.insightId}`, payload.config)
							.then(({data}) => {
								commit('setConfig', {
									insightId: data.data.id,
									config: data.data
								});
								dispatch('loadInsightData', data.data.id);
							})
							.catch(() => {
								commit('setError', {
									insightId: payload.insightId,
									error: 't_CantLoadData'
								});
							})
							.finally(() => {
								commit('setConfigUpdateTimeout', {
									insightId: payload.insightId,
									timeout: null
								});
							});
					}, 1000)
				});
			}
		},
		loadInsightData({commit, dispatch, getters, rootGetters}, insightId) {
			commit('startLoading', insightId);
			const previewMode = router.history.current.name === privateRouteName;
			axios.get(`/v0/insights/results/${insightId}/${(rootGetters['storyDetail/readOnly'] && !previewMode)
				? `latest-by-story-sharing-record/${rootGetters['storyDetail/publishToken']}`
				: 'latest'}`)
				.then(({data}) => {
					if (evaluateStatus(data.data) || (data.data?.results !== null && data.data?.results?.length > 0)) {
						if (data.data.status === status.ERROR) {
							commit('setError', {
								insightId,
								error: 't_CantLoadData'
							});
						} else {
							commit('setData', {
								insightId,
								data: data.data
							});
						}

						commit('setDataUpdateTimeout', {
							insightId,
							timeout: null
						});
					} else if (getters.dataUpdateTimeout(insightId) === null
						|| (data.data?.results === null && (data.data?.status === status.IN_PROGRESS || data.data?.status === status.SUBMITTED))) {
						commit('setDataUpdateTimeout', {
							insightId,
							timeout: setTimeout(() => {
								createLoadDataTimeout(insightId, commit, dispatch);
							}, 3000)
						});
					} else {
						clearTimeout(getters.dataUpdateTimeout(insightId));
					}
				})
				.catch(() => {
					commit('setDataUpdateTimeout', {
						insightId,
						timeout: null
					});
					commit('setError', {
						insightId,
						error: 't_CantLoadData'
					});
				});
		}
	}
};

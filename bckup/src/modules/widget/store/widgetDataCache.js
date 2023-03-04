import axios from 'axios';
import {dimensionDefinition} from '@/util/queryBuilder';
import widgetDataConfigMapper from '@/util/widgetDataConfigMapper';
import {cloneDeep} from 'lodash';

const getInitialState = () => ({
	data: {}
});

export default {
	namespaced: true,
	state: getInitialState(),
	mutations: {
		setData(state, payload) {
			state.data[payload.id] = payload.data;
		},
		reset(state) {
			Object.assign(state, getInitialState());
		}
	},
	getters: {
		data: (state) => (id) => state.data[id] ?? null
	},
	actions: {
		newPreviewId({commit}) {
			const id = `p${Math.round(Math.random() * (50000))}`;

			commit('setData', {
				id,
				data: null
			});

			return id;
		},
		loadPreviewData({commit}, {previewConfiguration, id}) {
			if (previewConfiguration.data) {
				axios.post('widget/loadDataByConfiguration', previewConfiguration)
					.then(({data}) => {
						commit('setData', {
							id,
							data
						});
					});
			}
		},
		// eslint-disable-next-line max-lines-per-function
		loadData({commit, rootGetters}, payload) {
			const {widgetInstanceId} = payload;
			const configuration = cloneDeep(rootGetters['widgetInstances/configuration'](widgetInstanceId));

			if (!configuration || !configuration.data) {
				return;
			}

			commit('widgetInstances/setLoading', {
				widgetInstanceId,
				loading: true
			}, {root: true});

			const globalFilter = rootGetters['storyDetail/story'].configuration?.globalFilters ?? [];
			const dynamicFilter = payload.dynamicFilter ?? configuration?.options?.dynamicFilter?.filters ?? [];
			const filters = {
				globalFilter,
				staticFilter: configuration?.staticFilter,
				dynamicFilter
			};
			const widgetTypeMetadata = rootGetters['widgetMetadata/widgetTypeMetadata'](rootGetters['widgetInstances/widgetType'](widgetInstanceId));

			Promise.all(configuration.data.configuration.dimensions?.filter((dimension) => dimension.topValues).map((dimension) => axios.post(
				`/v0/queries/${rootGetters['widgetInstances/readOnly'] ? `story-token/${rootGetters['storyDetail/publishToken']}` : 'fetch-data'}`,
				{
					datasetInfoId: rootGetters['storyDetail/story'].datasets.find((dataset) => dataset.id === configuration.data.datasetId)?.info.datasetInfoId,
					dimensions: [
						{
							column: {
								name: dimension.column,
								alias: 'Dimension1'
							},
							function: dimensionDefinition.NO_CHANGE
						}
					],
					...(dimension.topValues.metric
						? {
							metrics: [
								{
									column: {
										name: dimension.topValues.metric.column,
										alias: 'Metric1'
									},
									aggregation: dimension.topValues.metric.aggregation
								}
							]
						}
						: {}),
					limit: dimension.topValues.count,
					orderBy: [
						{
							columnAlias: dimension.topValues.metric ? 'Metric1' : 'Dimension1',
							order: dimension.topValues.direction
						}
					]
				}
			)
				.then(({data: {data}}) => {
					const dimensionIndex = data.columns.map((column) => column.reference).indexOf('Dimension1');
					return {
						column: dimension.column,
						values: data.rows.map((row) => row[dimensionIndex])
					};
				})) ?? [])

				.then((topValues) => axios.post(
					`/v0/queries/${rootGetters['widgetInstances/readOnly'] ? `story-token/${rootGetters['storyDetail/publishToken']}` : 'fetch-data'}`,
					widgetDataConfigMapper(
						configuration.data,
						rootGetters['storyDetail/story'],
						filters,
						widgetTypeMetadata?.configuration?.data ?? null,
						topValues
					)
				))

				.then(({data}) => {
					commit('setData', {
						id: widgetInstanceId,
						data: data.data
					});
				})
				.catch((error) => {
					commit('widgetInstances/setError', {
						widgetInstanceId,
						error
					}, {root: true});
				});
		}
	}
};

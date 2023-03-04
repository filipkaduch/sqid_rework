import {dataTypes, isDataType} from '@/util/queryBuilder';
import widgetDataConfigMapper from '@/util/widgetDataConfigMapper';
import {getDataIndexes} from '@/modules/widget/utils/widget';
import {getTopValues} from '@/modules/widget/store/widgetData/utils';
import {widgetServices} from '@/modules/widget/widgetServices';
import {checkCumSum} from '@/util/echartsWidgetsUtil';
import {migrateColoring} from '@/util/widgetMigrations';
import {echartsTypes, widgetTypes} from '@/util/consts/widgetTypes';
import {checkColumnsInDataAsset, getDataAssetId, getDatasetType, hasValidDataAssetId} from '@/modules/widget/store/widgetInstances/utils';
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import uniqWith from 'lodash/uniqWith';
import {STORY_DETAIL_GETTERS, STORY_DETAIL_NAME} from '@/modules/story/store/types';
import {DATA_ASSETS} from '@/util/consts/dataAssetTypes';
import router from '@/plugins/router';
import {mapFiltersForFetchData} from '@/modules/widget/components/widget-controls/filter/utils';

const getInitialState = () => ({
	data: {},
	rawData: {},
	latestWidgetInstanceRequests: {}
});

export default {
	namespaced: true,
	state: getInitialState(),
	mutations: {
		setData(state, payload) {
			state.data[payload.id] = payload.data;
		},
		setRawData(state, payload) {
			state.rawData[payload.id] = payload.data;
		},
		setLatestWidgetInstanceRequest(state, {widgetInstanceId, requestConfiguration}) {
			state.latestWidgetInstanceRequests[widgetInstanceId] = requestConfiguration;
		},
		updateData(state, {widgetInstanceId, data}) {
			const newConfiguration = merge(state.data[widgetInstanceId], data);
			state.data[widgetInstanceId] = newConfiguration;
		},
		reset(state) {
			Object.assign(state, getInitialState());
		}
	},
	getters: {
		data: (state) => (id) => state.data[id] ?? null,
		rawData: (state) => (id) => state.rawData[id] ?? null,
		latestWidgetInstanceRequest: (state) => (widgetInstanceId) => state.latestWidgetInstanceRequests[widgetInstanceId] ?? null,
		getColumnData: (state) => (widgetInstanceId, columnIndex) => {
			const rawData = state.rawData ? state.rawData[widgetInstanceId] : null;
			if (rawData && columnIndex >= 0) {
				return rawData.rows.map((row) => [row[columnIndex]]);
			} else if (rawData && rawData.rows[0].length === 1) {
				return rawData.rows;
			}
			return [];
		}
	},
	actions: {
		// eslint-disable-next-line max-lines-per-function,max-statements, complexity
		async loadData({commit, rootGetters, getters, dispatch}, {widgetInstanceId, reloadData = false, drillDownFilter = null}) {
			const configuration = cloneDeep(rootGetters['widgetInstances/configuration'](widgetInstanceId));

			// insight by default doesn't have data, but it does not need data transformation
			if (!configuration || !configuration.data) {
				return;
			}

			const parentId = rootGetters['widgetInstances/parentId'](widgetInstanceId);
			const widgetType = rootGetters['widgetInstances/widgetType'](widgetInstanceId);
			const widgetTypeMetadata = rootGetters['widgetMetadata/widgetTypeMetadata'](widgetType);
			if (echartsTypes.includes(widgetType)) {
				dispatch('widgetInstances/setFinishedRender', {widgetInstanceId, isRenderFinished: false}, {root: true});
			}
			const datasetId = getDataAssetId(configuration.data);
			const dynamicFilter = uniqWith(
				rootGetters['widgetInstances/filter'](parentId, datasetId)
					.filter((filter) => widgetTypeMetadata?.configuration?.data?.unfilteredDynamicFilter || filter.widgetId !== widgetInstanceId),
				isEqual
			);

			// We need do remap filters if ther is new format
			const staticFiltersToSave = mapFiltersForFetchData(configuration.staticFilter);

			const filters = {
				globalFilter: rootGetters['storyDetail/story']?.configuration?.globalFilters ?? [],
				staticFilter: staticFiltersToSave,
				dynamicFilter: dynamicFilter ?? [],
				drillDownFilter
			};

			configuration.options = {
				...configuration.options,
				title: rootGetters['widgetInstances/instance'](widgetInstanceId).name
			};

			let multiSeriesMetric = null;
			if (widgetTypes.MULTISERIES_CHARTS.includes(widgetType)
				|| widgetType === widgetTypes.SPARKLINE_PIE) {
				multiSeriesMetric = configuration.data.configuration?.metrics[0];
			}

			let requestConfiguration = null;
			// custom metric you can not find in checkColumnsInDataAsset()
			const metrics = configuration.data.configuration?.metrics?.filter((metric) => metric.customExpressionEnabled === false) ?? [];
			const columnsToCheck = [...(configuration.data.configuration?.dimensions ?? []), ...(metrics)].map((elm) => elm.column);
			const datasetType = getDatasetType(configuration.data);

			let columnsInDataset = [];
			if (datasetId) {
				if (datasetType === DATA_ASSETS.DATASET) {
					columnsInDataset = rootGetters[`${STORY_DETAIL_NAME}/${STORY_DETAIL_GETTERS.DATASET}`](datasetId)?.columns?.map((elm) => elm.name) ?? [];
				} else if (datasetType === DATA_ASSETS.CATALOG_ITEM) {
					columnsInDataset = rootGetters[`${STORY_DETAIL_NAME}/${STORY_DETAIL_GETTERS.CATALOG_ITEM}`](datasetId).attributes.map((elm) => elm.name) ?? [];
				}
			}
			const performFetch = checkColumnsInDataAsset(columnsInDataset, columnsToCheck);

			if (performFetch && hasValidDataAssetId(configuration.data)) {
				// TODO: need to save requestOption configuration and compare against new. dataTransformation will be called just on changed par
				const findTopValues = await getTopValues(configuration.data, rootGetters, multiSeriesMetric, columnsInDataset);

				requestConfiguration = widgetDataConfigMapper(
					configuration.data,
					rootGetters['storyDetail/story'],
					filters,
					widgetTypeMetadata?.configuration?.data ?? null,
					findTopValues
				);
			}

			let data = null;
			if ((requestConfiguration && (isEqual(requestConfiguration, getters.latestWidgetInstanceRequest(widgetInstanceId)) && !reloadData))
				|| checkCumSum(rootGetters['widgetInstances/configuration'](widgetInstanceId))) {
				data = getters.rawData(widgetInstanceId);
			} else {
				commit('widgetInstances/setLoading', {
					widgetInstanceId,
					loading: true
				}, {root: true});
				try {
					let response = {
						data: {
							columns: [],
							rows: []
						}
					};

					if (performFetch) {
						if (rootGetters['widgetInstances/readOnly']) {
							response = await widgetServices.fetchDataPublished(rootGetters['storyDetail/publishToken'], requestConfiguration);
						} else if (configuration.data.configuration?.dimensions?.length > 0 || configuration.data.configuration?.metrics?.length > 0) {
							response = await widgetServices.fetchData(requestConfiguration);
						}
					}

					data = {...response.data};
					commit('setRawData', {
						id: widgetInstanceId,
						data
					});
					migrateColoring(widgetInstanceId);
				} catch (error) {
					commit('widgetInstances/setError', {
						widgetInstanceId,
						error
					}, {root: true});
				} finally {
					commit('setLatestWidgetInstanceRequest', {
						widgetInstanceId,
						requestConfiguration
					});
				}
			}

			if (data !== null && data.columns.length) {
				const widgetConfiguration = cloneDeep(rootGetters['widgetInstances/configuration'](widgetInstanceId)) ?? {};
				widgetConfiguration.options.title = rootGetters['widgetInstances/instance'](widgetInstanceId)?.name ?? 'Widget';

				const sortedData = cloneDeep(data);
				// default sort by date
				if ((widgetConfiguration.data.configuration?.orderBy?.length === 0 && widgetConfiguration.data.configuration?.dimensions?.length > 0)
					&& isDataType(dataTypes.DATE_TYPE, (sortedData.columns.find((col) => col.reference === 'Dimension1'))?.dataType)) {
					const dimensionIndex = sortedData.columns.map((column) => column.reference).indexOf('Dimension1');
					sortedData.rows.sort((val1, val2) => new Date(val1[dimensionIndex]) - new Date(val2[dimensionIndex]));
				}
				if (widgetType !== widgetTypes.WIDGET_PAGE) {
					const widget = rootGetters['dependencies/dependency'](widgetTypeMetadata.component);
					const colors = {
						coloring: rootGetters['widgetInstances/option'](widgetInstanceId, 'coloring'),
						theme: rootGetters['storyDetail/story'].layoutConfiguration.theme.colors.graph,
						metadata: widgetTypeMetadata.configuration?.colors
					};
					// Check if route has debug mode, if yes set warning and skip, data transformation
					if (router.currentRoute.value.query?.debug === '1' || checkCumSum(widgetConfiguration)) {
						commit('setData', {
							id: widgetInstanceId,
							data: {
								isWarning: true
							}
						});
					} else {
						commit('setData', {
							id: widgetInstanceId,
							data: await widget.widgetHooks?.dataTransformation?.(
								sortedData,
								widgetConfiguration,
								{
									colors,
									props: widgetTypeMetadata.props,
									dynamicFilter: rootGetters['widgetInstances/filter'](parentId, configuration.data.datasetId)
										.filter((item) => item.widgetId === widgetInstanceId),
									indexes: getDataIndexes(data.columns),
									widgetInstanceId,
									story: {
										datasets: rootGetters['storyDetail/story'].datasets ?? [],
										catalogItems: rootGetters['storyDetail/story'].catalogItems ?? []
									},
									widgetConfigurationData: widgetConfiguration.data
								}
							) ?? data
						});
					}
					commit('widgetInstances/setLoading', {
						widgetInstanceId,
						loading: false
					}, {root: true});
				}
			}
			commit('widgetInstances/setLoading', {
				widgetInstanceId,
				loading: false
			}, {root: true});
		},
		updateData({commit}, payload) {
			commit('updateData', payload);
		},
		// eslint-disable-next-line max-lines-per-function, max-statements
		async updateOptions({rootGetters, getters, commit}, {widgetInstanceId, optionName}) {
			const widgetConfiguration = cloneDeep(rootGetters['widgetInstances/configuration'](widgetInstanceId)) ?? {};
			widgetConfiguration.options.title = rootGetters['widgetInstances/instance'](widgetInstanceId)?.name;
			// insight by default have no data, but it also doesn't require data transformation
			if (!widgetConfiguration.data) {
				return;
			}

			const parentId = rootGetters['widgetInstances/parentId'](widgetInstanceId);
			const widgetTypeMetadata = rootGetters['widgetMetadata/widgetTypeMetadata'](rootGetters['widgetInstances/widgetType'](widgetInstanceId));
			const chartData = getters.data(widgetInstanceId);
			const rawData = getters.rawData(widgetInstanceId);

			const widget = rootGetters['dependencies/dependency'](widgetTypeMetadata.component);
			const colors = {
				coloring: rootGetters['widgetInstances/option'](widgetInstanceId, 'coloring'),
				theme: rootGetters['storyDetail/story'].layoutConfiguration.theme.colors.graph
			};

			if (chartData) {
				// Check if route has debug mode, if yes set warning and skip, data transformation
				const optionData = await widget.widgetHooks.applyOptions(
					rawData,
					widgetConfiguration,
					{
						colors,
						props: widgetTypeMetadata.props,
						dynamicFilter: rootGetters['widgetInstances/filter'](parentId, widgetConfiguration.data.datasetId)
							.filter((item) => item.widgetId === widgetInstanceId),
						indexes: getDataIndexes(rawData.columns),
						chartData,
						optionName
					}
				);

				commit('setData', {
					id: widgetInstanceId,
					data: optionData
				});
			}
		}
	}
};

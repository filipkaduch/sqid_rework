/* eslint-disable max-lines */
import axios from 'axios';
import {notify} from '@kyvg/vue3-notification';
import i18n from '@/plugins/i18n';
const {t} = i18n.global;
import {dynamicFilterModes} from '@/util/consts/dynamicFilter';
import widgetDataConfigurationAutomapper from '@/util/widgetDataConfigurationAutomapper';
import {
	WIDGET_INSTANCE_ACTIONS,
	WIDGET_INSTANCE_GETTERS,
	WIDGET_INSTANCE_MUTATIONS
} from '@/modules/widget/store/widgetInstances/types';
import {
	createUpdateConfigPromise,
	getPage,
	getPageId,
	updateConfiguration
} from '@/modules/widget/store/widgetInstances/utils';
import {STORY_DETAIL_GETTERS, STORY_DETAIL_NAME, STORY_DETAIL_ACTIONS} from '@/modules/story/store/types';
import {widgetServices} from '@/modules/widget/widgetServices';
import {getWidgetOptions} from '@/modules/story/utils/widgetUtils';
import _ from 'lodash';
import merge from 'lodash/merge';
import {storyServices} from '@/modules/story/storyServices';
import cloneDeep from 'lodash/cloneDeep';
import {DATASOURCES} from '@/modules/dataset/utils/datasetUtils';

const compatibleCharts = [
	'EChartsBarMultiseries',
	'EChartsLineMultiseries',
	'EChartsBar',
	'EChartsSparkline',
	'EChartsBubble'
];
const getInitialState = () => ({
	widgetInstances: {},
	selectedWidgetInstanceId: null,
	sizeSelectedWidget: {},
	selectedWidgetInstanceStates: {},
	selectedPageId: null,
	readOnly: false
});
// eslint-disable-next-line max-lines-per-function
const createWidgetInstance = ({commit, dispatch, rootGetters = {}}, widget, preload = false) => {
	const filters = widget?.filters ? widget?.filters : {};

	if (widget.widgetDataConfigurations?.length > 0 && widget.widgetConfiguration?.dynamicFilter) {
		const filter = {};

		widget.widgetConfiguration.dynamicFilter.columns.forEach((column) => {
			filter[column] = widget.widgetConfiguration.dynamicFilter.filters;
		});

		filters[widget.widgetDataConfigurations[0].datasetId] = filter;
	}
	const instanceData = {
		id: widget.id,
		widgetType: widget.widgetType ?? 'widget_page',
		name: widget.name,
		position: {
			x: widget.layoutConfiguration?.position?.x ?? 0,
			y: widget.layoutConfiguration?.position?.y ?? 0,
			z: Math.min(Math.max(widget.layoutConfiguration?.position?.z ?? 0, 0), 100)
		},
		size: {
			width: widget.layoutConfiguration?.size?.width ?? 0.10,
			height: widget.layoutConfiguration?.size?.height ?? 0.10
		},
		rotation: widget.layoutConfiguration?.rotation ?? 0,
		loading: false,
		error: null,
		warning: null,
		configuration: {
			data: widget.widgetDataConfigurations?.[0] ?? null,
			options: (widget.widgetType ? widget.widgetConfiguration : widget.configuration) ?? {},
			staticFilter: widget.filters ?? null
		},
		parentId: widget.parentId,
		filters,
		...(widget.widgetType ? {} : {widgetOrder: widget.widgetOrder})
	};

	const widgetTypeMetadata = rootGetters['widgetMetadata/widgetTypeMetadata'](instanceData.widgetType);
	if (widgetTypeMetadata?.options && !preload) {
		instanceData.configuration.options = getWidgetOptions(widgetTypeMetadata.options, {...instanceData.configuration.options});
	}
	commit('addInstance', {
		id: widget.id,
		name: widget.name,
		instance: instanceData
	});
	if (widget.widgetDataConfigurations?.length > 0 && !preload) {
		dispatch('widgetData/loadData', {widgetInstanceId: widget.id}, {root: true});
	}
};
export default {
	namespaced: true,
	state: getInitialState(),
	mutations: {
		[WIDGET_INSTANCE_MUTATIONS.SET_RESIZE](state, payload) {
			state.sizeSelectedWidget = payload;
		},
		[WIDGET_INSTANCE_MUTATIONS.DELETE_OPTION](state, payload) {
			if (state.widgetInstances[payload.widgetInstanceId]) {
				delete state.widgetInstances[payload.widgetInstanceId].configuration.options[payload.optionName];
			}
		},
		[WIDGET_INSTANCE_MUTATIONS.SET_OPTION](state, payload) {
			if (state.widgetInstances[payload.widgetInstanceId]) {
				state.widgetInstances[payload.widgetInstanceId].configuration.options[payload.optionName] = payload.value;
			}
		},
		[WIDGET_INSTANCE_MUTATIONS.SET_POSITION](state, payload) {
			state.widgetInstances[payload.widgetInstanceId].position = payload.position;
			state.widgetInstances[payload.widgetInstanceId].position.z = Math.min(
				Math.max(
					Math.round(state.widgetInstances[payload.widgetInstanceId].position.z ?? 0),
					0
				),
				100
			);
		},
		[WIDGET_INSTANCE_MUTATIONS.SET_SIZE](state, payload) {
			state.widgetInstances[payload.widgetInstanceId].size = payload.size;
		},
		[WIDGET_INSTANCE_MUTATIONS.SET_ROTATION](state, payload) {
			state.widgetInstances[payload.widgetInstanceId].rotation = payload.rotation;
		},
		[WIDGET_INSTANCE_MUTATIONS.SET_CONFIGURATION](state, payload) {
			if (state.widgetInstances[payload.widgetInstanceId]) {
				if (payload.name) {
					state.widgetInstances[payload.widgetInstanceId].name = payload.name;
				}
				state.widgetInstances[payload.widgetInstanceId].configuration.data = payload?.configuration?.data ?? null;
				state.widgetInstances[payload.widgetInstanceId].configuration.staticFilter = payload?.configuration?.staticFilter ?? null;
				state.widgetInstances[payload.widgetInstanceId].configuration.options = payload?.configuration?.options ?? {};
			}
		},
		[WIDGET_INSTANCE_MUTATIONS.REMOVE_TIMELINE](state, payload) {
			if (state.widgetInstances[payload.widgetInstanceId]) {
				delete state.widgetInstances[payload.widgetInstanceId].configuration.options[payload.optionName];
			}
			delete state.widgetInstances[payload.widgetInstanceId].configuration.data.configuration.timeline;
		},
		[WIDGET_INSTANCE_MUTATIONS.SET_LOADING](state, payload) {
			state.widgetInstances[payload.widgetInstanceId].loading = payload.loading;
			state.widgetInstances[payload.widgetInstanceId].error = null;
			state.widgetInstances[payload.widgetInstanceId].warning = null;
		},
		[WIDGET_INSTANCE_MUTATIONS.SET_FINISHED_RENDER](state, payload) {
			state.widgetInstances[payload.widgetInstanceId].finishedRender = payload.isRenderFinished;
		},
		[WIDGET_INSTANCE_MUTATIONS.SET_ERROR](state, payload) {
			if (state.widgetInstances[payload.widgetInstanceId]) {
				state.widgetInstances[payload.widgetInstanceId].error = payload.error;
				state.widgetInstances[payload.widgetInstanceId].loading = false;
			}
		},
		[WIDGET_INSTANCE_MUTATIONS.SET_WARNING](state, payload) {
			if (state.widgetInstances[payload.widgetInstanceId]) {
				state.widgetInstances[payload.widgetInstanceId].warning = payload.warning;
				state.widgetInstances[payload.widgetInstanceId].loading = false;
			}
		},
		[WIDGET_INSTANCE_MUTATIONS.SET_SAVING_TIMEOUT](state, payload) {
			state.widgetInstances[payload.widgetInstanceId].savingTimeout = payload.timeout;
		},
		[WIDGET_INSTANCE_MUTATIONS.SELECT_WIDGET_INSTANCE](state, {widgetInstanceId, state: widgetState = 1}) {
			state.selectedWidgetInstanceId = widgetInstanceId;
			if (widgetInstanceId !== null && Object.keys(state?.widgetInstances).length > 0 && state.widgetInstances[widgetInstanceId]) {
				state.selectedPageId = state.widgetInstances[widgetInstanceId].parentId;
				state.selectedWidgetInstanceStates[state.selectedPageId] = {
					widgetInstanceId,
					state: widgetState
				};
			}
		},
		[WIDGET_INSTANCE_MUTATIONS.ADD_INSTANCE](state, {id, instance}) {
			state.widgetInstances[id] = instance;
		},
		[WIDGET_INSTANCE_MUTATIONS.SET_WIDGET_ORDER](state, {id, widgetOrder}) {
			state.widgetInstances[id].widgetOrder = widgetOrder;
		},
		[WIDGET_INSTANCE_MUTATIONS.REMOVE_INSTANCE](state, id) {
			delete state.widgetInstances[id];
		},
		[WIDGET_INSTANCE_MUTATIONS.SELECT_PAGE](state, pageId) {
			state.selectedPageId = pageId;
			state.selectedWidgetInstanceId = state.selectedWidgetInstanceStates[pageId]?.widgetInstanceId ?? null;
		},
		[WIDGET_INSTANCE_MUTATIONS.SET_FILTER](state, payload) {
			if (!state.widgetInstances[payload.widgetInstanceId].filters[payload.dataset]) {
				state.widgetInstances[payload.widgetInstanceId].filters[payload.dataset] = {};
			}
			if (payload.filter === null) {
				if (state.widgetInstances[payload.widgetInstanceId].filters[payload.dataset][payload.column]) {
					delete state.widgetInstances[payload.widgetInstanceId].filters[payload.dataset][payload.column];
				}
			} else {
				if (state.widgetInstances[payload.widgetInstanceId].filters[payload.dataset][payload.column]) {
					const oldWidgetId = state.widgetInstances[payload.widgetInstanceId].filters[payload.dataset][payload.column].widgetId;
					Object.keys(state.widgetInstances[payload.widgetInstanceId].filters[payload.dataset]).forEach((column) => {
						if (
							(column !== payload.column)
							&& (state.widgetInstances[payload.widgetInstanceId].filters[payload.dataset][column].widgetId === oldWidgetId)
						) {
							delete state.widgetInstances[payload.widgetInstanceId].filters[payload.dataset][column];
						}
					});
				}
				state.widgetInstances[payload.widgetInstanceId].filters[payload.dataset][payload.column] = payload.filter;
			}
		},
		[WIDGET_INSTANCE_MUTATIONS.SET_READONLY](state) {
			state.readOnly = true;
		},
		[WIDGET_INSTANCE_MUTATIONS.RESET](state) {
			const {readOnly} = state;
			Object.assign(state, getInitialState());
			state.readOnly = readOnly;
		},
		[WIDGET_INSTANCE_MUTATIONS.RESET_WIDGET_FILTERS](state, widgetInstanceId) {
			const {parentId} = state.widgetInstances[widgetInstanceId];

			// eslint-disable-next-line guard-for-in
			for (const dataset in state.widgetInstances?.[parentId]?.filters) {
				const filters = state.widgetInstances?.[parentId]?.filters?.[dataset];
				if (filters) {
					for (const column in filters) {
						if (filters[column].widgetId === widgetInstanceId) {
							delete state.widgetInstances[parentId].filters[dataset][column];
						}
					}
				}
			}
		}
	},
	getters: {
		[WIDGET_INSTANCE_GETTERS.SIZE_SELECTED_WIDGET]: (state) => state.sizeSelectedWidget,
		[WIDGET_INSTANCE_GETTERS.OPTION]:
			(state) => (widgetInstanceId, optionName) => state.widgetInstances[widgetInstanceId]?.configuration?.options?.[optionName] ?? null,
		[WIDGET_INSTANCE_GETTERS.OPTIONS]: (state) => (widgetInstanceId) => state.widgetInstances[widgetInstanceId]?.configuration?.options ?? {},
		[WIDGET_INSTANCE_GETTERS.WIDGET_TYPE]: (state) => (widgetInstanceId) => state.widgetInstances[widgetInstanceId]?.widgetType ?? null,
		[WIDGET_INSTANCE_GETTERS.POSITION]: (state) => (widgetInstanceId) => state.widgetInstances[widgetInstanceId]?.position ?? null,
		[WIDGET_INSTANCE_GETTERS.SIZE]: (state) => (widgetInstanceId) => state.widgetInstances[widgetInstanceId]?.size ?? null,
		[WIDGET_INSTANCE_GETTERS.ROTATION]: (state) => (widgetInstanceId) => state.widgetInstances[widgetInstanceId]?.rotation ?? null,
		[WIDGET_INSTANCE_GETTERS.CONFIGURATION]: (state) => (widgetInstanceId) => state.widgetInstances[widgetInstanceId]?.configuration ?? null,
		[WIDGET_INSTANCE_GETTERS.LAYOUT_CONFIGURATION]: (state, getters) => (widgetInstanceId) => (state.widgetInstances[widgetInstanceId]
			? {
				size: getters.size(widgetInstanceId),
				position: getters.position(widgetInstanceId),
				rotation: getters.rotation(widgetInstanceId)
			}
			: null),
		[WIDGET_INSTANCE_GETTERS.LOADING]: (state) => (widgetInstanceId) => state.widgetInstances[widgetInstanceId]?.loading ?? false,
		[WIDGET_INSTANCE_GETTERS.ERROR]: (state) => (widgetInstanceId) => state.widgetInstances[widgetInstanceId]?.error ?? null,
		[WIDGET_INSTANCE_GETTERS.WARNING]: (state) => (widgetInstanceId) => state.widgetInstances[widgetInstanceId]?.warning ?? null,
		[WIDGET_INSTANCE_GETTERS.FINISHED_RENDER]: (state) => (widgetInstanceId) => state.widgetInstances[widgetInstanceId]?.finishedRender ?? null,
		[WIDGET_INSTANCE_GETTERS.SAVING_TIMEOUT]: (state) => (widgetInstanceId) => state.widgetInstances[widgetInstanceId]?.savingTimeout ?? null,
		[WIDGET_INSTANCE_GETTERS.PAGE_WIDGET_INSTANCE_IDS]:
			(state, getters, rootState, rootGetters) => rootGetters[`${STORY_DETAIL_NAME}/${STORY_DETAIL_GETTERS.STORY}`]?.sectionOrder
				.filter((sectionId) => state.widgetInstances[sectionId]?.widgetType === 'widget_page') ?? [],
		[WIDGET_INSTANCE_GETTERS.WIDGET_INSTANCE_IDS]: (state, getters, rootState, rootGetters) => {
			const result = {};
			getters.pageWidgetInstanceIds.forEach((sectionId) => {
				result[sectionId] = state.widgetInstances[sectionId]?.widgetOrder
					.filter((widgetInstanceId) => (rootGetters['widgetMetadata/widgetTypeMetadata'](state.widgetInstances[widgetInstanceId]?.widgetType) !== null));
			});
			return result;
		},
		[WIDGET_INSTANCE_GETTERS.PAGE_HEIGHT_RATIO]: (state) => (widgetInstanceId) => state.widgetInstances[state.widgetInstances[widgetInstanceId].parentId]
			.configuration.options?.heightRatio ?? 1,
		[WIDGET_INSTANCE_GETTERS.SELECTED_WIDGET_INSTANCE_ID]: (state) => state.selectedWidgetInstanceId,
		[WIDGET_INSTANCE_GETTERS.SELECTED_WIDGET_INSTANCE_IDS]: (state) => {
			const result = {};
			// eslint-disable-next-line guard-for-in
			for (const pageWidgetInstanceId in state.selectedWidgetInstanceStates) {
				result[pageWidgetInstanceId] = state.selectedWidgetInstanceStates[pageWidgetInstanceId].widgetInstanceId;
			}
			return result;
		},
		[WIDGET_INSTANCE_GETTERS.WIDGET_INSTANCE_STATE]: (state) => (widgetInstanceId) => {
			const parentId = state.widgetInstances[widgetInstanceId]?.parentId ?? null;
			const pageState = parentId ? (state.selectedWidgetInstanceStates[parentId] ?? null) : null;
			return pageState && pageState.widgetInstanceId === widgetInstanceId ? pageState.state : 1;
		},
		[WIDGET_INSTANCE_GETTERS.SELECTED_PAGE_WIDGET_INSTANCE_ID]: (state, getters) => state.selectedPageId ?? getters.pageWidgetInstanceIds[0],
		[WIDGET_INSTANCE_GETTERS.SELECTED_PAGE]: (state) => getPage(state.selectedPageId),
		[WIDGET_INSTANCE_GETTERS.PAGE_COUNT]: (state) => Object.keys(state.widgetInstances)
			.filter((widgetInstanceId) => (state.widgetInstances[widgetInstanceId].widgetType === 'widget_page')).length,
		[WIDGET_INSTANCE_GETTERS.PARENT_ID]: (state) => (widgetInstanceId) => state.widgetInstances[widgetInstanceId]?.parentId ?? null,
		[WIDGET_INSTANCE_GETTERS.INSTANCE]: (state) => (widgetInstanceId) => state.widgetInstances?.[widgetInstanceId] ?? null,
		[WIDGET_INSTANCE_GETTERS.READONLY]: (state) => state.readOnly,
		filter: (state) => (widgetInstanceId, dataset) => Object.values(state.widgetInstances[widgetInstanceId]?.filters?.[dataset] ?? {}),
		// eslint-disable-next-line no-unused-vars
		isFilterOnPage: (state) => (pageId) => {
			if (state.widgetInstances && pageId !== 'end-section' && state?.widgetInstances[pageId]?.filters) {
				return Object.keys(state?.widgetInstances[pageId]?.filters).some((datasetId) => Object
					.keys(state.widgetInstances[pageId].filters[datasetId]).length > 0);
			}
			return false;
		}
	},
	actions: {
		[WIDGET_INSTANCE_ACTIONS.SET_WRAP_INSTANCES]({commit, dispatch, rootGetters}) {
			const story = cloneDeep(rootGetters[`${STORY_DETAIL_NAME}/${STORY_DETAIL_GETTERS.STORY}`]);
			const instances = story.sections.map((section) => merge(section, {parentId: story.id}));
			commit('reset');
			for (const instance of instances) {
				createWidgetInstance({
					commit,
					dispatch,
					rootGetters
				}, instance, true);
			}
			const widgets = instances.map((instance) => instance.widgets.map((widget) => merge(widget, {parentId: instance.id})))
				.flat(1);
			for (const widget of widgets) {
				createWidgetInstance({
					commit,
					dispatch,
					rootGetters
				}, widget, true);
				if (widget.widgetType === 'widget_insight_formula') {
					// eslint-disable-next-line no-await-in-loop
					dispatch('insightData/loadInsightData', widget.widgetConfiguration.insightId, {root: true});
				}
			}
		},
		[WIDGET_INSTANCE_ACTIONS.SET_WIDGET_INSTANCES]({commit, dispatch, getters, rootGetters}, widgets) {
			for (const widget of widgets) {
				if (!getters.widgetInstanceIds[widget.parentId].find((loadedWidget) => loadedWidget === widget.id)) {
					// eslint-disable-next-line no-await-in-loop
					createWidgetInstance({
						commit,
						dispatch,
						rootGetters
					}, widget, true);
				}
				if (widget.widgetType === 'widget_insight_formula') {
					// eslint-disable-next-line no-await-in-loop
					dispatch('insightData/loadInsightData', widget.widgetConfiguration.insightId, {root: true});
				}
			}
		},
		[WIDGET_INSTANCE_ACTIONS.SELECT_WIDGET_INSTANCE]({commit, state}, widgetInstanceId) {
			if (widgetInstanceId !== null) {
				commit(WIDGET_INSTANCE_MUTATIONS.SELECT_WIDGET_INSTANCE, {widgetInstanceId});
			}
		},
		[WIDGET_INSTANCE_ACTIONS.SET_WIDGET_INSTANCE_STATE]({commit}, payload) {
			commit(WIDGET_INSTANCE_MUTATIONS.SELECT_WIDGET_INSTANCE, payload);
		},
		[WIDGET_INSTANCE_ACTIONS.SET_POSITION]({commit, getters, state, dispatch}, payload) {
			const position = {
				x: Math.round((payload.position.x ?? 0) * 10000000000) / 10000000000,
				y: Math.round((payload.position.y ?? 0) * 10000000000) / 10000000000,
				z: payload.position.z ?? 0
			};

			if (_.isEqual(state.widgetInstances[payload.widgetInstanceId].position, position)) {
				return Promise.resolve(false);
			}
			commit(WIDGET_INSTANCE_MUTATIONS.SET_POSITION, {
				widgetInstanceId: payload.widgetInstanceId,
				position
			});

			return createUpdateConfigPromise(payload);
		},
		[WIDGET_INSTANCE_ACTIONS.SET_FINISHED_RENDER]({commit}, payload) {
			commit(WIDGET_INSTANCE_MUTATIONS.SET_FINISHED_RENDER, payload);
		},
		[WIDGET_INSTANCE_ACTIONS.SET_SIZE]({commit, getters, state, dispatch}, payload) {
			const size = {
				width: Math.round((payload.size.width ?? 1) * 10000000000) / 10000000000,
				height: Math.round((payload.size.height ?? 1) * 10000000000) / 10000000000
			};

			if (_.isEqual(state.widgetInstances[payload.widgetInstanceId].size, size)) {
				return Promise.resolve(false);
			}
			commit(WIDGET_INSTANCE_MUTATIONS.SET_SIZE, {
				widgetInstanceId: payload.widgetInstanceId,
				size
			});

			return createUpdateConfigPromise(payload);
		},
		[WIDGET_INSTANCE_ACTIONS.ADD_INSTANCE]({commit}, payload) {
			commit(WIDGET_INSTANCE_MUTATIONS.ADD_INSTANCE, payload);
		},
		[WIDGET_INSTANCE_ACTIONS.SET_ROTATION]({commit, getters, state, dispatch}, payload) {
			const rotation = payload.rotation ?? 0;
			if (_.isEqual(state.widgetInstances[payload.widgetInstanceId].rotation, rotation)) {
				return Promise.resolve(false);
			}

			commit(WIDGET_INSTANCE_MUTATIONS.SET_ROTATION, payload);

			return createUpdateConfigPromise(payload);
		},
		async [WIDGET_INSTANCE_ACTIONS.DELETE_OPTION]({commit, getters, state, dispatch}, payload) {
			commit(WIDGET_INSTANCE_MUTATIONS.SET_OPTION, payload);
			const reload = await createUpdateConfigPromise(payload, true);
			if (reload) {
				dispatch('widgetData/loadData', {
					widgetInstanceId: payload.widgetInstanceId,
					reloadData: payload.reloadData
				}, {root: true});
			}
		},
		async [WIDGET_INSTANCE_ACTIONS.REMOVE_TIMELINE]({commit, getters, state, dispatch}, payload) {
			commit(WIDGET_INSTANCE_MUTATIONS.REMOVE_TIMELINE, payload);
			const reload = await createUpdateConfigPromise(payload, true);
			if (reload) {
				dispatch('widgetData/loadData', {
					widgetInstanceId: payload.widgetInstanceId,
					reloadData: payload.reloadData
				}, {root: true});
			}
		},
		async [WIDGET_INSTANCE_ACTIONS.SET_OPTION]({commit, getters, rootGetters, state, dispatch}, payload) {
			const widgetTypeMetadata = rootGetters['widgetMetadata/widgetTypeMetadata'](getters.widgetType(payload.widgetInstanceId)) ?? {};
			const needReload = typeof widgetTypeMetadata.options[payload.optionName]?.needReload === 'undefined'
				? true
				: widgetTypeMetadata.options[payload.optionName].needReload;

			const needSaveConfig = typeof widgetTypeMetadata.options[payload.optionName]?.needSaveConfiguration === 'undefined'
				? true
				: widgetTypeMetadata.options[payload.optionName]?.needSaveConfiguration;

			const needFetch = typeof widgetTypeMetadata.options[payload.optionName]?.needFetch === 'undefined'
				? true
				: widgetTypeMetadata.options[payload.optionName]?.needFetch;

			const reloadObject = {
				reload: needReload,
				config: needSaveConfig,
				data: needFetch
			};
			commit(WIDGET_INSTANCE_MUTATIONS.SET_OPTION, payload);

			const reload = await createUpdateConfigPromise(payload, reloadObject.reload);
			if (compatibleCharts.includes(widgetTypeMetadata.component) && !reloadObject.reload) {
				await dispatch('widgetData/updateOptions', {
					widgetInstanceId: payload.widgetInstanceId,
					optionName: payload.optionName
				}, {root: true});
			} else if (reload || reloadObject.reload) {
				// TODO reload only data after options clean-up, saveConfig},
				await dispatch('widgetData/loadData', {
					widgetInstanceId: payload.widgetInstanceId,
					reloadObject: reloadObject.data
				}, {root: true});
			}
		},
		[WIDGET_INSTANCE_ACTIONS.SET_NAME]({commit, getters, state, dispatch}, payload) {
			try {
				updateConfiguration(payload.widgetInstanceId, {
					...state.widgetInstances[payload.widgetInstanceId],
					name: payload.name
				});
			} catch (err) {
				notify({
					type: 'danger',
					text: err?.response?.data?.error?.message ?? t('t_UnexpectedError'),
					duration: 5000
				});
			} finally {
				commit(WIDGET_INSTANCE_MUTATIONS.SET_CONFIGURATION, {
					widgetInstanceId: payload.widgetInstanceId,
					name: payload.name,
					configuration: state.widgetInstances[payload.widgetInstanceId]?.configuration
				});
			}
		},
		// eslint-disable-next-line max-lines-per-function
		[WIDGET_INSTANCE_ACTIONS.SET_CONFIGURATION]({commit, getters, state, dispatch}, payload) {
			const newConfiguration = _.cloneDeep(state.widgetInstances[payload.widgetInstanceId]?.configuration);
			if (newConfiguration) {
				newConfiguration.data = newConfiguration.data || {};
				if (payload.configuration?.data?.configuration) {
					newConfiguration.data.configuration = payload.configuration.data.configuration;
				}
				if (payload.configuration?.options) {
					newConfiguration.options = payload.configuration.options;
				}
				if (payload.configuration?.data?.datasetId) {
					newConfiguration.data.datasetId = payload.configuration.data.datasetId;
					newConfiguration.data.catalogItemId = null;
				}
				if (payload.configuration?.data?.catalogItemId) {
					newConfiguration.data.datasetId = null;
					newConfiguration.data.catalogItemId = payload.configuration.data.catalogItemId;
				}
				if (!_.isEqual(
					newConfiguration.configuration?.staticFilter,
					payload.configuration?.staticFilter
				)) {
					newConfiguration.staticFilter = payload.configuration.staticFilter;
				}
			}
			const needReload = !_.isEqual(
				state.widgetInstances[payload.widgetInstanceId]?.configuration.data,
				newConfiguration?.data
			) || !_.isEqual(
				state.widgetInstances[payload.widgetInstanceId]?.configuration.staticFilter,
				newConfiguration?.staticFilter
			);
			if (newConfiguration) {
				commit(WIDGET_INSTANCE_MUTATIONS.SET_CONFIGURATION, {
					widgetInstanceId: payload.widgetInstanceId,
					...(payload.name ? {name: payload.name} : {}),
					configuration: newConfiguration
				});
				// TODO: Verify this change properly
				createUpdateConfigPromise(payload, needReload).finally(() => dispatch('widgetData/loadData', {widgetInstanceId: payload.widgetInstanceId}, {root: true}));
			}
		},
		async [WIDGET_INSTANCE_ACTIONS.SET_INSTANCES]({commit, dispatch, rootGetters}, instances) {
			const widgets = instances.map((instance) => instance.widgets.map((widget) => merge(widget, {parentId: instance.id})))
				.flat(1);
			commit(WIDGET_INSTANCE_MUTATIONS.RESET);
			for (const instance of instances) {
				// eslint-disable-next-line no-await-in-loop
				createWidgetInstance({
					commit,
					dispatch,
					rootGetters
				}, instance, false);
			}
			for (const widget of widgets) {
				// eslint-disable-next-line no-await-in-loop
				await createWidgetInstance({
					commit,
					dispatch,
					rootGetters
				}, widget, false);
				if (widget.widgetType === 'widget_insight_formula') {
					// eslint-disable-next-line no-await-in-loop
					await dispatch('insightData/loadInsightData', widget.widgetConfiguration.insightId, {root: true});
				}
			}
		},
		[WIDGET_INSTANCE_ACTIONS.CREATE_WIDGET_INSTANCE](
			{commit, dispatch, rootGetters},
			configuration
		) {
			createWidgetInstance(
				{
					commit,
					dispatch,
					rootGetters
				},
				configuration
			);
		},
		// TODO: need refactor whole fnc
		// eslint-disable-next-line max-lines-per-function,complexity
		async [WIDGET_INSTANCE_ACTIONS.CREATE_NEW_INSTANCE](
			{commit, getters, rootGetters, dispatch},
			{widgetType, configuration = null, index = null}
		) {
			const storyDetail = rootGetters['storyDetail/story'];
			const widgetTypeMetadata = rootGetters['widgetMetadata/widgetTypeMetadata'](widgetType) ?? {};
			let widgetAutomappedDataConfiguration = null;
			// Add condition to check if there is any catalogItem
			if (widgetTypeMetadata.configuration?.data && (storyDetail.datasets.length > 0 || storyDetail.catalogItems.length > 0) && !configuration?.data) {
				const tmpConfiguration = await widgetDataConfigurationAutomapper(widgetTypeMetadata.configuration.data, storyDetail, widgetType);
				widgetAutomappedDataConfiguration = {
					...(tmpConfiguration?.datasetId ? {datasetId: tmpConfiguration.datasetId} : {}),
					...(tmpConfiguration?.catalogItemId ? {catalogItemId: tmpConfiguration.catalogItemId} : {}),
					dataConfiguration: tmpConfiguration.configuration
				};
			}
			return axios.post(widgetType === 'widget_page'
				? `/v0/sections/${storyDetail.id}`
				: `/v0/widgets/${getters.selectedPageWidgetInstanceId}`, {
				...(Number.isInteger(index) ? {atIndex: index} : {}),
				name: widgetType === 'widget_page' ? t('t_Section') : configuration?.name ? configuration.name : t(`widgetTypes.${widgetType}_title`),
				[widgetType === 'widget_page' ? 'configuration' : 'widgetConfiguration']: {
					version: 'default/v0',
					...(configuration?.options ?? {isDefaultName: true, ...(widgetType === 'widget_page' ? {} : {displayName: false})})
				},
				...(widgetType === 'widget_page'
					? {}
					: {
						widgetType,
						dataConfigurations: widgetAutomappedDataConfiguration
							? [widgetAutomappedDataConfiguration]
							: configuration && configuration.data
								? [
									{
										dataConfiguration: configuration.data?.configuration,
										datasetId: configuration.data?.datasetId,
										catalogItemId: configuration.data?.catalogItemId
									}
								]
								: [],
						filters: configuration && configuration.staticFilter ? {...configuration.staticFilter, version: 'default/v1'} : {version: 'default/v1'}
					}),
				layoutConfiguration: {
					version: 'default/v0',
					...(widgetType === 'widget_page'
						? {}
						: {
							size: {
								width: configuration?.layout?.size?.width
									?? (storyDetail.storyType === 'data-dashboard'
										? ((widgetTypeMetadata.initialize?.size?.width ?? 350) / storyDetail.layoutConfiguration.dimensions.width)
										: 1),
								height: configuration?.layout?.size?.height
									?? (storyDetail.storyType === 'data-dashboard'
										? ((widgetTypeMetadata.initialize?.size?.height ?? 450) / storyDetail.layoutConfiguration.dimensions.height)
										: 1)
							},
							position: {
								x: configuration?.layout?.position?.x ?? 0,
								y: configuration?.layout?.position?.y ?? 0,
								z: configuration?.layout?.position?.z ?? 0
							},
							rotation: configuration?.layout?.rotation ?? 0
						})
				}
			})
				.then(({data: {data}}) => ((widgetType === 'widget_page')
					? dispatch('storyDetail/reloadSectionOrder', null, {root: true})
					: dispatch('reloadWidgetOrder', getters.selectedPageWidgetInstanceId)).then(() => Promise.resolve(data)))
				.then((data) => {
					createWidgetInstance(
						{
							commit,
							dispatch,
							rootGetters
						},
						merge(data, {parentId: (widgetType === 'widget_page') ? rootGetters['storyDetail/story'].id : getters.selectedPageWidgetInstanceId})
					);

					if (widgetType === 'widget_page') {
						dispatch('selectPage', getPage(data.id));
					} else {
						dispatch('selectWidgetInstance', data.id);
					}

					dispatch('storyDetail/reloadData', {
						id: storyDetail.id,
						setInstances: false
					}, {root: true});
					return {
						id: `${data.id}`
					};
				});
		},
		async [WIDGET_INSTANCE_ACTIONS.DUPLICATE_SECTION]({getters, dispatch}, payload) {
			await storyServices.duplicateStorySection(payload.storyId, payload.sectionId);
			await dispatch('storyDetail/reloadData', {
				id: payload.storyId,
				setInstances: true
			}, {root: true});
		},
		async [WIDGET_INSTANCE_ACTIONS.MOVE_STEP_TO_ANOTHER_SECTION]({dispatch, rootGetters}, payload) {
			const data = await storyServices.moveStepToAnotherStorySection(payload.storyId, payload.sectionId, payload.widgetId, payload.newParent);
			const mergedData = _.merge(_.pick(rootGetters[`${STORY_DETAIL_NAME}/${STORY_DETAIL_GETTERS.STORY}`], [DATASOURCES.DATASETS, DATASOURCES.CATALOG_ITEMS]), data);
			await dispatch(`${STORY_DETAIL_NAME}/${STORY_DETAIL_ACTIONS.SET_STORY_DATA}`, mergedData, {root: true});
		},
		[WIDGET_INSTANCE_ACTIONS.REMOVE_PAGE_INSTANCE]({getters, dispatch}, pageInstanceId) {
			const widgetPages = getters.pageWidgetInstanceIds;
			if (widgetPages.includes(pageInstanceId) && widgetPages.length > 1) {
				const {selectedPage, selectedPageWidgetInstanceId} = getters;
				const widgetInstanceIds = _.cloneDeep(getters.widgetInstanceIds[pageInstanceId] ?? []);
				return dispatch(WIDGET_INSTANCE_ACTIONS.REMOVE_INSTANCE, {widgetInstanceId: pageInstanceId})
					.then(() => Promise.all(((selectedPageWidgetInstanceId === pageInstanceId)
						? [dispatch(WIDGET_INSTANCE_ACTIONS.SELECT_PAGE, widgetPages.length - 1 === selectedPage ? selectedPage - 1 : selectedPage)]
						: []).concat(widgetInstanceIds.map((widgetInstanceId) => dispatch(WIDGET_INSTANCE_ACTIONS.REMOVE_INSTANCE, {
						widgetInstanceId,
						soft: true
					})))));
			}
			return Promise.reject();
		},
		[WIDGET_INSTANCE_ACTIONS.REMOVE_PAGE_INSTANCE_BY_INDEX]({dispatch}, pageIndex) {
			return dispatch(WIDGET_INSTANCE_ACTIONS.REMOVE_INSTANCE, getPageId(pageIndex));
		},
		async [WIDGET_INSTANCE_ACTIONS.REMOVE_INSTANCE]({commit, getters, dispatch}, {widgetInstanceId, soft = false}) {
			if (getters.savingTimeout(widgetInstanceId)) {
				clearTimeout(getters.savingTimeout(widgetInstanceId));
			}
			if (soft) {
				return Promise.resolve();
			}
			const widgetType = getters.widgetType(widgetInstanceId);
			const isSection = widgetType === 'widget_page';
			if (isSection) {
				await widgetServices.deleteSection(widgetInstanceId);
			} else {
				await widgetServices.deleteWidget(widgetInstanceId);
			}
			dispatch('widgetFacts/removeWidgetFacts', widgetInstanceId, {root: true});
			commit(WIDGET_INSTANCE_MUTATIONS.RESET_WIDGET_FILTERS, widgetInstanceId);
			commit(WIDGET_INSTANCE_MUTATIONS.REMOVE_INSTANCE, widgetInstanceId);
			if (isSection) {
				return dispatch('storyDetail/reloadSectionOrder', null, {root: true});
			}
			return dispatch(WIDGET_INSTANCE_ACTIONS.RELOAD_WIDGET_ORDER, getters.selectedPageWidgetInstanceId);
		},
		async [WIDGET_INSTANCE_ACTIONS.RELOAD_WIDGET_ORDER]({commit}, sectionId) {
			const data = await widgetServices.getSection(sectionId);
			commit(WIDGET_INSTANCE_MUTATIONS.SET_WIDGET_ORDER, {
				id: data.id,
				widgetOrder: data.widgetOrder
			});
		},
		[WIDGET_INSTANCE_ACTIONS.REORDER_WIDGETS]({commit}, {sectionId, newOrder}) {
			return axios.post(`/v0/sections/${sectionId}/reorder`, {
				newOrder
			})
				.then(({data: {data}}) => {
					commit(WIDGET_INSTANCE_MUTATIONS.SET_WIDGET_ORDER, {
						id: data.id,
						widgetOrder: data.widgetOrder
					});
				});
		},
		[WIDGET_INSTANCE_ACTIONS.PREVENT_DESELECT]({commit}) {
			commit(WIDGET_INSTANCE_MUTATIONS.PREVENT_DESELECT);
		},
		[WIDGET_INSTANCE_ACTIONS.SELECT_PAGE]({commit, rootGetters}, page) {
			commit(WIDGET_INSTANCE_MUTATIONS.SELECT_PAGE, rootGetters['storyDetail/story']?.sectionOrder?.[page] ?? null);
		},
		[WIDGET_INSTANCE_ACTIONS.ADD_PAGE]({dispatch}, index = null) {
			return dispatch(WIDGET_INSTANCE_ACTIONS.CREATE_NEW_INSTANCE, {
				widgetType: 'widget_page',
				index
			});
		},
		[WIDGET_INSTANCE_ACTIONS.SET_FILTER]({commit, dispatch, getters, rootGetters}, payload) {
			const isDataDashboard = (rootGetters['storyDetail/story']?.storyType ?? 'data-dashboard') === 'data-dashboard';
			const isAnimated = (getters.configuration(payload.widgetInstanceId).options?.stacking ?? 'animated') === 'animated';
			const dynamicFilterMode = getters.configuration(payload.widgetInstanceId).options?.dynamicFilterMode ?? dynamicFilterModes.SAME_DATASET;
			if (isDataDashboard || !isAnimated) {
				switch (dynamicFilterMode) {
					case dynamicFilterModes.SAME_DATASET:
						commit(WIDGET_INSTANCE_MUTATIONS.SET_FILTER, payload);
						break;
					case dynamicFilterModes.ALL_DATASETS:
						for (
							const filteredDataset of rootGetters['storyDetail/story'].datasets
								.filter((dataset) => dataset.columns.some((column) => column.name === payload.column))
						) {
							commit(WIDGET_INSTANCE_MUTATIONS.SET_FILTER, {
								...payload,
								dataset: filteredDataset.id
							});
						}
						break;
				}
				if (dynamicFilterMode === dynamicFilterModes.SAME_DATASET || dynamicFilterMode === dynamicFilterModes.ALL_DATASETS) {
					return Promise.all(getters.widgetInstanceIds[payload.widgetInstanceId]
						.map((widgetInstanceId) => dispatch('widgetData/loadData', {widgetInstanceId}, {root: true})));
				}
			}
			return Promise.resolve();
		},
		[WIDGET_INSTANCE_ACTIONS.RESET_PAGE_FILTERS]({commit, getters, dispatch}, pageId) {
			getters.widgetInstanceIds[pageId].forEach((widgetInstanceId) => {
				commit(WIDGET_INSTANCE_MUTATIONS.RESET_WIDGET_FILTERS, widgetInstanceId);
			});

			getters.widgetInstanceIds[pageId].forEach((widgetInstanceId) => {
				dispatch('widgetData/loadData', {widgetInstanceId}, {root: true});
			});
		},
		[WIDGET_INSTANCE_ACTIONS.SET_READONLY]({commit}) {
			commit(WIDGET_INSTANCE_MUTATIONS.SET_READONLY);
		},
		// eslint-disable-next-line no-empty-pattern
		async [WIDGET_INSTANCE_ACTIONS.SET_ONLY_CONFIGURATION]({}, payload) {
			if (payload.configuration.data) {
				try {
					await widgetServices.updateDataConfiguration(payload.widgetInstanceId, {
						datasetId: payload.configuration.data.datasetId,
						dataConfiguration: payload.configuration.data.configuration
					}, payload.configuration.data.id);
				} catch (error) {
					notify({
						type: 'danger',
						text: error?.response?.data?.error?.message ?? t('t_UnexpectedError'),
						duration: 5000
					});
				}
			}
		}
	}
};

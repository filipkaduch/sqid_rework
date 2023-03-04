import {hslToRgb, parseRgb, printRgb, rgbToHsl} from '@/util/colors';
import {generateColor} from '@/util/colors/generate';
import {userEvents} from '@/util/consts/userEvents';
import router from '@/plugins/router';
import {setThemeColors} from '@/util/colors/widgetColors';
import store from '@/plugins/store';
import i18n from '@/plugins/i18n';
const {t} = i18n.global;
import {STORY_DETAIL_ACTIONS, STORY_DETAIL_GETTERS, STORY_DETAIL_MUTATIONS} from '@/modules/story/store/types';
import {storyServices} from '@/modules/story/storyServices';
import {getFirstWidgetIdInSections, getWidgetsByLocation} from '@/modules/story/utils/widgetUtils';
import {
	WIDGET_INSTANCE_ACTIONS,
	WIDGET_INSTANCE_GETTERS,
	WIDGET_INSTANCE_STORE_NAME
} from '@/modules/widget/store/widgetInstances/types';
import {datasetService} from '@/modules/dataset/datasetService';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import isEqual from 'lodash/isEqual';


const getInitialState = () => ({
	loading: false,
	publishLoading: false,
	readOnly: false,
	story: null,
	error: null,
	updatingTimeout: null,
	storyElement: null,
	scale: 1,
	generatedColors: [],
	publishToken: null,
	catalogItems: []
});

const setStoryActions = async({commit, dispatch}, data, storyPayload) => {
	commit(STORY_DETAIL_MUTATIONS.SET_STORY, data);
	if (data?.catalogItems.length) {
		const catalogItems = await datasetService.getCatalogItemsDetail(data.catalogItems.map((catalog) => catalog.catalogItemId).toString());
		commit(STORY_DETAIL_MUTATIONS.SET_CATALOG_ITEMS, catalogItems);
	}
	commit('widgetFacts/setFacts', cloneDeep(data.configuration?.facts ?? null), {root: true});
	if (storyPayload.setInstances) {
		await dispatch(
			`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_ACTIONS.SET_INSTANCES}`,
			data.sections.map((section) => merge(section, {parentId: data.id})), {root: true}
		);
	}
};

export default {
	namespaced: true,
	state: getInitialState(),
	getters: {
		[STORY_DETAIL_GETTERS.LOADING]: (state) => state.loading,
		[STORY_DETAIL_GETTERS.PUBLISH_LOADING]: (state) => state.publishLoading,
		[STORY_DETAIL_GETTERS.STORY]: (state) => state.story,
		[STORY_DETAIL_GETTERS.ERROR]: (state) => state.error,
		[STORY_DETAIL_GETTERS.SCALE]: (state) => state.scale,
		[STORY_DETAIL_GETTERS.READ_ONLY]: (state) => state.readOnly,
		[STORY_DETAIL_GETTERS.GENERATED_COLORS]: (state) => state.generatedColors,
		[STORY_DETAIL_GETTERS.PUBLISH_TOKEN]: (state) => state.publishToken,
		[STORY_DETAIL_GETTERS.GRAPH_COLOR]:
			(state) => (index) => state.generatedColors[index] ? printRgb(hslToRgb(state.generatedColors[index])) : 'rgb(44,133,248)',
		[STORY_DETAIL_GETTERS.GRAPH_COLORS]: (state) => state.generatedColors.map((color) => printRgb(hslToRgb(color))),
		[STORY_DETAIL_GETTERS.DATASET]: (state) => (datasetId) => state.story.datasets.find((dataset) => dataset.id === datasetId) ?? null,
		[STORY_DETAIL_GETTERS.DATASET_COLUMN]:
			(state, getters) => (datasetId, columnName) => getters.dataset(datasetId)?.columns.find((col) => col.name === columnName) ?? null,
		[STORY_DETAIL_GETTERS.CATALOG_ITEMS]: (state) => state.catalogItems ?? [],
		[STORY_DETAIL_GETTERS.CATALOG_ITEM]: (state, getters) => (catalogItemId) => getters.catalogItems.find((catalog) => catalog.id === catalogItemId) ?? null
	},
	mutations: {
		[STORY_DETAIL_MUTATIONS.START_LOADING](state) {
			state.loading = true;
		},
		[STORY_DETAIL_MUTATIONS.STOP_LOADING](state) {
			state.loading = false;
		},
		[STORY_DETAIL_MUTATIONS.START_PUBLISH_LOADING](state) {
			state.publishLoading = true;
		},
		[STORY_DETAIL_MUTATIONS.STOP_PUBLISH_LOADING](state) {
			state.publishLoading = false;
		},
		[STORY_DETAIL_MUTATIONS.SET_STORY](state, story) {
			state.story = story;
			state.generatedColors = story.layoutConfiguration.theme?.colors?.graph?.map((color) => rgbToHsl(parseRgb(color))) ?? [];
		},
		[STORY_DETAIL_MUTATIONS.SET_SECTION_ORDER](state, sectionOrder) {
			state.story.sectionOrder = sectionOrder;
		},
		[STORY_DETAIL_MUTATIONS.SET_ERROR](state, error) {
			state.error = error;
			state.loading = false;
		},
		[STORY_DETAIL_MUTATIONS.SET_NAME](state, name) {
			state.story.name = name;
		},
		[STORY_DETAIL_MUTATIONS.SET_CONFIGURATION](state, configuration) {
			state.story.configuration = configuration;
		},
		[STORY_DETAIL_MUTATIONS.SET_LAYOUT](state, layout) {
			state.story.layoutConfiguration = layout;
			state.generatedColors = layout.theme.colors.graph?.map((color) => rgbToHsl(parseRgb(color))) ?? [];
		},
		[STORY_DETAIL_MUTATIONS.SET_PUBLISH_TOKEN](state, token) {
			state.publishToken = token;
		},
		[STORY_DETAIL_MUTATIONS.SET_PUBLISH_CONFIGURATION](state, configuration) {
			state.story.publishConfiguration = configuration;
		},
		[STORY_DETAIL_MUTATIONS.SET_VISIBILITY_STATE](state, visibilityState) {
			state.story.visibilityState = visibilityState;
		},
		[STORY_DETAIL_MUTATIONS.SET_UPDATING_TIMEOUT](state, timeout) {
			state.updatingTimeout = timeout;
		},
		[STORY_DETAIL_MUTATIONS.SET_STORY_ELEMENT](state, storyElement) {
			state.storyElement = storyElement;
		},
		[STORY_DETAIL_MUTATIONS.SET_SCALE](state, scale) {
			state.scale = scale;
		},
		[STORY_DETAIL_MUTATIONS.SET_READONLY](state) {
			state.readOnly = true;
		},
		[STORY_DETAIL_MUTATIONS.ADD_COLOR](state, color) {
			state.generatedColors.push(color);
		},
		[STORY_DETAIL_MUTATIONS.ADD_CLAP](state) {
			state.story.storyStatistics.clapsCount += state.story.storyStatistics.clapsCount;
		},
		[STORY_DETAIL_MUTATIONS.RESET](state) {
			const {readOnly} = state;
			Object.assign(state, getInitialState());
			state.readOnly = readOnly;
		},
		[STORY_DETAIL_MUTATIONS.SET_CATALOG_ITEMS](state, catalogItems) {
			state.catalogItems = catalogItems;
		},
		[STORY_DETAIL_MUTATIONS.SET_DATASETS](state, datasets) {
			state.story.datasets = datasets;
		},
		[STORY_DETAIL_MUTATIONS.SET_SECTIONS](state, sections) {
			state.story.sections = sections;
			// When changing section, change section order too
			state.story.sectionOrder = sections.map((section) => section.id);
		}
	},
	actions: {
		async [STORY_DETAIL_ACTIONS.LOAD_STORY_SECTIONS]({commit, state, rootGetters}, id) {
			commit(STORY_DETAIL_MUTATIONS.RESET);
			commit(STORY_DETAIL_MUTATIONS.START_LOADING);
			let data = {};
			if (rootGetters[`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_GETTERS.READONLY}`]) {
				data = await storyServices.loadSharedStory(id);
			} else {
				data = await storyServices.loadStory(id);
			}
			if (state.readOnly) {
				commit(STORY_DETAIL_MUTATIONS.SET_PUBLISH_TOKEN, id);
			}
			commit('widgetFacts/setFacts', cloneDeep(data.configuration?.facts ?? null), {root: true});
			commit(STORY_DETAIL_MUTATIONS.SET_STORY, data);
			if (data?.catalogItems.length) {
				const catalogItems = await datasetService.getCatalogItemsDetail(data.catalogItems.map((catalog) => catalog.catalogItemId).toString());
				commit(STORY_DETAIL_MUTATIONS.SET_CATALOG_ITEMS, catalogItems);
			}
			commit(STORY_DETAIL_MUTATIONS.STOP_LOADING);
			return data;
		},
		async [STORY_DETAIL_ACTIONS.LOAD_STORY]({commit, dispatch}, id) {
			await dispatch(STORY_DETAIL_ACTIONS.LOAD_STORY_SECTIONS, id);
			commit(STORY_DETAIL_MUTATIONS.START_LOADING);
			const story = await dispatch(STORY_DETAIL_ACTIONS.LOAD_STORY_INSTANCES);
			commit(STORY_DETAIL_MUTATIONS.STOP_LOADING);
			return story;
		},
		[STORY_DETAIL_ACTIONS.LOAD_STORY_INSTANCE]({commit, dispatch, state, rootGetters}, {
			section,
			step,
			count,
			down
		}) {
			const widgets = getWidgetsByLocation(state.story, {
				section,
				step
			}, count, down);
			try {
				for (const widget of widgets) {
					if (!rootGetters['widgetData/data'](widget.id)) {
						dispatch('widgetData/loadData', {widgetInstanceId: widget.id}, {root: true});
					}
				}
			} catch (response) {
				if (rootGetters[`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_GETTERS.READONLY}`]) {
					store.commit('error/setError', 't_ResourceNotFoundError');
					router.push({name: 'error'});
				}
				commit(STORY_DETAIL_MUTATIONS.SET_ERROR, response?.response?.data?.message ?? t('errors.loadStory'));
			}
		},
		[STORY_DETAIL_ACTIONS.LOAD_FIRST_SECTION_STEPS]({dispatch, state}) {
			const widgets = getFirstWidgetIdInSections(state.story);
			for (const widget of widgets) {
				dispatch('widgetData/loadData', {widgetInstanceId: widget.id}, {root: true});
			}
		},
		async [STORY_DETAIL_ACTIONS.LOAD_STORY_INSTANCES]({commit, dispatch, state, rootGetters}) {
			try {
				await dispatch(
					`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_ACTIONS.SET_INSTANCES}`,
					cloneDeep(state.story.sections).map((section) => merge(section, {parentId: state.story.id})), {root: true}
				);
			} catch (response) {
				if (rootGetters[`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_GETTERS.READONLY}`]) {
					store.commit('error/setError', 't_ResourceNotFoundError');
					await router.push({name: 'error'});
				}
				commit(STORY_DETAIL_MUTATIONS.SET_ERROR, response?.response?.data?.message ?? t('errors.loadStory'));
			}
		},
		async [STORY_DETAIL_ACTIONS.RELOAD_SECTION_ORDER]({commit, getters}) {
			const data = await storyServices.loadStory(getters.story.id);
			commit(STORY_DETAIL_MUTATIONS.SET_SECTION_ORDER, data.sectionOrder);
		},
		async [STORY_DETAIL_ACTIONS.REORDER_SECTIONS]({commit, getters}, newOrder) {
			const data = await storyServices.reorderStorySections(getters.story.id, newOrder);
			commit(STORY_DETAIL_MUTATIONS.SET_SECTION_ORDER, data.sectionOrder);
		},
		[STORY_DETAIL_ACTIONS.EDITOR_OPENED]() {
			return storyServices.postUserEvent(userEvents.OPEN_EDITOR);
		},
		// eslint-disable-next-line max-lines-per-function
		[STORY_DETAIL_ACTIONS.UPDATE_STORY](
			{commit, state, dispatch},
			{name = null, layout = null, configuration = null, keepColors = false, privateView = false}
		) {
			if (
				(name === null || state.story.name === name)
				&& (layout === null || isEqual(state.story.layoutConfiguration, layout))
				&& (configuration === null || isEqual(state.story.configuration, configuration))
			) {
				return;
			}
			if (state.updatingTimeout !== null) {
				clearTimeout(state.updatingTimeout);
			}

			if (name !== null) {
				commit(STORY_DETAIL_MUTATIONS.SET_NAME, name);
			}
			if (layout !== null) {
				const colorCount = state.generatedColors.length;
				commit(STORY_DETAIL_MUTATIONS.SET_LAYOUT, layout);
				dispatch(STORY_DETAIL_ACTIONS.GENERATE_COLORS, colorCount);
			}
			if (configuration !== null) {
				commit(STORY_DETAIL_MUTATIONS.SET_CONFIGURATION, configuration);
			}

			if (state.readOnly || privateView) {
				return;
			}
			// TODO: transform only colors not series PT
			state.story.sections.forEach((section) => {
				if (section.widgets) {
					section.widgets.forEach(async(widget) => {
						// Call only when changing theme
						if (!keepColors) {
							await setThemeColors(widget.id);
						}
						await store.dispatch(`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_ACTIONS.SET_CONFIGURATION}`, {
							widgetInstanceId: widget.id
						});
					});
				}
			});
			commit(STORY_DETAIL_MUTATIONS.SET_UPDATING_TIMEOUT, setTimeout(() => {
				commit(STORY_DETAIL_MUTATIONS.SET_UPDATING_TIMEOUT, null);
				try {
					storyServices.putStory(state.story.id, {
						name: state.story.name,
						thumbnail: state.story.thumbnail,
						configuration: state.story.configuration
							? {
								version: 'default/v0',
								...(state.story.configuration)
							}
							: null,
						layoutConfiguration: state.story.layoutConfiguration
							? {
								version: 'default/v0',
								...(state.story.layoutConfiguration)
							}
							: null
					});
				} catch (err) {
					dispatch('flashMessages/addMessage', {
						variant: 'danger',
						text: err?.response?.data?.message ?? 'Can\'t edit story'
					}, {root: true});
				}
			}, 500));
		},
		[STORY_DETAIL_ACTIONS.SET_STORY_READ_ONLY]({commit}) {
			commit(STORY_DETAIL_MUTATIONS.SET_READONLY);
		},
		[STORY_DETAIL_ACTIONS.SET_STORY_ELEMENT]({commit}, storyElement) {
			commit(STORY_DETAIL_MUTATIONS.SET_STORY_ELEMENT, storyElement);
		},
		[STORY_DETAIL_ACTIONS.SET_SCALE]({commit}, scale) {
			commit(STORY_DETAIL_MUTATIONS.SET_SCALE, scale);
		},
		[STORY_DETAIL_ACTIONS.SET_VISIBILITY]({commit, state}, {visibilityState, publishConfiguration = null}) {
			if (state.story.visibilityState !== visibilityState) {
				commit(STORY_DETAIL_MUTATIONS.START_PUBLISH_LOADING);
				commit(STORY_DETAIL_MUTATIONS.SET_PUBLISH_CONFIGURATION, publishConfiguration);
				commit(STORY_DETAIL_MUTATIONS.STOP_PUBLISH_LOADING);
			}
			return Promise.resolve();
		},
		[STORY_DETAIL_ACTIONS.GENERATE_COLORS]({commit, state}, number) {
			if (state.story && number > state.generatedColors.length) {
				for (let i = state.generatedColors.length; i < number; i++) {
					commit(
						STORY_DETAIL_MUTATIONS.ADD_COLOR,
						generateColor(state.generatedColors.concat([rgbToHsl(parseRgb(state.story.layoutConfiguration.theme.colors.background))]))
					);
				}
			}
		},
		[STORY_DETAIL_ACTIONS.ADD_CLAP]({commit, state}) {
			commit(STORY_DETAIL_MUTATIONS.ADD_CLAP);
			return storyServices.postClap(state.story.id);
		},
		async [STORY_DETAIL_ACTIONS.SET_STORY_DATA]({commit, dispatch, getters}, payload) {
			await setStoryActions({commit, dispatch}, payload, {setInstances: true});
		},
		async [STORY_DETAIL_ACTIONS.RELOAD_DATA]({commit, dispatch}, payload) {
			const data = await storyServices.loadStory(payload.id);
			commit(STORY_DETAIL_MUTATIONS.SET_STORY, data);
			if (data?.catalogItems.length) {
				const catalogItems = await datasetService.getCatalogItemsDetail(data.catalogItems.map((catalog) => catalog.catalogItemId).toString());
				commit(STORY_DETAIL_MUTATIONS.SET_CATALOG_ITEMS, catalogItems);
			}
			commit('widgetFacts/setFacts', cloneDeep(data.configuration?.facts ?? null), {root: true});
			if (payload.setInstances) {
				dispatch(
					`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_ACTIONS.SET_INSTANCES}`,
					data.sections.map((section) => merge(section, {parentId: data.id})), {root: true}
				);
			}
		}
	}
};

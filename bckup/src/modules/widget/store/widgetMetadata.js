import {inject} from 'vue';

import axios from 'axios';
import router from '@/plugins/router';

const getInitialState = () => ({
	metadata: {},
	widgetTypeMetadata: {},
	widgetControlTypeMetadata: {},
	initialized: false
});

const getComponentsFromTypes = (types, metadata) => types
	.map((dependency) => Object.keys(metadata)
		.find((component) => (metadata[component].widgetTypes ?? metadata[component].widgetControlTypes ?? []).includes(dependency)));

export default {
	namespaced: true,
	state: getInitialState(),
	mutations: {
		setMetadata(state, metadata) {
			state.metadata = metadata;
		},
		setWidgetTypeMetadata(state, {widgetType, metadata}) {
			state.widgetTypeMetadata[widgetType] = metadata;
		},
		setWidgetControlTypeMetadata(state, {widgetControlType, metadata}) {
			state.widgetControlTypeMetadata[widgetControlType] = metadata;
		},
		initialize(state) {
			state.initialized = true;
		},
		reset(state) {
			Object.assign(state, getInitialState());
		}
	},
	getters: {
		options: (state) => state.metadata?.options ?? null,
		dependencyMetadata: (state) => (dependencyName) => state.metadata?.dependencies?.[dependencyName] ?? null,
		widgetTypeMetadata: (state) => (widgetId) => state.widgetTypeMetadata?.[widgetId] ?? null,
		widgetTypesMetadata: (state) => state.widgetTypeMetadata ?? {},
		widgetControlMetadata: (state) => (widgetControlId) => state.widgetControlTypeMetadata?.[widgetControlId] ?? null,
		initialized: (state) => state.initialized
	},
	actions: {
		// eslint-disable-next-line max-lines-per-function
		loadMetadata({commit, state, dispatch, getters, rootGetters}, loadDependencies = false) {
			if (state.initialized) {
				return Promise.resolve();
			}
			const appConfig = inject('appConfig');
			return axios.get('/manifest.json', {baseURL: appConfig?.widget?.baseUrl ?? ''})
				// eslint-disable-next-line max-lines-per-function
				.then(({data}) => {
					// Feature flag for VPN clients without mapbox
					const prohibitedWidgets = [
						'AmChartCountryMap',
						'DeckGlArc',
						'DeckGlHeatmap',
						'DeckGlHexagon',
						'DeckGlScatter'
					];
					const metadata = {...data};
					if (appConfig?.denyMaps) {
						metadata.dependencies = Object.keys(data.dependencies).filter((key) => !prohibitedWidgets.includes(key))
							.reduce((obj, key) => {
								obj[key] = data.dependencies[key];
								return obj;
							}, {});
					}
					commit('setMetadata', metadata);
					if (Array.isArray(loadDependencies) || loadDependencies === true) {
						const dependencies = Array.isArray(loadDependencies) ? getComponentsFromTypes(loadDependencies, metadata) : Object.keys(metadata.dependencies);
						return Promise.all(dependencies.map((dependencyName) => dispatch('dependencies/loadDependency', dependencyName, {root: true})
							.then(() => {
								const dependencyMetadata = getters.dependencyMetadata(dependencyName);
								// TODO constant
								if (dependencyMetadata.type === 'widget') {
									const widget = rootGetters['dependencies/dependency'](dependencyName);
									return Promise.all((widget?.widgetTypes?.() ?? [])
										.map((widgetType) => dispatch('setWidgetTypeMetadata', {
											widgetType,
											metadata: {
												...(widget.widgetTypeMetadata?.(widgetType) ?? {}),
												...({component: dependencyName})
											}
										})));
								}
								const widgetControl = rootGetters['dependencies/dependency'](dependencyName);
								return Promise.all((widgetControl?.widgetControlTypes?.() ?? [])
									.map((widgetControlType) => dispatch('setWidgetControlTypeMetadata', {
										widgetControlType,
										metadata: {
											...(widgetControl.widgetControlTypeMetadata?.(widgetControlType) ?? {}),
											...({component: dependencyName})
										}
									})));
							})))
							.then(() => loadDependencies === true ? dispatch('widgetTypes/loadWidgetTypes', getters.widgetTypesMetadata, {root: true}) : Promise.resolve());
					}
					return Promise.resolve();
				})
				.catch(() => {
					commit('error/setError', 't_UnexpectedError', {root: true});
					router.push({name: 'error'});
					return Promise.resolve();
				})
				.finally(() => {
					commit('initialize');
					return Promise.resolve();
				});
		},
		setWidgetTypeMetadata({commit}, {widgetType, metadata}) {
			commit('setWidgetTypeMetadata', {
				widgetType,
				metadata
			});
		},
		setWidgetControlTypeMetadata({commit}, {widgetControlType, metadata}) {
			commit('setWidgetControlTypeMetadata', {
				widgetControlType,
				metadata
			});
		}
	}
};

import difference from 'lodash/difference';
import omit from 'lodash/omit';
import cloneDeep from 'lodash/cloneDeep';
import {inject} from 'vue';

const getInitialState = () => ({
	dependencies: {},
	loadings: {},
	errors: {}
});

const loadCss = (options, metadata) => {
	if (typeof metadata === 'object' && metadata.loadCss) {
		let {cssUrl} = metadata;
		if (!cssUrl) {
			const urlParts = metadata.url.split('/');
			// eslint-disable-next-line prefer-named-capture-group,prefer-destructuring
			const filename = urlParts.reverse()[0].match(/^(.+)\.umd/u)[1];
			urlParts[urlParts.length - 1] = `${filename}.css`;
			cssUrl = urlParts.join('/');
		}
		const css = document.createElement('link');
		css.rel = 'stylesheet';
		css.type = 'text/css';
		if (cssUrl.slice(0, 4) === 'http') {
			css.href = cssUrl;
		} else {
			const appConfig = inject('appConfig');
			const tmpUrl = `${appConfig?.widget?.baseUrl ?? ''}/${options?.dependenciesUrlPrefix ?? ''}`;
			const hash = appConfig?.widget?.hash ?? null;
			css.href = `${tmpUrl}${tmpUrl.slice(-1) === '/' ? '' : '/'}${cssUrl}${hash ? `?h=${hash}` : ''}`;
		}
		document.head.appendChild(css);
	}
};

const scriptOnLoad = (commit, getters, dependencyName, oldWindowKeys, dependencyMetadata) => {
	if (dependencyMetadata.leaveOnWindow) {
		commit('setDependency', {
			name: dependencyName,
			dependency: null
		});
	} else {
		let tmpObject = {};
		difference(Object.getOwnPropertyNames(window), oldWindowKeys)
			.forEach((newKey) => {
				if (isNaN(newKey)) {
					tmpObject[newKey] = window[newKey];
					delete window[newKey];
				}
			});
		tmpObject = omit(tmpObject, Object.keys(tmpObject).filter((key) => key.startsWith('$vm')));
		const keys = Object.keys(tmpObject);
		if (keys.length === 0) {
			commit('setError', {
				name: dependencyName,
				error: true
			});
		} else {
			commit('setDependency', {
				name: dependencyName,
				dependency: (keys.length === 1) ? tmpObject[keys[0]] : tmpObject
			});
		}
	}
};

const scriptOnError = (commit, dependencyName, oldWindowKeys) => {
	difference(Object.getOwnPropertyNames(window), oldWindowKeys)
		.forEach((newKey) => {
			delete window[newKey];
		});
	commit('setError', {
		name: dependencyName,
		error: true
	});
};

// eslint-disable-next-line max-lines-per-function
const loadJs = (commit, getters, state, rootGetters, dependencyName) => {
	if (state.dependencies[dependencyName]) {
		return Promise.resolve();
	}
	if (state.loadings[dependencyName]) {
		return state.loadings[dependencyName];
	}
	const dependencyMetadata = rootGetters['widgetMetadata/dependencyMetadata'](dependencyName);
	let dependencyUrl = dependencyMetadata.url;
	const promise = Promise.all((dependencyMetadata.dependencies ?? [])
		.map((dependency) => loadJs(commit, getters, state, rootGetters, dependency)))
		// eslint-disable-next-line consistent-return
		.then(() => dependencyMetadata.internal === true
			// Internal dependency (W prefix for widgets and WC for widget controls)
			? (dependencyMetadata.type === 'widget-control'
				// eslint-disable-next-line prefer-template
				? import(`@/modules/widget/components/widget-controls/${dependencyUrl}.vue`)
				// eslint-disable-next-line prefer-template
				: import(`@/modules/widget/components/widgets/${dependencyUrl}.vue`)
			)
				.then((module) => {
					commit('setDependency', {
						name: dependencyName,
						dependency: cloneDeep(module.default)
					});
				})
			: (new Promise((resolve) => {
				// Load external dependency
				const options = rootGetters['widgetMetadata/options'];
				const oldWindowKeys = Object.getOwnPropertyNames(window);
				const script = document.createElement('script');
				script.async = true;
				script.defer = true;
				script.onload = () => {
					scriptOnLoad(commit, getters, dependencyName, oldWindowKeys, dependencyMetadata);
					resolve();
				};
				script.onerror = () => {
					scriptOnError(commit, dependencyName, oldWindowKeys);
					resolve();
				};

				if (dependencyUrl.substring(0, 4) !== 'http') {
					const appConfig = inject('appConfig');
					// Add base url and hash from mail app config if url is not full url
					const tmpUrl = `${appConfig?.widget?.baseUrl ?? ''}/${options?.dependenciesUrlPrefix ?? ''}`;
					const hash = appConfig?.widget?.hash ?? null;
					dependencyUrl = `${tmpUrl}${tmpUrl.slice(-1) === '/' ? '' : '/'}${dependencyUrl}${hash ? `?h=${hash}` : ''}`;
				}
				script.src = dependencyUrl;
				document.head.appendChild(script);

				loadCss(options, dependencyMetadata);
			})));

	promise
		.then(() => {
			commit('stopLoading', dependencyName);
		});

	commit('startLoading', {
		name: dependencyName,
		promise
	});

	return promise;
};

export default {
	namespaced: true,
	state: getInitialState(),
	getters: {
		loading: (state) => (dependencyName) => Boolean(state.loadings[dependencyName]),
		dependency: (state) => (dependencyName) => state.dependencies[dependencyName] ?? null,
		errors: (state) => (dependencyName) => Boolean(state.errors[dependencyName])
	},
	mutations: {
		startLoading(state, {name, promise}) {
			state.loadings[name] = promise;
		},
		stopLoading(state, dependencyName) {
			state.loadings[dependencyName] = false;
		},
		setDependency(state, {name, dependency}) {
			state.dependencies[name] = dependency;
		},
		setError(state, {name, error}) {
			state.errors[name] = error;
		},
		reset(state) {
			Object.assign(state, getInitialState());
		}
	},
	actions: {
		loadDependency({commit, getters, state, rootGetters}, dependencyName) {
			return loadJs(commit, getters, state, rootGetters, dependencyName);
		}
	}
};

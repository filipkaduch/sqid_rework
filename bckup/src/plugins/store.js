/* eslint-disable global-require */
import * as auth from '@/modules/auth/store';
import * as dataset from '@/modules/dataset/store';
import * as insight from '@/modules/insight/store';
import * as story from '@/modules/story/store';
import * as widget from '@/modules/widget/store';

import {createStore} from 'vuex';

import appLoading from '@/store/appLoading';
import dependencies from '@/store/dependencies';
import error from '@/store/error';
import flashMessages from '@/store/flashMessages';

// TODO: test this import.meta
const debug = import.meta.env.DEV;

const store = createStore({
	modules: {
		appLoading,
		...auth,
		dependencies,
		error,
		...dataset,
		flashMessages,
		...story,
		...widget,
		...insight
	},
	actions: {
		resetAll({commit}) {
			commit('appLoading/reset');
			commit('authLogin/reset');
			commit('dependencies/reset');
			commit('datasets/reset');
			commit('datasetCreate/reset');
			commit('datasetDetail/reset');
			commit('error/reset');
			commit('flashMessages/reset');
			commit('stories/reset');
			commit('widgetInstances/reset');
			commit('widgetMetadata/reset');
			commit('widgetTypes/reset');
			commit('widgetData/reset');
			commit('insights/reset');

			return Promise.resolve();
		}
	},
	strict: debug
});

// noinspection JSUnresolvedVariable
if (import.meta.hot) {
	import.meta.hot.accept([
		'@/store/appLoading',
		'@/modules/auth/store',
		'@/store/dependencies',
		'@/store/error',
		'@/modules/dataset/store',
		'@/store/flashMessages',
		'@/modules/story/store',
		'@/modules/widget/store'
	], () => {
		// noinspection NpmUsedModulesInstalled
		store.hotUpdate({
			modules: {
				appLoading: import.meta.glob('@/store/appLoading').default,
				...import.meta.glob('@/modules/auth/store'),
				dependencies: import.meta.glob('@/store/dependencies').default,
				error: import.meta.glob('@/store/error').default,
				...import.meta.glob('@/modules/dataset/store'),
				flashMessages: import.meta.glob('@/store/flashMessages').default,
				...import.meta.glob('@/modules/story/store'),
				...import.meta.glob('@/modules/widget/store')
			}
		});
	});
}

export default store;

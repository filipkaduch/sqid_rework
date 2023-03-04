import '../custom.scss';

import * as plugins from '@/plugins/all';
import App from '@/App.vue';
import {ComponentsInstaller} from '@/components/main/ComponentInstaller';
import {createApp} from 'vue';
import axios from 'axios';
import {setUpCrossDomainCookieListener} from '@/util/posthog/utils';

let appConfig = null as any;
plugins.store.commit('appLoading/startConfigLoading');
axios({
	url: '/config.json',
	// @ts-ignore
	baseURL: import.meta.env.ATACCAMA_ONE_TELLSTORY_WEBAPP_APP_BASE_URL || '/'
})
	.then(({data}) => {
		appConfig = data;
	})
	.catch((err) => {
		plugins.store.commit('error/setError', 't_CantLoadConfig');
	})
	.finally(() => {
		// @ts-ignore
		const app = createApp(App);
		app.use(ComponentsInstaller);
		app.use(plugins.i18n);
		app.use(plugins.store);
		app.use(plugins.router);
		app.use(plugins.pinia);
		app.use(plugins.vClickOutside);
		app.use(plugins.floatingVue);
		app.use(plugins.notifications);
		app.use(plugins.vueClipboard, {
			autoSetContainer: true
		});
		app.component('FaIcon', plugins.fontAwesome.FontAwesomeIcon);
		app.component('FaLayers', plugins.fontAwesome.FontAwesomeLayers);
		app.component('VueSlider', plugins.vueSlider);
		app.component('VChart', plugins.Echarts);
		app.config.globalProperties.appConfig = appConfig;
		app.provide('appConfig', appConfig);
		setUpCrossDomainCookieListener();
		app.mount('#app');
		plugins.store.commit('appLoading/stopConfigLoading');
	});

import {createApp, reactive, watchEffect} from 'vue'
import App from './App.vue'
import {ComponentsInstaller} from '@/components/main/ComponentInstaller';
import * as plugins from './plugins/all';

const app = createApp(App);
app.use(ComponentsInstaller);
app.use(plugins.floatingVue);
app.use(plugins.i18n);
app.use(plugins.pinia);
app.use(plugins.router);
app.mount('#app');

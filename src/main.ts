import {createApp} from 'vue'
import App from './App.vue'
import {ComponentsInstaller} from '@/components/main/ComponentInstaller';
import * as plugins from '@/plugins/all';
// import './styles/variables.scss'

const app = createApp(App);
app.use(ComponentsInstaller);
app.use(plugins.floatingVue);
app.mount('#app');

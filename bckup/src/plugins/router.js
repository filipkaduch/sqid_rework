import {createRouter, createWebHistory} from 'vue-router';
import store from '@/plugins/store';
import {storyRouter} from '@/modules/story/router';
import {datasetRouter} from '@/modules/dataset/router';
import {explorerRouter} from '@/modules/explorer/router';
import {authRouter} from '@/modules/auth/router';
import {homepageRouter} from '@/modules/homepage/router';
import {limitsRouter} from '@/modules/limits/router';

let devRoutes = [];
const clientRoutes = [
	...storyRouter,
	...datasetRouter,
	...authRouter,
	...explorerRouter,
	...homepageRouter,
	...limitsRouter,
	{
		path: '/error',
		name: 'error',
		component: () => import('@/views/Error.vue')
	},
	{
		path: '/disabled-present/:msg?/:sub?',
		name: 'disabled-present',
		component: () => import('@/modules/story/components/presenter/components/DisabledPresenter.vue')
	},
	{
		path: '/:pathMatch(.*)*',
		beforeEnter: (to, from, next) => {
			store.commit('error/setError', 't_PageNotFound');
			next({name: 'error'});
		}
	}
];


const testingRoutes = [
	{
		path: '/baseWidgetTest/:token',
		name: 'testing',
		component: () => import('@/./tests/components/TestWidgetPublisher.vue'),
		props: (route) => ({token: route.params.token}),
		meta: {requiresAuth: false}
	}
];
// Todo test this import.meta
if (import.meta.env.NODE_ENV !== 'production') {
	devRoutes = [...testingRoutes];
}
const router = createRouter({
	history: createWebHistory(import.meta.env.ATACCAMA_ONE_TELLSTORY_WEBAPP_APP_BASE_URL || '/'),
	routes: [
		...devRoutes,
		...clientRoutes
	]
});


router.beforeEach((to, from, next) => {
	if (store.getters['error/error']) {
		if (to.matched.some((record) => record.name === 'error')) {
			return next();
		}
		return next({name: 'error'});
	}
	if (to.matched.some((record) => record.name === 'logout')) {
		store.dispatch('authLogin/logout');
		return next(false);
	}
	if (to.matched.some((record) => record.meta.requiresAuth) && !store.getters['authLogin/isAuthenticated']) {
		localStorage.setItem('redirect', to.fullPath);
		return next({
			name: 'login'
		});
	}

	return next();
});

router.beforeEach((to, from, next) => {
	const htmlElement = document.documentElement;
	if (from && from.name) {
		htmlElement.classList.remove(`page--${from.name.toLowerCase()}`);
	}
	if (to && to.name) {
		htmlElement.classList.add(`page--${to.name.toLowerCase()}`);
	}

	return next();
});

export default router;

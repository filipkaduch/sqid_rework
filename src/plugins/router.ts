import {createRouter, createWebHistory} from 'vue-router';
// import store from '@/plugins/store';
import {homepageRouter} from '@/modules/homepage/router';

let devRoutes = [];
const clientRoutes = [
    ...homepageRouter,
    {
        path: '/error',
        name: 'error',
        component: () => import('@/views/Error.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        beforeEnter: (to, from, next) => {
            // store.commit('error/setError', 't_PageNotFound');
            next({name: 'error'});
        }
    }
];


/* const testingRoutes = [
    {
        path: '/baseWidgetTest/:token',
        name: 'testing',
        component: () => import('@/tests'),
        props: (route) => ({token: route.params.token}),
        meta: {requiresAuth: false}
    }
];
if (import.meta.env.NODE_ENV !== 'production') {
    devRoutes = [...testingRoutes];
} */

const router = createRouter({
    history: createWebHistory('/'),
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
    /* if (to.matched.some((record) => record.name === 'logout')) {
        store.dispatch('authLogin/logout');
        return next(false);
    }
    if (to.matched.some((record) => record.meta.requiresAuth) && !store.getters['authLogin/isAuthenticated']) {
        localStorage.setItem('redirect', to.fullPath);
        return next({
            name: 'login'
        });
    } */

    return next();
});

export default router;

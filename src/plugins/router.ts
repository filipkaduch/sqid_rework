import {createRouter, createWebHistory} from 'vue-router';
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

    return next();
});

export default router;

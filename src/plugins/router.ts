import {createRouter, createWebHistory} from 'vue-router';
import {homepageRouter} from '@/modules/homepage/router';
import {useErrorStore} from "@/store/util/error";

interface RouterRoute {
    beforeEnter: any,
    path: string,
    name: string
}

let devRoutes = [] as RouterRoute[];
const clientRoutes = [
    ...homepageRouter,
    {
        path: '/error',
        name: 'error',
        component: () => import('@/views/Error.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        // @ts-ignore
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
    // @ts-ignore
    routes: [
        ...devRoutes,
        ...clientRoutes
    ]
});

// @ts-ignore
router.beforeEach((to, from, next) => {
    if (useErrorStore().getError) {
        if (to.matched.some((record) => record.name === 'error')) {
            return next();
        }
        return next({name: 'error'});
    }

    return next();
});

export default router;

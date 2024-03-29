export const homepageRouter = [
    {
        path: '/',
        name: 'homepage',
        component: () => import('@/modules/homepage/Homepage.vue'),
        meta: {requiresAuth: true}
    },
    {
        path: '/version',
        name: 'version',
        component: () => import('@/modules/homepage/Version.vue'),
        meta: {requiresAuth: true}
    }
];
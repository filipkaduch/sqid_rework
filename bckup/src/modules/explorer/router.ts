import {RouteLocation} from 'vue-router';
export const EXPLORER_NAME = 'explorer-detail';
export const explorerRouter = [
	{
		path: '/explorer',
		name: 'explorer',
		component: () => import('@/modules/explorer/Main.vue'),
		meta: {requiresAuth: true},
		children: [
			{
				path: ':id',
				name: EXPLORER_NAME,
				component: () => import('@/modules/explorer/Detail.vue'),
				props: (route: RouteLocation) => ({exploreId: route.params.id})
			}
		]
	}
];

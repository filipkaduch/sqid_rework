import {RouteLocation} from 'vue-router';

export const storyRouter = [
	{
		path: '/create-story/:id?/:preselectedType?',
		name: 'create-story',
		component: () => import('@/modules/story/components/CreateStory.vue'),
		props: (route: RouteLocation) => ({datasetId: route.params.id}),
		meta: {requiresAuth: true}
	},
	{
		path: '/story',
		component: () => import('@/modules/story/Main.vue'),
		children: [
			{
				path: '',
				name: 'story-list',
				component: () => import('@/modules/story/List.vue'),
				meta: {requiresAuth: true}
			},
			{
				path: ':id',
				name: 'story-editor',
				component: () => import('@/modules/story/components/editor/Editor.vue'),
				props: (route: RouteLocation) => ({storyId: route.params.id}),
				meta: {requiresAuth: true}
			},
			{
				path: ':id',
				name: 'dashboard-editor',
				component: () => import('@/modules/story/components/dashboard/Editor.vue'),
				props: (route: RouteLocation) => ({storyId: route.params.id}),
				meta: {requiresAuth: true}
			},
			{
				path: ':token/present',
				name: 'story-present',
				component: () => import('@/modules/story/components/presenter/Presenter.vue'),
				props: (route: RouteLocation) => ({token: route.params.token}),
				meta: {requiresAuth: true}
			},
			{
				path: ':token/present-dashboard',
				name: 'story-present-dashboard',
				component: () => import('@/modules/story/components/presenter/DashboardPresenter.vue'),
				props: (route: RouteLocation) => ({token: route.params.token}),
				meta: {requiresAuth: true}
			},
			{
				path: ':token/present-dashboard-vertical',
				name: 'story-present-dashboard-vertical',
				component: () => import('@/modules/story/components/presenter/Publisher.vue'),
				props: (route: RouteLocation) => ({token: route.params.token}),
				meta: {requiresAuth: true}
			}
		]
	},
	{
		path: '/publish/public/:token',
		name: 'story-publish',
		component: () => import('@/modules/story/components/presenter/Presenter.vue'),
		props: (route: RouteLocation) => ({token: route.params.token})
	},
	{
		path: '/publish/public/dashboard/:token',
		name: 'story-publish-dashboard',
		component: () => import('@/modules/story/components/presenter/DashboardPresenter.vue'),
		props: (route: RouteLocation) => ({token: route.params.token})
	},
	{
		path: '/publish/public/dashboard-vertical/:token',
		name: 'story-publish-dashboard-vertical',
		component: () => import('@/modules/story/components/presenter/Publisher.vue'),
		props: (route: RouteLocation) => ({token: route.params.token})
	},
	{
		path: '/publish/restricted/:token',
		name: 'story-publish-restricted',
		component: () => import('@/modules/story/components/presenter/Presenter.vue'),
		props: (route: RouteLocation) => ({token: route.params.token}),
		meta: {requiresAuth: true}
	},
	// TODO: route with type leave there some time for backward compatibility
	{
		path: '/publish/restriced/:token',
		name: 'story-publish-restricted',
		component: () => import('@/modules/story/components/presenter/Presenter.vue'),
		props: (route: RouteLocation) => ({token: route.params.token}),
		meta: {requiresAuth: true}
	},
	{
		path: '/publish/restricted/dashboard/:token',
		name: 'dashboard-publish-restricted',
		component: () => import('@/modules/story/components/presenter/DashboardPresenter.vue'),
		props: (route: RouteLocation) => ({token: route.params.token}),
		meta: {requiresAuth: true}
	},
	{
		path: '/publish/restricted/dashboard-vertical/:token',
		name: 'dashboard-vertical-publish-restricted',
		component: () => import('@/modules/story/components/presenter/Publisher.vue'),
		props: (route: RouteLocation) => ({token: route.params.token}),
		meta: {requiresAuth: true}
	}
];

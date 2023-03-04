import {RouteLocation} from 'vue-router';

export const datasetRouter = [
	{
		path: '/dataset',
		component: () => import('@/modules/dataset/Main.vue'),
		meta: {requiresAuth: true},
		children: [
			{
				path: '',
				name: 'dataset-list',
				component: () => import('@/modules/dataset/List.vue')
			},
			{
				path: 'create',
				component: () => import('@/modules/dataset/components/createDataset/Main.vue'),
				children: [
					{
						path: '',
						name: 'dataset-create',
						redirect: {name: 'dataset-create-upload'}
					},
					{
						path: 'upload',
						name: 'dataset-create-upload',
						component: () => import('@/modules/dataset/components/createDataset/Upload.vue')
					},
					{
						path: 'url',
						name: 'dataset-create-url',
						component: () => import('@/modules/dataset/components/createDataset/Url.vue')
					},
					{
						path: 'google-drive',
						name: 'dataset-create-google-drive',
						component: () => import('@/modules/dataset/components/createDataset/GoogleDrive.vue')
					},
					{
						path: 'import-dq',
						name: 'dataset-create-import-dq',
						component: () => import('@/modules/dataset/components/createDataset/ImportDQ.vue')
					}
				]
			},
			{
				path: ':id',
				name: 'dataset-detail',
				component: () => import('@/modules/dataset/Detail.vue'),
				props: (route: RouteLocation) => ({datasetId: route.params.id})
			}
		]
	}
];

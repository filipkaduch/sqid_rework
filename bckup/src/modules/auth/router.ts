export const authRouter = [
	{
		path: '/login',
		name: 'login',
		component: () => import('@/modules/auth/Login.vue')
	},
	{
		path: '/logout',
		name: 'logout'
	}
];

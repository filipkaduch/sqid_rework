import axios from 'axios';

const getInitialState = () => ({
	insights: [],
	error: null,
	loading: false
});

export default {
	namespaced: true,
	state: getInitialState(),
	getters: {
		insights: (state) => state.insights,
		error: (state) => state.error,
		loading: (state) => state.loading
	},
	mutations: {
		setInsights(state, insights) {
			state.insights = insights;
		},
		startLoading(state) {
			state.loading = true;
			state.error = null;
		},
		stopLoading(state) {
			state.loading = false;
		},
		setError(state, error) {
			state.error = error;
			state.loading = false;
		},
		reset(state) {
			Object.assign(state, getInitialState());
		}
	},
	actions: {
		loadInsights({commit}) {
			commit('reset');
			commit('startLoading');
			return axios.get('/v0/insights/configurations/')
				.then(({data}) => {
					commit('setInsights', data.data);
					commit('stopLoading');
				})
				.catch(() => {
					commit('setError', 'Can\'t load insights');
				});
		}
	}
};

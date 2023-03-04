const getInitialState = (reset = false) => ({
	configLoading: !reset
});

export default {
	namespaced: true,
	state: getInitialState(),
	getters: {
		configLoading: (state) => state.configLoading,
		loading: (state) => state.configLoading
	},
	mutations: {
		startConfigLoading(state) {
			state.configLoading = true;
		},
		stopConfigLoading(state) {
			state.configLoading = false;
		},
		reset(state) {
			Object.assign(state, getInitialState(true));
		}
	},
	actions: {
	}
};

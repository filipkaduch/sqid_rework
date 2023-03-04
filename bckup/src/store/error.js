const getInitialState = () => ({
	error: null,
	widgetErrors: {}
});

export default {
	namespaced: true,
	state: getInitialState(),
	getters: {
		error: (state) => state.error,
		widgetError: (state) => (widgetId) => state.widgetErrors[widgetId] ?? null
	},
	mutations: {
		setError(state, error) {
			state.error = error;
		},
		setWidgetError(state, payload) {
			state.widgetErrors[payload.sourceId] = payload.response;
		},
		reset(state) {
			Object.assign(state, getInitialState());
		}
	},
	actions: {
	}
};

const getInitialState = () => ({
	states: {},
	widgetIds: {}
});

export default {
	namespaced: true,
	state: getInitialState(),
	mutations: {
		addId(state, id) {
			state.widgetIds[String(id)] = 1;
		},
		removeId(state, id) {
			delete state.widgetIds[String(id)];
		},
		setState(state, {id, playState}) {
			state.states[String(id)] = playState;
		},
		reset(state) {
			Object.assign(state, getInitialState());
		}
	},
	getters: {
		playState: (state) => (id) => state.states[String(id)] ?? null,
		hasId: (state) => (id) => Boolean(state.widgetIds[String(id)]),
		allIds: (state) => Object.keys(state.widgetIds)
	}
};

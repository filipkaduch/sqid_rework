const getInitialState = () => ({
	messages: []
});

export default {
	namespaced: true,
	state: getInitialState(),
	getters: {
		messages: (state) => state.messages
	},
	mutations: {
		add(state, message) {
			state.messages.push(message);
		},
		remove(state, index) {
			if (index >= 0 && index < state.messages.length) {
				state.messages.splice(index, 1);
			}
		},
		reset(state) {
			Object.assign(state, getInitialState());
		}
	},
	actions: {
		addMessage({commit}, message) {
			commit('add', message);
		},
		removeMessage({commit}, index) {
			commit('remove', index);
		}
	}
};

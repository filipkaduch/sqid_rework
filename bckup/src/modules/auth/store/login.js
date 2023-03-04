import {inject} from 'vue';
import axios from 'axios';
import md5 from 'md5';
import router from '@/plugins/router';
let keycloak = null;
// eslint-disable-next-line no-undef
const initializeKeycloak = (appConfig) => new Keycloak({
	realm: appConfig.auth.keycloak.realm,
	url: appConfig.auth.keycloak.url,
	clientId: appConfig.auth.keycloak.clientId
});

// eslint-disable-next-line max-lines-per-function
const createKeycloak = () => new Promise((resolve, reject) => {
	const appConfig = inject('appConfig');
	if (appConfig
		&& appConfig.auth?.keycloak
		&& appConfig.auth.keycloak.realm
		&& appConfig.auth.keycloak.url
		&& appConfig.auth.keycloak.clientId) {
		// eslint-disable-next-line no-undef
		if (typeof Keycloak === 'undefined') {
			const existingScript = document.getElementById('keycloak-library');
			if (existingScript) {
				resolve(initializeKeycloak(appConfig));
			} else {
				const script = document.createElement('script');
				script.src = `${appConfig.auth.keycloak.url}/js/keycloak.js`;
				script.id = 'keycloak-library';
				document.body.appendChild(script);

				script.onload = () => {
					resolve(initializeKeycloak(appConfig));
				};

				script.onerror = () => {
					reject();
				};
			}
		} else {
			resolve(initializeKeycloak(appConfig));
		}
	} else {
		reject();
	}
});

const redirect = () => {
	if (localStorage.redirect) {
		const {redirect: redirectUrl} = localStorage;
		localStorage.removeItem('redirect');
		router.replace(redirectUrl);
	} else {
		router.replace({name: 'homepage'});
	}
};

const getInitialState = () => ({
	loading: false,
	token: null,
	tokenData: null,
	user: null,
	error: null,
	refreshTokenInterval: null
});

export default {
	namespaced: true,
	state: getInitialState(),
	getters: {
		loading: (state) => state.loading,
		error: (state) => state.error,
		token: (state) => state.token,
		tokenData: (state) => state.tokenData,
		gravatarHash: (state) => (state.tokenData?.email) ? md5(state.tokenData.email) : '',
		isAuthenticated: (state) => state.token && state.tokenData.exp > (Date.now() / 1000),
		user: (state) => state.user
	},
	mutations: {
		startLoading(state) {
			state.loading = true;
			state.error = null;
		},
		setToken(state, {token, tokenData}) {
			state.token = token;
			state.tokenData = tokenData;
		},
		setUser(state, user) {
			state.user = user;
			state.loading = false;
		},
		setError(state, error) {
			state.error = error;
			state.loading = false;
		},
		reset(state) {
			Object.assign(state, getInitialState());
		},
		setRefreshInterval(state, interval) {
			if (state.refreshTokenInterval) {
				clearInterval(state.refreshTokenInterval);
			}
			state.refreshTokenInterval = interval;
		}
	},
	actions: {
		// eslint-disable-next-line max-lines-per-function
		login({commit, dispatch}) {
			commit('reset');
			commit('startLoading');
			return ((keycloak) ? Promise.resolve() : createKeycloak())
				.then((tmpKeycloak) => {
					if (tmpKeycloak) {
						keycloak = tmpKeycloak;
					}
					return ((keycloak)
						? keycloak.init({
							onLoad: 'check-sso',
							silentCheckSsoRedirectUri: `${window.location.origin}${import.meta.env.ATACCAMA_ONE_TELLSTORY_WEBAPP_APP_BASE_URL || '/'}silent-check-sso.html`
						})
						: Promise.reject());
				})
				.then((authenticated) => {
					if (authenticated) {
						commit('setToken', {
							token: keycloak.token,
							tokenData: keycloak.tokenParsed
						});
						axios.post('/v0/auth/user')
							.then(({data}) => {
								commit('setUser', data.data.user);
								redirect();
							});
						commit('setRefreshInterval', setInterval(() => {
							keycloak.updateToken(20)
								.then((refreshed) => {
									if (refreshed) {
										commit('setToken', {
											token: keycloak.token,
											tokenData: keycloak.tokenParsed
										});
										console.info('Token was successfully refreshed');
									}
								})
								.catch(() => {
									console.error('Failed to refresh the token, or the session has expired');
									dispatch('reload');
								});
						}, 10000));
					} else {
						keycloak.login();
					}
				})
				.catch(() => {
					commit('setError', 't_UnexpectedError');
					console.error('keycloak failed to initialize');
				});
		},
		logout({commit}) {
			commit('setRefreshInterval', null);
			if (keycloak) {
				keycloak.logout({
					redirectUri: `${window.location.origin}${router.resolve({name: 'signout'}).href}`
				});
			} else {
				router.push({name: 'signout'});
			}
		},
		reload({commit, dispatch}) {
			commit('setRefreshInterval', null);
			dispatch('resetAll', null, {root: true})
				.then(() => {
					router.go(0);
				});
		}
	}
};

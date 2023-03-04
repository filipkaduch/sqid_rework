import * as HttpCode from 'http-status-codes';

import {objectCaseMapper, objectCaseStyles} from '@/util/objectCaseMapper';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import router from '@/plugins/router';
import store from '@/plugins/store';
const getConfig = await axios({
	url: '/config.json',
	// @ts-ignore
	baseURL: `${window.location.origin}${import.meta.env.ATACCAMA_ONE_TELLSTORY_WEBAPP_APP_BASE_URL || '/'}`
}).then((data) => data);
const appConfig = getConfig.data;

const RETRIES = 5;

const baseUrl = (instance) => {
	instance.interceptors.request.use(
		(config) => {
			if (!config.baseURL && appConfig && appConfig.apiBaseUrl) {
				config.baseURL = appConfig.apiBaseUrl;
			}
			return config;
		},
		(err) => Promise.reject(err)
	);
};

const auth = (instance) => {
	instance.interceptors.request.use(
		(config) => {
			if (
				appConfig?.apiBaseUrl
				&& config.baseURL === appConfig.apiBaseUrl
				&& appConfig.auth?.headerName
				&& store.getters['authLogin/isAuthenticated']
			) {
				const tokenType = appConfig.auth.tokenType ? `${appConfig.auth.tokenType} ` : '';
				config.headers[appConfig.auth.headerName] = `${tokenType}${store.getters['authLogin/token']}`;
			}
			return config;
		},
		(err) => Promise.reject(err)
	);
};

const responseErrors = (instance) => {
	instance.interceptors.response.use(
		(value) => value,
		(error) => {
			// Handle only request errors
			if (!error.response) {
				return Promise.reject(error);
			}

			if (error.response.status === HttpCode.UNAUTHORIZED) {
				// TODO
				// return store.dispatch('authLogin/logout');
			}
			if (error.response.status === HttpCode.FORBIDDEN) {
				// If it was on fetch data, save error to widgetErrors
				if (error.response?.config?.url.includes('fetch-data') || error.response?.config?.url.includes('queries')) {
					const payload = JSON.parse(error.response.config.data);
					store.commit('error/setWidgetError', {
						sourceId: payload.dataset_id ?? payload.catalog_item_id,
						response: {...error.response}
					});
				} else {
					store.commit('error/setError', 't_PageNotFound');
					router.push({name: 'error'});
				}
			}

			// TODO HttpCode.CONFLICT, HttpCode.NOT_FOUND, Other

			return Promise.reject(error);
		}
	);
};

const apiRequestMapper = (instance) => {
	instance.interceptors.request.use((config) => {
		if (appConfig && config.baseURL === appConfig.apiBaseUrl) {
			if (config.data) {
				config.data = objectCaseMapper(config.data, objectCaseStyles.SNAKE_CASE);
			}
			if (config.params) {
				config.params = objectCaseMapper(config.params, objectCaseStyles.SNAKE_CASE);
			}
		}
		return config;
	});
};

const apiResponseMapper = (instance) => {
	instance.interceptors.response.use((response) => {
		if (response.data && appConfig && response.config.baseURL === appConfig.apiBaseUrl) {
			response.data = objectCaseMapper(response.data, objectCaseStyles.CAMEL_CASE);
		}
		return response;
	}, (error) => {
		if (error.response.data && appConfig && error.response.config.baseURL === appConfig.apiBaseUrl) {
			error.response.data = objectCaseMapper(error.response.data, objectCaseStyles.CAMEL_CASE);
		}
		throw error;
	});
};

axiosRetry(axios, {
	retries: RETRIES,
	retryDelay: axiosRetry.exponentialDelay
});
auth(axios);
responseErrors(axios);
apiRequestMapper(axios);
apiResponseMapper(axios);
baseUrl(axios);

export default axios;

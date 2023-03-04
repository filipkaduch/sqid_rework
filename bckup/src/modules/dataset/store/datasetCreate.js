import * as HttpCode from 'http-status-codes';
import axios from 'axios';
import {getFormData, jobTypes, formatBytes} from '@/modules/dataset/utils/datasetUtils';
import {datasetService} from '@/modules/dataset/datasetService';

const getInitialState = () => ({
	uploading: [],
	uploadingError: [],
	downloading: false,
	downloadingError: null,
	file: [],
	uploadDatasetProgress: {},
	uploadDatasetSize: {},
	uploadingInterval: [],
	index: 0
});

const setDownloadingErrorMessage = (commit, dispatch, response) => {
	commit('setDownloadingError', response?.data?.message ?? 't_ImportingError');
	dispatch('flashMessages/addMessage', {
		variant: 'danger',
		text: response?.data?.message ?? 't_ImportingError'
	}, {root: true});
};

const setUploadingErrorMessage = (commit, dispatch, response, currentIndex = 0) => {
	commit('setUploadingError', {
		error: response?.data?.message ?? 't_UploadingError',
		i: currentIndex
	});
	dispatch('flashMessages/addMessage', {
		variant: 'danger',
		text: response?.data?.message ?? 't_UploadingError'
	}, {root: true});
};

export default {
	namespaced: true,
	state: getInitialState(),
	getters: {
		uploading: (state) => state.uploading,
		downloading: (state) => state.downloading,
		uploadingError: (state) => state.uploadingError,
		downloadingError: (state) => state.downloadingError,
		uploadDatasetProgress: (state) => state.uploadDatasetProgress,
		uploadDatasetSize: (state) => state.uploadDatasetSize
	},
	mutations: {
		setFile(state, obj) {
			state.file[obj.i] = obj.file;
		},
		setUploadingInterval(state, obj) {
			state.uploadingInterval[obj.i] = obj.interval;
		},
		startUploading(state, i) {
			state.uploading[i] = true;
		},
		stopUploading(state, i) {
			state.uploading[i] = false;
		},
		setUploadDatasetProgress(state, {datasetId, progress}) {
			if (progress === null) {
				delete state.uploadDatasetProgress[datasetId];
			} else {
				state.uploadDatasetProgress[datasetId] = progress;
			}
		},
		setUploadDatasetSize(state, {datasetId, size}) {
			if (size === null) {
				delete state.uploadDatasetSize[datasetId];
			} else {
				state.uploadDatasetSize[datasetId] = size;
			}
		},
		startDownloading(state) {
			state.downloading = true;
		},
		stopDownloading(state) {
			state.downloading = false;
		},
		setDownloadingError(state, error) {
			state.downloadingError = error;
		},
		setUploadingError(state, obj) {
			state.uploadingError[obj.i] = obj.error;
		},
		reset(state) {
			Object.assign(state, getInitialState());
		},
		nextIndex(state) {
			state.index += 1;
		}
	},
	actions: {
		// eslint-disable-next-line max-lines-per-function
		importGSheet({commit, dispatch}, payload) {
			commit('startDownloading');
			return axios.post('/v0/datasets/', {
				visibility: 'PRIVATE',
				name: payload.datasetName,
				externalRunnerJobRef: {jobType: jobTypes.PROCESS_GOOGLE_SHEET},
				jobParams: {
					spreadsheetKey: payload.fileId,
					sheetName: payload.sheet
				},
				...(payload.scheduling
					? {
						scheduling: payload.scheduling
					}
					: {})
			})
				.then(({data}) => axios.post(`/v0/dataset-tasks/manual-run/${data.data.id}`, {
					jobType: jobTypes.PROCESS_GOOGLE_SHEET,
					parameters: {
						spreadsheetKey: payload.fileId,
						sheetName: payload.sheet
					}
				}))
				.catch(({response}) => {
					setDownloadingErrorMessage(commit, dispatch, response);
					return Promise.resolve();
				})
				.finally(() => {
					commit('stopDownloading');
				});
		},
		// eslint-disable-next-line max-lines-per-function
		importUrl({commit, dispatch}, payload) {
			commit('startDownloading');
			return axios.post('/v0/datasets/', {
				visibility: 'PRIVATE',
				name: payload.datasetName,
				externalRunnerJobRef: {jobType: jobTypes.PROCESS_URL_LINK},
				jobParams: {urlLink: payload.fileUrl},
				...(payload.scheduling
					? {
						scheduling: payload.scheduling
					}
					: {})
			})
				.then(({data}) => axios.post(`/v0/dataset-tasks/manual-run/${data.data.id}`, {
					jobType: jobTypes.PROCESS_URL_LINK,
					parameters: {urlLink: payload.fileUrl}
				}))
				.catch(({response}) => {
					setDownloadingErrorMessage(commit, dispatch, response);
					return Promise.resolve();
				})
				.finally(() => {
					commit('stopDownloading');
				});
		},
		async updateUrl({commit, dispatch}, payload) {
			commit('startDownloading');
			try {
				await datasetService.updateDataset(payload.id, {
					visibility: 'PRIVATE',
					name: payload.datasetName,
					externalRunnerJobRef: {jobType: jobTypes.PROCESS_URL_LINK},
					jobParams: {urlLink: payload.fileUrl},
					...(payload.scheduling
						? {
							scheduling: payload.scheduling
						}
						: {})
				});

				await datasetService.manualReRun(payload.id, {
					jobType: jobTypes.PROCESS_URL_LINK,
					parameters: {urlLink: payload.fileUrl}
				});
			} catch (error) {
				setDownloadingErrorMessage(commit, dispatch, error);
			}
			commit('stopDownloading');
		},
		async updateFile({state, commit, dispatch}, payload) {
			if (state.file.length > 0) {
				commit('nextIndex');
			}
			const currentIndex = state.index;
			commit('startUploading', currentIndex);
			commit('setFile', {
				file: payload.file,
				i: currentIndex
			});
			const tempDataId = await datasetService.updateDataset(payload.id, {
				visibility: 'PRIVATE',
				name: payload.datasetName
			});
			try {
				const linkResponse = await datasetService.generateUploadLink(tempDataId.id);
				const linkData = linkResponse.data;
				await axios.post(
					linkData.url,
					getFormData(linkData.requestFields, state.file[currentIndex]),
					{
						baseURL: '/',
						headers: {
							'Content-Type': 'multipart/form-data'
						},
						onUploadProgress: (progressEvent) => {
							const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
							commit('setUploadDatasetProgress', {
								datasetId: tempDataId.id,
								progress: percentCompleted
							});
							commit('setUploadDatasetSize', {
								datasetId: tempDataId.id,
								size: {
									dynamicText: formatBytes(progressEvent.loaded),
									totalText: ` of ${formatBytes(progressEvent.total)}`
								}
							});
						}
					}
				);
				await datasetService.manualReRun(payload.id, {
					jobType: jobTypes.PROCESS_CSV_FILE,
					parameters: {
						rawObjectKey: linkData.requestFields.key
					}
				});
			} catch (error) {
				setUploadingErrorMessage(commit, dispatch, error, currentIndex);
			}

			commit('stopUploading', currentIndex);
			commit('setUploadDatasetProgress', {
				datasetId: tempDataId.id,
				progress: 0
			});
		},
		// eslint-disable-next-line max-lines-per-function
		importFile({state, commit, dispatch}, payload) {
			let tempDataId = null;
			let linkData = null;
			if (state.file.length > 0) {
				commit('nextIndex');
			}
			const currentIndex = state.index;
			commit('startUploading', currentIndex);
			commit('setFile', {
				file: payload.file,
				i: currentIndex
			});
			return axios.post('/v0/datasets/', {
				visibility: 'PRIVATE',
				name: payload.datasetName
			})
				// eslint-disable-next-line max-lines-per-function
				.then(({data}) => {
					tempDataId = data;

					axios.post(`/v0/dataset-tasks/generate-upload-link/${tempDataId.data.id}`).then(({data: uploadLinkData}) => {
						linkData = uploadLinkData;
						return axios.post(
							linkData.data.url,
							getFormData(linkData.data.requestFields, state.file[currentIndex]),
							{
								baseURL: '/',
								headers: {
									'Content-Type': 'multipart/form-data'
								},
								onUploadProgress: (progressEvent) => {
									const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
									commit('setUploadDatasetProgress', {
										datasetId: tempDataId.data.id,
										progress: percentCompleted
									});
									commit('setUploadDatasetSize', {
										datasetId: tempDataId.data.id,
										size: {
											dynamicText: formatBytes(progressEvent.loaded),
											totalText: ` of ${formatBytes(progressEvent.total)}`
										}
									});
								}
							}
						);
					})
						.then((response) => response.status === HttpCode.NO_CONTENT
							? axios.post(`/v0/dataset-tasks/manual-run/${tempDataId.data.id}`, {
								jobType: jobTypes.PROCESS_CSV_FILE,
								parameters: {
									rawObjectKey: linkData.data.requestFields.key
								}
							})
							: Promise.reject())
						.catch(({response}) => {
							setUploadingErrorMessage(commit, dispatch, response, currentIndex);
							return Promise.resolve();
						})
						.finally(() => {
							commit('stopUploading', currentIndex);
						});
					commit('setUploadDatasetProgress', {
						datasetId: tempDataId.data.id,
						progress: 0
					});
					return Promise.resolve();
				});
		}
	}
};

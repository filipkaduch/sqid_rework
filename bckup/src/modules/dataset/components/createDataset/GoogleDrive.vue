<template>
	<app-loading :loading="loading">
		<ds-box padding-top="L">
			<div v-if="!signed">
				<ds-box padding-bottom="M">
					<ds-text color="display-content">
						{{ $t('datasetUpload.gDrive.signIn') }}
					</ds-text>
				</ds-box>
				<ds-btn
					class="google-button"
					variant="secondary"
					@click="handleAuthClick">
					<template #icon>
						<ds-icon class="img-container" name="google-logo" alt="Google Logo" />
					</template>
					<span>{{ $t('datasetUpload.gDrive.signInBtn') }}</span>
				</ds-btn>
				<hr v-if="signed">
			</div>
			<div v-else>
				<ds-box>
					<ds-inline gap="S">
						<ds-inline-item>
							<ds-icon name="icon-google" />
						</ds-inline-item>
						<ds-inline-item>
							<ds-text color="display-content">
								{{ profileEmail }}
							</ds-text>
						</ds-inline-item>
						<ds-inline-item>
							<ds-box padding-left="S" class="cursor-pointer" @click="handleSignoutClick">
								<ds-text>
									{{ $t('datasetUpload.gDrive.signOut') }}
								</ds-text>
							</ds-box>
						</ds-inline-item>
					</ds-inline>
					<hr>
				</ds-box>
				<div v-if="!file" class="pr-2" :class="modal ? 'w-100' : 'w-50'">
					<ds-box padding-bottom="S">
						<ds-text color="display-content">{{ $t('datasetUpload.gDrive.chooseSpreadsheet') }}</ds-text>
					</ds-box>
					<ds-select
						v-if="modal"
						:initialValue="$t('datasetUpload.gDrive.findSpreadsheet')"
						:items="files"
						:has-search="true"
						:placement="'bottom'"
						container=".modal-content"
						@input="file = $event" />
					<multiselect
						v-else
						:model-value="file"
						:options="files"
						:deselect-label="''"
						:placeholder="$t('datasetUpload.gDrive.findSpreadsheet')"
						:select-label="''"
						track-by="id"
						label="name"
						@update:model-value="file = $event" />
				</div>
				<ds-box v-else-if="file && !modal">
					<ds-row class="align-items-center">
						<ds-col cols="4">
							<ds-inline>
								<ds-icon name="icon-success" alt="success" />
								<ds-text variant="bodyMedium" class="text-truncate align-content-center ml-2">
									{{ file.name }}
								</ds-text>
							</ds-inline>
						</ds-col>
						<ds-col cols="5" class="p-0">
							<app-loading :loading="loadingSheets">
								<ds-inline gap="M">
									<ds-inline-item flex-grow="1" flex-basis>
										<bootstrap-select
											v-model:value="sheet"
											:disabled="!file || loadingSheets"
											value-field="title"
											text-field="title"
											:options="sheets" />
									</ds-inline-item>
									<ds-inline-item flex-grow="1" flex-basis>
										<app-input-bar
											v-model:input="datasetName"
											:placeholder="$t('t_DatasetName')" />
									</ds-inline-item>
								</ds-inline>
							</app-loading>
						</ds-col>
						<ds-col cols="1" />
						<ds-col cols="2">
							<ds-box align="right">
								<ds-btn variant="ghost" @click="deleteFile">
									<template #icon>
										<ds-icon name="icon-trash" />
									</template>
									{{ $t('datasetUpload.deleteFile') }}
								</ds-btn>
							</ds-box>
						</ds-col>
					</ds-row>
				</ds-box>
				<ds-box v-else-if="file && modal">
					<ds-row class="align-items-center">
						<ds-col cols="8">
							<ds-inline>
								<ds-icon name="icon-success" alt="success" />
								<ds-text variant="bodyMedium" class="text-truncate align-content-center ml-2">
									{{ datasetName }}
								</ds-text>
							</ds-inline>
						</ds-col>
						<ds-col cols="4">
							<ds-box align="right">
								<ds-btn variant="ghost" @click="deleteFile">
									<template #icon>
										<ds-icon name="icon-trash" />
									</template>
									{{ $t('datasetUpload.deleteFile') }}
								</ds-btn>
							</ds-box>
						</ds-col>
					</ds-row>
					<ds-row class="align-items-center pt-2">
						<ds-col cols="12">
							<app-loading :loading="loadingSheets">
								<ds-inline gap="M">
									<ds-inline-item flex-grow="1" flex-basis>
										<ds-select
											:initialValue="$t('datasetUpload.selectSpreadsheet')"
											:disabled="!file || loadingSheets"
											:items="sheetOptions"
											placement="bottom"
											container=".modal-content"
											@input="sheet = $event" />
									</ds-inline-item>
									<ds-inline-item flex-grow="1" flex-basis>
										<app-input-bar
											v-model:input="datasetName"
											:placeholder="$t('t_DatasetName')" />
									</ds-inline-item>
									<!--<ds-box class="h-100 my-auto">
										<img src="@/assets/ds-icon-minus-circle.svg" alt="Delete sheet">
									</ds-box>-->
								</ds-inline>
							</app-loading>
						</ds-col>
					</ds-row>
					<!-- TODO: ADD SUPPORT FOR MULTIPLE SHEETS SELECTED -->
					<!--<ds-row class="pt-2">
						<ds-col cols="4">
							<ds-btn variant="secondary" :small="true">
								<template v-slot:icon>
									<ds-icon name="icon-plus-sign" alt="Add sheet" />
								</template>
								{{ $t('datasetUpload.addSheet') }}
							</ds-btn>
						</ds-col>
					</ds-row>-->
				</ds-box>
			</div>
		</ds-box>
		<teleport v-if="showPortal && isMounted" to="#upload-form-portal">
			<ds-card v-if="isScheduledUploadFeature && !modal" body-class="p-0" class="p-5 mb-3 border-0 w-100">
				<ds-box padding-bottom="L">
					<ds-text variant="subheadline">
						2. {{ $t('datasetUpload.cardHeadlines.autoUpdateCycle') }}
					</ds-text>
				</ds-box>
				<auto-update-types v-model:scheduling="scheduling" />
			</ds-card>
			<create-dataset-card
				:modal="modal"
				:disabled="!datasetName || !file || !sheet || disableClick"
				@cancel="resetForm"
				@upload="chooseAction" />
		</teleport>
	</app-loading>
</template>

<script lang="ts">
import 'vue-multiselect/dist/vue-multiselect.css';
import '@/styles/_multiselect.scss';
import * as HttpCode from 'http-status-codes';
import AppInputBar from '@/components/inputs/AppInputBar.vue';
import AppLoading from '@/components/design/AppLoading.vue';
import Multiselect from 'vue-multiselect';
import CreateDatasetCard from '@/modules/dataset/components/createDataset/CreateDatasetCard.vue';
import AutoUpdateTypes from '@/modules/dataset/components/createDataset/AutoUpdateTypes.vue';
import {datasetCreateService} from './datasetCreateService';
import {
	computed,
	defineComponent,
	onActivated,
	onDeactivated,
	watch,
	onMounted,
	reactive,
	toRefs, inject
} from 'vue';
import {jobTypes} from '@/modules/dataset/utils/datasetUtils';
import {updateDatasetModal} from '@/modules/dataset/utils/dataset';
import {i18n} from '@/plugins/all';
const {t} = i18n.global;
import {useNotification} from '@kyvg/vue3-notification';
import BootstrapSelect from '@/components/temporary/BootstrapSelect.vue';
import {useRouter} from 'vue-router';
import {useStore} from 'vuex';

interface DriveFile {
	id: string;
}

interface DriveSheet {
	properties: {
		title: string;
		sheetId: string;
	};
	title: string;
}

export default defineComponent({
	name: 'GoogleDrive',
	components: {
		BootstrapSelect,
		AutoUpdateTypes,
		AppLoading,
		AppInputBar,
		CreateDatasetCard,
		Multiselect
	},
	props: {
		modal: {
			type: Boolean,
			default: false
		},
		updateId: {
			type: String,
			default: null
		}
	},
	emits: ['cancel', 'closeModal'],
	// eslint-disable-next-line max-statements
	setup(props, {emit}) {
		const router = useRouter();
		const store = useStore();
		const notification = useNotification();
		const appConfig = inject('appConfig');
		const state = reactive({
			loading: true,
			signed: false,
			loadingSheets: false,
			waiting: false,
			search: '',
			files: [],
			sheetOptions: [] as any,
			profileEmail: '',
			showPortal: true,
			disableClick: false,
			isMounted: false
		});

		const form = reactive({
			datasetName: '',
			file: null as DriveFile | null,
			sheets: [] as DriveSheet[],
			sheet: null as string | null,
			scheduling: null
		});

		const resetForm = () => {
			form.datasetName = '';
			form.file = null;
			form.sheets = [];
			form.sheet = null;
			form.scheduling = null;
			if (props.modal) {
				emit('cancel');
			}
		};

		let codeClient: any = {};
		let gapiInitialised = false;
		let gisInitialised = false;

		const gapiLoaded = () => {
			window.gapi.load('client', initializeGapiClient);
		};

		const initializeGapiClient = async() => {
			await window.gapi.client.init({
				// @ts-ignore
				apiKey: appConfig.googleApi.apiKey,
				discoveryDocs: [
					'https://sheets.googleapis.com/$discovery/rest?version=v4',
					'https://content.googleapis.com/discovery/v1/apis/drive/v3/rest'
				]
			});
			gapiInitialised = true;
			await onLibrariesLoaded();
		};

		const gisLoaded = () => {
			// @ts-ignore
			codeClient = window.google.accounts.oauth2.initCodeClient({
				// @ts-ignore
				// eslint-disable-next-line camelcase
				client_id: appConfig.googleApi.clientId,
				scope: 'email https://www.googleapis.com/auth/drive.readonly',
				callback: ''
			});
			gisInitialised = true;
			onLibrariesLoaded();
		};

		const onLibrariesLoaded = async() => {
			if (gapiInitialised && gisInitialised) {
				try {
					await setTokenAndGetFiles();
				} catch (error: any) {
					notification.notify({
						type: 'danger',
						text: error?.response?.data?.error?.message ?? t('t_UnexpectedError'),
						duration: 5000
					});
				}
			}
		};

		const handleAuthClick = () => {
			codeClient.callback = async(resp: any) => {
				if (typeof resp.error !== 'undefined') {
					throw (resp);
				}

				await datasetCreateService.googleSignIn(resp.code);
				await setTokenAndGetFiles();
			};

			if (window.gapi.client.getToken() === null) {
				// Prompt the user to select a Google Account and ask for consent to share their data
				// when establishing a new session.
				codeClient.requestCode({prompt: 'consent'});
			} else {
				// Skip display of account chooser and consent dialog for an existing session.
				codeClient.requestCode({prompt: ''});
			}
		};

		const parseJwt = (token: string) => {
			// eslint-disable-next-line prefer-destructuring
			const base64Url = token.split('.')[1];
			const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
			const jsonPayload = decodeURIComponent(atob(base64).split('').map((char: string) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''));

			return JSON.parse(jsonPayload);
		};

		const setTokenAndGetFiles = async() => {
			// Check if token is already set
			const {accessToken, idToken} = await datasetCreateService.getAccessToken();
			if (accessToken) {
				window.gapi.client.setToken({
					// eslint-disable-next-line camelcase
					access_token: accessToken
				});

				state.signed = true;
				await getFiles();
			}

			if (idToken) {
				state.profileEmail = parseJwt(idToken).email;
			}
		};

		const handleSignoutClick = () => {
			const token = window.gapi.client.getToken();
			if (token !== null) {
				// @ts-ignore
				window.google.accounts.oauth2.revoke(token.access_token);
				window.gapi.client.setToken('');
				datasetCreateService.googleSignOut();
				state.signed = false;
			}
		};

		const loadGapi = () => {
			const script = document.createElement('script');
			script.onload = gapiLoaded;
			script.async = true;
			script.src = 'https://apis.google.com/js/api.js';
			document.head.appendChild(script);
		};

		const loadGsi = () => {
			const script = document.createElement('script');
			script.onload = gisLoaded;
			script.async = true;
			script.src = 'https://accounts.google.com/gsi/client';
			document.head.appendChild(script);
		};

		const getFiles = () => window.gapi.client.drive.files.list({
			// eslint-disable-next-line id-length
			q: 'mimeType = "application/vnd.google-apps.spreadsheet"'
		})
			.then(({result: {files}}: any) => {
				if (props.modal) {
					state.files = files.map((fileMap: any) => ({
						value: fileMap.id,
						selectLabel: fileMap.name
					}));
				} else {
					state.files = files;
				}
			})
			.catch(() => {
				// @ts-ignore
				notification.notify({
					type: 'danger',
					text: t('t_CantLoadGoogleDriveFiles'),
					duration: 5000
				});
				return {files: []};
			});

		const getSheets = () => {
			state.loadingSheets = true;
			window.gapi.client.sheets.spreadsheets.get({
				spreadsheetId: form.file?.id ?? form.file,
				includeGridData: false
			})
				.then(({result: {sheets}}: any) => {
					form.sheets = sheets.map((sheet: DriveSheet) => sheet.properties);
					form.sheet = form.sheets.length === 1 ? form.sheets[0].title : null;
					if (props.modal) {
						state.sheetOptions = sheets.map((sheet: DriveSheet) => ({
							properties: sheet.properties,
							selectLabel: sheet?.properties?.title,
							value: sheet?.properties?.sheetId
						}));
					}
					state.loadingSheets = false;
				});
		};

		onMounted(() => {
			try {
				loadGapi();
				loadGsi();
			} catch (error) {
				// eslint-disable-next-line no-negated-condition
				if (error?.response?.status !== HttpCode.NOT_FOUND) {
					// @ts-ignore
					notification.notify({
						type: 'danger',
						text: t('t_UnexpectedError'),
						duration: 5000
					});
				}
			} finally {
				state.loading = false;
			}
		});

		onMounted(() => {
			state.isMounted = true;
		});

		onActivated(() => {
			state.showPortal = true;
		});

		onDeactivated(() => {
			state.showPortal = false;
		});

		const isScheduledUploadFeature = computed(() => store.getters['authLogin/user']?.subscription?.subscriptionPlan?.features?.scheduledUpload ?? false);

		watch(() => form.file, () => {
			if (!form.datasetName) {
				if (props.modal) {
					// @ts-ignore
					form.datasetName = state.files.find((file: unknown) => file.value === form.file)?.selectLabel;
				} else {
					// @ts-ignore
					form.datasetName = state.files.find((file: unknown) => file.id === form.file?.id)?.name;
				}
			}
			if (form.file) {
				getSheets();
			}
		});

		const chooseAction = async() => {
			if (props.modal) {
				await updateDataset();
			} else {
				await importDataset();
			}
		};

		const importDataset = () => {
			state.disableClick = true;
			state.waiting = true;
			store.dispatch('datasetCreate/importGSheet', {
				datasetName: form.datasetName,
				fileId: form.file?.id,
				sheet: form.sheet,
				scheduling: form.scheduling
			}).then(() => {
				// @ts-ignore
				notification.notify({
					type: 'success',
					text: t('t_googleUploading'),
					duration: 5000
				});
				router.push({name: 'dataset-list'});
			})
				.finally(() => {
					state.waiting = false;
				});
		};

		const updateDataset = async() => {
			const action = await updateDatasetModal(
				t('t_googleUploading'),
				t('dataset.update.updateError'),
				{
					visibility: 'PRIVATE',
					name: form.datasetName,
					externalRunnerJobRef: {jobType: jobTypes.PROCESS_GOOGLE_SHEET},
					jobParams: {
						spreadsheetKey: form.file?.id,
						sheetName: form.sheet
					}
				},
				props.updateId
			);
			emit(action);
		};

		const deleteFile = () => {
			form.file = null;
			form.datasetName = '';
		};

		return {
			...toRefs(state),
			...toRefs(form),
			isScheduledUploadFeature,
			importDataset,
			deleteFile,
			chooseAction,
			updateDataset,
			resetForm,
			handleAuthClick,
			handleSignoutClick
		};
	}
});
</script>

<style scoped lang="scss">
.column-select-right, .custom-select, .form-control {
	height: 36px;
}
.google-button {
	.img-container {
		width: 15px;
		height: 15px;
	}
}
</style>

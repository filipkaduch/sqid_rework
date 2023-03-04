<template>
	<ds-box class="cursor-pointer" flex-type="column" border-radius="basic" align="right">
		<ds-dropdown placement="bottom-end">
			<template #triggerContent>
				<ds-btn
					variant="ghost"
					style="color: #757575;"
					class="collapseBtnSize border-0">
					<fa-icon :icon="['fas', 'ellipsis-v']" class="m-0" />
				</ds-btn>
			</template>
			<template #dropdownContent>
				<dropdown-menu-basic
					:items="getActionItems(dataset)"
					:last="true"
					:dark-icon="true"
					@update:selected="selectDataset(dataset, $event)" />
			</template>
		</ds-dropdown>
		<ds-modal
			:show="modalActions.reuploadAction"
			:header-text="$t('datasetUpload.reuploadDataset')"
			size="md"
			:footer-class="'h-100'"
			:cancelText="$t('modals.cancel')"
			@ok="modalActions.reuploadAction = false"
			@cancel="closeReuploadModal">
			<template #modal-text>
				<ds-box>
					<import-types-list :items="sourceTypes" :horizontal="true" :selected="selectedType" @selected="selectedType = $event" />
				</ds-box>
				<url
					v-if="selectedType === UPLOAD_TYPES.IMPORT_URL"
					:update-id="datasetId"
					:modal="true"
					@close-modal="successUpdate"
					@cancel="closeReuploadModal" />
				<upload
					v-else-if="selectedType === UPLOAD_TYPES.UPLOAD_FILE"
					:update-id="datasetId"
					:modal="true"
					@close-modal="successUpdate"
					@cancel="closeReuploadModal" />
				<import-d-q
					v-else-if="selectedType === UPLOAD_TYPES.DQ_IMPORT"
					:update-id="datasetId"
					:modal="true"
					@close-modal="successUpdate"
					@cancel="closeReuploadModal" />
				<google-drive
					v-else-if="selectedType === UPLOAD_TYPES.GOOGLE_DRIVE"
					:update-id="datasetId"
					:modal="true"
					@close-modal="successUpdate"
					@cancel="closeReuploadModal" />
				<div id="reupload-form-portal" class="w-100" />
			</template>
			<template #modal-footer>
				<div id="upload-form-portal" class="w-75" />
			</template>
		</ds-modal>
		<ds-modal
			:show="modalActions.shareAction"
			:header-text="$t('datasetDetail.sharingOptions')"
			:confirm-text="null"
			size="md"
			:cancel-text="$t('t_Cancel')"
			@ok="modalActions.shareAction = false"
			@cancel="modalActions.shareAction = false">
			<template #modal-text>
				<dataset-sharing :show-headline="false" :dataset-id="datasetId" />
			</template>
		</ds-modal>
		<ds-modal
			:show="modalActions.renameAction"
			size="md"
			:header-text="$t('t_RenameDataset')"
			:confirm-text="$t('t_Rename')"
			:cancel-text="$t('t_Cancel')"
			@ok="updateDatasetName"
			@cancel="modalActions.renameAction = false">
			<template #modal-text>
				<ds-input
					v-model:value="newDatasetName"
					type="text"
					:placeholder="datasetName" />
			</template>
		</ds-modal>
	</ds-box>
</template>

<script lang="ts">
import ImportTypesList from '@/modules/dataset/components/createDataset/ImportTypesList.vue';
import DropdownMenuBasic from '@/components/main/Dropdown/DropdownMenuBasic.vue';
import DatasetSharing from '@/modules/dataset/components/detail/Sharing.vue';
import {computed, reactive, toRefs, watch, ref, defineComponent, inject} from 'vue';
import {
	sourceIcon,
	getJobType,
	compareJobRunStatus,
	UPLOAD_TYPES,
	getReuploadType,
	updateDatasetModal,
	actionValues,
	actionItems,
	actionItemsDetail,
	actionMenuSets
} from '@/modules/dataset/utils/dataset';
import {jobTypes} from '@/modules/dataset/utils/datasetUtils';
import {DatasetJobStatus, DatasetStatus} from '@/modules/dataset/consts/enums';
import GoogleDrive from '@/modules/dataset/components/createDataset/GoogleDrive.vue';
import Upload from '@/modules/dataset/components/createDataset/Upload.vue';
import Url from '@/modules/dataset/components/createDataset/Url.vue';
import ImportDQ from '@/modules/dataset/components/createDataset/ImportDQ.vue';
import {cloneDeep} from 'lodash';
import {datasetService} from '@/modules/dataset/datasetService';
import {SelectTypes} from '@/modules/dataset/components/createDataset/types';
import {datasetHeaderEnums} from '../utils/datasetListUtils';
import {useRouter} from 'vue-router';
import {storyType} from '@/modules/story/consts/storyType';
import {i18n} from '@/plugins/all';
const {t} = i18n.global;
import {useNotification} from '@kyvg/vue3-notification';
import {useStore} from 'vuex';
import {useSaasLimits} from '@/modules/limits/store/limits';
import {SelectItem} from '@/components/main/Dropdown/types';
import {LimitStatus} from '@/modules/limits/consts/enums';

export default defineComponent({
	name: 'DataStoriesDatasetActions',
	components: {
		GoogleDrive,
		ImportDQ,
		Upload,
		Url,
		ImportTypesList,
		DatasetSharing,
		DropdownMenuBasic
	},
	props: {
		disabled: {
			type: Boolean,
			default: false
		},
		dataset: {
			type: Object,
			default: null
		},
		datasetName: {
			type: String,
			default: null
		},
		datasetId: {
			type: String,
			default: null
		},
		actionsSet: {
			type: String,
			default: actionMenuSets.ACTION_ITEMS
		}
	},
	emits: ['cancel', 'reloadData', 'deleteDataset', 'updateCycle'],
	// eslint-disable-next-line max-lines-per-function,max-statements
	setup(props, {emit}) {
		const store = useStore();
		const router = useRouter();
		const notification = useNotification();
		const appConfig = inject('appConfig');
		const state = reactive({
			datasetToDelete: null as any,
			selected: null as any,
			selectedDataset: null as any,
			newDatasetName: '',
			modalActions: {
				deleteAction: false,
				refreshAction: false,
				reuploadAction: false,
				renameAction: false,
				shareAction: false,
				createStory: false
			},
			selectedType: null as any
		});

		const successUpdate = async() => {
			await refreshDataset(state.selectedDataset);
			closeReuploadModal();
			emit('reloadData');
		};
		const isShared = computed(() => props.dataset[datasetHeaderEnums.SHARED_BY]);
		const saasLimitsState = useSaasLimits();

		const getActionItems = (dataset: any) => {
			// Special case for shared story
			if (isShared.value) {
				const actionFiltered: SelectItem | undefined = actionItems.find((action: any) => action.value === actionValues.CREATE_STORY);
				if (actionFiltered) {
					actionFiltered.disabled = saasLimitsState.limitStatusStories.value === LimitStatus.ERROR;
				}
				return [actionFiltered] as SelectItem[];
			}

			// Get the correct menu set
			let datasetActionItems = props.actionsSet === actionMenuSets.ACTION_ITEMS_DETAIL ? cloneDeep(actionItemsDetail) : cloneDeep(actionItems);

			if (dataset.latestScheduledJobRun?.externalRunnerReference.jobType === jobTypes.PROCESS_CSV_FILE) {
				datasetActionItems = datasetActionItems.filter((item: any) => item.value !== actionValues.REFRESH);
			}
			if (getJobType(dataset) === jobTypes.PROCESS_DQ_RULE || getJobType(dataset) === jobTypes.PROCESS_DQ_ATTR) {
				datasetActionItems = datasetActionItems.filter((item: any) => item.value !== actionValues.REUPLOAD);
			} else {
				const index = datasetActionItems.findIndex((item: any) => item.value === actionValues.REUPLOAD);
				if (index >= 0) {
					datasetActionItems[index].icon = sourceIcon(dataset.latestScheduledJobRun?.externalRunnerReference.jobType);
				}
			}

			if (dataset.State === DatasetStatus.ERROR || dataset.State === DatasetStatus.NO_DATA) {
				datasetActionItems = datasetActionItems.filter((actionItem) => actionItem.value !== actionValues.CREATE_STORY
					&& actionItem.value !== actionValues.CREATE_EXPLORATION);
			}

			return datasetActionItems.map((item: SelectItem) => {
				if (saasLimitsState.limitStatusStories.value === LimitStatus.ERROR) {
					if (item.value === actionValues.CREATE_STORY || item.value === actionValues.CREATE_EXPLORATION) {
						item.disabled = true;
					}
				} else {
					item.disabled = false;
				}
				return item;
			});
		};

		// @ts-expect-error
		const googleDriveEnabled = appConfig?.googleApi?.apiKey && appConfig.googleApi.clientId;
		// TODO: enable reupload of DQ when possible
		// const importDqEnabled = appConfig?.oneIntegration;
		const importDqEnabled = false;
		// eslint-disable-next-line no-unused-vars
		const sourceTypes: SelectTypes = {
			uploadFile: {
				icon: 'upload-file',
				text: 't_UploadFile',
				route: 'dataset-create-upload'
			},
			importUrl: {
				icon: 'url-link',
				text: 't_ImportUrl',
				route: 'dataset-create-url'
			},
			...(googleDriveEnabled
				? {
					gDrive: {
						icon: 'google-drive',
						text: 't_ImportGoogleDrive',
						route: 'dataset-create-google-drive'
					}
				}
				: {}),
			...(importDqEnabled
				? {
					dq: {
						icon: 'data-quality',
						text: 't_ImportDQ',
						route: 'dataset-create-import-dq'
					}
				}
				: {}
			)
			// objectStorage: {
			// icon: 'object-storage',
			// text: 't_ImportObjectStorage',
			// route: ''
			// }
		};

		const deleteDataset = (dataset: any) => {
			state.datasetToDelete = dataset;
			emit('deleteDataset', dataset);
		};

		const selectDataset = (dataset: any, event: any) => {
			if (event.value === actionValues.REFRESH) {
				refreshDataset(dataset);
			} else if (event.value === actionValues.UPDATE_CYCLE) {
				emit('updateCycle', dataset);
			} else if (event.value === actionValues.CREATE_STORY) {
				router.push({
					name: 'create-story',
					params: {id: props.datasetId}
				});
			} else if (event.value === actionValues.CREATE_EXPLORATION) {
				router.push({
					name: 'create-story',
					params: {id: props.datasetId, preselectedType: storyType.DATA_EXPLORE}
				});
			} else if (event.value === actionValues.DELETE) {
				state.selectedDataset = dataset;
				deleteDataset(dataset);
			} else {
				state.selectedType = getReuploadType(getJobType(dataset));
				state.selectedDataset = dataset;
				state.selected = event;
			}
		};

		const updateDatasetName = async() => {
			const action = await updateDatasetModal(
				t('dataset.update.updateSuccess'),
				t('dataset.update.updateError'),
				{name: state.newDatasetName},
				props.datasetId
			);
			// eslint-disable-next-line require-atomic-updates
			state.modalActions.renameAction = false;
			if (action === 'closeModal') {
				emit('reloadData');
			}
		};

		const closeReuploadModal = () => {
			state.modalActions.reuploadAction = false;
			state.selectedDataset = null;
			state.selected = null;
		};
		const updating = ref(null as any);

		const refreshDataset = async(dataset: any) => {
			const scheduledJobDefinitionParams = dataset?.scheduledJobDefinition?.jobParams;
			const latestScheduledJobRunParams = dataset?.latestScheduledJobRun?.jobParams;
			const params = {
				jobType: getJobType(dataset),
				parameters: Object.keys(scheduledJobDefinitionParams).length > 0 ? scheduledJobDefinitionParams : latestScheduledJobRunParams
			};

			try {
				await datasetService.manualReRun(props.datasetId, params);
				// @ts-ignore
				notification.notify({
					type: 'success',
					text: 'Success. It could take a while',
					duration: 10000
				});
				updating.value = setInterval(() => {
					store.dispatch('datasetDetail/loadDataset', props.datasetId);
					if (compareJobRunStatus(dataset, DatasetJobStatus.COMPLETED)) {
						clearInterval(updating.value);
						updating.value = null;
					}
				}, 5000);
			} catch (error) {
				// @ts-ignore
				notification.notify({
					type: 'danger',
					text: 'Error',
					duration: 5000
				});
			}
		};


		watch(() => state.selected, (value: any) => {
			// @ts-ignore
			state.modalActions[`${value?.value}Action`] = !state.modalActions[`${value?.value}Action`];
		});


		return {
			...toRefs(state),
			successUpdate,
			UPLOAD_TYPES,
			sourceTypes,
			getActionItems,
			closeReuploadModal,
			updateDatasetName,
			selectDataset,
			deleteDataset
		};
	}
});
</script>

<style lang="scss" scoped>
.name-cell {
	text-decoration: underline;
}

.overflow-cell {
	max-width: 104px !important;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

:deep(.modal-content) {
	min-width: 600px;
}
</style>


<template>
	<div v-if="!datasetLoading" class="w-100 window-size">
		<ds-page-header>
			<ds-box flex-type="row" align="space-between" align-y="center">
				<ds-text variant="headline1">
					{{ datasetDetail.name }}
				</ds-text>

				<ds-dataset-actions
					:dataset="datasetDetail"
					:dataset-name="datasetDetail.name"
					:dataset-id="datasetId"
					actions-set="actionItemsDetail"
					@update-cycle="openAutoUpdateModal"
					@delete-dataset="openDeleteDatasetModal" />
			</ds-box>
		</ds-page-header>
		<div id="dataset-detail-content" class="content" @scroll="scroll = true">
			<ds-col cols="12" class="column-class">
				<ds-box padding-bottom="XL">
					<ds-row class="pt-4">
						<ds-btn-group class="flex">
							<ds-box
								v-for="btn in btnGroup"
								:key="btn.name"
								class="cursor-pointer"
								padding-right="L"
								@click="activeTab = btn.name">
								<ds-text variant="body" :class="{'btn-active': btn.name === activeTab}">{{ btn.name }}</ds-text>
							</ds-box>
						</ds-btn-group>
					</ds-row>
					<ds-row class="d-flex pt-4">
						<ds-alert-banner
							:variant="bannerState.bannerVariant"
							:message="bannerState.bannerText">
							<template v-if="bannerState.showBadge" #badge>
								<ds-box
									padding-right="M">
									<ds-badge
										:variant="bannerState.badgeVariant"
										:text="bannerState.badgeText" />
								</ds-box>
							</template>
						</ds-alert-banner>
					</ds-row>
					<ds-row v-if="activeTab === detailTabs.overview" class="py-4">
						<dataset-overview />
					</ds-row>
					<ds-row v-if="activeTab === detailTabs.schema" class="pt-4">
						<dataset-schema />
					</ds-row>
					<ds-row v-if="activeTab === detailTabs.data" class="pt-4">
						<dataset-data :checkScroll="scroll" @update-scroll="scroll = false" />
					</ds-row>
					<ds-row v-if="activeTab === detailTabs.uploadHistory" class="pt-4">
						<dataset-upload-history :datasetId="datasetId" />
					</ds-row>
				</ds-box>
			</ds-col>
		</div>
		<app-delete-dataset-modal
			:show-modal="showDeleteModal"
			:dataset-id="datasetId"
			:return-to-datasets="true"
			:ownedByUser="ownedByUser"
			@close-modal="showDeleteModal = false"
			@deleted="datasetDeleted" />
		<auto-update
			:show="showUpdateModal"
			:dataset="datasetDetail"
			@close-modal="showUpdateModal = false" />
	</div>
</template>

<script lang="ts">
import {computed, defineComponent, reactive, ref, toRefs, watch} from 'vue';
import DsBadge from '@/components/main/Badge/DataStoriesBadge.vue';
import DatasetOverview from '@/modules/dataset/components/detail/Overview.vue';
import DatasetSchema from '@/modules/dataset/components/detail/Schema.vue';
import DatasetData from '@/modules/dataset/components/detail/Data.vue';
import DatasetUploadHistory from '@/modules/dataset/components/detail/UploadHistory.vue';
import {getBannersValues, getDatasetStatus} from '@/modules/dataset/utils/dataset';
import {DatasetStatus, DatasetJobStatus} from '@/modules/dataset/consts/enums';
import i18n from '@/plugins/i18n';
const {t} = i18n.global;
import {useStore} from 'vuex';
import DsDatasetActions from '@/modules/dataset/components/DataStoriesDatasetActions.vue';
import {useSaasLimits} from '@/modules/limits/store/limits';
import AppDeleteDatasetModal from '@/modules/dataset/components/AppDeleteDatasetModal.vue';
import AutoUpdate from '@/modules/dataset/components/detail/AutoUpdate.vue';

export default defineComponent({
	components: {
		AutoUpdate,
		AppDeleteDatasetModal,
		DsBadge,
		DatasetOverview,
		DatasetSchema,
		DatasetData,
		DatasetUploadHistory,
		DsDatasetActions
	},
	props: {
		datasetId: {
			type: String,
			required: true
		}
	},
	// eslint-disable-next-line max-lines-per-function
	setup(props) {
		const store = useStore();
		const globalState = useSaasLimits();
		const translate = (word: string) => t(word);
		store.dispatch('datasetDetail/loadDataset', props.datasetId);

		const datasetDetail = computed(() => store.getters['datasetDetail/dataset']);
		const datasetLoading = computed(() => store.getters['datasetDetail/loading']);

		const detailTabs = {
			overview: translate('datasetDetail.tabs.overview'),
			schema: translate('datasetDetail.tabs.schema'),
			data: translate('datasetDetail.tabs.data'),
			uploadHistory: translate('datasetDetail.tabs.uploadHistory')
			// TODO Add once we implement invalid rows
			// invalidRows: translate('datasetDetail.tabs.invalidRows')
		};

		const activeTab = ref(detailTabs.overview);

		const btnGroup = [
			{name: detailTabs.overview},
			{name: detailTabs.schema},
			{name: detailTabs.data},
			{name: detailTabs.uploadHistory}
			// TODO Add once we implement invalid rows
			// {name: detailTabs.invalidRows}
		];

		const bannerState = ref({
			bannerVariant: null as any,
			bannerText: null as any,
			showBadge: false,
			badgeVariant: null as any,
			badgeText: null as any
		});

		watch(datasetDetail, (val) => {
			if (val) {
				const jobRun = val.latestScheduledJobRun;
				if (!jobRun || jobRun.status === DatasetJobStatus.PENDING || jobRun.status === DatasetJobStatus.RUNNING) {
					setTimeout(() => {
						// TODO change for new pinia loadDataset
						store.dispatch('datasetDetail/loadDatasetDetail', props.datasetId);
					}, 3000);
				}

				const status = getDatasetStatus(val);
				const stepInfo = status === DatasetStatus.VALID ? null : (val.latestScheduledJobRun?.statusParams?.stepDescription ?? null);

				bannerState.value = getBannersValues(status, stepInfo);
			}
		});

		const user = computed(() => store.getters['authLogin/user']);
		const ownedByUser = computed(() => user.value?.id === state?.datasetToDelete?.ownedById);

		const state = reactive({
			datasetToDelete: null as any,
			showDeleteModal: false,
			showUpdateModal: false
		});

		const scroll = ref(false);
		const openDeleteDatasetModal = (dataset: any, ownedUser: boolean) => {
			state.datasetToDelete = dataset;
			state.showDeleteModal = true;
		};

		const datasetDeleted = () => {
			globalState.getActualStatistics();
		};

		const openAutoUpdateModal = () => {
			state.showUpdateModal = true;
		};

		return {
			...toRefs(state),
			ownedByUser,
			activeTab,
			detailTabs,
			btnGroup,
			datasetDetail,
			datasetLoading,
			bannerState,
			scroll,
			openDeleteDatasetModal,
			openAutoUpdateModal,
			datasetDeleted
		};
	}
});
</script>

<style lang="scss" scoped>
.window-size {
	height: 100vh;
	width: 100vw;
	padding-bottom: 16px;
}

.content {
	height: calc(100vh - 82px);
	max-width: calc(100vw - 56px);
	overflow: auto;
}

.column-class {
	padding: 0;
}

.row {
	margin-left: 32px;
	margin-right: 32px;
}

.flex {
	display: flex;
}

.btn-active {
	border-bottom: solid 2px map-get($ds-colors, 'primary');
}

.dropdown-content {
	min-width: 156px;
	display: none;
	position: absolute;
	background-color: #f9f9f9;
	top: 100%;
	right: 0;
	z-index: 1;
}

.dropdown:hover .dropdown-content {
  display: block;
}
</style>

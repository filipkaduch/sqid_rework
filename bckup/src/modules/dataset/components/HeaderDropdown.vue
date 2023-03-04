<template>
	<ds-box class="ds-bg-white cursor-pointer" flex-type="column" box-shadow="low" border-radius="basic">
		<ds-box
			v-if="isValidDataset"
			padding-y="S"
			padding-x="M"
			flex-type="row"
			@click="$router.push({name: 'create-story', params: {id: datasetDetail.id}})">
			<ds-icon
				class="svg-image"
				name="icon-story-test"
				alt="icon" />
			<ds-box padding-left="S">
				<ds-text variant="body">Create Story</ds-text>
			</ds-box>
		</ds-box>
		<ds-box
			v-if="isValidDataset"
			padding-y="S"
			padding-x="M"
			flex-type="row"
			@click="$router.push({name: 'create-story', params: {id: datasetDetail.id, preselectedType: storyType.DATA_EXPLORE}})">
			<ds-icon
				class="svg-image"
				name="ds-icon-exploration"
				alt="icon" />
			<ds-box padding-left="S">
				<ds-text variant="body">{{ $t('t_createExploration') }}</ds-text>
			</ds-box>
		</ds-box>
		<ds-box v-if="detailTab && !isShared" padding-y="S" padding-x="M" flex-type="row">
			<ds-icon
				class="svg-image"
				name="icon-eye-closed"
				alt="icon" />
			<ds-box padding-left="S">
				<ds-text variant="body">View Detail</ds-text>
			</ds-box>
		</ds-box>
		<ds-box
			v-if="!isShared" padding-y="S" padding-x="M" flex-type="row"
			@click="refreshDataset">
			<ds-icon
				class="svg-image"
				:class="{'icon-spin': updating}"
				name="icon-reset"
				alt="icon" />
			<ds-box padding-left="S">
				<ds-text variant="body">Refresh</ds-text>
			</ds-box>
		</ds-box>
		<ds-box
			v-if="!isShared" padding-y="S" padding-x="M" flex-type="row"
			@click="showUpdateModal = !showUpdateModal">
			<ds-icon
				class="svg-image"
				name="icon-pencil"
				alt="icon" />
			<ds-box padding-left="S">
				<ds-text variant="body">Update cycle</ds-text>
			</ds-box>
		</ds-box>
		<!-- TODO add for listing -->
		<!-- <ds-box padding-y="S" padding-x="M" flex-type="row">
			<ds-icon
				class="svg-image"
				name="icon-reupload"
				alt="icon" />
			<ds-box padding-left="S">
				<ds-text>Reupload</ds-text>
			</ds-box>
		</ds-box> -->
		<!-- TODO Add after adding modal for name change -->
		<!-- <ds-box padding-y="S" padding-x="M" flex-type="row">
			<ds-icon
				class="svg-image"
				name="icon-pencil"
				alt="icon" />
			<ds-box padding-left="S">
				<ds-text>Rename</ds-text>
			</ds-box>
		</ds-box> -->
		<!-- TODO Add for listing -->
		<!-- <ds-box padding-y="S" padding-x="M" flex-type="row">
			<ds-icon
				class="svg-image"
				name="icon-share"
				alt="icon" />
			<ds-box padding-left="S">
				<ds-text>Share</ds-text>
			</ds-box>
		</ds-box> -->
		<ds-box
			v-if="!isShared" padding-y="S" padding-x="M" flex-type="row"
			@click="deleteDataset">
			<ds-icon
				class="svg-image"
				name="icon-trash"
				alt="icon" />
			<ds-box padding-left="S">
				<ds-text variant="body">Delete</ds-text>
			</ds-box>
		</ds-box>
		<app-delete-dataset-modal
			:show-modal="showDeleteModal"
			:dataset-id="datasetDetail.id"
			:return-to-datasets="true"
			:ownedByUser="ownedByUser"
			@close-modal="showDeleteModal = false" />
		<auto-update
			:show="showUpdateModal"
			@close-modal="showUpdateModal = false" />
	</ds-box>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from 'vue';
import {datasetService} from '@/modules/dataset/datasetService';
import {compareJobRunStatus, getDatasetStatus, getJobType} from '@/modules/dataset/utils/dataset';
import {DatasetJobStatus, DatasetStatus} from '@/modules/dataset/consts/enums';
import AppDeleteDatasetModal from '@/modules/dataset/components/AppDeleteDatasetModal.vue';
import AutoUpdate from '@/modules/dataset/components/detail/AutoUpdate.vue';
import {storyType} from '@/modules/story/consts/storyType';
import {useNotification} from '@kyvg/vue3-notification';
import {useStore} from 'vuex';
import {useSaasLimits} from '@/modules/limits/store/limits';

export default defineComponent({
	components: {
		AppDeleteDatasetModal,
		AutoUpdate
	},
	props: {
		detailTab: {
			type: Boolean,
			default: true
		},
		isShared: {
			type: Boolean,
			default: false
		}
	},
	// eslint-disable-next-line no-unused-vars, max-lines-per-function
	setup() {
		const store = useStore();
		const notification = useNotification();
		const datasetDetail = computed(() => store?.getters['datasetDetail/dataset']);
		const user = computed(() => store?.getters['authLogin/user']);
		const showDeleteModal = ref(false);
		const saasLimitsState = useSaasLimits();

		const ownedByUser = datasetDetail.value.ownedById === user.value.id;

		const updating = ref(null as any);

		const refreshDataset = async() => {
			const dataset = datasetDetail.value;
			const scheduledJobDefinitionParams = dataset?.scheduledJobDefinition?.jobParams;
			const latestScheduledJobRunParams = dataset?.latestScheduledJobRun?.jobParams;
			const params = {
				jobType: getJobType(dataset),
				parameters: Object.keys(scheduledJobDefinitionParams).length > 0 ? scheduledJobDefinitionParams : latestScheduledJobRunParams
			};

			try {
				await datasetService.manualReRun(dataset.id, params);
				// @ts-ignore
				notification.notify({
					type: 'success',
					text: 'Success. It could take a while',
					duration: 10000
				});
				updating.value = setInterval(() => {
					store.dispatch('datasetDetail/loadDataset', dataset.id);
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

		const deleteDataset = () => {
			showDeleteModal.value = true;
		};

		const isValidDataset = computed(() => getDatasetStatus(datasetDetail.value) !== DatasetStatus.ERROR
			&& getDatasetStatus(datasetDetail.value) !== DatasetStatus.NO_DATA);

		const showUpdateModal = ref(false);
		return {
			refreshDataset,
			datasetDetail,
			ownedByUser,
			updating,
			showUpdateModal,
			isValidDataset,
			deleteDataset,
			storyType,
			showDeleteModal,
			saasLimitsState
		};
	}
});
</script>

<style lang="scss" scoped>
.svg-image {
	fill: map-get($ds-colors, 'display-content-700');
	opacity: 0.702;
}

@keyframes spin {
    0% { transform: rotate(359deg); }
    100% {  transform: rotate(0deg); }
}
.icon-spin {
    animation: spin 2s linear infinite;
}
</style>

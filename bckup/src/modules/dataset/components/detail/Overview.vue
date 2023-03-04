<template>
	<ds-box v-if="!datasetLoading" class="w-100">
		<ds-box flex-type="row" box-shadow="low">
			<ds-box
				v-for="(item, index) in datasetCardData"
				:key="index"
				class="w-100 overview-card"
				padding-y="L">
				<ds-text variant="body" color="display-content-500">{{ item.name }}</ds-text>
				<ds-text
					variant="subheadline"
					:color="item.value === 'N/A' ? 'display-content-300' : 'separate-content-900'">
					<ds-box v-if="item.name === `${$t('datasetDetail.cardNames.updated')}`" flex-type="row">
						<ds-tooltip>
							<template #icon>
								<ds-box padding-right="S">
									<ds-icon name="icon_info" />
								</ds-box>
							</template>
							<template #tooltip>
								{{ dateFormatter(item.value) }}
							</template>
						</ds-tooltip>
						<ds-text variant="subheadline">
							{{ formatToRelativeDate(item.value) }}
						</ds-text>
					</ds-box>
					<ds-text v-else variant="subheadline">
						{{ item.value }}
					</ds-text>
				</ds-text>
			</ds-box>
		</ds-box>
		<ds-box flex-type="row" class="py-4" align-y="top">
			<ds-box class="w-100 ds-bg-white" padding="L" box-shadow="low" border-radius="basic">
				<ds-box>
					<ds-text variant="subheadline">{{ $t('datasetDetail.properties') }}</ds-text>
					<ds-box
						v-for="(item, index) in datasetProperties"
						:key="index"
						padding-top="M"
						:padding-bottom="index === datasetProperties.length - 1 ? 'NONE' : 'M'"
						:border-bottom="index !== datasetProperties.length - 1 ? 'separate' : 'none'"
						flex-type="row">
						<ds-box class="property-size">
							<ds-text variant="body">{{ item.name }}</ds-text>
						</ds-box>
						<ds-box flex-type="row" align="space-between">
							<ds-text
								variant="body"
								:color="item.value === 'N/A' ? 'display-content-300' : 'display-content-700'">
								{{ item.value }}
							</ds-text>
							<ds-box
								v-if="item.name === `${$t('datasetDetail.propertiesCard.source')}`"
								v-clipboard:copy="item.value"
								class="cursor-pointer">
								<ds-icon name="icon-copy" />
							</ds-box>
						</ds-box>
					</ds-box>
				</ds-box>
			</ds-box>
			<ds-box padding="L" box-shadow="low" border-radius="basic" class="w-100 mx-4 ds-bg-white">
				<usage-in-stories />
			</ds-box>
			<ds-box
				padding="L"
				class="w-100"
				:class="showSharingOption ? 'ds-bg-white' : 'ds-bg-transparent'"
				:box-shadow="showSharingOption ? 'low' : 'none'"
				border-radius="basic">
				<dataset-sharing v-if="showSharingOption" :dataset-id="getDatasetId" />
			</ds-box>
		</ds-box>
	</ds-box>
</template>

<script lang="ts">
import {computed, defineComponent, inject} from 'vue';
import {DATASET_GETTERS, DATASET_STORE_NAME} from '@/modules/dataset/store/types';
import {formatBytes} from '@/modules/dataset/utils/datasetUtils';
import DatasetSharing from '@/modules/dataset/components/detail/Sharing.vue';
import {getUploadType, formatToRelativeDate, dateFormatter} from '@/modules/dataset/utils/dataset';
import UsageInStories from '@/modules/dataset/components/detail/UsageInStories.vue';
import i18n from '@/plugins/i18n/index';
import {useStore} from 'vuex';
const {t} = i18n.global;

export default defineComponent({
	components: {
		DatasetSharing,
		UsageInStories
	},
	// eslint-disable-next-line max-lines-per-function
	setup() {
		const appConfig = inject('appConfig');
		// @ts-ignore
		const store = useStore();
		// @ts-ignore
		const translate = (word: string) => t(word);

		const datasetDetail = computed(() => store.getters['datasetDetail/dataset']);
		const datasetLoading = computed(() => store.getters['datasetDetail/loading']);
		const datasetJobs = computed(() => store.getters[`${DATASET_STORE_NAME}/${DATASET_GETTERS.SCHEDULED_JOBS}`]);
		const getDatasetId = computed(() => datasetDetail?.value?.id ?? null);
		const uploadTypes = getUploadType(datasetDetail.value.latestScheduledJobRun?.externalRunnerReference.jobType ?? null);

		const datasetCardData = computed(() => [
			{
				name: translate('datasetDetail.cardNames.uploadtype'),
				value: uploadTypes.uploadType
			},
			{
				name: translate('datasetDetail.cardNames.fileType'),
				value: uploadTypes.fileType
			},
			{
				name: translate('datasetDetail.cardNames.updated'),
				value: datasetDetail.value.latestScheduledJobRun?.processingEndedAt
			},
			{
				name: translate('datasetDetail.cardNames.rows'),
				value: datasetDetail.value.info?.rowsCount ?? 'N/A'
			},
			{
				name: translate('datasetDetail.cardNames.columns'),
				value: datasetDetail.value.info?.columnsCount ?? 'N/A'
			},
			{
				name: translate('datasetDetail.cardNames.size'),
				value: formatBytes(datasetDetail.value.info?.estimatedSizeBytes ?? 0)
			}
		]);

		const datasetProperties = computed(() => ([
			{
				name: translate('datasetDetail.propertiesCard.source'),
				value: datasetDetail.value.latestScheduledJobRun?.jobParams.urlLink ?? 'N/A'
			},
			// TODO: feature functionality for support folders in dataset listing
			// {
			// name: translate('datasetDetail.propertiesCard.folder'),
			// value: 'N/A'
			// },
			{
				name: translate('datasetDetail.propertiesCard.created'),
				value: dateFormatter(datasetDetail.value.createdAt)
			},
			{
				name: translate('datasetDetail.propertiesCard.nextUpdate'),
				value: dateFormatter(datasetJobs.value[datasetDetail.value.id])
			}
		]));

		const user = computed(() => store.getters['authLogin/user']);
		const sharingEnabled = appConfig?.oneIntegration;

		const showSharingOption = datasetDetail.value.ownedById === user.value.id && sharingEnabled;

		return {
			datasetCardData,
			datasetLoading,
			datasetProperties,
			showSharingOption,
			datasetDetail,
			getDatasetId,
			formatToRelativeDate,
			dateFormatter
		};
	}
});
</script>

<style lang="scss" scoped>
.overview-card {
	padding-left: 40px;
	background-color: map-get($ds-colors, 'white');
}

.overview-card:first-child {
	border-bottom-left-radius: 4px;
	border-top-left-radius: 4px;
}

.overview-card:not(:first-child) {
	border-left: 1px solid map-get($ds-colors, 'separate-content-100');
}

.overview-card:last-child {
	border-bottom-right-radius: 4px;
	border-top-right-radius: 4px;
}

.property-size {
	min-width: 150px;
}
</style>

<template>
	<ds-table
		v-if="!datasetLoading"
		:data-table="false"
		:table-header="uploadHistoryHeader"
		:table-rows="uploadHistoryRows"
		sticky-header>
		<template #default="{row, column}">
			<div v-if="column.name === tableNames.status">
				<ds-box flexType="row">
					<div :class="`ds-bg-${row[column.name].status.color}`" class="dot" />
					<ds-inline
						align-y="center">
						<ds-box padding-x="S">
							{{ row[column.name].status.text }}
						</ds-box>
					</ds-inline>
					<ds-tooltip>
						<template #icon>
							<ds-box>
								<ds-icon name="icon_info" @click="copy(row[column.name].statusParams)" />
							</ds-box>
						</template>
						<template #tooltip>
							<ds-box v-for="(value, key) of row[column.name].statusParams" :key="key">
								{{ objectCaseMapper(key, objectCaseStyles.SENTENCE_CASE) }}: {{ objectCaseMapper(value, objectCaseStyles.SENTENCE_CASE) }}
							</ds-box>
						</template>
					</ds-tooltip>
				</ds-box>
			</div>
			<div v-else-if="column.name === tableNames.moreInfo">
				<ds-tooltip>
					<template #icon>
						<ds-box>
							<ds-icon name="icon-more-info" @click="copy(row[column.name])" />
						</ds-box>
					</template>
					<template #tooltip>
						<ds-box v-for="(value, key) of row[column.name]" :key="key">
							{{ objectCaseMapper(key, objectCaseStyles.SENTENCE_CASE) }}: {{ value }}
						</ds-box>
					</template>
				</ds-tooltip>
			</div>
		</template>
	</ds-table>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref} from 'vue';
import {datasetService} from '@/modules/dataset/datasetService';
import {dateFormatter, TELLSTORY_ROW_ID} from '@/modules/dataset/utils/dataset';
import {DatasetJobStatus} from '@/modules/dataset/consts/enums';
import {objectCaseMapper, objectCaseStyles} from '@/util/objectCaseMapper';
import {TableHeader} from '@/components/main/consts/interfaces';
import {i18n} from '@/plugins/all';
import {useStore} from 'vuex';
const {t} = i18n.global;
import {copyText} from 'vue3-clipboard';

export default defineComponent({
	props: {
		datasetId: {
			type: String,
			required: true
		}
	},
	setup(props) {
		const store = useStore();
		const translate = (word: string): string => t(word) as string;

		const scheduledJobRuns = ref();

		onMounted(async() => {
			scheduledJobRuns.value = await datasetService.getScheduledJobRunsById(props.datasetId, {
				params: {
					limit: 40
				}
			});
		});

		const datasetLoading = computed(() => store.getters['datasetDetail/loading']);

		const tableNames = {
			start: translate('datasetDetail.uploadHistoryNames.start'),
			end: translate('datasetDetail.uploadHistoryNames.end'),
			duration: translate('datasetDetail.uploadHistoryNames.duration'),
			status: translate('datasetDetail.uploadHistoryNames.status'),
			trigger: translate('datasetDetail.uploadHistoryNames.trigger'),
			moreInfo: translate('datasetDetail.uploadHistoryNames.moreInfo')
		};

		// Header categories based on figma design
		const uploadHistoryHeader: TableHeader[] = [
			{name: tableNames.start, type: 'date'},
			{name: tableNames.end, type: 'date'},
			{name: tableNames.duration, type: 'string'},
			{name: tableNames.status, type: 'string'},
			{name: tableNames.trigger, type: 'string'},
			{name: tableNames.moreInfo, type: 'string'}
		];

		const uploadHistoryRows = computed(() => scheduledJobRuns.value?.data.reduce((data: any, item: any) => {
			if (item.name !== TELLSTORY_ROW_ID) {
				data.push({
					[`${tableNames.start}`]: dateFormatter(item.processingStartedAt),
					[`${tableNames.end}`]: dateFormatter(item.processingEndedAt),
					[`${tableNames.duration}`]: getDuration(item.processingStartedAt, item.processingEndedAt),
					[`${tableNames.status}`]: {
						status: getStatus(item.status),
						statusParams: objectCaseMapper(item.statusParams, objectCaseStyles.SNAKE_CASE)
					},
					[`${tableNames.trigger}`]: '',
					[`${tableNames.moreInfo}`]: objectCaseMapper(item.debugInfo.jobParams, objectCaseStyles.SNAKE_CASE)
				});
			}
			return data;
		}, []));

		const getDuration = (startDate: string, endDate: string) => {
			const duration: any = new Date(endDate).getTime() - new Date(startDate).getTime();
			// 3600000ms in hour, 60000ms in minute, 1000ms in second
			const hours = Math.floor(duration / 3600000);
			const minutes = Math.floor(duration / 60000);
			const seconds = parseInt(((duration % 60000) / 1000).toFixed(0), 10);

			return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
		};

		const getStatus = (item: string) => {
			switch (item) {
				case DatasetJobStatus.PENDING:
					return {
						color: 'warning-500',
						text: translate('status.pending')
					};
				case DatasetJobStatus.RUNNING:
					return {
						color: 'interaction-500',
						text: translate('status.running')
					};
				case DatasetJobStatus.COMPLETED:
					return {
						color: 'success-500',
						text: translate('status.success')
					};
				case DatasetJobStatus.ERROR:
					return {
						color: 'error-500',
						text: translate('status.fail')
					};
				default:
					return {
						color: 'display-content-500',
						text: translate('status.unknown')
					};
			}
		};

		const copy = (json: string) => {
			const text = JSON.stringify(json);
			// @ts-ignore
			copyText(text);
		};

		return {
			datasetLoading,
			tableNames,
			uploadHistoryHeader,
			uploadHistoryRows,
			copy,
			objectCaseMapper,
			objectCaseStyles
		};
	}
});
</script>

<style lang="scss" scoped>
.dot {
	width: 8px;
	height: 8px;
	border-radius: 8px;
	align-self: center;
}
</style>

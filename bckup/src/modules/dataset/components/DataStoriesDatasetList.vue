<template>
	<ds-box :padding-top="isLoading ? 'L' : null" :padding-bottom="isLoading ? 'L' : null">
		<app-loading :loading="isLoading" relative-parent>
			<ds-table
				v-if="totalRecords"
				:dynamic-width="false"
				data-testid="datasetListTable"
				:table-header="header"
				:pagination="true"
				:sortable="sortable"
				:header-line="true"
				:total-rows="totalRecords"
				:wrap-cells="false"
				:row-select="onRowSelect"
				:table-rows="tableData"
				:data-table="false"
				@row-clicked="onRowSelect ? updateSelectedDatasets($event, !selectedDatasets.some((dataset) => dataset.Id === $event[datasetHeaderEnums.ID])) : null"
				@get-more-data="loadMoreDatasets">
				<template #default="{row, column}">
					<td v-if="column.name === datasetHeaderEnums.CHECKBOX && selectable">
						<ds-box align-y="center" padding-x="M">
							<ds-check-box
								:state="selectedDatasets.some((dataset) => dataset.Id === row[datasetHeaderEnums.ID])"
								outline
								data-testid="list-item"
								:disabled="isInProgress(row)"
								@update:state="updateSelectedDatasets(row, $event)" />
						</ds-box>
					</td>
					<td v-else-if="column.name === datasetHeaderEnums.ICON" class="icon icon--column">
						<ds-box align-y="center" padding-left="M" padding-right="NONE">
							<ds-icon :name="`${sourceIcon(row.latestScheduledJobRun?.externalRunnerReference.jobType)}`" />
						</ds-box>
					</td>
					<td
						v-else-if="column.name === datasetHeaderEnums.NAME"
						class="name-cell overflow-cell"
						:class="{'cursor-pointer': !onRowSelect}"
						@click="!selectable ? onRowClick(row) : null">
						<ds-box align-y="center" padding-x="M">
							<ds-text variant="bodyMedium" color="display-content">
								<span @click.prevent="selectable ? onRowClick(row) : () => {}">{{ row[column.name] }}</span>
							</ds-text>
						</ds-box>
					</td>
					<td v-else-if="column.name === datasetHeaderEnums.FILE_TYPE && !isInProgress(row)">
						<ds-box align-y="center" padding-x="M">
							{{ row[column.name].fileType }}
						</ds-box>
					</td>
					<td v-else-if="column.name === datasetHeaderEnums.FILE_TYPE && isInProgress(row)">
						<ds-box flex-type="row" align-y="center" padding-x="M">
							<div class="pr-2">
								<data-stories-spinner />
							</div>
							<ds-text color="secondary-400" class="overflow-cell" style="padding-right: 5px">{{ getRunningJobStepDescription(row) }}</ds-text>
						</ds-box>
					</td>
					<td v-else-if="column.name === datasetHeaderEnums.UPDATED && isInProgress(row)" colspan="4">
						<ds-box align-y="center" padding-x="M">
							<app-progress-bar
								:value="getRunningJobStepProgress(row)"
								:text="getUploadedFileSize(row)"
								:hide-progress="isPending(row)"
								:dynamic-text="getUploadedFileSize(row)?.dynamicText ?? null"
								:total-text="getUploadedFileSize(row)?.totalText ?? null" />
						</ds-box>
					</td>
					<td v-else-if="column.name === datasetHeaderEnums.UPDATED && !isInProgress(row)">
						<ds-box align-y="center" padding-x="M">
							<ds-inline gap="S" no-wrap>
								<ds-tooltip :placement="'top'">
									<template #icon>
										<div style="width: 20px">
											<ds-icon name="ds-icon-info" />
										</div>
									</template>
									<template #tooltip>
										<ds-box padding-y="S" padding-x="L">
											<ds-row>
												<ds-col cols="5" class="px-0">
													<ds-inline-item>
														<ds-text color="display-content-400" variant="body">{{ $t('t_Created') }}</ds-text>
													</ds-inline-item>
													<ds-inline-item>
														<ds-text color="display-content-500" variant="body">{{ $t('datasetDetail.propertiesCard.nextUpdate') }}</ds-text>
													</ds-inline-item>
												</ds-col>
												<ds-col cols="7" class="px-0">
													<ds-box padding-left="S">
														<ds-text class="w-max-content" color="white">{{ getCreatedDate(row) }}</ds-text>
														<ds-text class="w-max-content" color="white">{{ getScheduledDate(row) }}</ds-text>
													</ds-box>
												</ds-col>
											</ds-row>
										</ds-box>
									</template>
								</ds-tooltip>
								{{ formatToRelativeDate(row[column.name]) }}
							</ds-inline>
						</ds-box>
					</td>
					<td v-else-if="column.name === datasetHeaderEnums.USAGE && !isInProgress(row)">
						<ds-box
							v-if="row[column.name]"
							align="center"
							align-y="center"
							padding-x="XS"
							border-radius="big"
							style="width: fit-content;"
							class="ds-bg-separate-content-100">
							<ds-text variant="caption" color="display-content">
								{{ row[column.name] }}
							</ds-text>
						</ds-box>
					</td>
					<td v-else-if="column.name === datasetHeaderEnums.ROWS && !isInProgress(row)">
						<ds-box align-y="center" padding-x="M">
							{{ generateRowsCountString(row[column.name]) }}
						</ds-box>
					</td>
					<td v-else-if="column.name === datasetHeaderEnums.COLUMNS && !isInProgress(row)">
						<ds-box align-y="center" padding-x="M">
							{{ generateColsCountString(row[column.name]) }}
						</ds-box>
					</td>
					<td v-else-if="column.name === datasetHeaderEnums.SHARED_BY">
						<ds-box align-y="center" padding-x="M">
							<ds-avatar
								v-if="row[column.name] !== '' && row[column.name].acronym !== ''"
								:bg-color="row[column.name].bgColor"
								:text-color="row[column.name].textColor"
								:text="row[column.name].acronym" />
						</ds-box>
					</td>
					<td v-else-if="column.name === datasetHeaderEnums.STATE">
						<ds-box flex-type="row" align-y="center" padding-x="M">
							<ds-badge
								:key="`${row[column.name]}`"
								:variant="getBannersValues(row[column.name]).badgeVariant"
								:text="getBannersValues(row[column.name]).badgeText" />
						</ds-box>
					</td>
					<td v-else-if="column.name === datasetHeaderEnums.ACTIONS && actions">
						<ds-box
							flex-type="row" align="right" align-y="center" padding-x="M"
							@click.stop>
							<ds-dataset-actions
								:dataset="row"
								:dataset-name="row.Name"
								:dataset-id="row.Id"
								@delete-dataset="openDeleteDatasetModal"
								@reload-data="loadMoreDatasets(true)" />
						</ds-box>
					</td>
				</template>
			</ds-table>
		</app-loading>
		<app-delete-dataset-modal
			:show-modal="showDeleteModal"
			:dataset-id="datasetToDelete?.Id ?? ''"
			:return-to-datasets="true"
			:ownedByUser="ownedByUser"
			@close-modal="showDeleteModal = false"
			@deleted="datasetDeleted" />
	</ds-box>
</template>

<script lang="ts">
import DsDatasetActions from '@/modules/dataset/components/DataStoriesDatasetActions.vue';
import DataStoriesSpinner from '@/components/main/DataStoriesSpinner.vue';
import DsBadge from '@/components/main/Badge/DataStoriesBadge.vue';
import DsAvatar from '@/components/main/DataStoriesAvatar.vue';
import {
	computed,
	reactive,
	toRefs,
	watch,
	ref,
	defineComponent,
	onBeforeMount,
	onBeforeUnmount
} from 'vue';
import {DATASET_ACTIONS, DATASET_GETTERS, DATASET_STORE_NAME} from '@/modules/dataset/store/types';
import {datasetHeaderEnums, datasetsHeader, mapDatasetsToTable} from '@/modules/dataset/utils/datasetListUtils';
import {
	generateRowsCountString,
	generateColsCountString,
	sourceIcon,
	UPLOAD_TYPES,
	getBannersValues,
	formatToRelativeDate
} from '@/modules/dataset/utils/dataset';
import AppLoading from '@/components/design/AppLoading.vue';
import AppDeleteDatasetModal from '@/modules/dataset/components/AppDeleteDatasetModal.vue';
import {DatasetStatus, StepStatusTasks} from '@/modules/dataset/consts/enums';
import {datasetJobStatus} from '@/modules/dataset/consts/datasetStatus';
import AppProgressBar from '@/components/design/AppProgressBar.vue';
import i18n from '@/plugins/i18n';
const {t} = i18n.global;
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';
import {useSaasLimits} from '@/modules/limits/store/limits';

export default defineComponent({
	name: 'DataStoriesDatasetList',
	components: {
		DsDatasetActions,
		DataStoriesSpinner,
		AppLoading,
		AppDeleteDatasetModal,
		DsAvatar,
		DsBadge,
		AppProgressBar
	},
	props: {
		selectable: {
			type: Boolean,
			default: false
		},
		onRowSelect: {
			type: Boolean,
			default: false
		},
		clickable: {
			type: Boolean,
			default: false
		},
		actions: {
			type: Boolean,
			default: true
		},
		selectedDatasets: {
			type: Array,
			default: () => []
		},
		search: {
			type: String,
			default: ''
		},
		sortable: {
			type: Boolean,
			default: false
		}
	},
	emits: ['update:selectedDatasets'],
	// eslint-disable-next-line max-lines-per-function,max-statements
	setup(props, {emit}) {
		const store = useStore();
		const router = useRouter();
		const state = reactive({
			searchTimeout: null as any,
			datasetToDelete: null as any,
			showDeleteModal: false
		});
		const saasLimitsState = useSaasLimits();

		const user = computed(() => store.getters['authLogin/user']);
		const ownedByUser = computed(() => user.value?.id === state?.datasetToDelete?.ownedById);
		const uploadDatasetProgress = computed(() => store.getters['datasetCreate/uploadDatasetProgress']);
		const uploadDatasetSize = computed(() => store.getters['datasetCreate/uploadDatasetSize']);
		const activeJobs = computed(() => store.getters[`${DATASET_STORE_NAME}/${DATASET_GETTERS.RUNNING_JOBS}`]);
		const isLoading = computed(() => store.getters[`${DATASET_STORE_NAME}/${DATASET_GETTERS.LOADING}`]);
		const tableData = computed(() => mapDatasetsToTable(store.getters[`${DATASET_STORE_NAME}/${DATASET_GETTERS.DATASETS}`], user.value.id));
		const totalRecords = computed(() => store.getters[`${DATASET_STORE_NAME}/${DATASET_GETTERS.TOTAL_RECORDS}`]);
		const activeJobInterval = ref(null);
		const scheduledJobs = computed(() => store.getters[`${DATASET_STORE_NAME}/${DATASET_GETTERS.SCHEDULED_JOBS}`]);
		const loadMoreDatasets = (reset: boolean = false) => {
			store.dispatch(`${DATASET_STORE_NAME}/${DATASET_ACTIONS.LOAD_NEXT_PAGE}`, {
				reset
			});
		};

		const header = ref([] as {
			[key: string]: any,
			name: string,
			type: string
		}[]);

		const onRowClick = (event: any) => {
			if (props.selectable) {
				const route = router.resolve({
					name: 'dataset-detail',
					params: {id: event.Id}
				});
				window.open(route.href, '_blank');
			} else {
				router.push({
					name: 'dataset-detail',
					params: {id: event.Id}
				});
			}
		};

		const openDeleteDatasetModal = (dataset: any, ownedUser: boolean) => {
			state.datasetToDelete = dataset;
			state.showDeleteModal = true;
		};

		const updateSelectedDatasets = (dataset: any, selected: boolean) => {
			if (props.selectedDatasets.some((item: any) => item.Id === dataset.Id) && !selected) {
				emit('update:selectedDatasets', props.selectedDatasets.filter((item: any) => item.Id !== dataset.Id));
			} else if (!props.selectedDatasets.some((item: any) => item.Id === dataset.Id) && selected) {
				emit('update:selectedDatasets', props.selectedDatasets.concat([dataset]));
			}
		};

		const isInProgress = (dataset: any) => (dataset?.latestScheduledJobRun?.status && (
			dataset.latestScheduledJobRun.status === datasetJobStatus.RUNNING
			|| dataset.latestScheduledJobRun.status === datasetJobStatus.PENDING
		)) || Object.hasOwn(uploadDatasetProgress.value, dataset.Id);

		const isPending = (dataset: any) => dataset?.latestScheduledJobRun?.status && dataset.latestScheduledJobRun.status === datasetJobStatus.PENDING;

		const getRunningJobStepDescription = (dataset: any) => {
			if (Object.hasOwn(uploadDatasetProgress.value, dataset.Id)) {
				// @ts-ignore
				return uploadDatasetProgress.value[dataset.Id] === 100 ? t('t_UploadingFinishing') : t('t_Uploading');
			}
			const job = dataset?.latestScheduledJobRun ?? null;
			if (job?.status === datasetJobStatus.PENDING) {
				return t('t_starting_dataset_task');
			}
			return job?.statusParams?.stepDescription ?? 'N/A';
		};

		const getUploadedFileSize = (dataset: any) => {
			const job = dataset?.latestScheduledJobRun ?? null;

			if (isPending(dataset)) {
				return {
					dynamicText: `${activeJobs.value.length} ${activeJobs.value.length > 1 ? 'jobs' : 'job'}`,
					totalText: ' in queue'
				};
			}

			if (Object.hasOwn(uploadDatasetSize.value, dataset.Id)
				&& Object.hasOwn(uploadDatasetProgress.value, dataset.Id)) {
				// @ts-ignore
				return uploadDatasetSize.value[dataset.Id];
			}

			if (job && job?.statusParams?.moreInformation && job?.statusParams?.moreInformation?.analyzedColumns) {
				return {
					dynamicText: job?.statusParams?.moreInformation?.analyzedColumns,
					totalText: ` of ${job?.statusParams?.moreInformation?.columnsCount} cols`
				};
			}

			if (job && job?.statusParams?.moreInformation && job?.statusParams?.moreInformation?.correctRowsCnt) {
				return {
					dynamicText: job?.statusParams?.moreInformation?.correctRowsCnt,
					totalText: ' rows processed'
				};
			}

			return null;
		};

		const getScheduledDate = (dataset: any) => {
			if (scheduledJobs?.value[dataset.Id]) {
				return new Intl.DateTimeFormat('en-GB', {
					year: 'numeric',
					month: 'numeric',
					day: 'numeric',
					hour: 'numeric',
					hour12: false,
					minute: 'numeric'
				}).format(new Date(scheduledJobs.value[dataset.Id]));
			}
			return 'N/A';
		};

		const getCreatedDate = (dataset: any) => new Intl.DateTimeFormat('en-GB', {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
			hour: 'numeric',
			hour12: false,
			minute: 'numeric'
		}).format(new Date(dataset.createdAt));

		const getRunningJobStepProgress = (dataset: any) => {
			if (Object.hasOwn(uploadDatasetProgress.value, dataset.Id)) {
				// @ts-ignore
				return uploadDatasetProgress.value[dataset.Id];
			}
			const job = dataset?.latestScheduledJobRun ?? null;
			if (job?.status === datasetJobStatus.PENDING) {
				return 0;
			}
			if (job?.statusParams?.stepName) {
				switch (job.statusParams.stepName) {
					case StepStatusTasks.DOWNLOAD_FILE_URL:
						return 10;
					case StepStatusTasks.DECOMPRESS_FILE:
						return 25;
					case StepStatusTasks.TRANSFORM_EXCEL_TO_CSV:
						return 30;
					case StepStatusTasks.DETECT_CSV_METADATA:
						return 40;
					case StepStatusTasks.DETECT_COLUMN_DATATYPES:
						return 55;
					case StepStatusTasks.DOWNLOAD_GOOGLE_SHEET:
						return 60;
					case StepStatusTasks.DOWNLOAD_CI_ATTR_RULE:
					case StepStatusTasks.DOWNLOAD_CI_ATTR:
					case StepStatusTasks.DOWNLOAD_CI_OVERALL:
					case StepStatusTasks.DOWNLOAD_MP:
					case StepStatusTasks.DOWNLOAD_MP_CI:
					case StepStatusTasks.DOWNLOAD_MP_CI_RULE_ATTR:
						return 65;
					case StepStatusTasks.STORAGE_USER_DATA_DB:
						return 70;
					case StepStatusTasks.CALCULATE_DATASET_COLUMNS_STATS:
						return 85;
					case StepStatusTasks.COMPLETE_UPLOAD_TASK:
						return 100;
				}
			}
			return 0;
		};

		const datasetDeleted = () => {
			saasLimitsState.getActualStatistics();
		};

		onBeforeMount(() => {
			header.value = [...datasetsHeader];
			if (!props.selectable && header.value.some((col: any) => col.name === datasetHeaderEnums.CHECKBOX)) {
				header.value.shift();
			}
			// @ts-ignore
			activeJobInterval.value = setInterval(() => {
				store.dispatch(`${DATASET_STORE_NAME}/${DATASET_ACTIONS.UPDATE_STATUS}`);
			}, 2000);
			loadMoreDatasets(true);
		});

		onBeforeUnmount(() => {
			// @ts-ignore
			clearInterval(activeJobInterval.value);
		});

		watch(() => props.search, (value) => {
			clearTimeout(state.searchTimeout);
			state.searchTimeout = setTimeout(() => {
				store.dispatch(`${DATASET_STORE_NAME}/${DATASET_ACTIONS.LOAD_NEXT_PAGE}`, {
					reset: true,
					search: value
				});
			}, 500);
		});

		return {
			...toRefs(state),
			isLoading,
			totalRecords,
			tableData,
			datasetHeaderEnums,
			header,
			isPending,
			generateColsCountString,
			generateRowsCountString,
			updateSelectedDatasets,
			sourceIcon,
			DatasetStatus,
			UPLOAD_TYPES,
			openDeleteDatasetModal,
			loadMoreDatasets,
			ownedByUser,
			onRowClick,
			getScheduledDate,
			getCreatedDate,
			getBannersValues,
			getUploadedFileSize,
			formatToRelativeDate,
			isInProgress,
			getRunningJobStepDescription,
			getRunningJobStepProgress,
			datasetDeleted
		};
	}
});
</script>

<style lang="scss" scoped>
	.name-cell {
		text-decoration: underline;
		min-width: 250px;
	}

	.overflow-cell {
		max-width: 104px !important;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.v-popper__arrow-container {
		display: block !important;
	}

	.icon--column {
		width: 20px;
	}

	.w-max-content {
		width: max-content;
	}

</style>


// @ts-ignore
import i18n from '@/plugins/i18n';
import {DatasetJobStatus, DatasetStatus, JobType} from '@/modules/dataset/consts/enums';
import {datasetService} from '@/modules/dataset/datasetService';
import {TranslateResult} from 'vue-i18n';
import {useNotification} from '@kyvg/vue3-notification';
import {SelectItem} from '@/components/main/Dropdown/types';

// @ts-ignore
const {t} = i18n.global;
const notification = useNotification();

export const TELLSTORY_ROW_ID = '__tellstory_row_id__';

export const actionValues = {
	CREATE_STORY: 'create-story',
	CREATE_EXPLORATION: 'create-exploration',
	REFRESH: 'refresh',
	RENAME: 'rename',
	REUPLOAD: 'reupload',
	UPDATE_CYCLE: 'update-cycle',
	SHARE: 'share',
	DELETE: 'delete'
};

export const actionMenuSets = {
	ACTION_ITEMS: 'actionItems',
	ACTION_ITEMS_DETAIL: 'actionItemsDetail'
};

export const sourceFilters = [
	{
		value: 'source',
		order: 'DESC',
		label: t('t_source')
	}
];

export const fileFilters = [
	{
		value: 'file',
		order: 'DESC',
		label: t('datasetDetail.cardNames.fileType')
	}
];

export const stateFilters = [
	{
		value: 'state',
		order: 'DESC',
		label: t('t_state')
	}
];

export const actionItems: SelectItem[] = [
	{
		value: actionValues.CREATE_STORY,
		label: t('t_createStory'),
		icon: 'ds-icon-story-type'
	},
	{
		value: actionValues.CREATE_EXPLORATION,
		label: t('t_createExploration'),
		icon: 'ds-icon-story-type'
	},
	{
		value: actionValues.REFRESH,
		label: t('t_Refresh'),
		icon: 'ds-icon-refresh'
	},
	{
		value: actionValues.REUPLOAD,
		label: t('t_Reupload'),
		icon: 'ds-icon-dq_dashboard'
	},
	{
		value: actionValues.RENAME,
		label: t('t_Rename'),
		icon: 'icon-pencil'
	},
	{
		value: actionValues.SHARE,
		label: t('t_share'),
		icon: 'icon-share'
	},
	{
		value: actionValues.DELETE,
		label: t('t_Delete'),
		icon: 'icon-trash'
	}
];

export const actionItemsDetail: SelectItem[] = [
	{
		value: actionValues.CREATE_STORY,
		label: t('t_createStory'),
		icon: 'ds-icon-story-type'
	},
	{
		value: actionValues.CREATE_EXPLORATION,
		label: t('t_createExploration'),
		icon: 'ds-icon-story-type'
	},
	{
		value: actionValues.REFRESH,
		label: t('t_Refresh'),
		icon: 'ds-icon-refresh'
	},
	{
		value: actionValues.UPDATE_CYCLE,
		label: t('t_UpdateCycle'),
		icon: 'icon-pencil'
	},
	{
		value: actionValues.DELETE,
		label: t('t_Delete'),
		icon: 'icon-trash'
	}
];


export const compareJobRunStatus = (dataset: any, value: DatasetJobStatus): boolean => {
	if (dataset.info !== null) {
		return dataset.info.externalRunnerJobRun.status === value;
	} else if (dataset.latestScheduledJobRun) {
		return dataset.latestScheduledJobRun.status === value;
	}
	return false;
};

export const getJobType = (dataset: any) => {
	if (dataset.info !== null) {
		return dataset.info.externalRunnerJobRun.externalRunnerReference.jobType;
	}
	if (dataset.scheduledJobDefinition !== null) {
		return dataset.scheduledJobDefinition.externalRunnerReference.jobType;
	}
	return null;
};

export const getDatasetStatus = (dataset: any): DatasetStatus => {
	if (!dataset.info && !dataset.latestScheduledJobRun) {
		return DatasetStatus.NO_DATA;
	} else if (!dataset.info && dataset.latestScheduledJobRun.status === DatasetJobStatus.ERROR) {
		return DatasetStatus.ERROR;
	} else if (dataset.info && (!dataset.latestScheduledJobRun || dataset.latestScheduledJobRun.status === DatasetJobStatus.ERROR)) {
		return DatasetStatus.FUNCTIONAL;
	} else if (dataset.latestScheduledJobRun.status === DatasetJobStatus.COMPLETED) {
		return DatasetStatus.VALID;
	} else if (!dataset.info && dataset.latestScheduledJobRun.status === DatasetJobStatus.RUNNING) {
		return DatasetStatus.RUNNING;
	} else if (!dataset.info && dataset.latestScheduledJobRun.status === DatasetJobStatus.PENDING) {
		return DatasetStatus.PENDING;
	}
	return DatasetStatus.UNKNOWN;
};

export const sourceIcon = (jobType: string) => {
	switch (jobType) {
		case JobType.PROCESS_URL_LINK:
			return 'ds-icon-link-horizontal';
		case JobType.PROCESS_CSV_FILE:
			return 'ds-icon-upload';
		case JobType.PROCESS_GOOGLE_SHEET:
			return 'ds-icon-google-folder';
		case JobType.PROCESS_DQ_MONITORING_PROJECT:
		case JobType.PROCESS_DQ_CATALOG_ITEM:
			return 'ds-icon-dq_dashboard';
	}

	return 'ds-icon-upload';
};

export const updateDatasetModal = async(messageSuccess: TranslateResult, messageFailure: TranslateResult, params: object, datasetId: string) => {
	try {
		await datasetService.updateSchedulingCycle(datasetId, params);
		// @ts-ignore
		notification.notify({
			type: 'success',
			text: messageSuccess
		});
		return 'closeModal';
	} catch (err) {
		// @ts-ignore
		notification.notify({
			type: 'danger',
			text: messageFailure
		});
		return 'cancel';
	}
};

export const UPLOAD_TYPES = {
	UPLOAD_FILE: 'uploadFile',
	IMPORT_URL: 'importUrl',
	GOOGLE_DRIVE: 'gDrive',
	DQ_IMPORT: 'dq'
};

export const getIconTitle = (dataset: any) => {
	if (dataset?.latestScheduledJobRun?.externalRunnerReference?.jobType) {
		return dataset.latestScheduledJobRun.externalRunnerReference.jobType;
	}
	return 'WaitingForData';
};

export const generateRowsCountString = (rows: number) => {
	if (rows) {
		if (rows >= 1000000000) {
			return `${(Math.round(rows / 1000000) / 1000).toFixed(1)}G`;
		}
		if (rows >= 1000000) {
			return `${(Math.round(rows / 1000) / 1000).toFixed(1)}M`;
		}
		if (rows >= 1000) {
			return `${(rows / 1000).toFixed(0)}K`;
		}
		return rows;
	}
	return t('t_NoData');
};

export const generateColsCountString = (cols: number) => {
	if (cols > 0) {
		return `${cols ?? 0}`;
	}
	return t('t_NoData');
};

export const getReuploadType = (jobType: string) => {
	switch (jobType) {
		case JobType.PROCESS_URL_LINK:
			return UPLOAD_TYPES.IMPORT_URL;
		case JobType.PROCESS_CSV_FILE:
			return UPLOAD_TYPES.UPLOAD_FILE;
		case JobType.PROCESS_GOOGLE_SHEET:
			return UPLOAD_TYPES.GOOGLE_DRIVE;
		case JobType.PROCESS_DQ_CATALOG_ITEM:
		case JobType.PROCESS_DQ_MONITORING_PROJECT:
			return UPLOAD_TYPES.DQ_IMPORT;
	}

	return UPLOAD_TYPES.UPLOAD_FILE;
};


// eslint-disable-next-line max-lines-per-function
export const getBannersValues = (value: DatasetStatus, stepInfo = ''): any => {
	switch (value) {
		case DatasetStatus.NO_DATA:
			return {
				bannerVariant: 'secondary-outline',
				bannerText: t(`t_datasetStatusMessage${value}`),
				showBadge: true,
				badgeVariant: 'secondary-outline',
				badgeText: t('t_datasetStatusInQueue')
			};

		case DatasetStatus.ERROR:
			return {
				bannerVariant: 'error',
				bannerText: stepInfo,
				showBadge: true,
				badgeVariant: 'error',
				badgeText: t(`t_datasetStatus${value}`)
			};

		case DatasetStatus.FUNCTIONAL:
			return {
				bannerVariant: 'warning',
				bannerText: t(`t_datasetStatus${value}`),
				showBadge: true,
				badgeVariant: 'warning',
				badgeText: 'Warning'
			};

		case DatasetStatus.RUNNING:
			return {
				bannerVariant: 'secondary',
				bannerText: stepInfo,
				showBadge: true,
				badgeVariant: 'secondary',
				badgeText: t(`t_datasetStatus${value}`)
			};

		case DatasetStatus.VALID:
			return {
				bannerVariant: 'success',
				bannerText: t(`t_datasetStatus${value}`),
				showBadge: false,
				badgeVariant: 'success',
				badgeText: 'Completed'
			};

		case DatasetStatus.PENDING:
			return {
				bannerVariant: 'secondary',
				bannerText: t('t_datasetStatusPendingText'),
				showBadge: true,
				badgeVariant: 'secondary-outline',
				badgeText: t('t_datasetStatusInQueue')
			};

		case DatasetStatus.UNKNOWN:
			return {
				bannerVariant: 'secondary',
				bannerText: t('t_datasetStatusPendingText'),
				showBadge: true,
				badgeVariant: 'secondary-outline',
				badgeText: t('t_datasetStatusInQueue')
			};

		default:
			return {
				bannerVariant: 'warning',
				bannerText: t(`t_datasetStatus${value}`),
				showBadge: false,
				badgeVariant: 'error',
				badgeText: stepInfo
			};
	}
};

export const getUploadType = (jobType: JobType): {uploadType: any, fileType: any} => {
	switch (jobType) {
		case JobType.PROCESS_CSV_FILE:
			return {
				uploadType: t(`datasetDetail.jobType.${jobType}`),
				fileType: t('datasetDetail.fileType.csv')
			};

		case JobType.PROCESS_URL_LINK:
			return {
				uploadType: t(`datasetDetail.jobType.${jobType}`),
				fileType: t('datasetDetail.fileType.csv')
			};

		case JobType.PROCESS_GOOGLE_SHEET:
			return {
				uploadType: t(`datasetDetail.jobType.${jobType}`),
				fileType: t('datasetDetail.fileType.csv')
			};

		case JobType.PROCESS_DQ_MONITORING_PROJECT:
			return {
				uploadType: t(`datasetDetail.jobType.${jobType}`),
				fileType: t('datasetDetail.fileType.monitoringProject')
			};

		case JobType.PROCESS_DQ_CATALOG_ITEM:
			return {
				uploadType: t(`datasetDetail.jobType.${jobType}`),
				fileType: t('datasetDetail.fileType.catalogItem')
			};
		default:
			return {
				uploadType: 'N/A',
				fileType: 'N/A'
			};
	}
};

export const getSourceIcon = (dataset: any) => {
	if (dataset?.latestScheduledJobRun?.externalRunnerReference?.jobType) {
		switch (dataset.latestScheduledJobRun.externalRunnerReference.jobType) {
			case 'ProcessUrlLink':
				return 'ds-icon-link-horizontal';
			case 'ProcessCsvFile':
				return 'ds-icon-upload';
			case 'ProcessGoogleSheet':
				return 'ds-icon-google-folder';
			case 'DqMpRuleAttrValidity':
			case 'DqCiAttrRuleValidity':
				return 'ds-icon-dq_dashboard';
		}
	}
	return 'ds-icon-upload';
};

/* eslint-disable */
const DIVISIONS = [
	{amount: 60, name: 'seconds'},
	{amount: 60, name: 'minutes'},
	{amount: 24, name: 'hours'},
	{amount: 7, name: 'days'},
	{amount: 4.34524, name: 'weeks'},
	{amount: 12, name: 'months'},
	{amount: Number.POSITIVE_INFINITY, name: 'years'}
];
/* eslint-enable */

export const formatToRelativeDate = (date: any | null) => {
	if (!date) {
		return 'N/A';
	}

	// eslint-disable-next-line no-undefined
	const formatter = new Intl.RelativeTimeFormat(undefined, {
		numeric: 'auto'
	});
	// @ts-ignore
	let duration = (new Date(date) - Date.now()) / 1000;
	for (let i = 0; i < DIVISIONS.length; i++) {
		const division = DIVISIONS[i];
		if (Math.abs(duration) < division.amount) {
			// @ts-ignore
			return formatter.format(Math.round(duration), division.name);
		}
		duration /= division.amount;
	}
	return null;
};

export const dateFormatter = (date: string | null) => {
	if (date) {
		return new Intl.DateTimeFormat('default', {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric'
		}).format(new Date(date));
	}
	return 'N/A';
};

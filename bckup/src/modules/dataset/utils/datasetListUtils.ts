import {getDatasetStatus, getUploadType} from '@/modules/dataset/utils/dataset';
import i18n from '@/plugins/i18n';
const {t} = i18n.global;
import {DatasetStatus} from '@/modules/dataset/consts/enums';


export const datasetHeaderEnums = {
	NAME: 'Name',
	FILE_TYPE: 'File type',
	UPDATED: 'Updated',
	USAGE: 'Usage',
	ROWS: 'Rows',
	COLUMNS: 'Columns',
	SHARED_BY: 'Shared by',
	STATE: 'State',
	ID: 'Id',
	ACTIONS: 'actions',
	CHECKBOX: 'checkbox',
	ICON: 'icon'
};

// TODO: handle colors based on something/GROUP/USER
const getAcronyms = (userAcronym: any) => {
	const firstLetter = userAcronym.firstName.charAt(0).toUpperCase();
	const secondLetter = userAcronym.lastName.charAt(0).toUpperCase();
	return {
		label: `${firstLetter}${secondLetter}`,
		acronym: `${firstLetter}${secondLetter}`,
		bgColor: 'interaction-100',
		textColor: 'interaction-500'
	};
};

export const mapDatasetsToTable = (datasets: any, currentId: string) => {
	const result: any = [];
	for (const dataset of datasets) {
		result.push({
			[`${datasetHeaderEnums.NAME}`]: dataset.name,
			[`${datasetHeaderEnums.FILE_TYPE}`]: getUploadType(dataset?.latestScheduledJobRun?.externalRunnerReference.jobType ?? null),
			[`${datasetHeaderEnums.UPDATED}`]: dataset?.info?.processedAt,
			[`${datasetHeaderEnums.USAGE}`]: dataset.storyCount,
			[`${datasetHeaderEnums.ROWS}`]: dataset?.info?.rowsCount,
			[`${datasetHeaderEnums.COLUMNS}`]: dataset?.info?.columnsCount,
			[`${datasetHeaderEnums.STATE}`]: getDatasetStatus(dataset),
			[`${datasetHeaderEnums.SHARED_BY}`]: dataset?.ownedById === currentId ? '' : getAcronyms(dataset?.ownedBy),
			[`${datasetHeaderEnums.ID}`]: dataset.id,
			latestScheduledJobRun: dataset.latestScheduledJobRun,
			ownedById: dataset.ownedById,
			createdAt: dataset.createdAt,
			scheduledJobDefinition: dataset.scheduledJobDefinition,
			info: dataset.info
		});
	}
	return result;
};


export const datasetsHeader = [
	{
		name: datasetHeaderEnums.CHECKBOX,
		type: 'string',
		hidden: true
	},
	{
		name: datasetHeaderEnums.ICON,
		type: 'string',
		hidden: true
	},
	{
		name: datasetHeaderEnums.NAME,
		type: 'string'
	},
	{
		name: datasetHeaderEnums.FILE_TYPE,
		type: 'string'
	},
	{
		name: datasetHeaderEnums.UPDATED,
		type: 'date'
	},
	{
		name: datasetHeaderEnums.USAGE,
		type: 'string'
	},
	{
		name: datasetHeaderEnums.ROWS,
		type: 'number'
	},
	{
		name: datasetHeaderEnums.COLUMNS,
		type: 'number'
	},
	{
		name: datasetHeaderEnums.SHARED_BY,
		type: 'string'
	},
	{
		name: datasetHeaderEnums.STATE,
		type: 'string'
	},
	{
		name: datasetHeaderEnums.ACTIONS,
		type: 'string',
		hidden: true
	}
];

export const getBadgeVariant = (value: DatasetStatus) => {
	switch (value) {
		case DatasetStatus.ERROR:
			return {
				badgeVariant: 'error',
				badgeText: t(`t_datasetStatus${value}`)
			};
		case DatasetStatus.NO_DATA:
			return {
				badgeVariant: 'interaction',
				badgeText: t(`t_datasetStatus${value}`)
			};

		case DatasetStatus.FUNCTIONAL:
			return {
				badgeVariant: 'warning',
				badgeText: 'Warning'
			};

		case DatasetStatus.RUNNING:
			return {
				badgeVariant: 'secondary',
				badgeText: t(`t_datasetStatus${value}`)
			};

		case DatasetStatus.VALID:
			return {
				badgeVariant: 'success',
				badgeText: t(`t_datasetStatus${value}`)
			};

		default:
			return {
				badgeVariant: 'error',
				badgeText: t(`t_datasetStatus${value}`)
			};
	}
};

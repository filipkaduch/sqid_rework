import {DatasetJobStatus} from '@/modules/dataset/consts/enums';
// eslint-disable-next-line no-unused-vars
import {DatasetExploration, ExplorationSection} from '@/modules/explorer/store/dataExplore';

export const datasetHeaderEnums = {
	NAME: 'Name',
	FILE_TYPE: 'File type',
	UPDATED: 'Updated',
	USAGE: 'Usage',
	ROWS: 'Rows',
	COLUMNS: 'Columns',
	SHARED_BY: 'Shared by',
	STATE: 'State',
	ID: 'Id'
};

export const mapDatasetsToTable = (datasets: any) => {
	const result: any = [];
	for (const dataset of datasets) {
		result.push({
			[`${datasetHeaderEnums.NAME}`]: dataset.name,
			[`${datasetHeaderEnums.FILE_TYPE}`]: dataset?.latestScheduledJobRun?.externalRunnerReference.jobType,
			[`${datasetHeaderEnums.UPDATED}`]: dataset?.info?.processedAt,
			[`${datasetHeaderEnums.USAGE}`]: '',
			[`${datasetHeaderEnums.ROWS}`]: dataset?.info?.rowsCount,
			[`${datasetHeaderEnums.COLUMNS}`]: dataset?.info?.columnsCount,
			[`${datasetHeaderEnums.SHARED_BY}`]: '',
			[`${datasetHeaderEnums.STATE}`]: dataset.status,
			[`${datasetHeaderEnums.ID}`]: dataset.id
		});
	}
	return result;
};
export const createDatasetsObjects = (selectedDatasets: ExplorationSection[]) => {
	const datasetObj = {} as { [datasetExploreId: string]: DatasetExploration };
	for (const dataset of selectedDatasets) {
		datasetObj[dataset.dataExplorationId] = {
			name: dataset.name,
			datasetId: dataset.datasetId,
			catalogItemId: dataset.catalogItemId,
			attributes: {
				list: [],
				filteredByType: null
			}
		};
	}
	return datasetObj;
};

export const datasetsHeader = [
	{
		name: ' ',
		type: 'string'
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
	}
];

export const getBadgeVariant = (state: string) => {
	switch (state) {
		case DatasetJobStatus.PENDING:
			return 'warning';
		case DatasetJobStatus.COMPLETED:
			return 'success';
		case DatasetJobStatus.ERROR:
			return 'danger';
		case DatasetJobStatus.RUNNING:
			return 'display-content';
		default:
			return 'display-content';
	}
};

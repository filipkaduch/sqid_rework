import {datasetJobStatus, datasetStatus} from '@/modules/dataset/consts/datasetStatus';

export const JOB_FINISHED = [
	'COMPLETED',
	'ERROR'
];

const validDatasetStates = [
	'NO DATA',
	'FUNCTIONAL',
	'VALID'
];

export const datasetMixin = {
	methods: {
		compareJobRunStatus(dataset, value) {
			if (dataset.info !== null) {
				return dataset.info.externalRunnerJobRun.status === value;
			} else if (dataset.latestScheduledJobRun) {
				return dataset.latestScheduledJobRun.status === value;
			}
			return false;
		},
		compareJobStatusParams(info, value) {
			if (info !== null) {
				return info?.externalRunnerJobRun?.statusParams?.stepName === value;
			}
			return false;
		},
		getRunningJob(dataset) {
			return dataset?.latestScheduledJobRun ?? null;
		},
		compareJobProgress(dataset, value) {
			const job = this.getRunningJob(dataset);
			if (job !== null && dataset !== null) {
				if (job.statusParams !== null) {
					return job.statusParams.stepName === value;
				}
				if (dataset.latestScheduledJobRun !== null && dataset.info === null) {
					return !(dataset.latestScheduledJobRun.status === datasetJobStatus.ERROR);
				}
			}
			return true;
		},
		getDatasetStatus(dataset) {
			if (!dataset.info && !dataset.latestScheduledJobRun) {
				return datasetStatus.NO_DATA;
			} else if (!dataset.info && dataset.latestScheduledJobRun.status === datasetJobStatus.ERROR) {
				return datasetStatus.ERROR;
			} else if (dataset.info && (!dataset.latestScheduledJobRun || dataset.latestScheduledJobRun.status === datasetJobStatus.ERROR)) {
				return datasetStatus.FUNCTIONAL;
			} else if (dataset.latestScheduledJobRun.status === datasetJobStatus.COMPLETED) {
				return datasetStatus.VALID;
			} else if (!dataset.info && dataset.latestScheduledJobRun.status === datasetJobStatus.RUNNING) {
				return datasetStatus.RUNNING;
			}
			return datasetStatus.UNKNOWN;
		},
		isDatasetValid(dataset) {
			const status = this.getDatasetStatus(dataset);
			return validDatasetStates.includes(status);
		},
		isShared(dataset) {
			if (dataset !== null) {
				return dataset.visibility === 'SHARED';
			}
			return false;
		},
		canBeUpdated(dataset) {
			if (dataset) {
				return this.getJobType(dataset) === 'ProcessUrlLink'
					|| this.getJobType(dataset) === 'ProcessGoogleSheet';
			}
			return false;
		},
		getJobType(dataset) {
			if (dataset.info !== null) {
				return dataset.info.externalRunnerJobRun.externalRunnerReference.jobType;
			}
			if (dataset.scheduledJobDefinition !== null) {
				return dataset.scheduledJobDefinition.externalRunnerReference.jobType;
			}
			return null;
		},
		getNullValuesCount(column, info) {
			if (column !== null && info !== null) {
				return Math.ceil(column.nullValuesCount / info.rowsCount * 100);
			}
			return 0;
		},
		getColumnsCount(dataset) {
			if (dataset !== null) {
				return dataset.columnsCount;
			}
			return 0;
		},
		sourceIcon(dataset) {
			if (dataset?.latestScheduledJobRun?.externalRunnerReference?.jobType) {
				switch (dataset.latestScheduledJobRun.externalRunnerReference.jobType) {
					case 'ProcessUrlLink':
						return [
							'fas',
							'link'
						];
					case 'ProcessCsvFile':
						return [
							'fas',
							'file'
						];
					case 'ProcessGoogleSheet':
						return [
							'fab',
							'google-drive'
						];
					case 'DqMpRuleAttrValidity':
					case 'DqCiAttrRuleValidity':
						return [
							'fac',
							'data-quality'
						];
				}
			}
			return [
				'fad',
				'hourglass-half'
			];
		},
		getIconTitle(dataset) {
			if (dataset?.latestScheduledJobRun?.externalRunnerReference?.jobType) {
				return dataset.latestScheduledJobRun.externalRunnerReference.jobType;
			}
			return 'WaitingForData';
		},
		generateRowsCountString(dataset) {
			if (dataset?.info?.rowsCount) {
				return `${(dataset.info.rowsCount >= 1000000000)
					? (`${(Math.round(dataset.info.rowsCount / 1000000) / 1000).toFixed(1)}G`)
					: (
						(dataset.info.rowsCount >= 1000000)
							? (`${(Math.round(dataset.info.rowsCount / 1000) / 1000).toFixed(1)}M`)
							: (
								(dataset.info.rowsCount >= 1000)
									? (`${(dataset.info.rowsCount / 1000).toFixed(1)}K`)
									: dataset.info.rowsCount
							)
					)} ${this.$t('t_rows')}`;
			}
			return this.$t('t_NoData');
		},
		generateColsCountString(dataset) {
			if (dataset?.info?.columnsCount) {
				return `${this.getColumnsCount(dataset.info)} ${this.$t('t_cols')}`;
			}
			return this.$t('t_NoData');
		}
	}
};

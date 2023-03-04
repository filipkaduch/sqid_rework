export enum DatasetJobStatus {
	PENDING = 'PENDING',
	RUNNING = 'RUNNING',
	COMPLETED = 'COMPLETED',
	ERROR = 'ERROR'
}

export enum DatasetStatus {
	NO_DATA = 'NO_DATA',
	ERROR = 'ERROR',
	FUNCTIONAL = 'FUNCTIONAL',
	VALID = 'VALID',
	UNKNOWN = 'UNKNOWN',
	RUNNING = 'RUNNING',
	PENDING = 'PENDING'
}

export enum StepStatusTasks {
	DOWNLOAD_FILE_URL = 'DownloadFileUrlTask',
	DECOMPRESS_FILE = 'DecompressFileTask',
	TRANSFORM_EXCEL_TO_CSV = 'TransformExcelToCsvTask',
	DETECT_CSV_METADATA = 'DetectCsvMetadataTask',
	DETECT_COLUMN_DATATYPES = 'DetectColumnDataTypesTask',
	DOWNLOAD_GOOGLE_SHEET = 'DownloadGoogleSheetTask',
	DOWNLOAD_CI_ATTR_RULE = 'DownloadCiAttrRuleValidityTask',
	DOWNLOAD_CI_ATTR = 'DownloadCiAttrValidityTask',
	DOWNLOAD_CI_OVERALL = 'DownloadCiOverallValidityTask',
	DOWNLOAD_MP = 'DownloadMpValidityTask',
	DOWNLOAD_MP_CI = 'DownloadMpCiValidityTask',
	DOWNLOAD_MP_CI_RULE_ATTR = 'DownloadMpCiRuleAttrValidityTask',
	STORAGE_USER_DATA_DB = 'StoreUserDataDbTask',
	CALCULATE_DATASET_COLUMNS_STATS = 'CalculateDatasetColumnStatsTask',
	COMPLETE_UPLOAD_TASK = 'CompleteUploadTask'
}

export enum JobType {
	PROCESS_URL_LINK = 'ProcessUrlLink',
	PROCESS_GOOGLE_SHEET = 'ProcessGoogleSheet',
	PROCESS_CSV_FILE = 'ProcessCsvFile',
	PROCESS_DQ_MONITORING_PROJECT = 'DqCiAttrRuleValidity',
	PROCESS_DQ_CATALOG_ITEM= 'DqMpRuleAttrValidity'
}

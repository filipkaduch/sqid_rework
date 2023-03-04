type DatasourceTypes = 'DATA-STORIES-DATASET' | 'CATALOG-ITEM';
export interface DataSource {
	id: string;
	type: DatasourceTypes
}

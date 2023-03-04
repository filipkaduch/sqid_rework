import {dimensionDefinition} from '@/util/queryBuilder';
import {widgetServices} from '@/modules/widget/widgetServices';
import {mapFiltersForFetchData} from '@/modules/widget/components/widget-controls/filter/utils';
import cloneDeep from 'lodash/cloneDeep';

export interface RawData {
	columns: Column[];
	rows: any
}
interface Column {
	dataType: string;
	reference: string;
}

export default function useDataset() {
	const loadTableData = async(dataset: any, page: number, recordsPerPage: number = 20, filters: any = []) => {
		if (!dataset || dataset.info === null) {
			return;
		}

		const isCatalog = Boolean(dataset.attributes);

		const dimensionsToMap = isCatalog ? dataset.attributes : dataset.columns;

		// We need to make clauses from new format of filters
		const remapedFilters = cloneDeep(mapFiltersForFetchData(filters));
		remapedFilters.preAggregation = [].concat(remapedFilters.preAggregation);

		// Map dataset columns to dimensions so we could fetch data
		const dimensions = dimensionsToMap.map((column: any) => ({
			function: dimensionDefinition.NO_CHANGE,
			column: {
				name: column.name,
				alias: column.name
			}
		}));
		const payload = {
			...(isCatalog
				? {
					catalogItemId: dataset.id,
					dataObjectSource: 'CATALOG-ITEM'
				}
				: {
					datasetInfoId: dataset.info.datasetInfoId,
					dataObjectSource: 'DATA-STORIES-DATASET'
				}
			),
			dimensions,
			metrics: [],
			ranking: [],
			filters: remapedFilters,
			limit: recordsPerPage,
			offset: page * recordsPerPage,
			orderBy: []
		};
		const tableData = ((await widgetServices.fetchData(payload)).data) as RawData;
		// If we already have tableData append new data to old
		// eslint-disable-next-line consistent-return
		return {...tableData, page: page + 1, recordsPerPage: 20};
	};
	return {
		loadTableData
	};
}

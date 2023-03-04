import {axiosGet, axiosPost, axiosUpdate} from '@/util/axiosServiceHandler';

class DatasetService {
	getDatasets(params: object) {
		return axiosGet('/v0/datasets/', params);
	}

	async getDatasetActiveJobs() {
		const {data} = await axiosGet('/v0/dataset-tasks/active-jobs');
		return data;
	}

	async getDatasetById(datasetId: string) {
		const {data} = await axiosGet(`/v0/datasets/${datasetId}`);
		return data;
	}

	async nextSheduledJobs(config: any) {
		const {data} = await axiosGet('/v0/dataset-tasks/next-scheduled-jobs', config);
		return data;
	}

	async manualReRun(datasetId: string, params: object) {
		const {data} = await axiosPost(`/v0/dataset-tasks/manual-run/${datasetId}`, params);
		return data;
	}

	async updateSchedulingCycle(datasetId: string, params: object) {
		const {data} = await axiosUpdate(`/v0/datasets/${datasetId}`, params);
		return data;
	}

	async updateDataset(datasetId: string, params: object) {
		const {data} = await axiosUpdate(`/v0/datasets/${datasetId}`, params);
		return data;
	}

	async generateUploadLink(datasetId: string) {
		const data = await axiosPost(`/v0/dataset-tasks/generate-upload-link/${datasetId}`);
		return data;
	}

	async getScheduledJobRunsById(datasetId: string, params: object) {
		const data = await axiosGet(`/v0/dataset-tasks/${datasetId}/scheduled-job-runs`, params);
		return data;
	}

	async getCatalogItems(payload: any = {}) {
		const data = await axiosGet('v0/integrations/gen2/catalog-items', {
			params: payload
		});
		return data;
	}

	async getCatalogItemsDetail(catalogItemIds: any) {
		const {data} = await axiosGet('v0/integrations/gen2/catalog-items/detail', {
			params: {
				ids: catalogItemIds
			}
		});
		return data;
	}
}
export const datasetService = new DatasetService();

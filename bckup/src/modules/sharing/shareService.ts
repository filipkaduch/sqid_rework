import {axiosDelete, axiosGet, axiosPost} from '@/util/axiosServiceHandler';

class ShareService {
	async getIdentities(params: object) {
		const {data} = await axiosGet('v0/integrations/gen2/identities', params);
		return data;
	}

	async getDatasetSharingRecords(datasetId: string) {
		const {data} = await axiosGet(`/v0/datasets/${datasetId}/sharing-records`);
		return data;
	}

	async createDatasetSharingRecord(datasetId: string, params: object) {
		const {data} = await axiosPost(`/v0/datasets/${datasetId}/sharing-records`, params);
		return data;
	}

	async deleteDatasetRecord(datasetId: string, datasetSharingRecordId: string) {
		const response = await axiosDelete(`/v0/datasets/${datasetId}/sharing-records/${datasetSharingRecordId}`);
		return response;
	}

	async getStorySharingRecords(storyId: string, recordType: string | null = null) {
		const data = await axiosGet(`v0/stories/${storyId}/sharing-records`, {
			params: {
				recordType
			}
		});

		return data;
	}

	async syncToDataCatalog(storyId: string): Promise<void> {
		await axiosPost(`/v0/stories/${storyId}/sync-to-data-catalog`);
	}
}
export const shareService = new ShareService();

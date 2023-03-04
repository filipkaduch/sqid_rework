import {axiosDelete, axiosGet, axiosPost, axiosUpdate} from '@/util/axiosServiceHandler';
import {DataSource} from '@/modules/dataset/utils/types';
import {DATASOURCE_TYPES} from '@/modules/dataset/utils/datasetUtils';

class StoryServices {
	async getStoryDetail(id: string) {
		const {data} = await axiosGet(`/v0/stories/${id}`);
		return data;
	}

	async getAllStories(params: any) {
		const {data} = await axiosGet('/v0/stories/', params);
		return data;
	}

	async getStoryThumbnails(storyIds: any) {
		const {data} = await axiosGet('/v0/stories/thumbnails', {params: {storyIds: storyIds.toString()}});
		return data;
	}

	async createStory(createStoryConfig: any) {
		const {data} = await axiosPost('/v0/stories', createStoryConfig);
		return data;
	}

	async duplicateStory(id: string, params: any) {
		const {data} = await axiosPost(`/v0/stories/${id}/duplicate`, params);
		return data;
	}

	async duplicateStorySection(storyId: string, sectionId: string) {
		const {data} = await axiosPost(`/v0/stories/${storyId}/sections/${sectionId}/duplicate`);
		return data;
	}

	async moveStepToAnotherStorySection(storyId: string, sectionId: string, widgetId: string, newParent: string) {
		const {data} = await axiosPost(`/v0/stories/${storyId}/sections/${sectionId}/widgets/${widgetId}/move`, {newParent});
		return data;
	}

	deleteStory(id: string) {
		return axiosDelete(`/v0/stories/${id}`);
	}

	updateStory(updateStoryConfig: any, storyId: string) {
		return axiosUpdate(`/v0/stories/${storyId}`, updateStoryConfig);
	}

	setStoryDataset(storyId:string, datasetId:string) {
		return axiosPost(`/v0/stories/${storyId}/dataset/${datasetId}`);
	}

	async loadStory(storyId: string) {
		const {data} = await axiosGet(`/v0/stories/${storyId}`);
		return data;
	}

	async loadSharedStory(storyId: string) {
		const {data} = await axiosGet(`/v0/shared-stories/${storyId}`);
		return data;
	}

	async reorderStorySections(storyId: string, newOrder: any) {
		const {data} = await axiosPost(`/v0/stories/${storyId}/reorder`, {newOrder});
		return data;
	}

	putStory(storyId: string, storyData: any) {
		return axiosUpdate(`/v0/stories/${storyId}`, {...storyData});
	}

	postClap(storyId: string) {
		return axiosPost(`/v0/stories/${storyId}/stats/clap`);
	}

	postUserEvent(eventType: string) {
		return axiosPost('/v0/events/user/record', {eventType});
	}

	async addCatalogItemToStory(storyId:string, catalogItemId:string) {
		const result = await axiosPost(`/v0/stories/${storyId}/catalog-item/${catalogItemId}`);
		return result;
	}

	async addDataSourcesToStory(storyId: string, dataSources: DataSource[]) {
		const sources = dataSources.map((source) => source.type === DATASOURCE_TYPES.DATASET
			? {type: source.type, datasetId: source.id}
			: {type: source.type, catalogItemId: source.id});
		const result = await axiosPost(`/v0/stories/${storyId}/data-objects/bulk-create`, {dataObjects: sources});
		return result;
	}

	async deleteDataSourcesFromStory(storyId:string, dataSources: DataSource[]) {
		const sources = dataSources.map((source) => source.type === DATASOURCE_TYPES.DATASET
			? {type: source.type, datasetId: source.id}
			: {type: source.type, catalogItemId: source.id});
		const result = await axiosPost(`/v0/stories/${storyId}/data-objects/bulk-delete`, {dataObjects: sources});
		return result;
	}

	async deleteDatasetFromStory(storyId:string, datasetId:string) {
		const result = await axiosDelete(`/v0/stories/${storyId}/dataset/${datasetId}`);
		return result;
	}

	async deleteCatalogFromStory(storyId:string, catalogItemId:string) {
		const result = await axiosDelete(`/v0/stories/${storyId}/catalog-item/${catalogItemId}`);
		return result;
	}
}
export const storyServices = new StoryServices();


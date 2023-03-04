import {axiosGet, axiosPost} from '@/util/axiosServiceHandler';
type StoryType = 'visual-data-story' | 'data-dashboard' | null
class StatisticsService {
	async getNumberOfStories(storyType?: StoryType) {
		const {data} = await axiosGet('/v0/statistics/stories/count', {
			params: {
				storyType
			}
		});
		return data.value;
	}

	async getCurrentStats() {
		const {data} = await axiosPost('/v0/auth/user');
		return data.user.subscription.currentStats;
	}

	async getNumberOfViews(storyType?: StoryType) {
		const {data} = await axiosGet('/v0/statistics/stories/views', {
			params: {
				storyType
			}
		});
		return data.value;
	}

	async getNumberOfDatasets() {
		const {data} = await axiosGet('/v0/statistics/datasets/count');
		return data.value;
	}

	async getStoriesDatasetCount(storyIds: number[]) {
		const {data} = await axiosGet('/v0/statistics/stories/datasets/count', {params: {storyIds: storyIds.toString()}});
		return data.values;
	}

	async getDatasetsStoriesCount(datasetIds: number[]) {
		const {data} = await axiosGet('/v0/statistics/datasets/stories/count', {params: {datasetIds: datasetIds.toString()}});
		return data.values;
	}
}
export const statisticsService = new StatisticsService();

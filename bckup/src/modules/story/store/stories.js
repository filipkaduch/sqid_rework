import axios from 'axios';
import {statisticsService} from '@/modules/homepage/statisticsService';
import {storyFilterType, storyOrderType, storySortFilterType} from '@/modules/story/consts/storyType';


const getInitialState = () => ({
	loading: false,
	loadingNextPage: false,
	page: 0,
	pageLength: 20,
	totalRecords: null,
	stories: [],
	error: null
});

// noinspection DuplicatedCode
export default {
	namespaced: true,
	state: getInitialState(),
	getters: {
		loading: (state) => state.loading,
		loadingNextPage: (state) => state.loadingNextPage,
		totalRecords: (state) => state.totalRecords,
		stories: (state) => state.stories,
		error: (state) => state.error,
		page: (state) => state.pageLength,
		pageLength: (state) => state.page,
		lastPage: (state) => state.page * state.pageLength >= (state.totalRecords ?? 0)
	},
	mutations: {
		startLoading(state) {
			state.loading = true;
			state.error = null;
		},
		startLoadingNextPage(state) {
			state.loadingNextPage = true;
			state.error = null;
		},
		nextPage(state) {
			state.page += 1;
		},
		addStories(state, {totalRecords, stories}) {
			state.totalRecords = totalRecords;
			state.stories = state.stories.concat(stories);
			state.loading = false;
			state.loadingNextPage = false;
		},
		deleteStory(state, id) {
			const index = state.stories.findIndex((story) => story.id === id);
			state.stories.splice(index, 1);
			state.totalRecords -= 1;
		},
		setError(state, error) {
			state.error = error;
			state.loading = false;
			state.loadingNextPage = false;
		},
		setThumbnail(state, {id, thumbnail}) {
			const story = state.stories.find((it) => it.id === id);
			if (story) {
				story.thumbnail = thumbnail;
			}
		},
		setFavorite(state, {id, isFavorite}) {
			const story = state.stories.find((item) => item.id === id);
			if (story) {
				story.isFavorite = isFavorite;
			}
		},
		prependStory(state, story) {
			state.stories.unshift(story);
		},
		reset(state) {
			Object.assign(state, getInitialState());
		}
	},
	actions: {
		prependStory({commit}, story) {
			commit('prependStory', story);
		},
		deleteStory({commit}, id) {
			commit('deleteStory', id);
		},
		async loadNextPage({commit, state}, {
			reset = false,
			storyType = null,
			searchTerm = null,
			orderByColumn = storySortFilterType.UPDATED_AT,
			orderByDir = storyOrderType.DESC,
			storyFilter = storyFilterType.OWNED_OR_SHARED_GEN2,
			onlyFavorites = null
		}) {
			if (state.page === 0 || reset) {
				commit('reset');
				commit('startLoading');
			} else {
				commit('startLoadingNextPage');
			}
			commit('nextPage');

			try {
				const {data: stories} = await axios.get('/v0/stories', {
					params: {
						limit: state.pageLength,
						offset: (state.page - 1) * state.pageLength,
						storyType,
						searchTerm,
						orderByColumn,
						orderByDir,
						storyFilter,
						onlyFavorites
					}
				});
				const storyIds = stories.data.map((story) => story.id);
				const storiesDatasetsCount = await statisticsService.getStoriesDatasetCount(storyIds);
				commit('addStories', {
					totalRecords: stories.pagination.count,
					stories: await Promise.all(stories.data.map((story) => ({
						...story,
						datasetCount: storiesDatasetsCount[story.id]
					})))
				});
			} catch (err) {
				commit('setError', err?.data?.message ?? 'Can\'t load stories');
			}
		}
	}
};

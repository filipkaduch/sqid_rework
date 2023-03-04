import i18n from '@/plugins/i18n';
const {t} = i18n.global;


export const storyType = {
	VISUAL_DATA_STORY: 'visual-data-story',
	DATA_DASHBOARD: 'data-dashboard',
	DATA_EXPLORE: 'data-explore'
};

export const sourceType = {
	DATASET: t('t_dataset'),
	CATALOG: t('t_catalog')
};

export enum storyFilterType {
	OWNED_OR_SHARED_GEN2 = 'OWNED-OR-SHARED-GEN2',
	ONLY_FAVORITE = 'ONLY_FAVORITE',
	ONLY_OWNED = 'ONLY-OWNED',
	ONLY_SHARED_GEN2 = 'ONLY-SHARED-GEN2'
}

export const storyEditorMenu = {
	STEP: 'step',
	SECTION: 'section',
	STORY: 'story'
};

export enum storySortFilterType {
	UPDATED_AT = 'updated_at',
	IS_FAVORITE = 'is_favorite',
	NAME = 'name',
	CREATED_AT = 'created_at',
	STORY_STATISTIC_VISITORS_COUNT = 'story_statistic__visitors_count'
}

export enum storyOrderType {
	ASC = 'ASC',
	DESC = 'DESC',
}

export const createOptions = [
	{value: storyType.VISUAL_DATA_STORY, label: t('t_Story'), properties: {subText: t('t_storySubtext')}},
	{value: storyType.DATA_DASHBOARD, label: t('t_dashboard'), properties: {subText: t('t_dashboardSubtext')}}
];

export const explorerOption = {
	value: storyType.DATA_EXPLORE, label: t('t_Exploration'), properties: {subText: t('explore.createReason')}
};

export const storyVisualizationTypes = [
	{
		type: storyType.VISUAL_DATA_STORY,
		title: t('t_Story'),
		desc: t('createStory.storyDesc'),
		reason: t('createStory.storyReason'),
		icon: 'ds-icon-story-type'
	},
	{
		type: storyType.DATA_DASHBOARD,
		title: t('t_dashboard'),
		desc: t('createStory.dashboardDesc'),
		reason: t('createStory.dashboardReason'),
		icon: 'ds-icon-dashboard'
	},
	{
		type: storyType.DATA_EXPLORE,
		title: t('t_dataExplore'),
		desc: t('explore.createDesc'),
		reason: t('explore.createReason'),
		icon: 'ds-icon-exploration'
	}
];

export const sortFilters = [
	{
		label: t('t_DateModified'),
		value: storySortFilterType.UPDATED_AT as string
	},
	{
		label: t('t_favoriteFirst'),
		value: storySortFilterType.IS_FAVORITE as string
	},
	{
		label: t('t_Name'),
		value: storySortFilterType.NAME as string
	},
	{
		label: t('t_DateCreated'),
		value: storySortFilterType.CREATED_AT as string
	},
	{
		label: t('t_views'),
		value: storySortFilterType.STORY_STATISTIC_VISITORS_COUNT as string
	}
];

export const storyToggleItems = [
	{
		label: 't_all',
		value: null
	},
	{
		label: 't_Stories',
		value: storyType.VISUAL_DATA_STORY
	},
	{
		label: 'explore.name',
		value: storyType.DATA_EXPLORE
	},
	{
		label: 't_Dashboards',
		value: storyType.DATA_DASHBOARD
	}
];

export const storyFilters = [
	{
		label: t('t_allFiles'),
		value: storyFilterType.OWNED_OR_SHARED_GEN2
	},
	{
		label: t('t_favorite'),
		value: storyFilterType.ONLY_FAVORITE
	},
	{
		label: t('t_onlyOwned'),
		value: storyFilterType.ONLY_OWNED
	},
	{
		label: t('t_onlyShared'),
		value: storyFilterType.ONLY_SHARED_GEN2
	}
];

export const dataSourceTypes = [
	{
		name: sourceType.DATASET
	},
	{
		name: sourceType.CATALOG
	}
];

export const orderFilters = [
	{
		label: t('t_orderZA'),
		value: storyOrderType.DESC as string,
		alias: {
			[`${storySortFilterType.CREATED_AT}`]: t('t_newestFirst'),
			[`${storySortFilterType.STORY_STATISTIC_VISITORS_COUNT}`]: t('t_mostViews')
		},
		hideAt: [storySortFilterType.IS_FAVORITE, storySortFilterType.UPDATED_AT]
	},
	{
		label: t('t_orderAZ'),
		value: storyOrderType.ASC as string,
		alias: {
			[`${storySortFilterType.CREATED_AT}`]: t('t_oldestFirst'),
			[`${storySortFilterType.STORY_STATISTIC_VISITORS_COUNT}`]: t('t_leastViews')
		},
		hideAt: [storySortFilterType.IS_FAVORITE, storySortFilterType.UPDATED_AT]
	}
];

import {computed, inject, ref} from 'vue';
import {createGlobalState, useSessionStorage} from '@vueuse/core';
import {statisticsService} from '@/modules/homepage/statisticsService';
import i18n from '@/plugins/i18n';
import {LimitStatus} from '@/modules/limits/consts/enums';

type StatusData = {
	message: string;
	messageCTA: string;
	countStories: number;
	countStoriesMax: number;
	countDatasets: number;
	countDatasetsMax: number;
}

enum LevelAmounts {
	ERROR = 10,
	WARNING = 7
}

export const useSaasLimits = createGlobalState(() => {
	const {t} = i18n.global;
	const appConfig = inject('appConfig');
	const oneIntegration = computed(() => appConfig?.oneIntegration);

	// state
	const statistics = ref({
		stories: 0,
		dashboards: 0,
		datasets: 0
	});

	// Reactive status for 3 alerts
	const alertsVisibilityStatus = ref(useSessionStorage('alerts', {
		homepageInfoAlert: false,
		storyCreateInfoAlert: true,
		datasetCreateInfoAlert: true
	}));

	// getters
	const limitsStatusCombined = computed(() => {
		if (!oneIntegration.value) {
			if (statistics.value.stories >= LevelAmounts.ERROR || statistics.value.datasets >= LevelAmounts.ERROR) {
				return LimitStatus.ERROR;
			}
			if (statistics.value.stories >= LevelAmounts.WARNING || statistics.value.datasets >= LevelAmounts.WARNING) {
				return LimitStatus.WARNING;
			}
		}
		return LimitStatus.SUCCESS;
	});

	const limitStatusStories = computed(() => {
		if (!oneIntegration.value) {
			if (statistics.value.stories >= LevelAmounts.ERROR) {
				return LimitStatus.ERROR;
			}
			if (statistics.value.stories >= LevelAmounts.WARNING) {
				return LimitStatus.WARNING;
			}
		}
		return LimitStatus.SUCCESS;
	});

	const limitStatusDatasets = computed(() => {
		if (!oneIntegration.value) {
			if (statistics.value.datasets >= LevelAmounts.ERROR) {
				return LimitStatus.ERROR;
			}
			if (statistics.value.datasets >= LevelAmounts.WARNING) {
				return LimitStatus.WARNING;
			}
		}
		return LimitStatus.SUCCESS;
	});

	// @ts-ignore
	const getAlertVisibilityStatus = (id: string) => alertsVisibilityStatus.value[id];

	// actions
	const setAlertVisibilityStatus = (id: string, visible: boolean) => {
		// @ts-ignore
		alertsVisibilityStatus.value[id] = visible;
	};

	const getActualStatistics = async() => {
		const currentStats = await statisticsService.getCurrentStats();
		const storiesCount = currentStats.cntStories;
		const dashboardsCount = 0;
		const datasetsCount = currentStats.cntPrivateDatasets;

		statistics.value.stories = storiesCount;
		statistics.value.dashboards = dashboardsCount;
		statistics.value.datasets = datasetsCount;
	};

	// @ts-ignore
	const getStatusData = computed(() => {
		const out: StatusData = {
			countStories: statistics.value.stories,
			countStoriesMax: LevelAmounts.ERROR,
			countDatasets: statistics.value.datasets,
			countDatasetsMax: LevelAmounts.ERROR,
			message: '',
			messageCTA: ''
		};

		if (statistics.value.stories >= LevelAmounts.ERROR && statistics.value.datasets >= LevelAmounts.ERROR) {
			out.message = t('limits.disabledDatasetsAndReports');
			out.messageCTA = t('limits.disabledDatasetsAndReportsCTAText');
		} else {
			if (statistics.value.stories >= LevelAmounts.ERROR) {
				out.message = t('limits.disabledReports');
				out.messageCTA = t('limits.disabledReportsCTAText');
			}
			if (statistics.value.datasets >= LevelAmounts.ERROR) {
				out.message = t('limits.disabledDatasets');
				out.messageCTA = t('limits.disabledDatasetsCTAText');
			}
		}

		out.countStories = statistics.value.stories;
		out.countStoriesMax = LevelAmounts.ERROR;
		out.countDatasets = statistics.value.datasets;
		out.countDatasetsMax = LevelAmounts.ERROR;

		return out;
	});

	return {
		statistics,
		getActualStatistics,
		getStatusData,
		limitStatusStories,
		limitStatusDatasets,
		limitsStatusCombined,
		alertsVisibilityStatus,
		getAlertVisibilityStatus,
		setAlertVisibilityStatus
	};
});

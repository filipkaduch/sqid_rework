<template>
	<ds-box padding-top="XL" padding-bottom="M" padding-x="XL">
		<ds-row>
			<ds-col class="p-0" cols="12" md="6" xl="3">
				<ds-box padding-x="M" padding-bottom="M">
					<ds-statistics-card icon="icon storyType" :loading="loading" :text="$t('statisticsHeader.numberOfStories')" :value="storiesCount">
						<template #icon>
							<ds-icon name="ds-icon-story-type" class="icon" fill="display-content-500" />
						</template>
					</ds-statistics-card>
				</ds-box>
			</ds-col>
			<ds-col class="p-0" cols="12" md="6" xl="3">
				<ds-box padding-x="M" padding-bottom="M">
					<ds-statistics-card icon="icon dashboard" :loading="loading" :text="$t('statisticsHeader.numberOfDashboards')" :value="dashboardsCount">
						<template #icon>
							<ds-icon name="ds-icon-dashboard" fill="display-content-500" />
						</template>
					</ds-statistics-card>
				</ds-box>
			</ds-col>
			<ds-col class="p-0" cols="12" md="6" xl="3">
				<ds-box padding-x="M" padding-bottom="M">
					<ds-statistics-card icon="icon-views" :loading="loading" :text="$t('statisticsHeader.numberOfViews')" :value="viewsCount">
						<template #icon>
							<ds-icon name="ds-icon-views" alt="views" class="icon" fill="display-content-500" />
						</template>
					</ds-statistics-card>
				</ds-box>
			</ds-col>
			<ds-col class="p-0" cols="12" md="6" xl="3">
				<ds-box padding-x="M" padding-bottom="M">
					<ds-statistics-card icon="icon storyType" :loading="loading" :text="$t('statisticsHeader.numberOfDatasets')" :value="datasetsCount">
						<template #icon>
							<ds-icon name="ds-icon-datasets" class="icon" fill="display-content-500" />
						</template>
					</ds-statistics-card>
				</ds-box>
			</ds-col>
		</ds-row>
	</ds-box>
</template>

<script>
import {defineComponent, onMounted, reactive, toRefs, watch} from 'vue';
import DsStatisticsCard from '@/components/main/DataStoriesStatisticsCard.vue';
import {statisticsService} from '../statisticsService';
import {notify} from '@kyvg/vue3-notification';
import i18n from '@/plugins/i18n/index';
const {t} = i18n.global;

export default defineComponent({
	name: 'StatisticsHeader',
	components: {
		DsStatisticsCard
	},
	props: {
		refresh: {
			type: Boolean,
			default: false
		}
	},
	emits: ['refreshed'],
	setup(props, {emit}) {
		const state = reactive({
			loading: true,
			storiesCount: 0,
			dashboardsCount: 0,
			viewsCount: 0,
			datasetsCount: 0
		});

		const refreshStatistics = async() => {
			try {
				state.loading = true;
				state.storiesCount = await statisticsService.getNumberOfStories('visual-data-story');
				state.dashboardsCount = await statisticsService.getNumberOfStories('data-dashboard');
				state.viewsCount = await statisticsService.getNumberOfViews();
				state.datasetsCount = await statisticsService.getNumberOfDatasets();
			} catch (err) {
				notify({
					type: 'danger',
					text: err?.response?.data?.error?.message ?? t('t_UnexpectedError'),
					duration: 5000
				});
			} finally {
				state.loading = false;
				emit('refreshed');
			}
		};

		watch(() => props.refresh, (refresh) => {
			if (refresh) {
				refreshStatistics();
			}
		});

		onMounted(() => {
			refreshStatistics();
		});

		return {
			...toRefs(state)
		};
	}
});
</script>

<style lang="scss" scoped>
.icon {
	opacity: 1;
	width: 16px;
}
</style>

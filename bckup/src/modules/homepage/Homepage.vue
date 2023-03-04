<template>
	<div class="w-100 overflow-auto" :style="{height: contentHeight + 'px'}">
		<div>
			<data-stories-alert-banner
				v-if="saasLimitsState.getAlertVisibilityStatus('homepageInfoAlert')"
				variant="interaction"
				enable-close
				align="center"
				padding-y="S"
				padding-x="M"
				@close="saasLimitsState.setAlertVisibilityStatus('homepageInfoAlert', false)">
				<ds-box flex-type="row">
					<ds-icon name="icon-info" fill="interaction" />
					<ds-text padding-left="S" color="display-content-700" variant="bodyMedium">Data people summit 2023.</ds-text>
					<ds-text padding-left="S" color="display-content-700" variant="body">Be the first to know about our new features.</ds-text>
					<ds-text padding-left="XS" color="display-content-700" variant="body">
						<a
							class="ds-text-display-content-700 underline" href="https://seznam.cz"
							target="blank">Register here</a>.
					</ds-text>
				</ds-box>
			</data-stories-alert-banner>

			<ds-page-header>
				<template v-if="!oneIntegration" #banner>
					<data-stories-limits-alerts />
				</template>

				<ds-inline align-y="center" align="space-between">
					<ds-inline>
						<ds-text variant="headline1light" padding-right="M">
							{{ $t('t_welcomeBack') }} {{ user.firstName }}
						</ds-text>

						<data-stories-limits-badge-button v-if="!oneIntegration" />
					</ds-inline>

					<ds-inline gap="M">
						<ds-btn variant="secondary" :disabled="saasLimitsState.limitStatusDatasets.value === LimitStatus.ERROR" @click="$router.push({name: 'dataset-create'})">
							{{ $t('t_AddDataSet') }}
						</ds-btn>
						<ds-btn-group class="d-flex" :class="{'disabled': saasLimitsState.limitStatusStories.value === LimitStatus.ERROR}">
							<ds-btn variant="primary" :disabled="saasLimitsState.limitStatusStories.value === LimitStatus.ERROR" @click="$router.push({name: 'create-story'})">
								{{ $t('t_Create') }}
							</ds-btn>
							<ds-dropdown placement="bottom-end" split-lane>
								<template #triggerContent>
									<ds-btn
										:disabled="saasLimitsState.limitStatusStories.value === LimitStatus.ERROR"
										padding-x="S" variant="primary" class="icon-selector" split-lane
										max-height>
										<ds-icon style="color: white !important;" class="chevron-down" name="ds-icon-chevron-down-white" />
									</ds-btn>
								</template>
								<template #dropdownContent>
									<dropdown-menu-basic
										:items="createOptions"
										@update:selected="$router.push({name: 'create-story', params: {preselectedType: $event.value}})" />
								</template>
							</ds-dropdown>
						</ds-btn-group>
					</ds-inline>
				</ds-inline>
			</ds-page-header>
			<statistics-header :refresh="refreshStatistics" @refreshed="refreshStatistics = false" />
			<ds-box padding-bottom="XL" padding-x="XL">
				<ds-row>
					<ds-col cols="12" xl="9" class="p-0">
						<homepage-story-list @refresh-statistics="refreshStatistics = true" />
					</ds-col>
					<ds-col cols="12" xl="3" class="p-0">
						<homepage-dataset-list @refresh-statistics="refreshStatistics = true" />
					</ds-col>
				</ds-row>
			</ds-box>
		</div>
	</div>
</template>

<script lang="ts">
import {computed, defineComponent, ref, inject, onMounted, onUnmounted, watch} from 'vue';
import {storyType} from '@/modules/story/consts/storyType';
import StatisticsHeader from '@/modules/homepage/components/StatisticsHeader.vue';
import HomepageDatasetList from '@/modules/homepage/components/HomepageDatasetList.vue';
import HomepageStoryList from '@/modules/homepage/components/HomepageStoryList.vue';
import {contentHeightHandler} from '@/mixins/contentHeightHandler';
import DropdownMenuBasic from '@/components/main/Dropdown/DropdownMenuBasic.vue';
import {getCreateVisualisationOptions} from '@/modules/story/utils/storyUtils';
import {useStore} from 'vuex';
import {useSaasLimits} from '@/modules/limits/store/limits';
import DataStoriesLimitsAlerts from '@/modules/limits/components/DataStoriesLimitsAlerts.vue';
import DataStoriesLimitsBadgeButton from '@/modules/limits/components/DataStoriesLimitsBadgeButton.vue';
import DataStoriesAlertBanner from '@/components/main/AlertBanner/DataStoriesAlertBanner.vue';
import {LimitStatus} from '@/modules/limits/consts/enums';

export default defineComponent({
	name: 'Homepage',
	components: {
		DataStoriesAlertBanner,
		DropdownMenuBasic,
		HomepageStoryList,
		HomepageDatasetList,
		StatisticsHeader,
		DataStoriesLimitsAlerts,
		DataStoriesLimitsBadgeButton
	},
	setup() {
		const store = useStore();
		const appConfig = inject('appConfig');
		const user = computed(() => store.getters['authLogin/user']);
		const {contentHeight, getContentHeight} = contentHeightHandler();
		const refreshStatistics = ref(false);
		// @ts-expect-error
		const createOptions = computed(() => getCreateVisualisationOptions(appConfig?.explorer));

		const oneIntegration = computed(() => appConfig?.oneIntegration);
		const saasLimitsState = useSaasLimits();

		onMounted(() => {
			saasLimitsState.getActualStatistics();
			window.addEventListener('resize', getContentHeight);
		});

		onUnmounted(() => {
			window.removeEventListener('resize', getContentHeight);
		});

		watch(refreshStatistics, (val) => {
			if (val) {
				saasLimitsState.getActualStatistics();
			}
		});

		return {
			createOptions,
			contentHeight,
			storyType,
			user,
			refreshStatistics,
			saasLimitsState,
			oneIntegration,
			LimitStatus
		};
	}
});
</script>

<template>
	<div class="w-100 overflow-auto" :style="{height: contentHeight + 'px'}" @scroll="onScrollUnfiltered">
		<ds-page-header>
			<template v-if="!oneIntegration" #banner>
				<data-stories-limits-alerts />
			</template>

			<ds-inline align="space-between" align-y="center">
				<ds-inline>
					<ds-text variant="headline1light" padding-right="M">
						{{ $t('t_StoriesAndDashboards') }}
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
									padding-x="S" class="icon-selector" variant="primary" split-lane
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

		<ds-box padding-y="XL" padding-x="XL">
			<ds-row>
				<ds-col
					cols="12"
					sm="12"
					md="9"
					lg="6"
					xl="4"
					xxl="3">
					<ds-search-input v-model:search="storySearch" />
				</ds-col>
			</ds-row>
		</ds-box>

		<ds-box padding-bottom="XL" padding-x="M">
			<homepage-story-list
				large-grid
				show-all
				@refresh-statistics="refreshStatistics" />
		</ds-box>
	</div>
</template>

<script lang="ts">
import {computed, defineComponent, inject, onMounted, onUnmounted, ref} from 'vue';
import {getCreateVisualisationOptions} from '@/modules/story/utils/storyUtils';
import {contentHeightHandler} from '@/mixins/contentHeightHandler';
import DropdownMenuBasic from '@/components/main/Dropdown/DropdownMenuBasic.vue';
import {useStore} from 'vuex';
import {useSaasLimits} from '@/modules/limits/store/limits';
import HomepageStoryList from '@/modules/homepage/components/HomepageStoryList.vue';
import DataStoriesLimitsAlerts from '@/modules/limits/components/DataStoriesLimitsAlerts.vue';
import DataStoriesLimitsBadgeButton from '@/modules/limits/components/DataStoriesLimitsBadgeButton.vue';
import {LimitStatus} from '@/modules/limits/consts/enums';

export default defineComponent({
	name: 'List',
	components: {
		DropdownMenuBasic,
		HomepageStoryList,
		DataStoriesLimitsAlerts,
		DataStoriesLimitsBadgeButton
	},
	// eslint-disable-next-line max-lines-per-function
	setup() {
		const store = useStore();
		const appConfig = inject('appConfig');
		const {contentHeight, getContentHeight} = contentHeightHandler();

		const lastPage = computed(() => store.getters['stories/lastPage']);
		const loading = computed(() => store.getters['stories/loading']);
		const loadingNextPage = computed(() => store.getters['stories/loadingNextPage']);
		const stories = computed(() => store.getters['stories/stories']);
		const error = computed(() => store.getters['stories/error']);
		const loadOnScrollCondition = computed(() => !loadingNextPage.value && !lastPage.value);
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

		const storySearch = ref('');

		const scroll = ref(false);

		const onScroll = () => {
			scroll.value = true;
		};

		const refreshStatistics = () => {
			saasLimitsState.getActualStatistics();
		};

		// @ts-ignore
		const onScrollUnfiltered = ({target: {scrollTop, clientHeight, scrollHeight} = {}}) => {
			if (loadOnScrollCondition.value && scrollTop + clientHeight + 1 >= scrollHeight) {
				onScroll();
			}
		};

		return {
			loading,
			loadingNextPage,
			stories,
			error,
			getContentHeight,
			contentHeight,
			onScroll,
			onScrollUnfiltered,
			scroll,
			createOptions,
			storySearch,
			saasLimitsState,
			oneIntegration,
			refreshStatistics,
			LimitStatus
		};
	}
});
</script>

<style lang="scss" scoped>
.ds-btn-group:not(.disabled):hover {
	cursor: pointer;

	.btn-selector {
		pointer-events: none;
	}

	.icon-selector {
		background-color: map-get($ds-colors, 'primary-600');
	}
}
</style>

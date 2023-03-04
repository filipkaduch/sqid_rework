<template>
	<ds-box class="w-100 window-size">
		<ds-page-header :sticky="false">
			<ds-box flex-type="row" align="space-between" align-y="center">
				<ds-text
					variant="headline1"
					is-editable
					@blur="saveExploreName"
					@keydown.enter.prevent>
					{{ title }}
				</ds-text>
				<ds-box class="d-flex align-items-center dropdown hidden">
					<ds-btn
						variant="secondary"
						class="collapseBtnSize"
						icon-only
						:disabled="false">
						<template #icon>
							<fa-icon :icon="['fas', 'ellipsis-v']" class="m-0" style="color: #B5B5BA;" />
						</template>
					</ds-btn>
					<ds-box class="dropdown-content" />
				</ds-box>
			</ds-box>
		</ds-page-header>

		<div class="content">
			<ds-row>
				<ds-col cols="12">
					<explorer-tabs v-model:value="dataset" />
				</ds-col>
			</ds-row>

			<ds-col cols="12" class="h-100 p-0">
				<ds-box padding-top="M" class="h-100 bg-color">
					<splitpanes class="default-theme calc-height">
						<pane :min-size="paneMinSize" :max-size="paneMaxSize" :size="attributePanelSize" class="attribute-bar">
							<explore-control-bar v-show="attributePanelSize > 5" :size="attributePanelSize" :exploreType="exploreType" @handle-size="handleSize" />
						</pane>
						<pane :size="explorerSize" class="bg-color overflow-visible">
							<ds-box padding-x="L">
								<ds-inline align-y="center" align="space-between">
									<ds-inline-item align-y="center">
										<ds-inline>
											<ds-box v-if="attributePanelSize < 5" padding-right="M">
												<ds-btn
													variant="secondary"
													icon-only
													class="d-flex align-items-center justify-content-center"
													@click="handleSize(20)">
													<template #icon>
														<ds-icon name="ds-icon-chevron-right-pull" alt="showControlBar" fill="display-content-600" />
													</template>
												</ds-btn>
											</ds-box>
											<ds-toggle-bar :items="exploreOptions" :value="exploreType" @selected="setExploreOption" />
										</ds-inline>
									</ds-inline-item>
									<ds-btn variant="primary" class="float-right" :disabled="isVisualization" @click="openAddToStory">
										{{ $t('modals.addToStory') }}
									</ds-btn>
								</ds-inline>
							</ds-box>
							<explore-page :explore-type="exploreType" :explore-id="exploreId" />
						</pane>
					</splitpanes>
				</ds-box>
			</ds-col>
		</div>
		<add-to-story-modal :stories-options="storiesOptions" :show-modal="showAddToStory" :prefilled-title="prefilledTitle" @close-modal="showAddToStory = false" />
	</ds-box>
</template>

<script lang="ts">
import 'splitpanes/dist/splitpanes.css';
import {computed, defineComponent, ref, onMounted, watch, onUnmounted, toRefs, reactive, nextTick} from 'vue';
import {Splitpanes, Pane} from 'splitpanes';
import ExploreControlBar from '@/modules/explorer/components/detail/attributeBar/ExploreControlBar.vue';
import usePaneSize from '@/modules/explorer/composables/usePaneSize';
import {ExplorationSection, useDataExploreStore} from '@/modules/explorer/store/dataExplore';
import useDataExplore from '@/modules/explorer/composables/useDataExplore';
import ExplorePage from '@/modules/explorer/components/detail/explore/ExplorePage.vue';
import {explorationData, explorationReport} from '@/modules/explorer/consts/consts';
import useExplorerChart from '@/modules/explorer/composables/useExplorerChart';
import {WIDGET_INSTANCE_ACTIONS, WIDGET_INSTANCE_STORE_NAME} from '@/modules/widget/store/widgetInstances/types';
import ExplorerTabs from '@/modules/explorer/components/detail/tabs/ExplorerTabs.vue';
import {STORY_DETAIL_ACTIONS, STORY_DETAIL_NAME} from '@/modules/story/store/types';
import AddToStoryModal from '@/modules/explorer/components/AddToStoryModal.vue';
import {useStore} from 'vuex';

export default defineComponent({
	components: {
		AddToStoryModal,
		ExplorerTabs,
		ExplorePage,
		ExploreControlBar,
		Splitpanes,
		Pane
	},
	props: {
		exploreId: {
			type: String,
			required: true
		}
	},
	setup(props) {
		const store = useStore();
		const dataExploreStore = useDataExploreStore();
		const state = reactive({
			showAddToStory: false
		});

		const loadExplorationData = () => {
			const explores = [] as ExplorationSection[];
			explore.value.sections.forEach((section: any, index: number) => {
				explores.push({
					dataExplorationId: section.id,
					datasetId: section.widgets[0].widgetDataConfigurations[0]?.datasetId,
					catalogItemId: section.widgets[0].widgetDataConfigurations[0]?.catalogItemId,
					name: section.name ? section.name : `data explore${index}`,
					attributes: {
						filteredByType: null,
						list: []
					}
				});
			});
			dataExploreStore.createExplorationList(explore.value.name, explore.value.id, explores);
		};

		const dataset = ref(null) as any;
		watch(() => dataExploreStore.selectedDatasetExplorationId, (val) => {
			if (val) {
				const section = explore.value.sections.find((sec: any) => sec.id === val);
				if (section) {
					store.dispatch(`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_ACTIONS.SELECT_WIDGET_INSTANCE}`, section.widgets[section?.widgets.length - 1].id);
				}
			}
		});
		onUnmounted(() => {
			nextTick(() => {
				store.dispatch(`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_ACTIONS.SELECT_WIDGET_INSTANCE}`, null);
				dataExploreStore.$reset();
			});
		});
		const title = ref('');
		const {loadStorySections, loadAllStories, setWrapInstances, loadFirstSectionSteps, explore, widgetDimensions, widgetMetrics, isVisualization, selectedSection}
			= useExplorerChart();
		const prefilledTitle = computed(() => selectedSection.value?.name ?? '');

		onMounted(async() => {
			await loadStorySections(props.exploreId);
			await setWrapInstances();
			await loadFirstSectionSteps();
			loadExplorationData();
			paneMinSize.value = getSizeToPercent(window.innerWidth, 320);
			paneMaxSize.value = getSizeToPercent(window.innerWidth, 600);
			title.value = dataExploreStore?.selectedExploration?.name ?? 'Explore name';
			exploreType.value = widgetDimensions.value.length > 0 || widgetMetrics.value.length > 0 ? explorationReport : explorationData;
			await loadAllStories(false);
		});

		const storiesOptions = computed(() => store.getters['stories/stories'].map((story: any) => ({
			selectLabel: story?.name,
			value: story?.id
		})));

		const openAddToStory = () => {
			state.showAddToStory = true;
		};

		// Panel sizes
		const attributePanelSize = ref(20);
		const handleSize = (size: number) => {
			attributePanelSize.value = size;
		};

		const explorerSize = computed(() => 100 - attributePanelSize.value);
		const {getSizeToPercent, paneMaxSize, paneMinSize} = usePaneSize();

		// explore options
		const {exploreOptions} = useDataExplore();
		const exploreType = ref(explorationData);
		const setExploreOption = (val: any) => {
			exploreType.value = val;
		};

		const saveExploreName = (evt: any) => {
			const newName = (evt.target.innerText || '').trim();
			if (!newName) {
				return;
			}
			if (title.value !== newName) {
				store.dispatch(`${STORY_DETAIL_NAME}/${STORY_DETAIL_ACTIONS.UPDATE_STORY}`, {name: newName});
			}
		};

		return {
			...toRefs(state),
			saveExploreName,
			explorationData,
			exploreType,
			setExploreOption,
			exploreOptions,
			dataExploreStore,
			title,
			paneMaxSize,
			paneMinSize,
			explorerSize,
			widgetDimensions,
			widgetMetrics,
			handleSize,
			attributePanelSize,
			dataset,
			prefilledTitle,
			storiesOptions,
			isVisualization,
			openAddToStory
		};
	}
});
</script>
<style lang="scss" scoped>
.window-size {
	height: 100vh;
	width: 100vw;
	padding-bottom: 16px;
}

.splitpanes.default-theme .attribute-bar {
	background-color: map-get($ds-colors, 'white');
}

.content {
	height: calc(100vh - 82px);
	width: calc(100vw - 57px);
}

.splitpanes.default-theme .bg-color {
	background-color: map-get($ds-colors, 'separate-content-0');
}

.bg-color {
	background-color: map-get($ds-colors, 'separate-content-0');
}

.calc-height {
	max-height: calc(100% - 33px);
}
</style>

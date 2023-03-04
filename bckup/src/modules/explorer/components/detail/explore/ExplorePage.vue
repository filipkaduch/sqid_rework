<template>
	<ds-box class="h-100 w-100">
		<splitpanes
			v-show="!isDataExploration"
			id="first-page"
			horizontal
			@resized="thumbnailDebounceFn(explore, firstWidgetInstance, true)">
			<pane :size="50" class="bg-color overflow-visible">
				<ds-box class="bg-color h-100 w-100" padding-x="L" padding-top="M">
					<chart-page :suggestion-input="suggestionInput" />
				</ds-box>
			</pane>
			<pane class="bg-color overflow-hidden">
				<ds-box class="h-100" padding-top="M" padding-x="L">
					<app-loading :loading="!datasetId && !catalogItemId" class="h-100">
						<drop-zone @suggestion-input="suggestionInput = $event" />
					</app-loading>
				</ds-box>
			</pane>
		</splitpanes>

		<ds-box v-if="isDataExploration" flex-type="column" padding-x="L" padding-y="M">
			<app-loading :loading="!datasetId && !catalogItemId" class="h-100">
				<dataset-data data-testid="dataAssetList" :catalog-item-id="catalogItemId" :dataset-id="datasetId" />
			</app-loading>
		</ds-box>
	</ds-box>
</template>

<script lang="ts">
import {Pane, Splitpanes} from 'splitpanes';
import {computed, defineComponent, onBeforeMount, ref, watch} from 'vue';
import DropZone from '@/modules/explorer/components/detail/explore/dropZone/DropZone.vue';
import DatasetData from '@/modules/explorer/components/detail/explore/DataCopyExplorer.vue';
import {useDataExploreStore} from '@/modules/explorer/store/dataExplore';
import {explorationData} from '@/modules/explorer/consts/consts';
import useExplorerChart from '@/modules/explorer/composables/useExplorerChart';
import AppLoading from '@/components/design/AppLoading.vue';
import ChartPage from '@/modules/explorer/components/detail/explore/chartSection/ChartPage.vue';
import {cloneDeep, debounce, isEqual} from 'lodash';
import {updatePreviewImage} from '@/modules/story/components/editor/utils/thumbnailUtil';
import store from '@/plugins/store';
import {
	WIDGET_INSTANCE_GETTERS,
	WIDGET_INSTANCE_STORE_NAME
} from '@/modules/widget/store/widgetInstances/types';

export default defineComponent({
	components: {
		ChartPage,
		AppLoading,
		Splitpanes,
		Pane,
		DropZone,
		DatasetData
	},
	props: {
		exploreType: {
			type: String,
			required: true
		},
		exploreId: {
			type: String,
			required: true
		}
	},
	setup(props) {
		const {explore, widget, widgetDimensions, widgetMetrics, selectedWidgetInstanceId, loadData} = useExplorerChart();
		const dataExploreStore = useDataExploreStore();

		const datasetId = computed(() => dataExploreStore.selectedDataExploration?.datasetId);
		const catalogItemId = computed(() => dataExploreStore.selectedDataExploration?.catalogItemId);
		const widgetId = computed(() => widget.value?.id ?? '');
		const suggestionInput = ref({
			dimensions: [],
			metrics: []
		});
		const isDataExploration = computed(() => props.exploreType === explorationData);
		const isRenderable = computed(() => widgetMetrics.value.length > 0 && widgetDimensions.value.length > 0);

		watch(selectedWidgetInstanceId, (id: string) => {
			loadData(id);
		});

		// THUMBNAILS
		const thumbnailDebounceFn: any = ref(null);
		onBeforeMount(() => {
			// eslint-disable-next-line
			thumbnailDebounceFn.value = debounce(function (story, widget, isExplorer) {
				updatePreviewImage(story, widget, isExplorer);
			}, 2000);
		});
		const firstWidgetId = computed(() => explore.value?.sections[0].widgets?.[0].id);
		const firstWidgetInstance = computed(() => cloneDeep(store.getters[`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_GETTERS.INSTANCE}`](firstWidgetId.value)));
		let firstLoad = true;
		watch([firstWidgetInstance, isDataExploration], (newVal, oldVal) => {
			const isReport = !newVal[1];
			const [widgetNew] = newVal;
			const [widgetOld] = oldVal;

			if (isReport) {
				let updateThumbnail = false;
				if (firstLoad) {
					firstLoad = false;
					updateThumbnail = true;
				}
				if (!updateThumbnail && !isEqual(widgetNew, widgetOld)) {
					updateThumbnail = true;
				}

				if (updateThumbnail) {
					thumbnailDebounceFn.value(explore.value, widgetNew, true);
				}
			}
		}, {deep: true});

		return {
			isRenderable,
			widgetId,
			selectedWidgetInstanceId,
			explorationData,
			datasetId,
			catalogItemId,
			explore,
			isDataExploration,
			suggestionInput,
			firstWidgetInstance,
			thumbnailDebounceFn
		};
	}
});
</script>

<style lang="scss" scoped>
.splitpanes.default-theme .bg-color {
	background-color: map-get($ds-colors, 'separate-content-0');
}

#first-page {
	max-height: calc(100% - 54px);
}

.max-height-100 {
	max-height: calc(100% - 0px)
}
</style>

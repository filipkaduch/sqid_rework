<template>
	<ds-box border-radius="basic" :padding-top="!showChartTypeWindow ? 'XL' : 'NONE'" padding-x="M" class="ds-bg-white h-100 w-100">
		<div class="h-100 w-100 position-relative">
			<ds-btn
				v-show="!showChartTypeWindow && checkSuggestions && widgetDimensions.length > 0"
				variant="secondary"
				icon-only
				class="position-absolute position w-auto"
				@click="showChartTypeWindow = true">
				<template #icon>
					<chart-suggestion :chart-icon="`${icons[selectedWidgetType]}`" :suggestion-input="suggestionInput" @new-suggestions="showSuggestions" />
				</template>
			</ds-btn>
			<ds-close-button v-if="showChartTypeWindow" class="position-cross position-absolute" @close="showChartTypeWindow = false" />
			<ds-box
				v-if="showChartTypeWindow"
				padding-bottom="L" padding-x="XL" flex-type="row"
				align-y="center"
				align="space-between">
				<chart-types :suggestions="suggestionsOutput" @selected="endChartSwitch" />
			</ds-box>
			<app-loading v-if="!showChartTypeWindow" :loading="!explore || isChangingWidget" class="h-100">
				<ds-box
					v-if="!checkSuggestions"
					flex-type="column"
					align="center"
					align-y="center"
					class="h-100 w-100">
					<ds-text variant="ds-headline4" class="pb-2">{{ $t('t_noVisualisation') }}</ds-text>
					<ds-text variant="paragraph" color="display-content-500" class="pb-4">
						{{ $t('t_explorationAdvice') }}
					</ds-text>
					<ds-icon name="ds-no-explorations')" alt="No visualisations" />
				</ds-box>
				<widget-wrapper
					v-else
					:page-widget-instance-id="selectedDatasetExplorationId"
					variant="published-widget"
					:widget-instance-id="selectedWidgetInstanceId" />
			</app-loading>
		</div>
	</ds-box>
</template>

<script lang="ts">
import ChartTypes from '@/modules/explorer/components/detail/explore/chartSection/ChartTypes.vue';
import {defineComponent, computed, ref, reactive, toRefs, watch} from 'vue';
import {useDataExploreStore} from '@/modules/explorer/store/dataExplore';
import useExplorerChart from '@/modules/explorer/composables/useExplorerChart';
import WidgetWrapper from '@/modules/story/components/editor/WidgetWrapper.vue';
import AppLoading from '@/components/design/AppLoading.vue';
import DsCloseButton from '@/components/main/button/DsCloseButton.vue';
import ChartSuggestion from '@/modules/explorer/components/detail/explore/ChartSuggestion.vue';
import cloneDeep from 'lodash/cloneDeep';
import useChartTypes from '@/modules/explorer/composables/useChartTypes';
import {useStore} from 'vuex';

export default defineComponent({
	components: {ChartTypes, ChartSuggestion, WidgetWrapper, AppLoading, DsCloseButton},
	props: {
		// TODO: remove and use dim and metric from store
		suggestionInput: {
			type: Object,
			required: true
		}
	},
	setup() {
		const store = useStore();
		const showChartTypeWindow = ref(false);
		const dataExploreStore = useDataExploreStore();

		const selectedDatasetExplorationId = computed(() => dataExploreStore.selectedDatasetExplorationId);
		const isChangingWidget = computed(() => dataExploreStore.isChangingWidget);
		const {selectedWidgetInstanceId, explore, widgetDimensions, widgetMetrics} = useExplorerChart();
		const {icons} = useChartTypes();
		const selectedWidgetType = computed(() => store.getters['widgetInstances/widgetType'](selectedWidgetInstanceId.value));
		const isLoading = computed(() => store.getters['widgetInstances/loading'](selectedWidgetInstanceId.value));
		const state = reactive({
			suggestionsOutput: []
		});

		const showSuggestions = (event: any) => {
			state.suggestionsOutput = cloneDeep(event.value);
		};

		watch(selectedDatasetExplorationId, () => {
			showChartTypeWindow.value = false;
		});

		const endChartSwitch = () => {
			dataExploreStore.isChangingWidget = false;
			showChartTypeWindow.value = false;
		};

		const checkSuggestions = computed(() => widgetDimensions.value.length > 0 || widgetMetrics.value.length > 0);

		return {
			...toRefs(state),
			selectedDatasetExplorationId,
			showChartTypeWindow,
			selectedWidgetInstanceId,
			selectedWidgetType,
			explore,
			icons,
			showSuggestions,
			checkSuggestions,
			isLoading,
			endChartSwitch,
			widgetDimensions,
			isChangingWidget
		};
	}
});
</script>

<style scoped>
.position {
	top: -11px;
	right: 16px;
	z-index: 13;
}

.position-cross {
	top: 20px;
	right: 16px;
	z-index: 13;
}
</style>

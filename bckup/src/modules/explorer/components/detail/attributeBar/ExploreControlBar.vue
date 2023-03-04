<template>
	<ds-box
		border-radius="basic"
		class="attribute-bar attribute-bar-size ds-bg-white h-100">
		<ds-inline align="space-around" align-y="center" class="w-100">
			<ds-tab-buttons v-model:active-tab="activeTab" icons :tabs="settingTabs" variant="tab">
				<template #countBadge="{tab}">
					<ds-box v-if="tab.key === filterTab && widgetConfiguration?.staticFilter?.preAggregation?.length" padding-left="S">
						<ds-box
							align="center"
							align-y="center"
							border-radius="big"
							class="ds-bg-secondary-500 circle-size">
							<ds-text variant="caption" color="white" no-wrap>
								{{ widgetConfiguration?.staticFilter?.preAggregation.length }}
							</ds-text>
						</ds-box>
					</ds-box>
				</template>
				<template #rightSlot>
					<ds-box
						class="h-100 close-btn" align-y="center"
						padding-x="S">
						<ds-close-button small fill="display-content-400" @close="handleSize" />
					</ds-box>
				</template>
			</ds-tab-buttons>
		</ds-inline>
		<div v-if="!collapsed" class="attribute-bar-size attribute-bar-right-border position-relative h-100">
			<ds-box
				:border-bottom="activeTab.key === attributeTab ? 'disabled' : 'none'"
				:padding-top="activeTab.key === attributeTab ? 'S' : activeTab.key === filterTab ? 'M' : ''"
				padding-x="L">
				<ds-box v-if="activeTab.key === attributeTab" flex-type="column" class="h-100">
					<ds-box padding-y="S">
						<ds-search-input v-model:search="attributeSearch" />
					</ds-box>
					<ds-box padding-bottom="M" padding-top="XS">
						<attribute-filter-buttons />
					</ds-box>
				</ds-box>
			</ds-box>
			<template v-if="activeTab.key === attributeTab">
				<attribute-list :attributeSearch="attributeSearch" class="overflow-scroll" />
				<create-custom-metrics />
			</template>
			<ds-box v-if="activeTab.key === filterTab" class="overflow-scroll-filter">
				<exploration-filter />
			</ds-box>
			<explorer-chart-properties v-if="activeTab.key === chartPropertiesTab" class="overflow-scroll-chart-setting" />
		</div>
	</ds-box>
</template>

<script lang="ts">
import {computed, defineComponent, ref, watch} from 'vue';
import AttributeFilterButtons from '@/modules/explorer/components/detail/attributeBar/component/AttributeFilterButtons.vue';
import AttributeList from '@/modules/explorer/components/detail/attributeBar/component/AttributeList.vue';
import DsCloseButton from '@/components/main/button/DsCloseButton.vue';
import usePaneSize from '@/modules/explorer/composables/usePaneSize';
import {
	attributeTab,
	chartPropertiesTab,
	explorationData,
	filterTab,
	settingBarTabs
} from '@/modules/explorer/consts/consts';
import DsTabButtons from '@/components/main/button/DsTabButtons.vue';
import ExplorationFilter from '@/modules/explorer/components/detail/attributeBar/component/ExplorationFilter.vue';
import ExplorerChartProperties from '@/modules/explorer/components/detail/attributeBar/component/ExplorerChartProperties.vue';
import CreateCustomMetrics from '@/modules/explorer/components/detail/attributeBar/component/CreateCustomMetrics.vue';
import useExplorerChart from '@/modules/explorer/composables/useExplorerChart';


export default defineComponent({
	components: {
		CreateCustomMetrics,
		ExplorerChartProperties,
		ExplorationFilter,
		DsTabButtons,
		DsCloseButton,
		AttributeList,
		AttributeFilterButtons
	},
	props: {
		size: {
			type: Number,
			default: 20
		},
		exploreType: {
			type: String,
			required: true
		}
	},
	emits: ['handleSize'],
	setup(props, {emit}) {
		const collapsed = computed(() => props.size < 6);
		const attributeSearch = ref('');
		const {widgetConfiguration} = useExplorerChart();

		// Handle attribute panel size and close
		const {paneMinSize} = usePaneSize();
		const {widgetMetrics, widgetDimensions, selectedWidgetInstanceId} = useExplorerChart();
		paneMinSize.value = 0;

		const handleSize = () => {
			if (props.size >= 20) {
				emit('handleSize', paneMinSize.value);
			} else {
				emit('handleSize', 20);
			}
		};
		const settingTabs = computed(() => props.exploreType === explorationData
			|| (widgetDimensions.value.length === 0 && widgetMetrics.value.length === 0)
			? settingBarTabs.filter((el) => el.key !== chartPropertiesTab)
			: settingBarTabs);

		watch(() => props.exploreType, (val) => {
			if (val === explorationData) {
				[activeTab.value] = settingBarTabs;
			}
		});

		const activeTab = ref(settingBarTabs[0]);
		watch(selectedWidgetInstanceId, (val) => {
			if (widgetDimensions.value.length === 0 && widgetMetrics.value.length === 0) {
				[activeTab.value] = settingBarTabs;
			}
		}, {deep: true});
		return {
			chartPropertiesTab,
			settingTabs,
			activeTab,
			collapsed,
			handleSize,
			attributeSearch,
			attributeTab,
			filterTab,
			widgetConfiguration
		};
	}
});
</script>
<style lang="scss" scoped>
.attribute-bar {
	border-top-left-radius: 0!important;
	border-bottom-left-radius: 0!important;
	overflow-x: visible;
	overflow-y: hidden;
}
.attribute-bar-size {
	max-width: 600px;
	min-width: 230px;
}
.overflow-scroll {
	overflow-y: auto;
	height: calc(100% - 226px);
}

.overflow-scroll-filter {
	overflow-x: hidden;
	overflow-y: auto;
	height: calc(100vh - 182px);
}
.overflow-scroll-chart-setting {
	overflow-x: hidden;
	overflow-y: auto;
	height: calc(100vh - 166px);
}

.overflow-scroll-chart-setting::-webkit-scrollbar {
	width: 16px;
}

.overflow-scroll-chart-setting::-webkit-scrollbar-thumb {
	background-color: #c8d4da;
	border: 5px solid #fff;
	border-radius: 10rem;
}

.close-btn {
	width: 36px;
	background-color: map-get($ds-colors, 'separate-content-0');
	border-right: 1px solid map-get($ds-colors, 'separate-content-200');
	border-top: 1px solid map-get($ds-colors, 'separate-content-200');
	border-top-right-radius: 4px;
	border-bottom: 1px solid map-get($ds-colors, 'separate-content-200');
}

.attribute-bar-right-border {
	border-right: 1px solid map-get($ds-colors, 'separate-content-200');
}

.circle-size {
	width: 16px;
	height: 16px;
}
</style>

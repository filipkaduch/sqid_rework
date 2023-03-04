<template>
	<ds-box padding-y="L" padding-x="XL" class="w-100">
		<ds-box padding-bottom="L">
			<ds-tab-buttons
				v-model:activeTab="activeTab"
				:tabs="availableTabs"
				variant="button" />
		</ds-box>
		<chart-type-switch
			:category="activeTab.name" :suggestions="chartItems" :explorer="true" :widget-instance-id="selectedWidgetInstanceId"
			@changed="$emit('selected')" />
	</ds-box>
</template>

<script>
import {defineComponent, toRefs, reactive, computed} from 'vue';
import useExplorerChart from '@/modules/explorer/composables/useExplorerChart';
import ChartTypeSwitch from '@/modules/explorer/components/detail/explore/chartSection/ChartTypeSwitch.vue';
import DsTabButtons from '@/components/main/button/DsTabButtons.vue';
import {chartSelection, chartSelectionTooltips} from '@/modules/explorer/consts/suggestionConst';
import useCharTypes from '@/modules/explorer/composables/useChartTypes';
import i18n from '@/plugins/i18n/index';
const {t} = i18n.global;

export default defineComponent({
	components: {
		DsTabButtons,
		ChartTypeSwitch
	},
	props: {
		suggestions: {
			type: Array,
			default: () => []
		}
	},
	emits: ['selected'],
	setup(props) {
		const {selectedWidgetInstanceId} = useExplorerChart();
		const {icons} = useCharTypes();
		const state = reactive({
			activeTab: {name: t('t_RecommendedWidgets')}
		});

		const chartItems = computed(() => {
			const categoryWidgetsItems = {};
			if (state.activeTab.name === t('t_RecommendedWidgets')) {
				props.suggestions.forEach((widget) => {
					categoryWidgetsItems[widget.type] = {
						type: widget.type,
						text: widget.name,
						icon: `${icons.value[widget.type]}`
					};
				});
			} else {
				chartSelection[state.activeTab.name].forEach((widget) => {
					categoryWidgetsItems[widget.type] = {
						type: widget.type,
						text: widget.name,
						icon: `${icons.value[widget.type]}`
					};
				});
			}
			return categoryWidgetsItems;
		});

		const availableTabs = computed(() => {
			const available = [{name: t('t_RecommendedWidgets')}];
			Object.keys(chartSelection).forEach((chartSel) => {
				if (available.findIndex((el) => el.name === chartSel) === -1) {
					available.push({name: chartSel, tooltip: chartSelectionTooltips[chartSel]});
				}
			});
			return available;
		});

		return {
			...toRefs(state),
			selectedWidgetInstanceId,
			chartItems,
			availableTabs
		};
	}
});
</script>

<style scoped>

</style>

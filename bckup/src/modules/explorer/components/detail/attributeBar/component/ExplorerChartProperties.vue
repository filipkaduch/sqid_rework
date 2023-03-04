<template>
	<ds-box class="ds-bg-white overflow-y">
		<explorer-property-group
			v-if="getKeys(generalOptions).length > 0"
			:title="$t('explore.properties.general')"
			:options="getKeys(generalOptions)" />
		<explorer-property-group
			v-if="getKeys(visualOptions).length > 0"
			:title="$t('explore.properties.visual')"
			:options="getKeys(visualOptions)" />
		<explorer-property-group
			v-if="getKeys(legendOptions).length > 0"
			:title="$t('explore.properties.legend')"
			:main-option="mainLegendOption"
			:options="getKeys(legendOptions)" />
		<explorer-property-group
			v-if="getKeys(stackedOptions).length > 0"
			:title="widgetTypes.LINE_CHARTS.includes(widgetType)
				? $t('explore.properties.filled')
				: $t('explore.properties.stacked')"
			:main-option="mainStackedOption"
			:options="getKeys(stackedOptions)" />
		<explorer-property-group
			v-if="getKeys(axisOptions).length > 0"
			:title="$t('explore.properties.axis')"
			:options="getKeys(axisOptions)" />
		<explorer-property-group
			v-if="getKeys(labelOptions).length > 0"
			:title="$t('explore.properties.label')"
			:main-option="mainLabelOption"
			:options="getKeys(labelOptions)" />
		<!--other for check if is all categorized-->
		<explorer-property-group
			v-if="getKeys(otherOptions).length > 0"
			:title="$t('explore.properties.other')"
			:options="getKeys(otherOptions)" />
	</ds-box>
</template>

<script lang="ts">
// @ts-ignore
import {defineComponent, computed} from 'vue';
import useExplorerChart from '@/modules/explorer/composables/useExplorerChart';
import {
	CATEGORY_AXIS,
	CATEGORY_GENERAL,
	CATEGORY_LABEL,
	CATEGORY_LEGEND,
	CATEGORY_VISUAL,
	CATEGORY_STACKED
} from '@/modules/widget/components/widget-controls/consts/categories';
import {widgetTypes} from '@/util/consts/widgetTypes';
import flow from 'lodash/flow';
import isEmpty from 'lodash/isEmpty';
import ExplorerPropertyGroup
	from '@/modules/explorer/components/detail/attributeBar/component/ExplorerPropertyGroup.vue';
import {widgetOptionName} from '@/util/consts/widgetOptionsNames';
import {useStore} from 'vuex';

export default defineComponent({
	components: {ExplorerPropertyGroup},
	setup() {
		const store = useStore();
		const {selectedWidgetInstanceId, widget} = useExplorerChart();

		const widgetTypeMetadata = computed(() => store.getters['widgetMetadata/widgetTypeMetadata'](widgetType.value));
		const widgetControls = computed(() => widgetTypeMetadata.value?.options ?? []);
		const widgetType = computed(() => store.getters['widgetInstances/widgetType'](selectedWidgetInstanceId.value));

		// set categories for options
		// TODO: type of options
		const generalOptions = computed(() => getByCategory(CATEGORY_GENERAL));
		const visualOptions = computed(() => getByCategory(CATEGORY_VISUAL));
		const labelOptions = computed(() => getByCategory(CATEGORY_LABEL));
		const mainLabelOption = computed(() => isEmpty(getMainOption(labelOptions.value)) ? null : getMainOption(labelOptions.value));
		const mainStackedOption = computed(() => isEmpty(getMainOption(stackedOptions.value)) ? null : getMainOption(stackedOptions.value));
		const legendOptions = computed(() => getByCategory(CATEGORY_LEGEND));
		const mainLegendOption = computed(() => isEmpty(getMainOption(legendOptions.value)) ? null : getMainOption(legendOptions.value));
		const axisOptions = computed(() => getByCategory(CATEGORY_AXIS));
		const stackedOptions = computed(() => getByCategory(CATEGORY_STACKED));
		// Other
		const filterByNoCategory = (arr: any) => arr.filter(([key, value]: any) => !value?.category);
		const otherOptions = computed(() => getByNoCategory());
		// selected legend is legacy, empty option
		const getKeys = (obj: Object) => (Object.keys(obj).filter((el) => el !== widgetOptionName.SELECTED_LEGEND && el !== widgetOptionName.DRAG_WITHOUT_OVERLAY)
			// @ts-ignore
			.sort((first: any, second: any) => obj[first].order - obj[second].order));
		const filterByCategory = (arr: any, category: string) => arr.filter(([key, value]: any) => value?.category === category);
		const findMain = (arr: any) => arr.filter(([key, value]: any) => value.props?.main);
		const getByCategory = (category: string) => flow([
			Object.entries,
			(arr) => filterByCategory(arr, category),
			Object.fromEntries
		])(widgetControls.value);
		const getByNoCategory = () => flow([
			Object.entries,
			filterByNoCategory,
			Object.fromEntries
		])(widgetControls.value);
		const getMainOption = (options: Object) => flow([
			Object.entries,
			findMain,
			Object.fromEntries
		])(options);
		return {
			visualOptions,
			labelOptions,
			legendOptions,
			generalOptions,
			stackedOptions,
			getKeys,
			mainLabelOption,
			mainLegendOption,
			mainStackedOption,
			widget,
			otherOptions,
			axisOptions,
			widgetTypes,
			widgetType
		};
	}
});
</script>

<style lang="scss" scoped>
.overflow-y {
	overflow-y: auto;
	overflow-x: hidden;
}
</style>

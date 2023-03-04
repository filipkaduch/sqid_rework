<template>
	<ds-box
		v-if="showSection" padding-x="L" border-radius="big"
		padding-y="M"
		class="group-property">
		<ds-box flex-type="row" align="space-between" class="w-100">
			<ds-box
				v-if="!mainOption" flex-type="row"
				:padding-bottom="collapsedSection ? '' : 'M'"
				align="space-between"
				align-y="center"
				class="w-100 cursor-pointer"
				@click="collapse(!collapsedSection)">
				<ds-text variant="subheadlineMedium">{{ title }}</ds-text>
				<ds-box v-if="collapsedSection" class="cursor-pointer">
					<ds-icon
						v-if="collapsedSection" name="ds-icon-chevron-left" fill="icon-default" alt="Left" />
				</ds-box>
				<ds-box v-else class="cursor-pointer">
					<ds-icon
						name="ds-icon-chevron-down-white" fill="icon-default" alt="Down " />
				</ds-box>
			</ds-box>
			<ds-box v-else flex-type="row" align-y="center">
				<ds-text variant="subheadlineMedium">{{ title }}</ds-text>
			</ds-box>
			<app-widget-control-wrapper
				v-if="mainOption"
				groupHeadOption
				:options-name="mainOptionName"
				:widget-instance-id="selectedWidgetInstanceId" />
		</ds-box>
		<ds-box v-show="(mainOptionValue || !mainOption) && (!collapsedSection || mainOptionValue)" :padding-top="mainOptionValue && options.length > 1 ? 'M' : ''">
			<ds-box v-for="optionName in options" :key="optionName">
				<app-widget-control-wrapper
					v-if="optionName !== mainOptionName"
					:options-name="optionName"
					:widget-instance-id="selectedWidgetInstanceId" />
				<ds-box
					v-if="title === $t('explore.properties.general') && optionName === 'displayName' && showTitle">
					<ds-box :padding-bottom="options.length > 1 ? 'M' : ''" :padding-top="options.length <= 2 ? 'M' : ''">
						<ds-input
							v-model:value="stepName" debounce :lg="false" :title="$t('t_Title')"
							width="100%" @update="setWidgetName" />
					</ds-box>
				</ds-box>
			</ds-box>
		</ds-box>
	</ds-box>
</template>

<script>
import {computed, defineComponent, watch, ref, onMounted} from 'vue';
import AppWidgetControlWrapper from '@/modules/story/components/editor/AppWidgetControlWrapper.vue';
import useExplorerChart from '@/modules/explorer/composables/useExplorerChart';
import isEmpty from 'lodash/isEmpty';
import {optionsHandler} from '@/modules/story/components/editor/utils/optionsHandler';
import {widgetOptionName} from '@/util/consts/widgetOptionsNames';
import {useStore} from 'vuex';
import {WIDGET_INSTANCE_GETTERS, WIDGET_INSTANCE_STORE_NAME} from '@/modules/widget/store/widgetInstances/types';

export default defineComponent({
	components: {AppWidgetControlWrapper},
	props: {
		title: {
			type: String,
			default: ''
		},
		options: {
			type: Array,
			required: true
		},
		mainOption: {
			type: Object,
			default: null
		}
	},
	setup(props) {
		const store = useStore();
		const mainOptionName = computed(() => props.mainOption ? Object.keys(props.mainOption)[0] : null);
		const mainOptionValue = computed(() => isEmpty(props.mainOption)
			? null
			: store.getters['widgetInstances/option'](selectedWidgetInstanceId.value, mainOptionName.value) ?? props.mainOption[mainOptionName.value].default);

		const widgetType = computed(() => store.getters['widgetInstances/widgetType'](selectedWidgetInstanceId.value));
		const widgetTypeMetadata = computed(() => store.getters['widgetMetadata/widgetTypeMetadata'](widgetType.value));
		const showTitle = computed(() => store.getters['widgetInstances/option'](selectedWidgetInstanceId.value, widgetOptionName.DISPLAY_NAME));
		const showSection = ref(true);
		const collapsedSection = ref(true);
		const collapse = (action) => {
			collapsedSection.value = action;
		};

		onMounted(() => {
			showSection.value = optionsHandler(mainOptionName.value, selectedWidgetInstanceId.value, widgetTypeMetadata.value.options[mainOptionName.value]?.props).show;
		});
		const {selectedWidgetInstanceId} = useExplorerChart();
		// Some options are changing depending on number of Metric and Dimension
		const widgetRawData = computed(() => store.getters['widgetData/rawData'](selectedWidgetInstanceId.value));
		const widgetRawDataLen = computed(() => widgetRawData.value?.length);
		watch(widgetRawDataLen, () => {
			showSection.value = optionsHandler(mainOptionName.value, selectedWidgetInstanceId.value, widgetTypeMetadata.value.options[mainOptionName.value]?.props).show;
		});

		const selectedWidget
			= computed(() => selectedWidgetInstanceId.value ? store.getters[`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_GETTERS.INSTANCE}`](selectedWidgetInstanceId.value) : null);
		const stepName = ref('');
		watch(selectedWidgetInstanceId, (val) => {
			if (val) {
				stepName.value = selectedWidget.value.name;
			}
		}, {immediate: true});
		const setWidgetName = (value) => {
			if (selectedWidget.value?.configuration?.options?.isDefaultName) {
				store.dispatch('widgetInstances/setOption', {
					widgetInstanceId: selectedWidgetInstanceId.value,
					optionName: 'isDefaultName',
					value: false
				});
			}
			if (value !== selectedWidget.value?.name) {
				store.dispatch('widgetInstances/setName', {
					widgetInstanceId: selectedWidgetInstanceId.value,
					name: value
				});
			}
		};
		return {selectedWidgetInstanceId, mainOptionName, mainOptionValue, stepName, setWidgetName, showSection, showTitle, collapsedSection, collapse};
	}
});
</script>

<style lang="scss" scoped>
.group-property {
	border-bottom: 1px solid map-get($ds-colors, 'separate-content-100');
	background-color: map-get($ds-colors, 'white');
	border-bottom-left-radius: 0 !important;
	border-bottom-right-radius: 0 !important;
}
</style>

<template>
	<div>
		<ds-box v-if="explorer" class="w-100" padding="">
			<radio-card-group
				:items="explorerCardSuggestions" class="w-100" :selected="selectedWidgetType" :explorer-icon="true"
				@selected="switchComponent($event)" />
		</ds-box>
		<ds-inline v-else gap="S">
			<template v-for="type in categoryWidgets" :key="type.chart">
				<ds-tooltip placement="top">
					<template #icon>
						<ds-btn
							:id="'button' + type.chart"
							variant="ghost"
							:class="{'active-chart-btn': selectedWidgetType === type.chart}"
							class="px-0 w-100 border"
							icon-only
							@click="switchComponent(type.chart)">
							<template #icon>
								<ds-icon
									fill="interaction-500"
									:name="icons[type.chart]"
									alt="icon" />
							</template>
						</ds-btn>
					</template>
					<template #tooltip>
						{{ $t(type.value) }}
					</template>
				</ds-tooltip>
			</template>
		</ds-inline>
	</div>
</template>

<script lang="ts">
import {defineComponent, toRefs, reactive, computed} from 'vue';
import {
	editMetric, getWidgetCategory, getWidgetsByDataConfig, multiSeries, singleSeries,
	widgetMultiSeriesTypes,
	widgetSingleSeriesTypes
} from '@/modules/explorer/consts/suggestionConst';
// eslint-disable-next-line no-duplicate-imports
import type {widgetType} from '@/modules/explorer/consts/suggestionConst';
import RadioCardGroup from '@/modules/dataset/components/createDataset/RadioCardGroup.vue';
import useChartTypes from '@/modules/explorer/composables/useChartTypes';
import {i18n} from '@/plugins/all';
const {t} = i18n.global;
import cloneDeep from 'lodash/cloneDeep';
import {
	WIDGET_INSTANCE_ACTIONS, WIDGET_INSTANCE_GETTERS,
	WIDGET_INSTANCE_MUTATIONS,
	WIDGET_INSTANCE_STORE_NAME
} from '@/modules/widget/store/widgetInstances/types';
import {widgetTypes} from '@/util/consts/widgetTypes';
import {useDataExploreStore} from '@/modules/explorer/store/dataExplore';
// eslint-disable-next-line no-duplicate-imports
import type {Attribute} from '@/modules/explorer/store/dataExplore';
import {chartConstants} from '@/util/consts/chartsConstants';
import {filterWidgetOptions, widgetOptionName} from '@/util/consts/widgetOptionsNames';
import {useStore} from 'vuex';

export default defineComponent({
	components: {RadioCardGroup},
	props: {
		explorer: {
			type: Boolean,
			default: false
		},
		category: {
			type: String,
			default: t('t_RecommendedWidgets')
		},
		suggestions: {
			type: Object,
			default: null
		}
	},
	emits: ['changed', 'widgetType'],
	setup(props, {emit}) {
		const store = useStore();
		const state = reactive({
			switchedWidgetId: '',
			selectedType: '',
			widgetBaseUrl: '/'
		});
		const {widgetTypesMetadata, icons, selectedWidgetType, selectedWidgetInstanceId} = useChartTypes();
		const widgetLayoutConfiguration = computed(() => store.getters['widgetInstances/layoutConfiguration'](selectedWidgetInstanceId.value));
		const widgetConfiguration = computed(() => store.getters['widgetInstances/configuration'](selectedWidgetInstanceId.value));
		const dataExploreStore = useDataExploreStore();

		const categoryWidgets = computed(() => {
			if (props.explorer) {
				const dimLength = widgetConfiguration.value.data.configuration.dimensions.length;
				const metricLength = widgetConfiguration.value.data.configuration.metrics.length;
				const widgets = getWidgetsByDataConfig(dimLength, metricLength, selectedWidgetType.value);
				return widgets?.filter((widgetOut: widgetType) => {
					if (widgetOut.dataType) {
						return widgetOut.dataType.includes(dataExploreStore?.getUsedAttributes
							?.find((attr: Attribute) => attr.selected === chartConstants.dataConfiguration.DIMENSION)?.type ?? '');
					}
					return true;
				});
			}
			const category = getWidgetCategory(selectedWidgetType.value);
			if (category === singleSeries) {
				return widgetSingleSeriesTypes;
			} else if (category === multiSeries) {
				return widgetMultiSeriesTypes;
			}
			return [];
		});

		const explorerCardSuggestions = computed(() => {
			if (props.category === t('t_RecommendedWidgets')) {
				return cloneDeep(props.suggestions);
			}
			const mappedSuggestions = {};
			Object.keys(props.suggestions).forEach((suggest: any) => {
				// @ts-ignore
				mappedSuggestions[props.suggestions[suggest].type] = {
					chart: props.suggestions[suggest].type,
					text: props.suggestions[suggest].text,
					icon: props.suggestions[suggest].icon,
					disabled: categoryWidgets.value ? categoryWidgets.value.findIndex((el) => el.chart === props.suggestions[suggest].type) === -1 : true
				};
			});
			return mappedSuggestions;
		});

		const deleteWidget = () => store.dispatch(
			`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_ACTIONS.REMOVE_INSTANCE}`,
			{widgetInstanceId: state.switchedWidgetId}
		);

		const createWidget = (wtuid: string, configuration: any) => store.dispatch(`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_ACTIONS.CREATE_NEW_INSTANCE}`, {
			widgetType: wtuid,
			configuration
		});


		const switchComponent = async(wtuid: string) => {
			if (props.explorer) {
				dataExploreStore.isChangingWidget = true;
			}
			state.switchedWidgetId = selectedWidgetInstanceId.value;
			const parentId = store.getters[`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_GETTERS.PARENT_ID}`](state.switchedWidgetId);
			const {id} = await createWidget(wtuid, editConfiguration(wtuid, widgetConfiguration.value));
			store.commit(`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_MUTATIONS.SET_WIDGET_ORDER}`, {id: parentId, widgetOrder: [id]});
			await deleteWidget();
			await store.dispatch(`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_ACTIONS.SELECT_WIDGET_INSTANCE}`, id);
			emit('changed', id);
			emit('widgetType', wtuid);
		};

		const editConfiguration = (wtuid: string, configuration: any) => {
			const newConfiguration = cloneDeep(configuration);
			while (editMetric.includes(wtuid) && newConfiguration.data?.configuration.metrics?.length > 1) {
				newConfiguration.data.configuration.metrics.pop();
			}
			newConfiguration.options = {};
			// eslint-disable-next-line guard-for-in
			for (const option in configuration.options) {
				// transfer options which exist in both widgets (e.g. step title)
				if (Object.hasOwn(widgetTypesMetadata.value[wtuid]?.options, option) || ((option === widgetOptionName.SELECTED_FORMAT
					|| option === filterWidgetOptions.FILTER_MAP
					|| option === filterWidgetOptions.FILTER_DATASETS) && props.explorer)) {
					if (option === widgetOptionName.HORIZONTAL && wtuid === widgetTypes.BAR_CHART) {
						newConfiguration.options[option] = false;
					} else {
						newConfiguration.options[option] = configuration.options[option];
					}
				}
			}

			if (configuration.options?.coloring) {
				newConfiguration.options.coloring = configuration.options.coloring;
			}

			return {
				data: newConfiguration.data,
				options: newConfiguration.options,
				layout: cloneDeep(widgetLayoutConfiguration.value),
				staticFilter: newConfiguration.staticFilter
			};
		};

		return {
			...toRefs(state),
			categoryWidgets,
			explorerCardSuggestions,
			selectedWidgetType,
			switchComponent,
			icons
		};
	}
});
</script>

<style lang="scss">
.active-chart-btn {
	border: 1px solid map-get($ds-colors, 'interaction-500');
	box-shadow: 0 0 0 1px map-get($ds-colors, 'interaction-500');
	background-color: map-get($ds-colors, 'interaction-0');
	-webkit-box-shadow: 0 0 0 1px map-get($ds-colors, 'interaction-500');
}
</style>

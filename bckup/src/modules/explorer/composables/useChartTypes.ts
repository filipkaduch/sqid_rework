import store from '@/plugins/store';
import {computed} from 'vue';
import {widgetTypes} from '@/util/consts/widgetTypes';
import {filterWidgetOptions, widgetOptionName} from '@/util/consts/widgetOptionsNames';
import {
	WIDGET_INSTANCE_ACTIONS,
	WIDGET_INSTANCE_STORE_NAME
} from '@/modules/widget/store/widgetInstances/types';
import cloneDeep from 'lodash/cloneDeep';
import {editMetric} from '@/modules/explorer/consts/suggestionConst';
import {widgetServices} from '@/modules/widget/widgetServices';
import {chartConstants} from '@/util/consts/chartsConstants';
import merge from 'lodash/merge';
import {useDataExploreStore} from '@/modules/explorer/store/dataExplore';
import useExplorerChart from '@/modules/explorer/composables/useExplorerChart';
const dataExploreStore = useDataExploreStore();

// eslint-disable-next-line func-names
export default function() {
	const {explore, widget, selectedWidgetInstanceId, selectedWidget} = useExplorerChart();
	const selectedWidgetType = computed(() => store.getters['widgetInstances/widgetType'](selectedWidgetInstanceId.value));
	const widgetTypesMetadata = computed(() => store.getters['widgetMetadata/widgetTypesMetadata']);

	// TODO: resolve icons with custom path in ds-icon component
	const icons = computed(() => Object.keys(widgetTypesMetadata.value).reduce((result, key) => {
		if (widgetTypesMetadata.value[key] && key !== widgetTypes.NOTIFICATION_FORMULA && key !== widgetTypes.INSIGHT) {
			// @ts-ignore
			result[key] = `${key}`;
		}
		return result;
	}, {}));

	const createWidgetAsync = async(wtuid: string, configuration: Object, section: any, previousId: string) => {
		const {data} = await widgetServices.createWidget(section.id, configuration);
		await store.dispatch(
			`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_ACTIONS.CREATE_WIDGET_INSTANCE}`,
			merge(data, {parentId: section.id})
		);
		await store.dispatch(`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_ACTIONS.SELECT_WIDGET_INSTANCE}`, data.id);
		await store.dispatch(
			`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_ACTIONS.REMOVE_INSTANCE}`,
			{widgetInstanceId: previousId}
		);
		return data;
	};

	// handles swapping format between multiple dimension attributes
	const swapSelectedFormat = (dimCount: number, selectedFormat: any) => {
		const newSelectedFormat = {} as any;
		if (dimCount > 1) {
			if (selectedFormat?.[chartConstants.dataConfiguration.X_AXIS]) {
				newSelectedFormat[chartConstants.dataConfiguration.Y_AXIS] = selectedFormat?.[chartConstants.dataConfiguration.X_AXIS];
			}

			if (selectedFormat?.[chartConstants.dataConfiguration.Y_AXIS]) {
				newSelectedFormat[chartConstants.dataConfiguration.X_AXIS] = selectedFormat?.[chartConstants.dataConfiguration.Y_AXIS];
			}

			if (selectedFormat?.metric) {
				newSelectedFormat.metric = selectedFormat?.metric;
			}
		} else {
			if (selectedFormat?.xAxis) {
				newSelectedFormat.xAxis = selectedFormat?.xAxis;
			}
			if (selectedFormat?.yAxis) {
				newSelectedFormat.xAxis = selectedFormat?.yAxis;
			}
			if (selectedFormat?.metric) {
				newSelectedFormat.metric = selectedFormat?.metric;
			}
		}

		// save swapped format
		store.dispatch('widgetInstances/setOption', {
			widgetInstanceId: selectedWidgetInstanceId.value,
			optionName: 'selectedFormat',
			value: newSelectedFormat
		});

		return newSelectedFormat;
	};

	const swapConfiguration = (
		wtuid: string,
		configuration: any,
		metrics: any,
		dimensions: any,
		datasetId: string | undefined | null,
		catalogItemId: string | undefined | null,
		configurationOptions: any,
		orderBy: any | undefined | null
		// eslint-disable-next-line max-params
	) => {
		// @ts-ignore
		const widgetLayoutConfiguration = configuration.layoutConfiguration;
		const newConfiguration = cloneDeep(configuration);
		// @ts-ignore
		while (editMetric.includes(wtuid) && newConfiguration.widgetDataConfigurations[0].configuration.metrics?.length > 1) {
			// @ts-ignore
			newConfiguration.widgetDataConfigurations[0].configuration.metrics.pop();
		}

		// @ts-ignore
		newConfiguration.widgetConfiguration = {};
		// @ts-ignore
		for (const option in configurationOptions) {
			// transfer options which exist in both widgets (e.g. step title)
			if (option in (store.getters['widgetMetadata/widgetTypesMetadata'][wtuid]?.options ?? [])
				|| option === widgetOptionName.SELECTED_FORMAT
				|| option === filterWidgetOptions.FILTER_DATASETS
				|| option === filterWidgetOptions.FILTER_MAP) {
				if (option === widgetOptionName.COLORS) {
					// @ts-ignore
					newConfiguration.widgetConfiguration.coloring = configurationOptions[option];
				} else if (option === widgetOptionName.HORIZONTAL && wtuid === widgetTypes.BAR_CHART) {
					// @ts-ignore
					newConfiguration.widgetConfiguration[option] = false;
				} else {
					// @ts-ignore
					newConfiguration.widgetConfiguration[option] = configurationOptions[option];
				}
			}
		}
		// @ts-ignore
		newConfiguration.widgetConfiguration.version = configurationOptions.version;
		return {
			dataConfigurations: [
				{
					dataConfiguration: {
						dimensions,
						metrics,
						orderBy,
						// @ts-ignore
						limit: newConfiguration.widgetDataConfigurations[0].configuration.limit,
						// @ts-ignore
						version: newConfiguration.widgetDataConfigurations[0].configuration.version
					},
					datasetId,
					catalogItemId
				}
			],
			// @ts-ignore
			widgetConfiguration: newConfiguration?.widgetConfiguration,
			widgetType: wtuid,
			// @ts-ignore
			layoutConfiguration: cloneDeep(widgetLayoutConfiguration),
			// @ts-ignore
			filters: newConfiguration.filters,
			name: selectedWidget.value?.configuration?.options?.isDefaultName ? configuration.name : selectedWidget.value?.name
		};
	};

	const switchComponent = async(metrics: any, dimensions: any, widgetType: string, orderBy: any) => {
		const datasetId = dataExploreStore.selectedDataExploration?.datasetId;
		const catalogItemId = dataExploreStore.selectedDataExploration?.catalogItemId;
		const section = explore.value.sections.find((sec: any) => sec.id === dataExploreStore.selectedDatasetExplorationId);
		// eslint-disable-next-line max-len
		const {id} = await createWidgetAsync(
			widgetType,
			// eslint-disable-next-line max-len
			swapConfiguration(widgetType, widget.value, metrics, dimensions, datasetId, catalogItemId, selectedWidget.value.configuration.options, orderBy),
			section, selectedWidgetInstanceId.value
		);
		return id;
	};

	return {
		icons,
		widgetTypesMetadata,
		selectedWidgetType,
		selectedWidgetInstanceId,
		switchComponent,
		swapSelectedFormat
	};
}

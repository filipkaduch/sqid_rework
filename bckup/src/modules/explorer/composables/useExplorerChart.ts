import store from '@/plugins/store';
import {
	STORY_DETAIL_ACTIONS,
	STORY_DETAIL_GETTERS,
	STORY_DETAIL_MUTATIONS,
	STORY_DETAIL_NAME
} from '@/modules/story/store/types';
import {
	WIDGET_INSTANCE_ACTIONS,
	WIDGET_INSTANCE_GETTERS,
	WIDGET_INSTANCE_STORE_NAME
} from '@/modules/widget/store/widgetInstances/types';
import {computed, inject} from 'vue';
import {storyServices} from '@/modules/story/storyServices';
import {widgetServices} from '@/modules/widget/widgetServices';
import {sectionServices} from '@/modules/story/sectionServices';
import {exploreDefaultConfig, sectionDefaultConfig, widgetDefaultConfig} from '@/modules/explorer/consts/consts';
import router from '@/plugins/router';
import {Attribute, useDataExploreStore} from '@/modules/explorer/store/dataExplore';
import cloneDeep from 'lodash/cloneDeep';
import pick from 'lodash/pick';
import {EXPLORER_NAME} from '@/modules/explorer/router';
import {datasetService} from '@/modules/dataset/datasetService';
import {storyFilterType, storyType} from '@/modules/story/consts/storyType';
import {dataTypes, dimensionDefinition, isDataType, metricDefinition, ordering} from '@/util/queryBuilder';
import {mapDimensionAxes, mapMetricAxes} from '@/util/widgetDataBinding';
import merge from 'lodash/merge';
import {DataSource} from '@/modules/dataset/utils/types';
import {DATASOURCE_TYPES} from '@/modules/dataset/utils/datasetUtils';
import i18n from '@/plugins/i18n/index';
import {useNotification} from '@kyvg/vue3-notification';

const {t} = i18n.global;
const notification = useNotification();
// eslint-disable-next-line max-statements
export default function useExplorerChart() {
	const appConfig = inject('appConfig');
	const getDatasetFromExplore = (id: string) => explore.value.datasets.find((el: any) => el.id === id);
	const loadStorySections = (id: string) => store.dispatch(`${STORY_DETAIL_NAME}/${STORY_DETAIL_ACTIONS.LOAD_STORY_SECTIONS}`, id);
	const loadFirstSectionSteps = () => store.dispatch(`${STORY_DETAIL_NAME}/${STORY_DETAIL_ACTIONS.LOAD_FIRST_SECTION_STEPS}`);
	const editorOpened = () => store.dispatch(`${STORY_DETAIL_NAME}/${STORY_DETAIL_ACTIONS.EDITOR_OPENED}`);
	const setWrapInstances = () => store.dispatch(`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_ACTIONS.SET_WRAP_INSTANCES}`);
	const loadData = (id: string, force: boolean = false) => {
		if ((!store.getters['widgetData/data'](id) && (widgetMetrics.value.length > 0 || widgetDimensions.value.length > 0)) || force) {
			// TODO: we can remove load data from here (need test)
			// await store.dispatch('widgetData/loadData', {widgetInstanceId: id});
		}
	};
	const loadAllStories = async(fetchThumbnails: boolean = true) => {
		await store.dispatch('stories/loadNextPage', {
			reset: true,
			storyType: storyType.VISUAL_DATA_STORY,
			storyFilter: appConfig?.oneIntegration ? storyFilterType.OWNED_OR_SHARED_GEN2 : storyFilterType.ONLY_OWNED,
			fetchThumbnails
		});
		while (!store.getters['stories/lastPage']) {
			await store.dispatch('stories/loadNextPage', {
				storyType: storyType.VISUAL_DATA_STORY,
				storyFilter: appConfig?.oneIntegration ? storyFilterType.OWNED_OR_SHARED_GEN2 : storyFilterType.ONLY_OWNED,
				fetchThumbnails
			});
		}
	};
	const explore = computed(() => store.getters[`${STORY_DETAIL_NAME}/${STORY_DETAIL_GETTERS.STORY}`]);
	const catalogs = computed(() => store.getters[`${STORY_DETAIL_NAME}/${STORY_DETAIL_GETTERS.CATALOG_ITEMS}`]);
	const pageWidgetInstanceIds = computed(() => store.getters[`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_GETTERS.PAGE_WIDGET_INSTANCE_IDS}`]);
	const setReadOnly = () => store.commit(`${STORY_DETAIL_NAME}/${STORY_DETAIL_MUTATIONS.SET_READONLY}`);
	const selectedWidget = computed(() => store.getters[`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_GETTERS.INSTANCE}`](selectedWidgetInstanceId.value));
	const selectedWidgetInstanceId = computed(() => store.getters[`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_GETTERS.SELECTED_WIDGET_INSTANCE_ID}`] ?? '');

	const selectedSection = computed(() => store.getters[`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_GETTERS.INSTANCE}`](dataExploreStore.selectedDatasetExplorationId) ?? null);

	const widgetConfiguration = computed(() => store.getters[`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_GETTERS.CONFIGURATION}`](selectedWidgetInstanceId.value));
	const dataSourceId = computed(() => widgetConfiguration.value?.data?.catalogItemId ?? widgetConfiguration.value?.data?.datasetId);
	const widgetRawData = computed(() => store.getters['widgetData/rawData'](selectedWidgetInstanceId.value));
	const dataConfiguration = computed(() => cloneDeep(widgetConfiguration.value?.data?.configuration
		?? widgetConfiguration.value?.dataConfigurations[0]?.dataConfiguration ?? {}));

	const dataExploreStore = useDataExploreStore();
	const widget = computed(() => {
		if (explore.value) {
			const section = explore.value.sections.find((sec: any) => sec.id === dataExploreStore.selectedDatasetExplorationId);
			if (section) {
				return section.widgets[section?.widgets.length - 1];
			}
		}
		return null;
	});

	const widgetDataConfiguration
		= computed(() => store.getters[`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_GETTERS.CONFIGURATION}`](selectedWidgetInstanceId.value)
			?.data?.configuration ?? null);
	const widgetMetrics = computed(() => widgetDataConfiguration.value?.metrics ?? []);
	const widgetDimensions = computed(() => widgetDataConfiguration.value?.dimensions ?? []);
	const isVisualization = computed(() => !(widgetDimensions.value.length > 0 && widgetMetrics.value.length > 0));

	const cloneExplore = async(widgetId: string, sectionIndex: number, explorationId: string, name: string) : Promise<{dataExploreId: string, name: string}> => {
		const sectionConfig = cloneDeep(sectionDefaultConfig);
		sectionConfig.atIndex = sectionIndex;
		sectionConfig.name = `${name} Copy`;
		const section = await sectionServices.createSection(explorationId, sectionConfig);

		// Create widget instance of section
		store.dispatch(`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_ACTIONS.ADD_INSTANCE}`, {
			id: section.id,
			name: section.name,
			instance: {...section, ...{parentId: explore.value.id, widgetType: 'widget_page'}}
		});

		// Get conf of widget we are duplicating
		let configuration = store.getters[`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_GETTERS.CONFIGURATION}`](widgetId);
		if (configuration) {
			configuration = cloneDeep(pick(configuration, [
				'data',
				'staticFilter',
				'options'
			]));
		}

		// Get default config
		const widgetConfig = cloneDeep(widgetDefaultConfig);

		widgetConfig.widgetType = store.getters[`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_GETTERS.WIDGET_TYPE}`](widgetId);
		// Update properties
		if (configuration.data.configuration.dimension || configuration.data.configuration.metrics) {
			widgetConfig.dataConfigurations = [
				{
					dataConfiguration: configuration?.data?.configuration,
					datasetId: configuration.data?.datasetId,
					catalogItemId: configuration.data?.catalogItemId
				}
			];
		} else {
			widgetConfig.dataConfigurations = [
				{
					datasetId: configuration.data?.datasetId,
					catalogItemId: configuration.data?.catalogItemId,
					dataConfiguration: {
						version: 'default/v0'
					}
				}
			];
		}
		if (configuration.staticFilter) {
			widgetConfig.filters = {
				...configuration.staticFilter,
				version: 'default/v1'
			};
		}

		// Create new widget for section
		const newWidget = await widgetServices.createWidget(section.id, widgetConfig);

		section.widgets = [newWidget.data];

		// Add new section with widget to sections
		store.commit(`${STORY_DETAIL_NAME}/${STORY_DETAIL_MUTATIONS.SET_SECTIONS}`, explore.value.sections.concat([section]));
		// TODO add try catch if will fail remove section
		// Create widget instance
		await store.dispatch(
			`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_ACTIONS.CREATE_WIDGET_INSTANCE}`,
			merge(newWidget.data, {parentId: section.id})
		);
		return {dataExploreId: section.id, name: sectionConfig.name};
	};

	const addDataSourcesToStory = async(storyId: string, dataSources: DataSource[], createNew = false) => {
		const currentCatalogs = createNew ? [] : catalogs?.value ?? [];
		const currentDatasets = createNew ? [] : explore?.value?.datasets ?? [];
		const catalogsToConnect = dataSources.filter((source) => source.type === DATASOURCE_TYPES.CATALOG_ITEM && !currentCatalogs.some((catalog: any) => catalog.id === source.id));
		const datasetsToConnect = dataSources.filter((source) => source.type === DATASOURCE_TYPES.DATASET && !currentDatasets.some((dataset: any) => dataset.id === source.id));
		const sourcesToConnect = [...datasetsToConnect, ...catalogsToConnect];
		if (sourcesToConnect.length > 0) {
			await storyServices.addDataSourcesToStory(storyId, sourcesToConnect);
			if (!createNew) {
				for (const source of sourcesToConnect) {
					const isDataset = source.type === DATASOURCE_TYPES.DATASET;
					const detail = isDataset ? await datasetService.getDatasetById(source.id) : await datasetService.getCatalogItemsDetail(source.id);
					if (isDataset) {
						await store.commit(`${STORY_DETAIL_NAME}/${STORY_DETAIL_MUTATIONS.SET_DATASETS}`, explore.value.datasets.concat(detail));
					} else {
						await store.commit(`${STORY_DETAIL_NAME}/${STORY_DETAIL_MUTATIONS.SET_CATALOG_ITEMS}`, catalogs.value.concat(detail));
					}
				}
			}
		}
	};
	const createNewSections = async(storyId: string, sectionIndex: number, dataSources: DataSource[], createNew = false) => {
		const sectionsConfigurations = await Promise.all(dataSources.map(async(source, index) => {
			let sectionName = null;
			if (createNew) {
				const sourceDetail = source.type === DATASOURCE_TYPES.DATASET
					? await datasetService.getDatasetById(source.id)
					: await datasetService.getCatalogItemsDetail(source.id);
				sectionName = sourceDetail?.name ?? sourceDetail[0].name;
			} else {
				const dataSource = source.type === DATASOURCE_TYPES.CATALOG_ITEM
					? catalogs.value.find((item: any) => item.id === source.id)
					: explore.value.datasets.find((item: any) => item.id === source.id);
				sectionName = dataSource.name;
			}

			const sectionConfig = cloneDeep(sectionDefaultConfig);
			sectionConfig.atIndex = sectionIndex + index;
			sectionConfig.name = sectionName;
			return sectionConfig;
		}));
		const sections = await sectionServices.createSectionsBulk(storyId, sectionsConfigurations);
		return sections;
	};

	const createWidgetForSection = async(storyId: string, section: any, dataSource: DataSource, createNew = false) => {
		// Create default widget config
		const widgetConfig = widgetDefaultConfig;
		(widgetConfig.dataConfigurations as any) = [
			{
				...(dataSource.type === DATASOURCE_TYPES.DATASET
					? {datasetId: dataSource.id}
					: {catalogItemId: dataSource.id}),
				dataConfiguration: {
					version: 'default/v0',
					limit: 20
				}
			}
		];

		// Create new widget
		const newWidget = await widgetServices.createWidget(section.id, widgetConfig);

		if (!createNew) {
			// Add widget to section
			// eslint-disable-next-line require-atomic-updates
			section.widgets = [newWidget.data];

			// Add new section with widget to sections
			store.commit(`${STORY_DETAIL_NAME}/${STORY_DETAIL_MUTATIONS.SET_SECTIONS}`, explore.value.sections.concat([section]));

			// Create widget instance
			await store.dispatch(
				`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_ACTIONS.CREATE_WIDGET_INSTANCE}`,
				merge(newWidget.data, {parentId: section.id})
			);
		}
	};
	const createExploration = async(dataSources: DataSource[]) => {
		const exploration = await storyServices.createStory(exploreDefaultConfig);
		await addDataSourcesToStory(exploration.id, dataSources, true);
		const newSections = await createNewSections(exploration.id, 0, dataSources, true);
		for (let i = 0; i < newSections.length; i++) {
			await createWidgetForSection(exploration.id, newSections[i], dataSources[i], true);
		}
		router.push({
			name: EXPLORER_NAME,
			params: {id: exploration.id}
		});
	};

	const getDataConfigFromAttributes = (metricAttr: Attribute[], dimensionAttr: Attribute[], topVal?: any) => {
		const metrics = metricAttr.map((metric) => {
			let metricFunction = metric.aggregation;
			if (!metricFunction) {
				metricFunction = isDataType(dataTypes.NUMBER, metric.type)
					? metricDefinition.SUM
					: metricDefinition.COUNT;
			// If we have C_SUm and we deleted dimension we need to switch it to SUM
			} else if (metricFunction === metricDefinition.C_SUM && !dimensionAttr.length) {
				metricFunction = metricDefinition.SUM;
			}

			return mapMetricAxes({
				column: metric.name,
				function: metricFunction,
				customExpressionEnabled: metric.customExpressionEnabled,
				customExpression: metric.customExpression,
				customColumnName: metric.customColumnName,
				id: metric.id
			});
		});

		const dimensions = dimensionAttr.map((dimension, index) => mapDimensionAxes({
			column: dimension.name,
			function: dimension.function,
			...(dimension.function === dimensionDefinition.NO_CHANGE
				? {}
				: dimension.function === dimensionDefinition.BUCKET_VALUE
					? {numberOfBuckets: dimension.numberOfBuckets}
					: {bucketsDatetime: dimension.bucketsDatetime}
			),
			...(index === 1 && metricAttr.length > 0
				? {
					topValues: topVal
						? {
							count: topVal.count,
							direction: topVal.direction,
							metric: {
								column: topVal.metric?.column,
								aggregation: topVal.metric?.function
							}
						}
						: {
							count: 10,
							direction: ordering.ASC,
							metric: {column: metricAttr?.[0]?.name, aggregation: metricDefinition.COUNT}
						}
				}
				: {})
		}));
		return {metrics, dimensions};
	};

	const saveConfiguration = async(metricAttr: Attribute[], dimensionAttr: Attribute[], topVal?: any) => {
		const {metrics, dimensions} = getDataConfigFromAttributes(metricAttr, dimensionAttr, topVal);

		const newConfig = cloneDeep(dataConfiguration.value);
		const haveCumsum = metricAttr.find((item) => item.aggregation === metricDefinition.C_SUM);
		const dim1HasOrder = newConfig.orderBy?.find((item: any) => item.columnAlias === 'Dimension1');

		if (haveCumsum && !dim1HasOrder && dimensions.length) {
			newConfig.orderBy = [
				{
					columnAlias: 'Dimension1',
					order: ordering.ASC
				}
			];
			notification.notify({
				type: 'info',
				title: t('t_orderingActivated'),
				text: t('t_byCumSum'),
				duration: 8000
			});
		}

		await store.dispatch(`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_ACTIONS.SET_CONFIGURATION}`, {
			widgetInstanceId: selectedWidgetInstanceId.value,
			configuration: {
				data: {
					configuration: {
						...newConfig,
						dimensions,
						metrics
					}
				}
			}
		});
	};

	return {
		cloneExplore,
		getDatasetFromExplore,
		widget,
		createExploration,
		pageWidgetInstanceIds,
		setReadOnly,
		loadStorySections,
		setWrapInstances,
		editorOpened,
		loadFirstSectionSteps,
		explore,
		catalogs,
		loadData,
		loadAllStories,
		widgetDimensions,
		isVisualization,
		widgetDataConfiguration,
		widgetMetrics,
		selectedWidget,
		selectedSection,
		widgetRawData,
		dataConfiguration,
		saveConfiguration,
		getDataConfigFromAttributes,
		widgetConfiguration,
		dataSourceId,
		createNewSections,
		createWidgetForSection,
		addDataSourcesToStory,
		selectedWidgetInstanceId
	};
}

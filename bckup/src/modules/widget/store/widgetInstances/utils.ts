import store from '@/plugins/store';
import {STORY_DETAIL_GETTERS, STORY_DETAIL_NAME} from '@/modules/story/store/types';
import {
	WIDGET_INSTANCE_GETTERS,
	WIDGET_INSTANCE_MUTATIONS,
	WIDGET_INSTANCE_STORE_NAME
} from '@/modules/widget/store/widgetInstances/types';
import {widgetServices} from '@/modules/widget/widgetServices';
import {ConfigData} from '@/modules/widget/models';
import {DATA_ASSETS} from '@/util/consts/dataAssetTypes';

// eslint-disable-next-line consistent-return
export const updateConfiguration = async(widgetInstanceId: string, data: any) => {
	if (!data) {
		return Promise.resolve();
	}

	let instance = null;
	const isSection = data.widgetType === 'widget_page';
	const config = {
		name: data?.name ?? store.getters[`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_GETTERS.INSTANCE}`](widgetInstanceId)?.name,
		layoutConfiguration: {version: 'default/v0'},
		filters: {
			version: 'default/v1',
			...(data.configuration?.staticFilter ?? {})
		}
	} as any;
	if (isSection) {
		config.configuration = {
			version: 'default/v0',
			...(data.configuration.options ?? {})
		};
		instance = await widgetServices.updateSections(widgetInstanceId, config);
	} else {
		config.widgetType = data.widgetType;
		config.widgetConfiguration = data?.configuration?.options ?? {};
		config.layoutConfiguration.position = data.position;
		config.layoutConfiguration.size = data.size;
		config.layoutConfiguration.rotation = data.rotation;
		instance = await widgetServices.updateWidget(widgetInstanceId, config);
	}
	if (data?.configuration?.data && instance) {
		const noConfiguration = instance?.widgetDataConfigurations?.length === 0;
		const configData: ConfigData = {
			datasetId: data.configuration.data.datasetId || null,
			catalogItemId: data.configuration.data.catalogItemId || null,
			dataConfiguration: data.configuration.data.configuration || null
		};

		if (hasValidDataAssetId(configData) && configData.dataConfiguration) {
			if (noConfiguration) {
				widgetServices.setDataConfiguration(instance.id, configData).finally();
			} else {
				widgetServices.updateDataConfiguration(instance.id, configData, data.configuration.data.id).finally();
			}
		}
	}
};

export const hasValidDataAssetId = (config: ConfigData): boolean => Boolean(getDataAssetId(config));

export const getDataAssetId = (config: ConfigData): any => config.datasetId ?? config.catalogItemId;

export const getDatasetType = (config: ConfigData): any => config.datasetId ? DATA_ASSETS.DATASET : DATA_ASSETS.CATALOG_ITEM;

export const checkColumnsInDataAsset = (columnsInDataset: string[], columNames: string[]): boolean => columnsInDataset.length
	? columNames.every((name) => columnsInDataset.includes(name))
	: false;

export const createUpdateConfigPromise = (payload: any, returnReload = false): Promise<any> => {
	if (store.state[WIDGET_INSTANCE_STORE_NAME].readOnly) {
		return Promise.resolve(false);
	}

	let resolves = [] as any;
	if (store.getters[`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_GETTERS.SAVING_TIMEOUT}`](payload.widgetInstanceId)) {
		clearTimeout(store.getters[`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_GETTERS.SAVING_TIMEOUT}`](payload.widgetInstanceId).timeout);
		// eslint-disable-next-line prefer-destructuring
		resolves = store.getters[`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_GETTERS.SAVING_TIMEOUT}`](payload.widgetInstanceId).resolves;
	}
	return new Promise((resolve) => {
		store.commit(`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_MUTATIONS.SET_SAVING_TIMEOUT}`, {
			widgetInstanceId: payload.widgetInstanceId,
			timeout: {
				timeout: setTimeout(() => {
					updateConfiguration(payload.widgetInstanceId, store.state[WIDGET_INSTANCE_STORE_NAME].widgetInstances[payload.widgetInstanceId])
						.then(() => {
							let returnedReload = false;
							resolves.forEach((tmpResolve: any) => {
								if (tmpResolve.returnReload && !returnedReload) {
									returnedReload = true;
									tmpResolve.resolve(true);
								} else {
									tmpResolve.resolve(false);
								}
							});
							resolve(!returnedReload && returnReload);
						});
					if (store.state[WIDGET_INSTANCE_STORE_NAME].widgetInstances[payload.widgetInstanceId]) {
						store.commit(`${WIDGET_INSTANCE_STORE_NAME}/${WIDGET_INSTANCE_MUTATIONS.SET_SAVING_TIMEOUT}`, {
							widgetInstanceId: payload.widgetInstanceId,
							timeout: null
						});
					}
				}, 500),
				resolves: resolves.concat([
					{
						returnReload,
						resolve
					}
				])
			}
		});
	});
};

export const getPage = (widgetInstanceId: string): any => {
	const widget = widgetInstanceId ? (store.state[WIDGET_INSTANCE_STORE_NAME].widgetInstances[widgetInstanceId] ?? null) : null;
	const page = widget?.widgetType === 'widget_page' ? widget : store.state[WIDGET_INSTANCE_STORE_NAME].widgetInstances[widget?.parentId] ?? null;
	return (page === null || page.widgetType !== 'widget_page')
		? null
		: (store.getters['storyDetail/story']?.sectionOrder.indexOf(page.id) ?? null);
};

export const getPageId = (pageIndex: number): any => store.getters[`${STORY_DETAIL_NAME}/${STORY_DETAIL_GETTERS.STORY}`]?.sectionOrder[pageIndex] ?? null;

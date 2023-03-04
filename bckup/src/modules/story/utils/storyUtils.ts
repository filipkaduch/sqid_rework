import {storyType, createOptions, explorerOption} from '@/modules/story/consts/storyType';
import {widgetTypes} from '@/util/consts/widgetTypes';
import cloneDeep from 'lodash/cloneDeep';

export const getDefaultWidgetConfig = (visualizationType: string) => ({
	name: 'widget',
	widgetType: widgetTypes.TEXT_PARAGRAPH,
	widgetConfiguration: {
		version: 'default/v0',
		displayName: false,
		isDefault: true,
		text: visualizationType === storyType.DATA_DASHBOARD
			? '<h1 style="text-align: center">Your dashboard title</h1>'
			: '<h1 style="text-align: center">Your story title</h1>'
	},
	layoutConfiguration: getDefaultLayoutConfig(visualizationType)
});


export const getCreateVisualisationOptions = (explorerFlag: boolean = false) => {
	const baseOptions = cloneDeep(createOptions);
	if (explorerFlag) {
		baseOptions.splice(1, 0, explorerOption);
	}
	return baseOptions;
};

export const getDefaultLayoutConfig = (visualizationType: string) => ({
	version: 'default/v0',
	size: {
		width: 1,
		height: visualizationType === storyType.DATA_DASHBOARD ? 0.15 : 1
	},
	position: {
		x: 0,
		y: 0,
		z: 0
	},
	rotation: 0
});

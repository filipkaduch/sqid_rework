// @ts-ignore
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';

import {sectionStackingModes} from '@/util/consts/sectionStackingVariants';
import {widgetTypes} from '@/util/consts/widgetTypes';

interface Location {
	section: number,
	step: number
}

export const getWidgetOptions = (metadataOptions: any, configurationOptions: any): any => {
	// eslint-disable-next-line guard-for-in
	for (const optionName in metadataOptions) {
		const [storeOptionName] = optionName.split('.');
		// store option key is only for maps
		const storeOptionKey = optionName.split('.')[1] ?? null;
		const storeConfigOption = storeOptionKey === null ? configurationOptions[optionName] : configurationOptions[storeOptionName]?.[storeOptionKey];
		const defaultMetadataOption = metadataOptions[optionName]?.default;
		const configName = storeOptionKey === null ? optionName : storeOptionName;

		if (!storeConfigOption && defaultMetadataOption) {
			configurationOptions[configName] = storeOptionKey === null
				// if isn't map option name set default
				? configurationOptions[storeOptionName] ?? defaultMetadataOption
				: {
					...(configurationOptions[storeOptionName] ?? {}),
					[storeOptionKey]: defaultMetadataOption
				};
		}
	}

	return configurationOptions;
};

export const getFirstWidgetIdInSections = (story: any) : string[] => {
	const loadedWidget = [] as string[];
	story.sections.forEach((section: any) => {
		if (section.configuration?.stacking === sectionStackingModes.ANIMATED || typeof section.configuration?.stacking === 'undefined') {
			loadedWidget.push(section.widgets[0]);
		} else {
			section.widgets.forEach((widget: any) => loadedWidget.push(widget));
		}
	});
	return loadedWidget;
};
export const getWidgetsByLocation = (story: any, location: Location, count: number, directionDown = true) => {
	if (!story.sections[location.section]?.widgets) {
		return [];
	}
	if (directionDown) {
		return loadNextWidgets(story, location, count);
	}
	return previousWidgets(story, location, count);
};

const loadNextWidgets = (story: any, location: Location, count: number) => {
	const loadedWidget = [];
	let nextSection = 0;
	let nextStep = location.step;
	if ([
		widgetTypes.INSIGHT,
		widgetTypes.EXPLAINER
	].includes(story.sections[location.section].widgets[location.step].widgetType)) {
		const overlay = findOverlayParent(story, location);
		if (overlay) {
			loadedWidget.push(overlay);
		}
	}
	const storyToMerge = cloneDeep(story);
	loadedWidget.push(merge(storyToMerge.sections[location.section].widgets[location.step], {parentId: storyToMerge.sections[location.section].id}));
	for (let i = 1; i <= count; i++) {
		// Load following step
		if (storyToMerge.sections[location.section + nextSection].widgets.length === nextStep + 1) {
			nextSection += 1;
			if (!storyToMerge.sections[location.section + nextSection]?.widgets) {
				break;
			}
			nextStep = 0;
			// load first from next section step
			loadedWidget.push(merge(storyToMerge.sections[location.section + nextSection].widgets[0], {parentId: storyToMerge.sections[location.section + nextSection].id}));
		} else {
			nextStep += 1;
			// load next step in section
			loadedWidget.push(merge(storyToMerge.sections[location.section + nextSection].widgets[nextStep], {
				parentId: storyToMerge.sections[location.section + nextSection].id
			}));
		}
	}
	return loadedWidget;
};

const previousWidgets = (story: any, location: Location, count: number) => {
	const loadedWidget = [];
	let nextSection = 0;
	let nextStep = location.step;
	const storyToMerge = cloneDeep(story);
	for (let i = 1; i <= count; i++) {
		if (nextStep - 1 >= 0) {
			nextStep -= 1;
			loadedWidget.push(merge(storyToMerge.sections[location.section + nextSection].widgets[nextStep], {
				parentId: storyToMerge.sections[location.section + nextSection].id
			}));
		} else {
			nextSection -= 1;
			if (!storyToMerge.sections[location.section + nextSection]?.widgets) {
				break;
			}
			nextStep = storyToMerge.sections[location.section - 1].widgets.length;
			// load first from next section step
			loadedWidget.push(merge(
				storyToMerge.sections[location.section + nextSection].widgets[nextStep],
				{parentId: storyToMerge.sections[location.section + nextSection].id}
			));
		}
	}
	return loadedWidget;
};
const findOverlayParent = (story: any, location: Location) => {
	let nextSection = 0;
	let nextStep = location.step;
	if (story.sections[location.section + nextSection]?.widgets) {
		do {
			const parentWidget = checkOverlay(story.sections[location.section + nextSection].widgets[nextStep], story.sections[location.section + nextSection].id);
			if (parentWidget) {
				return parentWidget;
			}
			if (nextStep - 1 >= 0) {
				nextStep -= 1;
			} else {
				nextSection -= 1;
				nextStep = story.sections[location.section - 1].widgets.length;
			}
		} while (story.sections[location.section + nextSection]?.widgets);
	}
	return null;
};
const checkOverlay = (widget: any, parentId: string) => {
	if (![
		widgetTypes.INSIGHT,
		widgetTypes.EXPLAINER
	].includes(widget.widgetType)) {
		return (merge(
			widget,
			{parentId}
		));
	}
	return null;
};

import _ from 'lodash';
import {rgbLinearShade} from '@/util/colors/shade';
import store from '@/plugins/store';
import {widgetOptionName} from '@/util/consts/widgetOptionsNames';
import {MAX_COLORS} from '@/util/consts/chartsConstants';

const getColor = (index, coloring, selected = false) => {
	const colorIndex = index % MAX_COLORS;
	if (!coloring || selected || colorIndex >= coloring.length) {
		// eslint-disable-next-line no-param-reassign
		selected = false;
		return selected
			? rgbLinearShade(0.6, store.getters['storyDetail/graphColor'](colorIndex))
			: store.getters['storyDetail/graphColor'](colorIndex);
	}
	return coloring[colorIndex].color;
};

const setColoringOption = (widgetInstanceId, value) => {
	store.commit('widgetInstances/setOption', {
		widgetInstanceId,
		optionName: widgetOptionName.COLORING,
		value
	});
};

export const generateColors = async(number, widgetInstanceId, persist = false, singleMetric = false, force = false) => {
	const coloring = store.getters['widgetInstances/option'](widgetInstanceId, widgetOptionName.COLORING) ?? null;
	const numberOfColors = Math.min(number, MAX_COLORS);
	const defaultColors = new Array(numberOfColors);
	const isRecolored = coloring?.find((element) => element.color.startsWith('#')) === 'undefined';
	const allSame = coloring?.every((val, i, arr) => val.color === arr[0].color) ?? true;
	if (!coloring || coloring.length < defaultColors.length || (force && !isRecolored && allSame)) {
		let tempColoring = null;
		if (persist) {
			tempColoring = _.cloneDeep(coloring);
		}
		await store.dispatch('storyDetail/generateColors', numberOfColors);
		if (tempColoring) {
			tempColoring.forEach((colour, index) => {
				defaultColors[index] = persist
					? colour
					: {
						colour: getColor(singleMetric ? 0 : index, coloring, true),
						index
					};
			});
		} else {
			for (let i = 0; i < numberOfColors; i++) {
				// eslint-disable-next-line require-atomic-updates
				defaultColors[i] = {
					index: i,
					color: getColor(singleMetric ? 0 : i, coloring, true)
				};
			}
		}
		setColoringOption(widgetInstanceId, defaultColors);
	}
};

export const setThemeColors = (widgetInstanceId) => {
	setColoringOption(widgetInstanceId, {});
};

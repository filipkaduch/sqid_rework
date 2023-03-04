import {echartsDefaultControls} from '@/modules/widget/echartsWidgetControls';
import {
	CATEGORY_AXIS,
	CATEGORY_LEGEND,
	CATEGORY_VISUAL
} from '@/modules/widget/components/widget-controls/consts/categories';

export const initialize = {
	size: {
		width: 450,
		height: 300
	}
};

export const widgetGroup = {
	group: 'chart',
	subGroup: 'chart_line'
};

export const configuration = {
	data: {
		dimensions: {
			count: 2
		},
		metrics: {
			count: 1
		},
		limit: {
			default: 10,
			maxValue: 30
		},
		rankingIndex: 0
	},
	colors: {
		dimensionColoring: true
	}
};

export const options = {
	...echartsDefaultControls(true),
	stacked: {
		type: 'widget_control_single_switch',
		default: false,
		needReload: false,
		category: CATEGORY_VISUAL,
		props: {
			switchText: 't_Stacked',
			showTextState: true
		}
	},
	replaceUndefined: {
		type: 'widget_control_single_switch',
		category: CATEGORY_VISUAL,
		default: false,
		needReload: true,
		props: {
			showTextState: true,
			switchText: 't_ReplaceUndefinedZero'
		}
	},
	connectUndefined: {
		type: 'widget_control_single_switch',
		category: CATEGORY_VISUAL,
		default: false,
		needReload: false,
		props: {
			switchText: 't_ConnectPoints',
			showTextState: true
		}
	},
	switchToLog: {
		type: 'widget_control_single_switch',
		category: CATEGORY_AXIS,
		default: false,
		needReload: false,
		props: {
			switchText: 't_linearLogarithmic',
			lastOption: true,
			showTextState: true
		}
	},
	showMax: {
		type: 'widget_control_single_switch',
		default: false,
		category: CATEGORY_VISUAL,
		needReload: false,
		props: {
			switchText: 't_ShowMaximalValue',
			showTextState: true
		}
	},
	showMin: {
		type: 'widget_control_single_switch',
		default: false,
		category: CATEGORY_VISUAL,
		needReload: false,
		props: {
			switchText: 't_ShowMinimalValue',
			showTextState: true
		}
	},
	showLast: {
		type: 'widget_control_single_switch',
		default: false,
		category: CATEGORY_VISUAL,
		needReload: false,
		props: {
			switchText: 't_ShowLastValue',
			showTextState: true
		}
	},
	graphSymbols: {
		type: 'widget_control_single_switch',
		default: false,
		needReload: false,
		category: CATEGORY_VISUAL,
		props: {
			showTextState: true,
			switchText: 't_showPoints',
			lastOption: true
		}
	},
	hideLegend: {
		type: 'widget_control_single_switch',
		default: false,
		needReload: false,
		category: CATEGORY_LEGEND,
		props: {
			switchText: 't_HideLegend',
			lastOption: true
		}
	}
};

export const getChartHeight = (count) => {
	if (count > 6) {
		return 'height: 150px';
	} else if (count <= 6 && count > 3) {
		return 'height: 250px';
	} else if (count <= 3) {
		return 'height: 500px';
	}
	return 'height: 500px';
};

export const getTitleValueSparkline = (widgetConfiguration, data) => {
	const maxArr = data.slice(1).map(Number);
	if (widgetConfiguration.options?.showMax) {
		return Math.max(...maxArr).toString();
	}
	if (widgetConfiguration.options?.showMin) {
		return Math.min(...maxArr).toString();
	}
	if (widgetConfiguration.options?.showLast) {
		return maxArr[maxArr.length - 1].toString();
	}
	return Math.max(...maxArr).toString();
};

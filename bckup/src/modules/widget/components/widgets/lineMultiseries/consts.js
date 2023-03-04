import {
	echartsDefaultControls,
	echartsLegendControls,
	labelRotate,
	xAxisNumberOfCharacter
} from '@/modules/widget/echartsWidgetControls';
import {
	CATEGORY_AXIS, CATEGORY_GENERAL,
	CATEGORY_LEGEND, CATEGORY_STACKED,
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
			count: 2,
			showTopValues: true
		},
		metrics: {
			count: 1,
			noMetricEnums: true,
			cSum: true
		},
		limit: {
			default: 10,
			maxValue: 10000
		},
		rankingIndex: 0
	},
	timeline: {
		race: true,
		hide: true
	},
	colors: {
		dimensionColoring: true
	}
};

export const options = {
	...echartsDefaultControls(false),
	...echartsLegendControls,
	legendGridWidth: {
		type: 'widget_control_number_input',
		category: CATEGORY_LEGEND,
		props: {
			numberInputText: 't_maxLegendWidth',
			step: 5,
			unit: '%',
			minValue: 0,
			default: 30,
			maxValue: 50
		}
	},
	stacked: {
		type: 'widget_control_single_switch',
		category: CATEGORY_STACKED,
		default: false,
		props: {
			main: true,
			showTextState: true,
			switchText: 't_Stacking'
		}
	},
	minorGridLines: {
		type: 'widget_control_single_switch',
		default: true,
		needReload: false,
		category: CATEGORY_VISUAL,
		props: {
			switchText: 't_MinorGridLines',
			showTextState: true,
			delimiter: false
		}
	},
	showAxisPointer: {
		type: 'widget_control_single_switch',
		default: true,
		needReload: false,
		category: CATEGORY_VISUAL,
		props: {
			switchText: 't_ShowCrossAxisPointer',
			delimiter: false,
			showTextState: true,
			border: true
		}
	},
	graphSymbols: {
		type: 'widget_control_single_switch',
		category: CATEGORY_VISUAL,
		default: false,
		order: 0,
		props: {
			showTextState: true,
			switchText: 't_showPoints'
		}
	},
	connectUndefined: {
		type: 'widget_control_single_switch',
		default: false,
		category: CATEGORY_VISUAL,
		order: 1,
		props: {
			showTextState: true,
			border: true,
			switchText: 't_ConnectPoints'
		}
	},
	averageLineBucketing: {
		type: 'widget_control_single_switch',
		default: false,
		category: CATEGORY_VISUAL,
		order: 2,
		props: {
			showTextState: true,
			switchText: 't_averageLineBucketing'
		}
	},
	averageLineAll: {
		type: 'widget_control_single_switch',
		default: false,
		category: CATEGORY_VISUAL,
		order: 3,
		props: {
			showTextState: true,
			border: true,
			switchText: 't_GlobalAverageLine'
		}
	},
	replaceUndefined: {
		type: 'widget_control_single_switch',
		default: false,
		category: CATEGORY_VISUAL,
		order: 5,
		props: {
			showTextState: true,
			switchText: 't_ReplaceUndefinedZero'
		}
	},
	smoothLine: {
		type: 'widget_control_single_switch',
		default: false,
		category: CATEGORY_VISUAL,
		order: 6,
		props: {
			showTextState: true,
			switchText: 't_smoothLines'
		}
	},
	switchToLog: {
		type: 'widget_control_single_switch',
		default: false,
		needReload: false,
		category: CATEGORY_AXIS,
		props: {
			switchText: 't_linearLogarithmic',
			delimiter: true
		}
	},
	limitRange: {
		type: 'widget_control_single_switch',
		default: false,
		category: CATEGORY_GENERAL,
		props: {
			showTextState: true,
			switchText: 't_LimitDisplayedRange',
			border: true,
			lastOption: true
		}
	},
	gridBorder: {
		type: 'widget_control_grid_border',
		category: CATEGORY_GENERAL,
		props: {
			gridText: 't_visibleRange',
			leftValueName: 'gridLeft',
			rightValueName: 'gridRight',
			delimiter: true
		}
	},
	labelRotate,
	xAxisNumberOfCharacter: xAxisNumberOfCharacter(3),
	selectedLegend: {
		type: 'widget_control_hidden',
		default: {},
		needReload: true,
		category: CATEGORY_LEGEND,
		needSaveConfiguration: false,
		needFetch: false
	}
};

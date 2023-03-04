import {
	echartsDefaultControls,
	echartsLegendControls,
	labelRotate,
	xAxisNumberOfCharacter
} from '@/modules/widget/echartsWidgetControls';
import {
	CATEGORY_GENERAL,
	CATEGORY_LABEL,
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
	subGroup: 'chart_column'
};

export const configuration = {
	data: {
		dimensions: {
			showTopValues: true,
			count: 2
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
	colors: {
		dimensionColoring: true
	}
};

export const options = {
	...echartsDefaultControls(false),
	...echartsLegendControls,
	legendGridWidth: {
		type: 'widget_control_number_input',
		needReload: false,
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
	horizontalFlip: {
		type: 'widget_control_button_group',
		default: false,
		category: CATEGORY_VISUAL,
		order: 2,
		props: {
			headingText: 't_chartOrientation',
			options: [{value: true, text: 'chartOrientation.horizontal'}, {value: false, text: 'chartOrientation.vertical'}],
			delimiter: true
		}
	},
	stacked: {
		type: 'widget_control_single_switch',
		default: false,
		needReload: false,
		category: CATEGORY_STACKED,
		props: {
			switchText: 't_Stacked',
			showTextState: true,
			main: true
		}
	},
	stackedToMax: {
		type: 'widget_control_single_switch',
		default: false,
		category: CATEGORY_STACKED,
		props: {
			showTextState: true,
			switchText: 't_StackedToMax',
			lastOption: true
		}
	},
	barGap: {
		type: 'widget_control_single_switch',
		default: true,
		needReload: false,
		category: CATEGORY_VISUAL,
		order: 1,
		props: {
			switchText: 't_ShowBarGap',
			showTextState: true,
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
	showLabel: {
		type: 'widget_control_single_switch',
		default: false,
		needReload: false,
		category: CATEGORY_LABEL,
		props: {
			showTextState: true,
			switchText: 't_showLabel',
			main: true
		}
	},
	labelPosition: {
		type: 'widget_control_button_group',
		default: 'top',
		category: CATEGORY_LABEL,
		needReload: false,
		props: {
			headingText: 't_LabelPosition'
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

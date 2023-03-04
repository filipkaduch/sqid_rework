import {
	CATEGORY_AXIS,
	CATEGORY_GENERAL,
	CATEGORY_LEGEND
} from '@/modules/widget/components/widget-controls/consts/categories';
import {chartConstants} from '@/util/consts/chartsConstants';

export const echartsDefaultControls = (lastOption = false) => ({
	displayName: {
		type: 'widget_control_single_switch',
		default: false,
		needReload: false,
		category: CATEGORY_GENERAL,
		props: {
			showTextState: true,
			switchText: 't_showChartTitle',
			disabled: false,
			...(lastOption ? {lastOption: true} : {})
		}
	}
});
export const xAxisNumberOfCharacter = (order: number = 1) => ({
	type: 'widget_control_switchable_number_input',
	default: null,
	category: CATEGORY_AXIS,
	order,
	props: {
		default: null,
		maxValue: 30,
		numberInputText: 't_MaximumLabelLength'
	}
});
export const labelRotate = {
	type: 'widget_control_button_group',
	default: 'horizontal',
	order: 0,
	category: CATEGORY_AXIS,
	props: {
		headingText: 't_VerticalLabels',
		options: [
			{value: chartConstants.chartConst.HORIZONTAL, text: 'labelRotation.horizontal'},
			{value: chartConstants.chartConst.VERTICAL, text: 'labelRotation.vertical'},
			{value: chartConstants.chartConst.SLOPING, text: 'labelRotation.sloping'}
		]
	}
};
export const labelRotateHandle = (rotation: string) => {
	switch (rotation) {
		case chartConstants.chartConst.VERTICAL:
			return 90;
		case chartConstants.chartConst.HORIZONTAL:
			return 0;
		case chartConstants.chartConst.SLOPING:
			return 30;
		default:
			return 0;
	}
};
export const xAxisNameControls = {
	showXAxisName: {
		type: 'widget_control_single_switch',
		default: false,
		needReload: false,
		category: CATEGORY_AXIS,
		props: {
			showTextState: true,
			switchText: 'showXAxisName'
		}
	},
	xAxisName: {
		type: 'widget_control_text_input',
		default: '',
		needReload: false,
		category: CATEGORY_AXIS,
		props: {
			headingText: 'xAxisName',
			name: 'text'
		}
	}
};
export const yAxisNameControls = {
	showYAxisName: {
		type: 'widget_control_single_switch',
		default: false,
		needReload: false,
		category: CATEGORY_AXIS,
		props: {
			showTextState: true,
			switchText: 'showYAxisName'
		}
	},
	yAxisName: {
		type: 'widget_control_text_input',
		default: '',
		needReload: false,
		category: CATEGORY_AXIS,
		props: {
			headingText: 'yAxisName',
			name: 'text'
		}
	}
};
export const echartsLegendControls = {
	showLegend: {
		type: 'widget_control_single_switch',
		default: true,
		category: CATEGORY_LEGEND,
		props: {
			main: true,
			showTextState: true,
			switchText: 't_showLegend'
		}
	},
	legendPosition: {
		type: 'widget_control_button_group',
		default: 'bottom',
		category: CATEGORY_LEGEND,
		props: {
			headingText: 't_position',
			options: [
				'left',
				'bottom',
				'right'
			]
		}
	}
};


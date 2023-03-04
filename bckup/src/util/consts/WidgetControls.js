import {CATEGORY_GENERAL} from '@/modules/widget/components/widget-controls/consts/categories';

export const widgetDefaultControls = {
	displayName: {
		type: 'widget_control_single_switch',
		default: false,
		needReload: false,
		category: CATEGORY_GENERAL,
		props: {
			showTextState: true,
			switchText: 't_showChartTitle',
			disabled: false
		}
	}
};

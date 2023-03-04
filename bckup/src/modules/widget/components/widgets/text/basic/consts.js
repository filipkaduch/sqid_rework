import {CATEGORY_GENERAL} from '@/modules/widget/components/widget-controls/consts/categories';

export const widgetGroup = {
	group: 'text',
	subGroup: 'text_paragraph'
};

export const initialize = {
	size: {
		width: 950,
		height: 50
	}
};

export const options = {
	displayName: {
		type: 'widget_control_single_switch',
		default: true,
		needReload: false,
		category: CATEGORY_GENERAL,
		props: {
			hide: true
		}
	},
	text: {
		type: 'widget_control_dummy',
		default: null,
		placeholder: 'Enter your text...',
		category: CATEGORY_GENERAL
	},
	// Below are options for backwards compatibility
	textConverted: {
		type: 'widget_control_dummy',
		default: false,
		category: CATEGORY_GENERAL
	}
};

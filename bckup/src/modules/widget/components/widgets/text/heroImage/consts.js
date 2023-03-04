export const widgetGroup = {
	group: 'text',
	subGroup: 'text_paragraph'
};

export const initialize = {
	size: {
		width: 950,
		height: 430
	}
};

export const options = {
	url: {
		type: 'widget_control_dummy',
		default: null
	},
	backgroundSize: {
		type: 'widget_control_dummy',
		default: 'contain'
	},
	text: {
		type: 'widget_control_dummy',
		default: null,
		placeholder: 'Place your HERO text here...'
	},
	// Below are options for backwards compatibility
	textConverted: {
		type: 'widget_control_dummy',
		default: false
	},
	textColor: {
		type: 'widget_control_dummy',
		default: 'dark'
	},
	textSize: {
		type: 'widget_control_dummy',
		default: 'h2'
	}
};

export const widgetGroup = {
	group: 'text',
	subGroup: 'text_paragraph'
};
export const initialize = {
	size: {
		width: 400,
		height: 400
	}
};

export const configuration = {
	data: {
		hideOrdering: true,
		hideLastValueColumn: true,
		default: true,
		metrics: {
			min: 1
		}
	}
};

export const options = {
	text: {
		type: 'widget_control_dummy',
		default: null,
		placeholder: 'Enter your Explainer text...'
	}
};

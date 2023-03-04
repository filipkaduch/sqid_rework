export const widgetGroup = {
	group: 'text',
	subGroup: 'text_paragraph'
};

export const initialize = {
	size: {
		width: 630,
		height: 260
	}
};

export const configuration = {
	data: {
		metrics: {
			min: 1
		},
		hideOrdering: true,
		hideLastValueColumn: true
	}
};

export const options = {
	format: {
		type: 'widget_control_text_input',
		default: '',
		needReload: false,
		props: {
			multiline: true,
			showFacts: true,
			headingIcon: [
				'fal',
				'text'
			],
			headingText: 't_Format'
		}
	},
	percentage: {
		type: 'widget_control_single_switch',
		default: true,
		needReload: false,
		props: {
			switchText: 'Show percentage',
			headingIcon: [
				'fal',
				'percentage'
			]
		}
	}
};


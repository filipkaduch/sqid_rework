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
		metrics: {
			count: 1
		},
		hideOrdering: true,
		hideLastValueColumn: true
	}
};

export const options = {
	formulaType: {
		type: 'widget_control_button_group',
		default: 'text',
		needReload: false,
		props: {
			headingText: 't_Formula type',
			options: [
				{
					icon: 'ds-icon-text',
					label: 't_ValueText',
					value: 'text'
				},
				{
					icon: 'ds-icon-circle-solid',
					label: 't_Formula',
					value: 'shape'
				},
				{
					icon: 'ds-icon-bell',
					label: 't_Notification',
					value: 'notification'
				},
				{
					icon: 'ds-icon-mouse',
					label: 't_Button',
					value: 'button'
				}
			]
		}
	},
	textSize: {
		type: 'widget_control_button_group',
		default: 'paragraph',
		needReload: false,
		props: {
			headingText: 't_Text size',
			options: [
				{
					icon: 'ds-icon-paragraph',
					label: 'textEditor.btnParagraph',
					value: 'paragraph'
				},
				{
					icon: 'ds-icon-h2',
					label: 'textEditor.btnHeaderH2',
					value: 'h2'
				},
				{
					icon: 'ds-icon-h1',
					label: 'textEditor.btnHeaderH1',
					value: 'h1'
				}
			]
		}
	},
	textColor: {
		type: 'widget_control_button_group',
		default: 'dark',
		needReload: false,
		props: {
			headingText: 't_Text color',
			options: [
				{
					icon: 'ds-icon-moon',
					label: 't_Dark',
					value: 'dark'
				},
				{
					icon: 'ds-icon-sun',
					label: 't_Light',
					value: 'light'
				}
			]
		}
	},
	coloring: {
		type: 'widget_control_combined_color_picker',
		needReload: false,
		props: {
			headingText: 't_colorSelect',
			index: 0,
			type: 'widget',
			groupType: 'metric',
			groupIndex: 0,
			widgetType: 'widget_text_formula'
		}
	},
	position: {
		type: 'widget_control_button_group',
		needReload: false,
		props: {
			headingIcon: [
				'far',
				'arrows-alt'
			],
			headingText: 't_Position',
			options: [
				{
					icon: 'ds-icon-move',
					label: 't_Center',
					value: 'center'
				},
				{
					icon: 'ds-icon-chevron-down-pull',
					label: 't_top',
					value: 'flex-end'
				},
				{
					icon: 'ds-icon-chevron-top',
					label: 't_bottom',
					value: 'flex-start'
				}
			]
		}
	},
	scale: {
		type: 'widget_control_slider',
		default: 100,
		needReload: false,
		props: {
			headingIcon: [
				'fal',
				'layer-group'
			],
			headingText: 't_Scale',
			maxValue: 100
		}
	},
	format: {
		type: 'widget_control_text_input',
		default: '{1}',
		needReload: false,
		props: {
			headingIcon: [
				'fal',
				'text'
			],
			headingText: 't_Format',
			paragraphTrue: true,
			showFacts: true,
			showMetrics: true
		}
	}
};

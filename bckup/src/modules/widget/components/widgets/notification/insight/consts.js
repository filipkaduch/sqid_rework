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
		dimensions: {
			hideBucketing: true,
			noDimensionEnums: true,
			count: 1
		},
		metrics: {
			hideBucketing: true,
			noMetricEnums: true,
			count: 1
		},
		date: {
			count: 1
		},
		hideOrdering: true,
		hideLastValueColumn: true,
		showDate: true
	}
};
export const options = {

	insightName: {
		type: 'widget_control_text_input',
		default: '',
		needReload: false,
		props: {
			headingText: 't_Name',
			name: 'insightName'
		}
	},
	periodDays: {
		type: 'widget_control_text_input',
		default: '7',
		props: {
			headingText: 't_PeriodDays',
			placeholder: 't_PeriodDays'
		}
	},
	topResults: {
		type: 'widget_control_slider',
		default: 2,
		props: {
			headingText: 't_TopResults',
			maxValue: 3
		}
	},
	invertSentiment: {
		type: 'widget_control_single_switch',
		props: {
			switchText: 't_InvertSentiment'
		}
	},
	showPoints: {
		type: 'widget_control_single_switch',
		props: {
			switchText: 't_ShowPoints'
		}
	},
	smoothLine: {
		type: 'widget_control_single_switch',
		props: {
			switchText: 't_SmoothLine'
		}
	},
	format: {
		type: 'widget_control_text_input',
		default: 'Text',
		needReload: false,
		props: {
			headingText: 't_ValueText',
			multiline: true,
			name: 'Format',
			paragraphTrue: true,
			placeholder: 't_EnterYourTextHere'
		}
	},
	sparklineVisible: {
		type: 'widget_control_single_switch',
		props: {
			switchText: 't_Sparkline'
		}
	},
	sentimentVisible: {
		type: 'widget_control_single_switch',
		props: {
			switchText: 't_Sentiment'
		}
	},
	worseText: {
		type: 'widget_control_text_input',
		props: {
			headingText: 't_Worse'
		}
	},
	// TODO: we will need it bot not for now
	// worseColor: {
	// type: 'widget_control_combined_color_picker',
	// props: {
	// type: 'theme'
	// }
	// },
	betterText: {
		type: 'widget_control_text_input',
		props: {
			headingText: 't_Better'
		}
	}
	// TODO: we will need it bot not for now
	// betterColor: {
	// type: 'widget_control_combined_color_picker',
	// props: {
	// type: 'theme'
	// }
	// }
};
export const intlFormatter = new Intl.DateTimeFormat('default', {
	value: {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	},
	text: 'DD/Mon/YYYY (01 Jan 2000)'
});
export const formatDate = (date) => intlFormatter.format(new Date(date));

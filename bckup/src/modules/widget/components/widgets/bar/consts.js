import {echartsDefaultControls, echartsLegendControls} from '@/modules/widget/echartsWidgetControls';
import {stackToMaxDataset} from '@/util/echartsWidgetsUtil';
import {cleanBucketingIndex, cleanLastValueIndexForDataset} from '@/util/widgetData';
import {chartConstants} from '@/util/consts/chartsConstants';

import {
	CATEGORY_LABEL,
	CATEGORY_LEGEND,
	CATEGORY_VISUAL,
	CATEGORY_STACKED,
	CATEGORY_GENERAL
} from '@/modules/widget/components/widget-controls/consts/categories';

export const initialize = {
	size: {
		width: 450,
		height: 300
	}
};

export const configuration = {
	data: {
		dimensions: {
			count: 1
		},
		metrics: {
			min: 1,
			cSum: true
		},
		limit: {
			default: 10,
			maxValue: 10000
		}
	},
	timeline: {
		interval: 30000,
		fontSize: 24
	}
};

export const options = {
	...echartsDefaultControls,
	...echartsLegendControls,
	showLegend: {
		type: 'widget_control_single_switch',
		default: false,
		category: CATEGORY_LEGEND,
		props: {
			showTextState: true,
			switchText: 't_showLegend',
			main: true
		}
	},
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
	stacked: {
		type: 'widget_control_single_switch',
		default: false,
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
		order: 1,
		category: CATEGORY_VISUAL,
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
			border: true,
			switchText: 't_LimitDisplayedRange',
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
		category: CATEGORY_LABEL,
		props: {
			showTextState: true,
			switchText: 't_showLabel',
			main: true
		}
	}
};

export const mapData = (data, context, conf) => {
	const header = conf.data.configuration.dimensions.map((dimension) => dimension.column)
		.concat(conf.data.configuration.metrics.map((metric) => metric.column));

	let datasetSource = null;
	if (context.indexes[`${chartConstants.dataConfiguration.BUCKET_NUMBER}`]) {
		datasetSource = cleanBucketingIndex(context, data);
	} else {
		datasetSource = cleanLastValueIndexForDataset(data);
	}
	datasetSource.unshift(header);

	if (conf?.options?.stackedToMax && conf?.options?.stacked) {
		// find hidden indexes for the purpose of clean percentage calculation in stack to max option
		const hiddenIndexes = [];
		for (const hiddenIndex of Object.keys(conf.options.selectedLegend)) {
			if (!conf.options.selectedLegend[hiddenIndex]) {
				hiddenIndexes.push(parseInt(hiddenIndex, 10));
			}
		}
		datasetSource = stackToMaxDataset(datasetSource, hiddenIndexes);
	}

	const series = conf.data.configuration.metrics.map((item, index) => ({
		type: 'bar',
		name: (index + 1).toString(),
		label: {
			valueAnimation: true
		},
		itemStyle: {}
	}));
	return {
		numColors: series.length,
		datasetSource,
		series
	};
};

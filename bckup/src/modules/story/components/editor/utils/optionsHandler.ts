import store from '@/plugins/store';
import {widgetTypes} from '@/util/consts/widgetTypes';
import {barControlHandler} from '@/modules/widget/components/widgets/bar/controlSetting';
import {barMultiSeriesControlHandler} from '@/modules/widget/components/widgets/barMultiseries/controlSetting';
import {heatmapControlHandler} from '@/modules/widget/components/widgets/heatmap/controlSetting';
import {lineControlHandler} from '@/modules/widget/components/widgets/line/controlSetting';
import {lineMultiSeriesControlHandler} from '@/modules/widget/components/widgets/lineMultiseries/controlSetting';
import {ControlSetting} from '@/modules/widget/models';
import {pieControlHandler} from '@/modules/widget/components/widgets/pie/controlSetting';
import {spiderControlHandler} from '@/modules/widget/components/widgets/spider/controlSetting';
import {bubbleControlHandler} from '@/modules/widget/components/widgets/bubble/controlSetting';
import {lineTimeComparisonControlHandler} from '@/modules/widget/components/widgets/lineTimeComparison/controlSetting';
import {comparisonControlHandler} from '@/modules/widget/components/widgets/comparison/controlSetting';
import {dataGridControlHandler} from '@/modules/widget/components/widgets/datatable/controlSetting';

// eslint-disable-next-line max-statements
export const optionsHandler = (controlName: string, widgetInstanceId: string, metadata: any) => {
	const widgetType = store.getters['widgetInstances/widgetType'](widgetInstanceId);
	let setting: ControlSetting = {
		disabled: false,
		options: null,
		show: true
	};
	switch (widgetType) {
		case widgetTypes.BAR_CHART:
			setting = barControlHandler(controlName, widgetInstanceId);
			break;
		case widgetTypes.CATEGORY_BAR:
			setting = barControlHandler(controlName, widgetInstanceId);
			break;
		case widgetTypes.BAR_MULTISERIES:
			setting = barMultiSeriesControlHandler(controlName, widgetInstanceId);
			break;
		case widgetTypes.HEATMAP_CHART:
			setting = heatmapControlHandler(controlName, widgetInstanceId);
			break;
		case widgetTypes.LINE_CHART:
			setting = lineControlHandler(controlName, widgetInstanceId);
			break;
		case widgetTypes.LINE_MULTISERIES:
			setting = lineMultiSeriesControlHandler(controlName, widgetInstanceId);
			break;
		case widgetTypes.PIE_CHART:
			setting = pieControlHandler(controlName, widgetInstanceId);
			break;
		case widgetTypes.SPIDER_CHART:
			setting = spiderControlHandler(controlName, widgetInstanceId);
			break;
		case widgetTypes.BUBBLE_CHART:
			setting = bubbleControlHandler();
			break;
		case widgetTypes.LINE_COMPARISON:
			setting = lineTimeComparisonControlHandler(controlName, widgetInstanceId);
			break;
		case widgetTypes.COMPARISON_CHART:
			setting = comparisonControlHandler(controlName, widgetInstanceId);
			break;
		case widgetTypes.DATA_TABLE:
			setting = dataGridControlHandler(controlName, widgetInstanceId);
			break;
	}

	if (setting.options === null) {
		setting.options = metadata?.options ?? null;
	}
	return setting;
};

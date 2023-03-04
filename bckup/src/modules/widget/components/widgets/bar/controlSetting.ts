import store from '@/plugins/store';
import {widgetOptionName} from '@/util/consts/widgetOptionsNames';
import {chartConstants} from '@/util/consts/chartsConstants';
import {ControlSetting} from '@/modules/widget/models';


// eslint-disable-next-line max-statements
export const barControlHandler = (controlName: string, widgetInstanceId: string) => {
	const setting: ControlSetting = {
		disabled: false,
		options: null,
		show: true,
		default: null
	};
	switch (controlName) {
		case widgetOptionName.STACKED_LABEL_SUM: {
			const rawData = store.getters['widgetData/rawData'](widgetInstanceId);
			const showLabel = store.getters['widgetInstances/option'](widgetInstanceId, widgetOptionName.SHOW_LABEL);
			const stacked = store.getters['widgetInstances/option'](widgetInstanceId, widgetOptionName.STACKED);
			setting.show = !(rawData?.columns?.length <= 2 || !stacked || !showLabel);
			break;
		}
		case widgetOptionName.STACKED: {
			const rawData = store.getters['widgetData/rawData'](widgetInstanceId);
			setting.disabled = rawData?.columns?.length <= 2;
			break;
		}
		case widgetOptionName.STACKED_TO_MAX: {
			setting.disabled = !store.getters['widgetInstances/option'](widgetInstanceId, widgetOptionName.STACKED);
			break;
		}
		case widgetOptionName.LABEL_POSITION: {
			const horizontalFlip = store.getters['widgetInstances/option'](widgetInstanceId, widgetOptionName.HORIZONTAL);
			const showLabel = store.getters['widgetInstances/option'](widgetInstanceId, widgetOptionName.SHOW_LABEL);
			const stackedLabelSum = store.getters['widgetInstances/option'](widgetInstanceId, widgetOptionName.STACKED_LABEL_SUM);
			const stacked = store.getters['widgetInstances/option'](widgetInstanceId, widgetOptionName.STACKED);

			setting.options = horizontalFlip
				? chartConstants.labelPositionHorizontal
				: chartConstants.labelPosition;
			setting.show = !(!showLabel || (stackedLabelSum && stacked));
			break;
		}
		case widgetOptionName.LEGEND_POSITION: {
			setting.disabled = !store.getters['widgetInstances/option'](widgetInstanceId, widgetOptionName.SHOW_LEGEND);
			break;
		}
		case widgetOptionName.LEGEND_GRID_WIDTH: {
			const showLegend = store.getters['widgetInstances/option'](widgetInstanceId, widgetOptionName.SHOW_LEGEND);
			const legendPosition = store.getters['widgetInstances/option'](widgetInstanceId, widgetOptionName.LEGEND_POSITION);
			setting.default = store.getters['widgetInstances/option'](widgetInstanceId, widgetOptionName.LEGEND_GRID_WIDTH);
			setting.show = showLegend && legendPosition !== chartConstants.chartConst.BOTTOM;
			break;
		}
		case widgetOptionName.GRID_BORDER: {
			const limitRange = store.getters['widgetInstances/option'](widgetInstanceId, widgetOptionName.LIMIT_RANGE);
			setting.show = limitRange;
			break;
		}
		case widgetOptionName.TITLE: {
			const displayName = store.getters['widgetInstances/option'](widgetInstanceId, widgetOptionName.DISPLAY_NAME);
			setting.show = displayName;
			break;
		}
	}
	return setting;
};

import store from '@/plugins/store';
import {widgetOptionName} from '@/util/consts/widgetOptionsNames';
import {ControlSetting} from '@/modules/widget/models';
import {chartConstants} from '@/util/consts/chartsConstants';


// eslint-disable-next-line max-statements
export const lineControlHandler = (controlName: string, widgetInstanceId: string) => {
	const setting: ControlSetting = {
		disabled: false,
		options: null,
		show: true,
		default: null
	};
	switch (controlName) {
		case widgetOptionName.CONNECT_UNDEFINED: {
			if (store.getters['widgetInstances/option'](widgetInstanceId, widgetOptionName.CONNECT_UNDEFINED)
				&& !store.getters['widgetInstances/option'](widgetInstanceId, widgetOptionName.GRAPH_SYMBOLS)) {
				store.dispatch('widgetInstances/setOption', {
					widgetInstanceId,
					optionName: widgetOptionName.GRAPH_SYMBOLS,
					value: true
				});
			}
			break;
		}
		case widgetOptionName.GRAPH_SYMBOLS: {
			if (store.getters['widgetInstances/option'](widgetInstanceId, widgetOptionName.CONNECT_UNDEFINED)) {
				setting.disabled = true;
			}
			break;
		}
		case widgetOptionName.LEGEND_POSITION: {
			setting.disabled = !store.getters['widgetInstances/option'](widgetInstanceId, widgetOptionName.SHOW_LEGEND);
			break;
		}
		case widgetOptionName.GRID_BORDER: {
			setting.show = store.getters['widgetInstances/option'](widgetInstanceId, widgetOptionName.LIMIT_RANGE);
			break;
		}
		case widgetOptionName.TITLE: {
			setting.show = store.getters['widgetInstances/option'](widgetInstanceId, widgetOptionName.DISPLAY_NAME);
			break;
		}
		case widgetOptionName.AVERAGE_LINE_ALL:
		case widgetOptionName.AVERAGE_LINE_BUCKETING: {
			const rawData = store.getters['widgetData/rawData'](widgetInstanceId);
			if (rawData) {
				setting.disabled = rawData?.columns?.length <= 2;
			}
			break;
		}
		case widgetOptionName.LEGEND_GRID_WIDTH: {
			const showLegend = store.getters['widgetInstances/option'](widgetInstanceId, widgetOptionName.SHOW_LEGEND);
			const legendPosition = store.getters['widgetInstances/option'](widgetInstanceId, widgetOptionName.LEGEND_POSITION);
			setting.show = legendPosition !== chartConstants.chartConst.BOTTOM;
			setting.disabled = !showLegend;
			setting.default = store.getters['widgetInstances/option'](widgetInstanceId, widgetOptionName.LEGEND_GRID_WIDTH);
			break;
		}
	}
	return setting;
};

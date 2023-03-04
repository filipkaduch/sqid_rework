import store from '@/plugins/store';
import {widgetOptionName} from '@/util/consts/widgetOptionsNames';
import {ControlSetting} from '@/modules/widget/models';
import {chartConstants} from '@/util/consts/chartsConstants';


// eslint-disable-next-line max-statements
export const comparisonControlHandler = (controlName: string, widgetInstanceId: string) => {
	const setting: ControlSetting = {
		disabled: false,
		options: null,
		show: true,
		default: null
	};
	switch (controlName) {
		case widgetOptionName.LEGEND_POSITION: {
			setting.disabled = !store.getters['widgetInstances/option'](widgetInstanceId, widgetOptionName.SHOW_LEGEND);
			break;
		}
		case widgetOptionName.LEGEND_GRID_WIDTH: {
			const showLegend = store.getters['widgetInstances/option'](widgetInstanceId, widgetOptionName.SHOW_LEGEND);
			const legendPosition = store.getters['widgetInstances/option'](widgetInstanceId, widgetOptionName.LEGEND_POSITION);
			setting.default = store.getters['widgetInstances/option'](widgetInstanceId, widgetOptionName.LEGEND_GRID_WIDTH);
			setting.show = legendPosition !== chartConstants.chartConst.BOTTOM;
			setting.disabled = !showLegend;
			break;
		}
	}
	return setting;
};

import store from '@/plugins/store';
import {widgetOptionName} from '@/util/consts/widgetOptionsNames';
import {ControlSetting} from '@/modules/widget/models';
// eslint-disable-next-line max-statements
export const heatmapControlHandler = (controlName: string, widgetInstanceId: string) => {
	const setting: ControlSetting = {
		disabled: false,
		options: null,
		show: true
	};
	switch (controlName) {
		case widgetOptionName.COLOR_SCALE_POSITION: {
			setting.disabled = !store.getters['widgetInstances/option'](widgetInstanceId, widgetOptionName.SHOW_COLOR_SCALE);
			break;
		}
		case widgetOptionName.SET_GREEN_COLOR_SCALE: {
			setting.disabled = store.getters['widgetInstances/option'](widgetInstanceId, widgetOptionName.SET_PLASMA_COLOR_SCALE);
			break;
		}
		case widgetOptionName.SET_PLASMA_COLOR_SCALE: {
			setting.disabled = store.getters['widgetInstances/option'](widgetInstanceId, widgetOptionName.SET_GREEN_COLOR_SCALE);
			break;
		}
		case widgetOptionName.GRID_BORDER: {
			setting.show = store.getters['widgetInstances/option'](widgetInstanceId, widgetOptionName.LIMIT_RANGE);
			break;
		}
	}
	return setting;
};

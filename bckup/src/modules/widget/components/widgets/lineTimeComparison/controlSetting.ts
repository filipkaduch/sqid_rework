import store from '@/plugins/store';
import {widgetOptionName} from '@/util/consts/widgetOptionsNames';
import {ControlSetting} from '@/modules/widget/models';


// eslint-disable-next-line max-statements
export const lineTimeComparisonControlHandler = (controlName: string, widgetInstanceId: string) => {
	const setting: ControlSetting = {
		disabled: false,
		options: null,
		show: true
	};
	switch (controlName) {
		case widgetOptionName.GRID_BORDER: {
			setting.show = store.getters['widgetInstances/option'](widgetInstanceId, widgetOptionName.LIMIT_RANGE);
			break;
		}
		case widgetOptionName.TITLE: {
			setting.show = store.getters['widgetInstances/option'](widgetInstanceId, widgetOptionName.DISPLAY_NAME);
			break;
		}
	}
	return setting;
};

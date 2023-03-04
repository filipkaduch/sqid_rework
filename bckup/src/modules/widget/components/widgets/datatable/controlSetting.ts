import store from '@/plugins/store';
import {widgetOptionName} from '@/util/consts/widgetOptionsNames';
import {ControlSetting} from '@/modules/widget/models';

// eslint-disable-next-line max-statements
export const dataGridControlHandler = (controlName: string, widgetInstanceId: string) => {
	const setting: ControlSetting = {
		disabled: false,
		options: null,
		show: true,
		default: null
	};
	switch (controlName) {
		case widgetOptionName.TITLE: {
			setting.show = store.getters['widgetInstances/option'](widgetInstanceId, widgetOptionName.DISPLAY_NAME);
			break;
		}
	}
	return setting;
};

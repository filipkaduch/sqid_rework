import store from '@/plugins/store';
import {widgetOptionName} from '@/util/consts/widgetOptionsNames';
import {ControlSetting} from '@/modules/widget/models';

// eslint-disable-next-line max-statements
export const spiderControlHandler = (controlName: string, widgetInstanceId: string) => {
	const setting: ControlSetting = {
		disabled: false,
		options: null,
		show: true
	};
	switch (controlName) {
		case widgetOptionName.LEGEND_POSITION: {
			setting.disabled = !store.getters['widgetInstances/option'](widgetInstanceId, widgetOptionName.SHOW_LEGEND);
			break;
		}
		case 'dataModeSwitch': {
			const rawData = store.getters['widgetData/rawData'](widgetInstanceId);
			if (rawData) {
				const dimension2Index = rawData.columns.some((item: any) => item.reference === 'Dimension2');
				if (dimension2Index) {
					setting.disabled = true;
				}
			}
			break;
		}
	}
	return setting;
};

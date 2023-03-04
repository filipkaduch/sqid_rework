import {PopupListItem} from '@/components/main/layout/utils/types';

export interface EditorContent {
	type: string;
	attrs?: any;
	content?: any
}

export enum DataType {
	FACT = 'fact',
	METRIC = 'metric',
	INSIGHT = 'insight'
}

export const modifyItem = (data: EditorContent[], id: string | number, val: string | number, type: DataType) => {
	if (data?.length) {
		for (const item of data) {
			if (item.type === 'protectedItem' && item.attrs?.id === id) {
				item.attrs.txt = val;
				if (item.content?.length) {
					item.content[0].text = val.toString();
				}
			} else if (item.content) {
				modifyItem(item.content, id, val, type);
			}
		}
	}
};

export const getNode = (data: PopupListItem<string>[], selectedValue: string, type: DataType): any => {
	const nodeData = data.find((item) => item.value === selectedValue);
	return {
		id: nodeData?.value,
		txt: nodeData?.dataValue,
		referenceName: `[${type} ${nodeData?.value}]`
	};
};

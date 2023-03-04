import {PropType} from 'vue';
import {PopupListItem} from '@/components/main/layout/utils/types';

export const componentProps = {
	html: {
		type: String,
		default: ''
	},
	editorClass: {
		type: String,
		default: ''
	},
	editorStyle: {
		type: Object,
		default: null
	},
	presentationMode: {
		type: Boolean,
		default: false
	},
	editEnabled: {
		type: Boolean,
		default: true
	},
	placeholder: {
		type: String,
		default: 'Enter your text...'
	},
	metrics: {
		type: Array as PropType<PopupListItem<string>[]>,
		default: null
	},
	facts: {
		type: Array as PropType<PopupListItem<string>[]>,
		default: null
	},
	backgroundImage: {
		type: String,
		default: null
	},
	backgroundSize: {
		type: String,
		default: 'contain'
	},
	showBgImage: {
		type: Boolean,
		default: false
	},
	widgetInstanceId: {
		type: String,
		default: null
	}
};

export const colorPalette = [
	'#FFFFFF',
	'#000000',
	'#D6006D',
	'#583F99',
	'#67686F',
	'#1141C5',
	'#57727F',
	'#419544',
	'#D68F00',
	'#C61010'
];

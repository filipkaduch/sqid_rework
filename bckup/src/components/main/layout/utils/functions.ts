import {Align, AlignY} from '@/components/main/layout/utils/types';

export const mapAlignToCss = (align?: Align | null) => {
	switch (align) {
		case 'left':
			return 'flex-start';
		case 'right':
			return 'flex-end';
		case 'center':
			return 'center';
		case 'space-between':
			return 'space-between';
		case 'space-around':
			return 'space-around';
		default:
			return null;
	}
};

export const mapAlignYToCss = (alignY?: AlignY | null) => {
	switch (alignY) {
		case 'top':
			return 'flex-start';
		case 'top-baseline':
			return 'baseline';
		case 'center':
			return 'center';
		case 'bottom':
			return 'flex-end';
		default:
			return null;
	}
};

export type Align = 'left' | 'center' | 'right' | 'space-between' | 'space-around';
export type AlignY = 'top' | 'top-baseline' | 'center' | 'bottom';

export type PositiveSpaceUnit = 'NONE' | 'XS' | 'S' | 'GROUP' | 'M' | 'L' | 'XL' | 'XXL';
export type FlexType = 'column' | 'row' | 'column-reverse' | 'row-reverse';
export type Borders = 'box' | 'boxHover' | 'disabled' | 'error' | 'layout' | 'separate' | 'separate-light' | 'transparent' | 'none';
export type BorderRadii = 'small' | 'basic' | 'big' | 'rounded' | 'pill' | 'none';
export type BoxShadows = 'low' | 'high';
export type FlexGrow = '1' | '2' | '3';
export const space = {
	NONE: '0',
	XXS: '2px',
	XS: '4px',
	S: '8px',
	GROUP: '12px',
	M: '16px',
	L: '24px',
	XL: '32px',
	XXL: '48px',
	XXXL: '64px',
	'-XXS': '-2px',
	'-XS': '-4px',
	'-S': '-8px',
	'-M': '-16px',
	'-L': '-24px',
	'-XL': '-32px',
	'-XXL': '-48px',
	'-XXXL': '-64px',
	'-GROUP': '12px'
};

export type PlacementVariants = 'auto' | 'auto-start' | 'auto-end' | 'top' | 'top-start' |
	'top-end' | 'right' | 'right-start' | 'right-end' | 'bottom' | 'bottom-start' | 'bottom-end' |
	'left' | 'left-start' | 'left-end';


export type PopupListItem<T> = {
	value: T
	selectLabel?: string
	group?: string,
	properties?: Object,
	highlighted?: boolean
	searchableText?: string,
	dataValue?: any,
	text?: string,
	catalogItemId?: string
};


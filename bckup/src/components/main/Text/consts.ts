interface TextVariants {
	display: 'display',
	headline1: 'headline1',
	headline1light: 'headline1light',
	headline2: 'headline2',
	'ds-headline1': 'ds-headline1',
	'ds-headline2': 'ds-headline2',
	'ds-headline3': 'ds-headline3',
	'ds-s-headline1': 'ds-s-headline1',
	'ds-s-headline2': 'ds-s-headline2',
	'ds-s-headline3': 'ds-s-headline3',
	subheadline: 'subheadline',
	subheadlineRegular: 'subheadlineRegular',
	subheadlineMedium: 'subheadlineMedium',
	body: 'body',
	bodyMedium: 'bodyMedium',
	paragraph: 'paragraph',
	'ds-paragraphLarge': 'ds-paragraphLarge',
	data: 'data',
	dataCaption: 'dataCaption',
	caption: 'caption',
	captionMedium: 'captionMedium'
}

export type TextVariant = TextVariants[keyof TextVariants];
export type TextAlign = 'left' | 'right' | 'center';
export type FontStyle = 'normal' | 'italic';
export type WhiteWrap = 'normal' | 'nowrap' | 'pre-wrap';

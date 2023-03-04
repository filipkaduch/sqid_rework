interface TextVariants {
	display: 'display',
	headline1: 'headline1',
	headline1light: 'headline1light',
	headline2: 'headline2',
	'app-headline1': 'app-headline1',
	'app-headline2': 'app-headline2',
	'app-headline3': 'app-headline3',
	'app-s-headline1': 'app-s-headline1',
	'app-s-headline2': 'app-s-headline2',
	subheadline: 'subheadline',
	subheadlineRegular: 'subheadlineRegular',
	subheadlineMedium: 'subheadlineMedium',
	body: 'body',
	bodyMedium: 'bodyMedium',
	paragraph: 'paragraph',
	'ds-paragraphLarge': 'app-paragraphLarge',
	data: 'data',
	dataCaption: 'dataCaption',
	caption: 'caption',
	captionMedium: 'captionMedium'
}

export type TextVariant = TextVariants[keyof TextVariants];
export type TextAlign = 'left' | 'right' | 'center';
export type FontStyle = 'normal' | 'italic';
export type WhiteWrap = 'normal' | 'nowrap' | 'pre-wrap';

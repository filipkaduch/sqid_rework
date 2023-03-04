export interface ColorStyle {
	text: string,
	border: string,
	background: string
}

export interface ColorVariants {
	primary: 'primary',
	secondary: 'secondary',
	'display-content': 'display-content',
	interaction: 'interaction',
	'separate-content': 'separate-content',
	success: 'success',
	warning: 'warning',
	error: 'error'
}

export interface TableHeader {
	name: string,
	type: string
}

export type ColorVariant = ColorVariants[keyof ColorVariants];

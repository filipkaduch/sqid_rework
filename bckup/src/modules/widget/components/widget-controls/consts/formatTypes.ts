export interface Formatting {
	metric?: FormatOption
	xAxis?: FormatOption
	yAxis?: FormatOption
}

export interface FormatOption {
	value?: {
		minimumFractionDigits?: number
		maximumFractionDigits?: number
		currency?: string
		style?: string
		day?: string
		month?: string
		year?: string
		notation?: string
		weekday?: string
		locale?: string
		hour?: string
		minute?: string
	} | null
	text?: string,
	short?: string
}

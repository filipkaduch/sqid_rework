export interface SelectTypesItem {
	text: string,
	icon: string,
	route?: string,
	disabled?: boolean
}
export interface SelectTypes {
	[key: string]: SelectTypesItem
}

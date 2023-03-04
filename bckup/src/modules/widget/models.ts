export type ControlSetting = {
	disabled: boolean | null;
	options: any | null;
	show: boolean | null;

	default?: any | null
};

export type ConfigData = {
	datasetId?: string;
	catalogItemId?: string;
	dataConfiguration?: any;
}

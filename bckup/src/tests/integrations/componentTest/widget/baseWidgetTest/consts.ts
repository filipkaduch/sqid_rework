const url = process.env.ATACCAMA_ONE_TELLSTORY_WEBAPP_API_BASE_URL ? process.env.ATACCAMA_ONE_TELLSTORY_WEBAPP_API_BASE_URL : 'https://datastories-api.stg.tellstory.cloud';
export const URL_DATA:string = `${url}/v0/queries/story-token/`;
export const URL_STORY:string = `${url}/v0/shared-stories/`;
export const NON_CANVAS_WIDGETS = ['paragraphText', 'multiseriesFormulaChart', 'heroImage', 'formulaChart', 'dataGrid'];

export const mock = {
	baseRender: {
		story: {},
		data: {}
	},
	Bucket: {
		story: {},
		data: {}
	},
	Limit: {
		story: {},
		data: {}
	},
	StepProps: {
		story: {},
		data: {}
	},
	TwoDimensions: {
		story: {},
		data: {}
	},
	MultiMetrics: {
		story: {},
		data: {}
	},
	Descending: {
		story: {},
		data: {}
	},
	RadiusDetailHigh: {
		story: {},
		data: {}
	},
	RadiusDetailLow: {
		story: {},
		data: {}
	},
	StepPropsHigh: {
		story: {},
		data: {}
	},
	LatestEntry: {
		story: {},
		data: {}
	},
	Extract: {
		story: {},
		data: {}
	},
	FormattingEnums: {
		story: {},
		data: {}
	},
	Average: {
		story: {},
		data: {}
	}
};

export const dataMocks = Object.freeze({
	COVID: 'covid',
	BAR_BUCKET: 'barBucket',
	STOCKS: 'stocks',
	POKEMON: 'pokemon',
	DEFAULT: 'default-taxi',
	GERMANY: 'germany'
});

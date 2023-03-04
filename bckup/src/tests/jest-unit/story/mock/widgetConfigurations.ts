export const widgetConfigurationWithTopValues = {
	configuration: {
		version: 'default/v0',
		dimensions: [
			{
				function: 'NO-CHANGE',
				column: 'column1'
			},
			{
				function: 'NO-CHANGE',
				column: 'column2',
				topValues: {
					count: 10,
					direction: 'ASC'
				}
			}
		],
		metrics: [
			{
				aggregation: 'SUM',
				column: 'metric1'
			}
		],
		limit: 10,
		orderBy: [],
		lastValueColumn: false
	},
	datasetId: 'datasetId',
	id: null,
	widgetId: null
};

export const widgetConfigurationWithTimeline = {
	configuration: {
		version: 'default/v0',
		dimensions: [
			{
				function: 'NO-CHANGE',
				column: 'column1'
			}
		],
		metrics: [
			{
				aggregation: 'SUM',
				column: 'column2'
			}
		],
		limit: 10,
		orderBy: [],
		timeline: {
			function: 'NO_CHANGE',
			column: 'metric1'
		},
		lastValueColumn: false
	},
	datasetId: 'datasetId',
	id: null,
	widgetId: null
};


export const widgetConfigurationSimple = {
	configuration: {
		version: 'default/v0',
		limit: 10,
		dimensions: [
			{
				column: 'column1',
				function: 'NO-CHANGE'
			}
		],
		metrics: [
			{
				column: 'column2',
				aggregation: 'SUM'
			}
		],
		orderBy: [],
		lastValueColumn: false
	},
	id: null,
	datasetId: 'datasetId',
	widgetId: null
};

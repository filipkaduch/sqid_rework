import {widgetConfigurationSimple, widgetConfigurationWithTopValues, widgetConfigurationWithTimeline} from './widgetConfigurations';

export const rankingData = [
	{
		testName: 'Bar multiSeries',
		data: {
			widgetConfiguration: widgetConfigurationWithTopValues,
			metadataConfig: {
				dimensions: {
					count: 2,
					showTopValues: true
				},
				metrics: {
					min: 1,
					noMetricEnums: true
				},
				limit: {
					default: 10,
					maxValue: 10000
				},
				rankingIndex: 0
			}
		},
		correct: {
			columnReference: 'Dimension1Ranking',
			count: 10,
			definition: {
				orderBy: [
					{
						columnAlias: 'Metric1',
						order: 'ASC'
					}
				],
				partitionBy: ['Dimension1']
			},
			ignoreNulls: false
		}
	},
	{
		testName: 'Bar with Timeline',
		data: {
			widgetConfiguration: widgetConfigurationWithTimeline,
			metadataConfig: {
				dimensions: {
					count: 1
				},
				metrics: {
					min: 1
				},
				limit: {
					default: 10,
					maxValue: 10000
				}
			}
		},
		correct: {
			columnReference: 'TimelineRanking',
			count: 10,
			definition: {
				orderBy: [],
				partitionBy: ['Timeline']
			},
			ignoreNulls: false
		}
	}
];

export const globalFilterData = [
	{
		testName: 'Contained In ',
		data: {
			widgetConfiguration: widgetConfigurationWithTopValues,
			filters: {
				globalFilter: [
					{
						columnReference: {
							datasetId: ['column1']
						},
						active: true,
						editable: true,
						datatype: 'TEXT',
						type: 'SIMPLE-ARRAY-COLUMN-VALUE',
						logic: 'IN',
						value: [
							'Austria',
							'Poland'
						]
					}
				],
				staticFilter: {
					version: 'default/v0'
				},
				dynamicFilter: [],
				drillDownFilter: null
			}
		},
		correct: {
			preAggregation: [
				{
					type: 'SIMPLE-ARRAY-COLUMN-VALUE',
					negate: false,
					columnReference: 'column1',
					values: [
						'Austria',
						'Poland'
					]
				}
			],
			postAggregation: [],
			version: 'default/v0'
		}
	},
	{
		testName: 'Mulitple Filters',
		data: {
			widgetConfiguration: widgetConfigurationWithTopValues,
			filters: {
				globalFilter: [
					{
						type: 'SIMPLE-ARRAY-COLUMN-VALUE',
						logic: 'IN',
						value: [
							'Austria',
							'Poland'
						],
						active: true,
						datatype: 'TEXT',
						editable: true,
						columnReference: {
							datasetId: ['column1']
						}
					},
					{
						columnReference: {
							datasetId: ['column1']
						},
						active: true,
						editable: true,
						datatype: 'TEXT',
						type: 'SIMPLE-ARRAY-COLUMN-VALUE',
						logic: '=',
						value: 'Poland'
					}
				],
				staticFilter: {
					version: 'default/v0'
				},
				dynamicFilter: [],
				drillDownFilter: null
			}
		},
		correct: {
			preAggregation: [
				{
					type: 'GROUP',
					operator: 'AND',
					clauses: [
						{
							type: 'SIMPLE-COLUMN-VALUE',
							logic: '=',
							negate: false,
							columnReference: 'column1',
							value: 'Poland'
						},
						{
							type: 'SIMPLE-ARRAY-COLUMN-VALUE',
							negate: false,
							columnReference: 'column1',
							values: [
								'Austria',
								'Poland'
							]
						}
					]
				}
			],
			postAggregation: [],
			version: 'default/v0'
		}
	}
];

export const filtersData = [
	{
		testName: 'globalFilter',
		data: {
			widgetConfiguration: widgetConfigurationSimple,
			filters: {
				drillDownFilter: null,
				dynamicFilter: [],
				globalFilter: [
					{
						type: 'SIMPLE-ARRAY-COLUMN-VALUE',
						logic: 'IN',
						value: [
							'Slovakia',
							'Poland'
						],
						active: true,
						datatype: 'TEXT',
						editable: true,
						columnReference: {
							datasetId: ['column1']
						}
					}
				],
				staticFilter: {
					version: 'default/v0'
				}
			},
			topValues: []
		},
		correct: {
			preAggregation: [
				{
					type: 'SIMPLE-ARRAY-COLUMN-VALUE',
					negate: false,
					columnReference: 'column1',
					values: [
						'Slovakia',
						'Poland'
					]
				}
			],
			postAggregation: []
		}
	},
	{
		testName: 'globalFilter + dynamicFilter',
		data: {
			widgetConfiguration: widgetConfigurationSimple,
			filters: {
				drillDownFilter: null,
				dynamicFilter: [
					{
						widgetId: null,
						columnName: 'column1',
						values: [['Poland']]
					}
				],
				globalFilter: [
					{
						type: 'SIMPLE-ARRAY-COLUMN-VALUE',
						logic: 'IN',
						value: [
							'Slovakia',
							'Poland'
						],
						active: true,
						datatype: 'TEXT',
						editable: true,
						columnReference: {
							datasetId: ['column1']
						}
					}
				],
				staticFilter: {
					version: 'default/v0'
				}
			},
			topValues: []
		},
		correct: {
			preAggregation: [
				{
					type: 'SIMPLE-ARRAY-COLUMN-VALUE',
					logic: '=',
					negate: false,
					columnReference: 'column1',
					values: ['Poland']
				},
				{
					type: 'SIMPLE-ARRAY-COLUMN-VALUE',
					negate: false,
					columnReference: 'column1',
					values: [
						'Slovakia',
						'Poland'
					]
				}
			],
			postAggregation: []
		}
	}
];

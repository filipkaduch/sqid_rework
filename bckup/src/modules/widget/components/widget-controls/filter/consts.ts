import {filterTypes, filterLogic} from '@/util/queryBuilder';
import {i18n} from '@/plugins/all';
const {t} = i18n.global;

export enum filterVersions {
	// Version with old filters where we saved filter as it should go on BE and metadata was saved to filterMap (till v14.3)
	DEFAULT_v0 = 'default/v0',
	// Rework of filters (new format to save, filters need to be maped before fetching) (from v14.3)
	DEFAULT_v1 = 'default/v1'
}

export enum filterValueConsts {
	EQUAL_TO = 'equalTo',
	NOT_EQUAL_TO = 'notEqualTo',
	CONTAINS = 'contains',
	DO_NOT_CONTAINS = 'doNotContains',
	IS_EMPTY = 'isEmpty',
	IS_NOT_EMPTY = 'isNotEmpty',
	LESS_THAN = 'lessThan',
	LESS_THAN_OR_EQUAL = 'lessThanOrEqual',
	GREATER_THAN = 'greaterThan',
	GREATER_THAN_OR_EQUAL = 'greaterThanOrEqual',
	IN_RANGE = 'inRange',
	NOT_IN_RANGE = 'notInRange',
	BEFORE = 'before',
	AFTER = 'after',
	IN_LAST = 'inLast',
	IN_CURRENT = 'inCurrent',
	DAY = 'day',
	WEEK = 'week',
	WEEK_US = 'weekUS',
	WEEK_EU = 'weekEU',
	MONTH = 'month',
	QUARTER = 'quarter',
	YEAR = 'year'
}

export interface FilterMetadataType {
	value: filterValueConsts,
	selectLabel: string,
	type: string,
	logic: string | string[],
	negate: boolean,
	noPicker?: boolean,
	operator?: string,
	subType?: string
}

export const stringFiltersOperations = [
	{
		value: filterValueConsts.EQUAL_TO,
		selectLabel: t('filters.new.equalTo'),
		type: filterTypes.SIMPLE_ARRAY_COLUMN_VALUE,
		logic: null,
		negate: false
	},
	{
		value: filterValueConsts.NOT_EQUAL_TO,
		selectLabel: t('filters.new.notEqualTo'),
		type: filterTypes.SIMPLE_ARRAY_COLUMN_VALUE,
		logic: null,
		negate: true
	},
	{
		value: filterValueConsts.CONTAINS,
		selectLabel: t('filters.new.contains'),
		type: filterTypes.SIMPLE_COLUMN_VALUE,
		logic: filterLogic.LIKE,
		negate: false
	},
	{
		value: filterValueConsts.DO_NOT_CONTAINS,
		selectLabel: t('filters.new.doesNotContain'),
		type: filterTypes.SIMPLE_COLUMN_VALUE,
		logic: filterLogic.ILIKE,
		negate: true
	},
	{
		value: filterValueConsts.IS_EMPTY,
		selectLabel: t('filters.new.isEmpty'),
		type: filterTypes.SIMPLE_COLUMN_VALUE,
		logic: filterLogic.EQUAL,
		negate: false,
		noPicker: true
	},
	{
		value: filterValueConsts.IS_NOT_EMPTY,
		selectLabel: t('filters.new.isNotEmpty'),
		type: filterTypes.SIMPLE_COLUMN_VALUE,
		logic: filterLogic.NOT_EQUAL,
		negate: false,
		noPicker: true
	}
];

export const numberInputs = [filterLogic.GREATER, filterLogic.LESSER, filterLogic.EQUAL, filterLogic.NOT_EQUAL, filterLogic.GREATER_OR_EQUAL, filterLogic.LESSER_OR_EQUAL];

export const numberFiltersOperations = [
	{
		value: filterValueConsts.GREATER_THAN,
		selectLabel: '\u003E',
		type: filterTypes.SIMPLE_COLUMN_VALUE,
		logic: filterLogic.GREATER,
		negate: false
	},
	{
		value: filterValueConsts.LESS_THAN,
		selectLabel: '\u003C',
		type: filterTypes.SIMPLE_COLUMN_VALUE,
		logic: filterLogic.LESSER,
		negate: false
	},
	{
		value: filterValueConsts.GREATER_THAN_OR_EQUAL,
		selectLabel: '\u2267',
		type: filterTypes.SIMPLE_COLUMN_VALUE,
		logic: filterLogic.GREATER_OR_EQUAL,
		negate: false
	},
	{
		value: filterValueConsts.LESS_THAN_OR_EQUAL,
		selectLabel: '\u2266',
		type: filterTypes.SIMPLE_COLUMN_VALUE,
		logic: filterLogic.LESSER_OR_EQUAL,
		negate: false
	},
	{
		value: filterValueConsts.EQUAL_TO,
		selectLabel: '\u003D',
		type: filterTypes.SIMPLE_COLUMN_VALUE,
		logic: filterLogic.EQUAL,
		negate: false
	},
	{
		value: filterValueConsts.NOT_EQUAL_TO,
		selectLabel: '\u2260',
		type: filterTypes.SIMPLE_COLUMN_VALUE,
		logic: filterLogic.NOT_EQUAL,
		negate: false
	},
	{
		value: filterValueConsts.IS_EMPTY,
		selectLabel: t('filters.new.isEmpty'),
		type: filterTypes.SIMPLE_COLUMN_VALUE,
		logic: filterLogic.EQUAL,
		negate: false,
		noPicker: true
	},
	{
		value: filterValueConsts.IS_NOT_EMPTY,
		selectLabel: t('filters.new.isNotEmpty'),
		type: filterTypes.SIMPLE_COLUMN_VALUE,
		logic: filterLogic.NOT_EQUAL,
		negate: false,
		noPicker: true
	},
	{
		value: filterValueConsts.IN_RANGE,
		selectLabel: t('filters.new.inRange'),
		type: filterTypes.GROUP,
		operator: filterLogic.AND,
		subType: filterTypes.SIMPLE_COLUMN_VALUE,
		logic: [filterLogic.GREATER_OR_EQUAL, filterLogic.LESSER_OR_EQUAL],
		negate: false
	},
	{
		value: filterValueConsts.NOT_IN_RANGE,
		selectLabel: t('filters.new.notInRange'),
		type: filterTypes.GROUP,
		operator: filterLogic.AND,
		subType: filterTypes.SIMPLE_COLUMN_VALUE,
		logic: [filterLogic.GREATER_OR_EQUAL, filterLogic.LESSER_OR_EQUAL],
		negate: true
	}
];

export const dateFiltersOperations = [
	{
		value: filterValueConsts.EQUAL_TO,
		selectLabel: t('filters.new.equalTo'),
		type: filterTypes.SIMPLE_COLUMN_VALUE,
		logic: filterLogic.EQUAL,
		negate: false
	},
	{
		value: filterValueConsts.NOT_EQUAL_TO,
		selectLabel: t('filters.new.notEqualTo'),
		type: filterTypes.SIMPLE_COLUMN_VALUE,
		logic: filterLogic.NOT_EQUAL,
		negate: false
	},
	{
		value: filterValueConsts.IN_RANGE,
		selectLabel: t('filters.new.inRange'),
		type: filterTypes.GROUP,
		operator: filterLogic.AND,
		subType: filterTypes.SIMPLE_COLUMN_VALUE,
		logic: [filterLogic.GREATER_OR_EQUAL, filterLogic.LESSER_OR_EQUAL],
		negate: false
	},
	{
		value: filterValueConsts.NOT_IN_RANGE,
		selectLabel: t('filters.new.notInRange'),
		type: filterTypes.GROUP,
		operator: filterLogic.AND,
		subType: filterTypes.SIMPLE_COLUMN_VALUE,
		logic: [filterLogic.GREATER_OR_EQUAL, filterLogic.LESSER_OR_EQUAL],
		negate: true
	},
	{
		value: filterValueConsts.BEFORE,
		selectLabel: 'before',
		type: filterTypes.SIMPLE_COLUMN_VALUE,
		logic: filterLogic.LESSER,
		negate: false
	},
	{
		value: filterValueConsts.AFTER,
		selectLabel: 'after',
		type: filterTypes.SIMPLE_COLUMN_VALUE,
		logic: filterLogic.GREATER,
		negate: false
	},
	{
		value: filterValueConsts.IS_EMPTY,
		selectLabel: t('filters.new.isEmpty'),
		type: filterTypes.SIMPLE_COLUMN_VALUE,
		logic: filterLogic.EQUAL,
		negate: false,
		noPicker: true
	},
	{
		value: filterValueConsts.IS_NOT_EMPTY,
		selectLabel: t('filters.new.isNotEmpty'),
		type: filterTypes.SIMPLE_COLUMN_VALUE,
		logic: filterLogic.NOT_EQUAL,
		negate: false,
		noPicker: true
	},
	{
		value: filterValueConsts.IN_LAST,
		selectLabel: t('filters.new.inLast'),
		type: filterTypes.SIMPLE_COLUMN_VALUE,
		logic: filterLogic.GREATER,
		negate: false
	},
	{
		value: filterValueConsts.IN_CURRENT,
		selectLabel: t('filters.new.inCurrent'),
		type: filterTypes.SIMPLE_COLUMN_VALUE,
		logic: filterLogic.GREATER,
		negate: false
	}
];

export const lastCurrentDateOptions = (filter: any) => [
	{
		value: filterValueConsts.DAY,
		selectLabel: t('filters.new.day')
	},
	...filter.metadata.value === filterValueConsts.IN_LAST
		? [
			{
				value: filterValueConsts.WEEK,
				selectLabel: t('filters.new.week')
			}
		]
		: [],
	...filter.metadata.value === filterValueConsts.IN_CURRENT
		? [
			{
				value: filterValueConsts.WEEK_US,
				selectLabel: t('filters.new.weekUs')
			}
		]
		: [],
	...filter.metadata.value === filterValueConsts.IN_CURRENT
		? [
			{
				value: filterValueConsts.WEEK_EU,
				selectLabel: t('filters.new.weekEu')
			}
		]
		: [],
	{
		value: filterValueConsts.MONTH,
		selectLabel: t('filters.new.month')
	},
	{
		value: filterValueConsts.YEAR,
		selectLabel: t('filters.new.year')
	}
];

// TODO: This can be used for testing scenarios
export const testFilter = {
	version: 'default/v0',
	postAggregation: [],
	preAggregation: [
		{
			type: 'GROUP',
			clauses: [
				{
					type: 'GROUP',
					negate: false,
					clauses: [
						{
							type: 'SIMPLE-COLUMN-VALUE',
							logic: '>=',
							value: '4',
							columnReference: 'Value'
						},
						{
							type: 'SIMPLE-COLUMN-VALUE',
							logic: '<=',
							value: '5',
							columnReference: 'Value'
						}
					],
					operator: 'AND'
				},
				{
					type: 'GROUP',
					negate: false,
					clauses: [
						{
							type: 'SIMPLE-COLUMN-VALUE',
							logic: '>=',
							value: '0',
							columnReference: 'Value'
						},
						{
							type: 'SIMPLE-COLUMN-VALUE',
							logic: '<=',
							value: '2',
							columnReference: 'Value'
						}
					],
					operator: 'AND'
				}
			],
			operator: 'OR'
		}
	]
};

export const testFilter2 = {
	version: 'default/v0',
	preAggregation: [
		{
			type: 'GROUP',
			operator: 'AND',
			clauses: [
				{
					type: 'SIMPLE-COLUMN-VALUE',
					logic: '>',
					negate: false,
					columnReference: 'Value',
					value: '2'
				},
				{
					type: 'SIMPLE-ARRAY-COLUMN-VALUE',
					negate: false,
					columnReference: 'Name',
					values: [
						'Karci',
						'Jozi',
						'Ard'
					]
				}
			]
		}
	],
	postAggregation: []
};

export const testFilter3 = {
	version: 'default/v0',
	preAggregation: [
		{
			type: 'GROUP',
			operator: 'AND',
			clauses: [
				{
					type: 'SIMPLE-ARRAY-COLUMN-VALUE',
					negate: false,
					columnReference: 'Name',
					values: [
						'Ferdinant',
						'Karci',
						'Erdedy'
					]
				},
				{
					type: 'GROUP',
					operator: 'AND',
					negate: true,
					clauses: [
						{
							type: 'SIMPLE-COLUMN-VALUE',
							logic: '>=',
							columnReference: 'Value',
							value: '1'
						},
						{
							type: 'SIMPLE-COLUMN-VALUE',
							logic: '<=',
							columnReference: 'Value',
							value: '2'
						}
					]
				}
			]
		}
	],
	postAggregation: []
};

export const testFilter4 = {
	version: 'default/v0',
	preAggregation: [
		{
			type: 'GROUP',
			operator: 'AND',
			clauses: [
				{
					type: 'SIMPLE-COLUMN-VALUE',
					logic: '!=',
					negate: false,
					columnReference: 'Value',
					value: '7'
				},
				{
					type: 'GROUP',
					operator: 'AND',
					negate: true,
					clauses: [
						{
							type: 'SIMPLE-COLUMN-VALUE',
							logic: '>=',
							columnReference: 'Date',
							value: '2023-01-26'
						},
						{
							type: 'SIMPLE-COLUMN-VALUE',
							logic: '<=',
							columnReference: 'Date',
							value: '2023-01-26'
						}
					]
				}
			]
		}
	],
	postAggregation: []
};

export const testFilter5 = {
	version: 'default/v0',
	preAggregation: [
		{
			type: 'GROUP',
			operator: 'OR',
			clauses: [
				{
					type: 'GROUP',
					operator: 'AND',
					negate: true,
					clauses: [
						{
							type: 'SIMPLE-COLUMN-VALUE',
							logic: '>=',
							columnReference: 'Value',
							value: '4'
						},
						{
							type: 'SIMPLE-COLUMN-VALUE',
							logic: '<=',
							columnReference: 'Value',
							value: '6'
						}
					]
				},
				{
					type: 'GROUP',
					operator: 'AND',
					negate: false,
					clauses: [
						{
							type: 'SIMPLE-COLUMN-VALUE',
							logic: '>=',
							columnReference: 'Value',
							value: '0'
						},
						{
							type: 'SIMPLE-COLUMN-VALUE',
							logic: '<=',
							columnReference: 'Value',
							value: '1'
						}
					]
				}
			]
		}
	],
	postAggregation: []
};

export const testFilter6 = {
	version: 'default/v0',
	preAggregation: [
		{
			type: 'GROUP',
			operator: 'AND',
			clauses: [
				{
					type: 'GROUP',
					operator: 'AND',
					negate: false,
					clauses: [
						{
							type: 'SIMPLE-COLUMN-VALUE',
							logic: '>=',
							columnReference: 'Value',
							value: '0'
						},
						{
							type: 'SIMPLE-COLUMN-VALUE',
							logic: '<=',
							columnReference: 'Value',
							value: '1'
						}
					]
				},
				{
					type: 'GROUP',
					operator: 'OR',
					clauses: [
						{
							type: 'SIMPLE-COLUMN-VALUE',
							logic: 'LIKE',
							negate: false,
							columnReference: 'Name',
							value: 'Ard'
						},
						{
							type: 'GROUP',
							operator: 'OR',
							clauses: [
								{
									type: 'SIMPLE-COLUMN-VALUE',
									logic: 'LIKE',
									negate: false,
									columnReference: 'Name',
									value: 'Jozi'
								},
								{
									type: 'SIMPLE-COLUMN-VALUE',
									logic: 'LIKE',
									negate: false,
									columnReference: 'Name',
									value: 'Feri'
								}
							]
						}
					]
				}
			]
		}
	],
	postAggregation: []
};

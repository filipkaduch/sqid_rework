import {configuration as configurationBar} from '@/modules/widget/components/widgets/bar/consts';
import {configuration as configurationBarMulti} from '@/modules/widget/components/widgets/barMultiseries/consts';
import {configuration as configurationBubble} from '@/modules/widget/components/widgets/bubble/consts';
import {configuration as configurationLine} from '@/modules/widget/components/widgets/line/consts';
import {configuration as configurationLineMulti} from '@/modules/widget/components/widgets/lineMultiseries/consts';
import {configuration as configurationLineTime} from '@/modules/widget/components/widgets/lineTimeComparison/consts';
import {configuration as configurationCalendar} from '@/modules/widget/components/widgets/calendar/consts';
import {configuration as configurationComparison} from '@/modules/widget/components/widgets/comparison/consts';
import {configuration as configurationCountry} from '@/modules/widget/components/widgets/country/consts';
import {configuration as configurationDatatable} from '@/modules/widget/components/widgets/datatable/consts';
import {configuration as configurationHeatmap} from '@/modules/widget/components/widgets/heatmap/consts';
import {configuration as configurationHexagon} from '@/modules/widget/components/widgets/hexagon/consts';
import {configuration as configurationHistogram} from '@/modules/widget/components/widgets/histogram/consts';
import {configuration as configurationHeatmapMap} from '@/modules/widget/components/widgets/heatmapMap/consts';
import {configuration as configurationScatter} from '@/modules/widget/components/widgets/scatter/consts';
import {configuration as configurationScatterMap} from '@/modules/widget/components/widgets/scatterMap/consts';
import {configuration as configurationSpider} from '@/modules/widget/components/widgets/spider/consts';
import {configuration as configurationSparkline} from '@/modules/widget/components/widgets/sparkline/consts';
import {configuration as configurationSparklinePie} from '@/modules/widget/components/widgets/sparklinePie/consts';
import {configuration as configurationPie} from '@/modules/widget/components/widgets/pie/consts';
import {configuration as configurationArc} from '@/modules/widget/components/widgets/arc/consts';
// @ts-ignore
import {dataWidgets} from '@/util/consts/widgetTypes';

export const widgetDataConfigurations = {
	[dataWidgets.ARC_MAP]: {
		config: configurationArc,
		correct: {
			configuration: {
				version: 'default/v0',
				dimensions: [
					{
						function: 'GEO-POI-GRID',
						longitudeColumnName: 'new_cases',
						latitudeColumnName: 'new_cases',
						zoom: 16,
						column: 'total_cases'
					},
					{
						function: 'GEO-POI-GRID',
						longitudeColumnName: 'new_cases_smoothed',
						latitudeColumnName: 'new_cases',
						zoom: 16,
						column: 'new_cases'
					}
				],
				metrics: [
					{
						aggregation: 'SUM',
						longitudeColumnName: 'new_cases',
						latitudeColumnName: 'new_cases',
						zoom: 16,
						column: 'total_cases'
					}
				],
				limit: 1000,
				orderBy: [],
				lastValueColumn: false
			},
			datasetId: '0a2267fd-a1ac-4d9d-98e7-2fec4e36be2a'
		}
	},
	[dataWidgets.DATA_TABLE]: {
		config: configurationDatatable,
		correct: {
			configuration: {
				version: 'default/v0',
				dimensions: [
					{
						function: 'NO-CHANGE',
						column: 'iso_code'
					}
				],
				metrics: [
					{
						aggregation: 'SUM',
						column: 'total_cases'
					}
				],
				limit: 10,
				orderBy: [],
				lastValueColumn: false
			},
			datasetId: '0a2267fd-a1ac-4d9d-98e7-2fec4e36be2a'
		}
	},
	[dataWidgets.BAR_CHART]: {
		config: configurationBar,
		correct: {
			configuration: {
				version: 'default/v0',
				dimensions: [
					{
						function: 'NO-CHANGE',
						column: 'iso_code'
					}
				],
				metrics: [
					{
						aggregation: 'SUM',
						column: 'total_cases'
					}
				],
				limit: 10,
				orderBy: [],
				lastValueColumn: false
			},
			datasetId: '0a2267fd-a1ac-4d9d-98e7-2fec4e36be2a'
		}
	},
	[dataWidgets.BAR_MULTISERIES]: {
		config: configurationBarMulti,
		correct: {
			configuration: {
				version: 'default/v0',
				dimensions: [
					{
						function: 'NO-CHANGE',
						column: 'iso_code'
					},
					{
						function: 'NO-CHANGE',
						topValues: {
							count: 10,
							direction: 'ASC'
						},
						column: 'continent'
					}
				],
				metrics: [
					{
						aggregation: 'SUM',
						column: 'total_cases'
					}
				],
				limit: 10,
				orderBy: [],
				lastValueColumn: false
			},
			datasetId: '0a2267fd-a1ac-4d9d-98e7-2fec4e36be2a'
		}
	},
	[dataWidgets.BUBBLE_CHART]: {
		config: configurationBubble,
		correct: {
			configuration: {
				version: 'default/v0',
				dimensions: [
					{
						function: 'NO-CHANGE',
						column: 'iso_code'
					},
					{
						function: 'NO-CHANGE',
						column: 'continent'
					}
				],
				metrics: [
					{
						aggregation: 'SUM',
						column: 'total_cases'
					}
				],
				limit: 10,
				orderBy: [],
				lastValueColumn: false
			},
			datasetId: '0a2267fd-a1ac-4d9d-98e7-2fec4e36be2a'
		}
	},
	[dataWidgets.CALENDAR_HEATMAP]: {
		config: configurationCalendar,
		correct: {
			configuration: {
				version: 'default/v0',
				dimensions: [
					{
						function: 'NO-CHANGE',
						column: 'date'
					}
				],
				metrics: [
					{
						aggregation: 'SUM',
						column: 'total_cases'
					}
				],
				limit: 20,
				orderBy: [
					{
						columnAlias: 'Dimension1',
						order: 'ASC'
					}
				],
				lastValueColumn: false
			},
			datasetId: '0a2267fd-a1ac-4d9d-98e7-2fec4e36be2a'
		}
	},
	[dataWidgets.CATEGORY_BAR]: {
		config: configurationBar,
		correct: {
			configuration: {
				version: 'default/v0',
				dimensions: [
					{
						function: 'NO-CHANGE',
						column: 'iso_code'
					}
				],
				metrics: [
					{
						aggregation: 'SUM',
						column: 'total_cases'
					}
				],
				limit: 10,
				orderBy: [],
				lastValueColumn: false
			},
			datasetId: '0a2267fd-a1ac-4d9d-98e7-2fec4e36be2a'
		}
	},
	[dataWidgets.COMPARISON_CHART]: {
		config: configurationComparison,
		correct: {
			configuration: {
				version: 'default/v0',
				dimensions: [
					{
						function: 'NO-CHANGE',
						column: 'iso_code'
					}
				],
				metrics: [
					{
						aggregation: 'SUM',
						column: 'total_cases'
					}
				],
				limit: 3,
				orderBy: [],
				lastValueColumn: false
			},
			datasetId: '0a2267fd-a1ac-4d9d-98e7-2fec4e36be2a'
		}
	},
	[dataWidgets.PIE_CHART]: {
		config: configurationPie,
		correct: {
			configuration: {
				version: 'default/v0',
				dimensions: [
					{
						function: 'NO-CHANGE',
						column: 'iso_code'
					}
				],
				metrics: [
					{
						aggregation: 'SUM',
						column: 'total_cases'
					}
				],
				limit: 10,
				orderBy: [],
				lastValueColumn: false
			},
			datasetId: '0a2267fd-a1ac-4d9d-98e7-2fec4e36be2a'
		}
	},
	[dataWidgets.HEATMAP_CHART]: {
		config: configurationHeatmap,
		correct: {
			configuration: {
				version: 'default/v0',
				dimensions: [
					{
						function: 'NO-CHANGE',
						column: 'date'
					},
					{
						function: 'NO-CHANGE',
						column: 'iso_code'
					}
				],
				metrics: [
					{
						aggregation: 'SUM',
						column: 'total_cases'
					}
				],
				limit: 10,
				orderBy: [],
				lastValueColumn: false
			},
			datasetId: '0a2267fd-a1ac-4d9d-98e7-2fec4e36be2a'
		}
	},
	[dataWidgets.LINE_CHART]: {
		config: configurationLine,
		correct: {
			configuration: {
				version: 'default/v0',
				dimensions: [
					{
						function: 'NO-CHANGE',
						column: 'iso_code'
					}
				],
				metrics: [
					{
						aggregation: 'SUM',
						column: 'total_cases'
					}
				],
				limit: 10,
				orderBy: [],
				lastValueColumn: false
			},
			datasetId: '0a2267fd-a1ac-4d9d-98e7-2fec4e36be2a'
		}
	},
	[dataWidgets.LINE_MULTISERIES]: {
		config: configurationLineMulti,
		correct: {
			configuration: {
				version: 'default/v0',
				dimensions: [
					{
						function: 'NO-CHANGE',
						column: 'iso_code'
					},
					{
						function: 'NO-CHANGE',
						topValues: {
							count: 10,
							direction: 'ASC'
						},
						column: 'continent'
					}
				],
				metrics: [
					{
						aggregation: 'SUM',
						column: 'total_cases'
					}
				],
				limit: 10,
				orderBy: [],
				lastValueColumn: false
			},
			datasetId: '0a2267fd-a1ac-4d9d-98e7-2fec4e36be2a'
		}
	},
	[dataWidgets.LINE_COMPARISON]: {
		config: configurationLineTime,
		correct: {
			configuration: {
				version: 'default/v0',
				dimensions: [
					{
						function: 'NO-CHANGE',
						column: 'date'
					}
				],
				metrics: [
					{
						aggregation: 'SUM',
						column: 'total_cases'
					}
				],
				limit: 10,
				orderBy: [],
				lastValueColumn: false
			},
			datasetId: '0a2267fd-a1ac-4d9d-98e7-2fec4e36be2a'
		}
	},
	[dataWidgets.COUNTRY_MAP_NEW]: {
		config: configurationCountry,
		correct: {
			configuration: {
				version: 'default/v0',
				dimensions: [
					{
						function: 'NO-CHANGE',
						column: 'iso_code'
					}
				],
				metrics: [
					{
						aggregation: 'SUM',
						column: 'total_cases'
					}
				],
				limit: 10,
				orderBy: [],
				lastValueColumn: false
			},
			datasetId: '0a2267fd-a1ac-4d9d-98e7-2fec4e36be2a'
		}
	},
	[dataWidgets.HEATMAP_MAP]: {
		config: configurationHeatmapMap,
		correct: {
			configuration: {
				version: 'default/v0',
				dimensions: [
					{
						function: 'GEO-POI-GRID',
						longitudeColumnName: 'new_cases',
						latitudeColumnName: 'new_cases',
						zoom: 16,
						column: 'total_cases'
					}
				],
				metrics: [
					{
						aggregation: 'SUM',
						longitudeColumnName: 'new_cases',
						latitudeColumnName: 'new_cases',
						zoom: 16,
						column: 'total_cases'
					}
				],
				limit: 5000,
				orderBy: [],
				lastValueColumn: false
			},
			datasetId: '0a2267fd-a1ac-4d9d-98e7-2fec4e36be2a'
		}
	},
	[dataWidgets.HEXAGON_MAP]: {
		config: configurationHexagon,
		correct: {
			configuration: {
				version: 'default/v0',
				dimensions: [
					{
						function: 'GEO-POI-GRID',
						longitudeColumnName: 'new_cases',
						latitudeColumnName: 'new_cases',
						zoom: 16,
						column: 'total_cases'
					}
				],
				metrics: [
					{
						aggregation: 'SUM',
						longitudeColumnName: 'new_cases',
						latitudeColumnName: 'new_cases',
						zoom: 16,
						column: 'total_cases'
					}
				],
				limit: 1000,
				orderBy: [],
				lastValueColumn: false
			},
			datasetId: '0a2267fd-a1ac-4d9d-98e7-2fec4e36be2a'
		}
	},
	[dataWidgets.HISTOGRAM]: {
		config: configurationHistogram,
		correct: {
			configuration: {
				version: 'default/v0',
				dimensions: [
					{
						numberOfBuckets: 10,
						function: 'BUCKET-VALUE',
						column: 'total_cases'
					}
				],
				metrics: [],
				limit: 10,
				orderBy: [],
				lastValueColumn: false
			},
			datasetId: '0a2267fd-a1ac-4d9d-98e7-2fec4e36be2a'
		}
	},
	[dataWidgets.SCATTER_CHART]: {
		config: configurationScatter,
		correct: {
			configuration: {
				version: 'default/v0',
				dimensions: [
					{
						function: 'NO-CHANGE',
						column: 'iso_code'
					},
					{
						function: 'NO-CHANGE',
						column: 'continent'
					}
				],
				metrics: [],
				limit: 10,
				orderBy: [],
				lastValueColumn: false
			},
			datasetId: '0a2267fd-a1ac-4d9d-98e7-2fec4e36be2a'
		}
	},
	[dataWidgets.SCATTER_MAP]: {
		config: configurationScatterMap,
		correct: {
			configuration: {
				version: 'default/v0',
				dimensions: [
					{
						function: 'GEO-POI-GRID',
						longitudeColumnName: 'new_cases',
						latitudeColumnName: 'new_cases',
						zoom: 16,
						column: 'total_cases'
					}
				],
				metrics: [
					{
						aggregation: 'SUM',
						longitudeColumnName: 'new_cases',
						latitudeColumnName: 'new_cases',
						zoom: 16,
						column: 'total_cases'
					}
				],
				limit: 1000,
				orderBy: [],
				lastValueColumn: false
			},
			datasetId: '0a2267fd-a1ac-4d9d-98e7-2fec4e36be2a'
		}
	},
	[dataWidgets.SPARKLINE]: {
		config: configurationSparkline,
		correct: {
			configuration: {
				version: 'default/v0',
				dimensions: [
					{
						function: 'NO-CHANGE',
						column: 'iso_code'
					},
					{
						function: 'NO-CHANGE',
						column: 'continent'
					}
				],
				metrics: [
					{
						aggregation: 'SUM',
						column: 'total_cases'
					}
				],
				limit: 10,
				orderBy: [],
				lastValueColumn: false
			},
			datasetId: '0a2267fd-a1ac-4d9d-98e7-2fec4e36be2a'
		}
	},
	[dataWidgets.SPARKLINE_PIE]: {
		config: configurationSparklinePie,
		correct: {
			configuration: {
				version: 'default/v0',
				dimensions: [
					{
						function: 'NO-CHANGE',
						topValues: {
							count: 10,
							direction: 'ASC'
						},
						column: 'iso_code'
					}
				],
				metrics: [
					{
						aggregation: 'SUM',
						column: 'total_cases'
					}
				],
				limit: 10,
				orderBy: [],
				lastValueColumn: false
			},
			datasetId: '0a2267fd-a1ac-4d9d-98e7-2fec4e36be2a'
		}
	},
	[dataWidgets.SPIDER_CHART]: {
		config: configurationSpider,
		correct: {
			configuration: {
				version: 'default/v0',
				dimensions: [
					{
						function: 'NO-CHANGE',
						column: 'iso_code'
					}
				],
				metrics: [
					{
						aggregation: 'SUM',
						column: 'total_cases'
					}
				],
				limit: 10,
				orderBy: [],
				lastValueColumn: false
			},
			datasetId: '0a2267fd-a1ac-4d9d-98e7-2fec4e36be2a'
		}
	}
};

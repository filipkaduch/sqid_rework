/* eslint-disable camelcase */
import {storyType as storyTypes} from '@/modules/story/consts/storyType';
import themes from '@/util/themes';
import {widgetTypes} from '@/util/consts/widgetTypes';
import i18n from '@/plugins/i18n';
const {t} = i18n.global;
import {SelectItem} from '@/components/main/Dropdown/types';
import {
	dateFormatOptionsFormatted,
	formatOptionsFormatted
} from '@/modules/widget/components/widget-controls/consts/formatOptions';
import {Attribute} from '@/modules/explorer/store/dataExplore';
import {dataTypes, isDataType, isFormattable, bucketing, dimensionDefinition, extracting} from '@/util/queryBuilder';
import {chartConstants} from '@/util/consts/chartsConstants';
import isEqual from 'lodash/isEqual';
import {FormatOption} from '@/modules/widget/components/widget-controls/consts/formatTypes';
import {componentTypesEnums} from '@/util/consts/componentTypes';

export const filterTab = 'FILTER';
export const attributeTab = 'ATTRIBUTE';
export const chartPropertiesTab = 'CHART_PROPERTIES';
export const closeTab = 'CLOSE';
export const explorationReport = 'REPORT';
export const explorationData = 'DATA';

export const settingBarTabs = [
	{name: 'Attributes', key: attributeTab, icon: 'ds-icon-attribute', tooltip: t('explorer.attributes')},
	{name: 'Filters', key: filterTab, icon: 'ds-icon-filter', tooltip: t('explorer.filters')},
	{name: 'Chart', key: chartPropertiesTab, icon: 'ds-icon-graph-settings', tooltip: t('explorer.vizProps')}
];

export const widgetDefaultConfig = {
	widgetConfiguration: {
		version: 'default/v0'
	},
	widgetType: widgetTypes.BAR_CHART,
	dataConfigurations: [] as any,
	filters: {
		version: 'default/v1'
	},
	layoutConfiguration: {
		version: 'default/v0',
		size: {
			width: 1,
			height: 1
		},
		position: {
			x: 0,
			y: 0,
			z: 0
		},
		rotation: 0
	}
};
export const sectionDefaultConfig = {
	name: '',
	configuration: {
		version: 'default/v0'
	},
	layoutConfiguration: {
		version: 'default/v0'
	},
	atIndex: 0
};
export const exploreDefaultConfig = {
	name: 'My exploration',
	storyType: storyTypes.DATA_EXPLORE,
	layoutConfiguration: {
		version: 'default/v0',
		theme: themes[0]
	},
	configuration: {
		version: 'default/v0'
	}
};

export const dropzoneDimensionRowActions = (column: Attribute, showChangeColor: Boolean = false) => {
	const actions = [
		{
			label: t('rowActions.renameDimension'),
			value: 'renameDimension',
			icon: 'icon-pencil'
		},
		{
			label: t('rowActions.changeColor'),
			value: 'changeColor'
		}
	] as SelectItem[];

	if (!showChangeColor) {
		return actions.filter((item) => item.value !== 'changeColor');
	}
	return actions;
};

// eslint-disable-next-line complexity
export const dropzoneColumnActions = (column: Attribute, showColorChangeOption: boolean = true) => {
	const actions = [
		{
			label: column.selected === chartConstants.dataConfiguration.METRIC
				? t('columnActions.removeMetric')
				: t('columnActions.removeDimension'),
			value: 'remove',
			properties: {
				extraPadding: true,
				color: 'error-500'
			}
		}
	] as SelectItem[];

	if (column.selected === chartConstants.dataConfiguration.METRIC) {
		if (showColorChangeOption) {
			actions.unshift({
				label: t('columnActions.changeColor'),
				value: 'color',
				properties: {
					extraPadding: true,
					tooltipText: t('explorer.tooltips.colorMetric')
				}
			});
		}
		actions.unshift({
			label: t('columnActions.renameMetric'),
			value: 'renameMetric',
			properties: {
				extraPadding: true,
				hideBorder: true,
				tooltipText: t('explorer.tooltips.renameMetric')
			}
		});
		if (column.selected === chartConstants.dataConfiguration.METRIC && isFormattable(column.selected, column.type)) {
			actions.unshift({
				label: t('t_format'),
				value: 'format',
				...(column?.selectedFormat ? {icon: 'ds-icon-checkmark', smallIcon: true} : {}),
				properties: {
					tooltipText: t('explorer.tooltips.metricFormat'),
					submenu: 'format',
					submenuType: 'select',
					clearBtnText: t('t_Remove'),
					clearBtnIcon: 'ds-icon-minus-circle',
					submenuItems: formatOptionsFormatted.map((option: FormatOption) => ({
						...option,
						...(isEqual(option.value, column.selectedFormat) ? {selected: column?.selectedFormat} : {})
					})),
					submenuGroups: [t('numberFormat.currencyFormat'), t('numberFormat.numberFormat')]
				}
			});
		}
	}

	if (column.selected === chartConstants.dataConfiguration.DIMENSION && isFormattable(column.selected, column.type)) {
		if (isDataType(dataTypes.DATE_TYPE, column.type)) {
			actions.unshift({
				label: t('t_format'),
				value: 'format',
				...(column?.selectedFormat ? {icon: 'ds-icon-checkmark', smallIcon: true} : {}),
				properties: {
					tooltipText: t('explorer.tooltips.dateFormat'),
					submenu: 'format',
					submenuType: 'select',
					submenuGroups: [t('dateFormat.dateFormatting')],
					clearBtnText: t('t_Remove'),
					clearBtnIcon: 'ds-icon-minus-circle',
					submenuItems: dateFormatOptionsFormatted.map((option: FormatOption) => ({
						...option,
						group: t('dateFormat.dateFormatting'),
						...(isEqual(option.value, column.selectedFormat) ? {selected: column?.selectedFormat} : {})
					}))
				}
			});
		} else if (isDataType(dataTypes.NUMBER, column.type)) {
			actions.unshift({
				label: t('t_format'),
				value: 'format',
				...(column.function === dimensionDefinition.BUCKET_VALUE ? {disabled: true} : {}),
				...(column?.selectedFormat ? {icon: 'ds-icon-checkmark', smallIcon: true} : {}),
				properties: {
					tooltipText: t('explorer.tooltips.numberFormat'),
					submenu: 'format',
					submenuType: 'select',
					clearBtnText: t('t_Remove'),
					clearBtnIcon: 'ds-icon-minus-circle',
					submenuItems: formatOptionsFormatted.map((option: FormatOption) => ({
						...option,
						...(isEqual(option.value, column.selectedFormat) ? {selected: column?.selectedFormat} : {})
					})),
					submenuGroups: [t('numberFormat.currencyFormat'), t('numberFormat.numberFormat')]
				}
			});
		}
	}
	if (chartConstants.dataConfiguration.METRIC === column.selected && column.aggregations) {
		actions.unshift({
			label: t('explorer.dropZone.aggregation'),
			value: 'aggregation',
			...(column?.aggregation ? {icon: 'ds-icon-checkmark', smallIcon: true} : {}),
			properties: {
				tooltipText: t('explorer.tooltips.aggregation'),
				submenu: 'aggregation',
				submenuType: 'select',
				clearBtn: false,
				submenuGroups: [t('explorer.dropZone.aggregation')],
				submenuItems: column?.aggregations?.map((submenuItem: any) => ({
					...submenuItem,
					...(submenuItem.value === column.aggregation ? {selected: submenuItem.value} : {}),
					group: t('explorer.dropZone.aggregation')
				}))
			}
		});
	}

	if (isDataType(dataTypes.DATE_TYPE, column.type) && column.selected === chartConstants.dataConfiguration.DIMENSION) {
		actions.unshift({
			label: t('t_Extracting'),
			value: 'extract',
			...(column?.function === dimensionDefinition.EXTRACT_DATE ? {icon: 'ds-icon-checkmark', smallIcon: true} : {}),
			properties: {
				tooltipText: t('explorer.tooltips.extracting'),
				submenu: 'extract',
				submenuType: 'select',
				clearBtnText: t('t_Remove'),
				clearBtnIcon: 'ds-icon-minus-circle',
				submenuGroups: [t('t_Extracting')],
				submenuItems: Object.values(extracting)?.map((extract: any) => ({
					value: {
						bucketsDatetime: extract,
						function: dimensionDefinition.EXTRACT_DATE
					},
					...(extract === column.bucketsDatetime ? {selected: extract} : {}),
					selectLabel: t(`t_extract_${extract}`),
					group: t('t_Extracting')
				})).filter((val: any) => val.value.bucketsDatetime !== null)
			}
		});
		actions.unshift({
			label: t('t_Bucketing'),
			value: 'bucketing',
			selected: column.function === dimensionDefinition.BUCKET_DATE,
			...(column.function === dimensionDefinition.BUCKET_DATE ? {icon: 'ds-icon-checkmark', smallIcon: true} : {}),
			properties: {
				hideBorder: true,
				tooltipText: t('explorer.tooltips.bucketing'),
				submenu: 'bucketing',
				submenuType: 'select',
				submenuGroups: [t('t_Bucketing')],
				clearBtnText: t('t_Remove'),
				clearBtnIcon: 'ds-icon-minus-circle',
				submenuItems: Object.values(bucketing)?.map((bucket: any) => ({
					selectLabel: t(`t_bucket_${bucket}`),
					value: {
						bucketsDatetime: bucket,
						function: dimensionDefinition.BUCKET_DATE
					},
					...(bucket === column.bucketsDatetime ? {selected: bucket} : {}),
					group: t('t_Bucketing')
				})).filter((val: any) => val.value.bucketsDatetime !== null)
			}
		});
	}

	if (isDataType(dataTypes.NUMBER, column.type) && column.selected === chartConstants.dataConfiguration.DIMENSION) {
		actions.unshift({
			label: t('t_BucketCount'),
			value: 'numberOfBuckets',
			...(column.function === dimensionDefinition.BUCKET_VALUE ? {icon: 'ds-icon-checkmark', smallIcon: true} : {}),
			properties: {
				tooltipText: t('explorer.tooltips.numberOfBuckets'),
				submenu: 'numberOfBuckets',
				submenuType: 'component',
				submenuComponentProps: {
					selectedColumn: column,
					componentType: componentTypesEnums.EXPLORER,
					min: 0
				},
				submenuComponent: 'column-select-number'
			}
		});
	}

	return actions;
};

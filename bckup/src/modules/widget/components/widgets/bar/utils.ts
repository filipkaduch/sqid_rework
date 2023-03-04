/* eslint-disable no-invalid-this */
import {chartConstants} from '@/util/consts/chartsConstants';
import {getFormatter} from '@/util/formatingUtil';
import {
	getEchartAxisType,
	createSelectedLegend,
	getSelectedLegend, getAlias
} from '@/util/echartsWidgetsUtil';
import box from '@/assets/box-icon.svg';
import checkBox from '@/assets/checkbox-icon.svg';
import {getMetricAlias} from '@/util/widgetData';
import {widgetOptionName} from '@/util/consts/widgetOptionsNames';
import {cloneDeep} from 'lodash';
import {labelRotateHandle} from '@/modules/widget/echartsWidgetControls';
import {getXYaxisGrid} from '@/modules/widget/utils/widget';

export default class BarChartService {
	metricFormatter = null as any;

	columnXFormatter = null as any;

	optionsFormatter = null as any;

	dimensionType = null as any;

	axisPointerOption = {
		show: true,
		z: -1,
		type: 'shadow',
		label: {
			show: false
		},
		shadowStyle: {
			color: '#F6F8F9'
		}
	};

	constructor(data: any, configuration: any, context: any) {
		this.dimensionType = getEchartAxisType(data.columns[context.indexes.Dimension1?.index]?.dataType);
		this.metricFormatter = getFormatter(
			data.columns[context.indexes.Metric1?.index]?.dataType,
			'metric',
			'metric',
			configuration?.options?.enums,
			configuration?.options?.selectedFormat,
			{
				shortLabel: configuration?.options?.xAxisShortLabel,
				maxLength: configuration?.options?.xAxisNumberOfCharacter
			}
		);

		this.columnXFormatter = getFormatter(
			data.columns[context.indexes.Dimension1?.index]?.dataType,
			'dimension0',
			'xAxis',
			configuration?.options?.enums,
			configuration?.options?.selectedFormat,
			{tooltip: true}
		);

		this.optionsFormatter = getFormatter(
			data.columns[context.indexes.Dimension1?.index]?.dataType,
			'dimension0',
			'xAxis',
			configuration?.options?.enums,
			configuration?.options?.selectedFormat,
			{
				shortLabel: configuration?.options?.xAxisShortLabel,
				maxLength: configuration?.options?.xAxisNumberOfCharacter
			}
		);
	}

	getTitle = () => ({
		textStyle: {
			color: '#36363A',
			fontSize: 32
		}
	});

	getGrid = (configuration: any) => {
		const options = configuration?.options;
		return getXYaxisGrid(options, configuration?.data?.configuration?.timeline);
	};

	getLabel = (configuration: any) => {
		const options = configuration?.options;
		const getValue = (params: any, horizontal: boolean, stackCount = false) => {
			if (stackCount) {
				// find hidden indexes for the purpose of clean percentage calculation in stack to max option
				const copiedParams = cloneDeep(params.value.slice(1));
				for (const hiddenIndex of Object.keys(options.selectedLegend)) {
					if (!options.selectedLegend[hiddenIndex]) {
						copiedParams.splice((parseInt(hiddenIndex, 10) - 1), 1);
					}
				}
				return copiedParams.reduce((val1: number, val2: number) => val1 + val2, 0);
			}
			if (horizontal) {
				return params.value[params.encode.x[0]];
			}
			return params.value[params.encode.y[0]];
		};
		const getColor = (optionsSetting: any) => {
			let color = null;
			if ([chartConstants.chartConst.INSIDE, chartConstants.chartConst.INSIDE_RIGHT, chartConstants.chartConst.INSIDE_LEFT].includes(optionsSetting?.labelPosition)) {
				color = 'white';
			} else if (optionsSetting?.stackedLabelSum && optionsSetting?.stacked) {
				color = 'black';
			}
			return color;
		};
		return {
			show: options?.showLabel,
			position: options?.labelPosition,
			rotate: options?.horizontal ? 0 : options?.labelRotate === chartConstants.chartConst.VERTICAL || options?.labelRotate === true ? 90 : 0,
			valueAnimation: true,
			// eslint-disable-next-line array-element-newline
			color: getColor(options),
			formatter: (params: any) => {
				if (params.encode) {
					return this.metricFormatter(getValue(params, options?.horizontal, options?.stackedLabelSum && options?.stacked));
				}
				return '';
			}
		};
	};

	getTooltip = (configuration: any, context: any) => ({
		trigger: 'item',
		formatter: (params: any) => {
			const name = params.length >= 1 ? params[0].name : params.name;
			const paramsArray = params.length >= 1 ? params : [params];
			const metrics = {...configuration?.data?.configuration};
			const enums = {...configuration?.options};
			return `${this.columnXFormatter(name)}<br>
		${paramsArray.map((param: any) => `${param.marker}${getMetricAlias(param.seriesIndex, metrics, enums, context)}:${
			this.metricFormatter(param.value[configuration?.options?.horizontal ? param.encode.x[0] : param.encode.y[0]])}`)
			.join('<br>')}`;
		}
	});

	getYAxis = (configuration: any) => {
		const options = configuration?.options;
		return {
			...(options?.horizontal ? {type: 'category'} : {type: 'value'}),
			inverse: options?.horizontal,
			splitLine: {
				lineStyle: {
					type: 'dashed',
					color: chartConstants.colors.split
				}
			},
			axisLabel: {
				color: '#808189',
				margin: 24,
				fontSize: 28,
				formatter: options?.horizontal
					? this.optionsFormatter
					: this.metricFormatter,
				valueAnimation: true
			},
			...(options?.horizontal
				? {
					axisLine: {
						show: true,
						lineStyle: {
							type: 'solid',
							color: chartConstants.colors.axis
						}
					},
					axisPointer: this.axisPointerOption
				}
				: {}),
			...(options?.limitRange
				? options?.horizontal ? {max: null, min: null} : {max: options?.gridBorder?.gridRight, min: options?.gridBorder?.gridLeft}
				: {}),
			animationDuration: 0,
			animationDurationUpdate: 300
		};
	};

	getXAxis = (configuration: any) => {
		const options = configuration?.options;
		return {
			...(options?.horizontal ? {type: 'value'} : {type: 'category'}),
			axisTick: {
				alignWithLabel: options?.tickAlignWithLabel
			},
			axisLabel: {
				color: '#67686F',
				margin: configuration?.data?.configuration?.timeline ? 12 : 24,
				fontSize: 28,
				rotate: labelRotateHandle(options?.labelRotate),
				formatter: options?.horizontal
					? this.metricFormatter
					: this.optionsFormatter
			},
			...(options?.horizontal
				? {
					axisLine: false,
					splitLine: {
						lineStyle: {
							type: 'dashed',
							color: chartConstants.colors.split
						}
					}
				}
				: {
					axisLine: {
						lineStyle: {
							color: chartConstants.colors.axis
						}
					},
					axisPointer: this.axisPointerOption
				}
			),
			max: options?.horizontal ? options?.gridBorder?.gridRight : null,
			min: options?.horizontal ? options?.gridBorder?.gridLeft : null
		};
	};

	// eslint-disable-next-line max-lines-per-function
	getLegend = (configuration: any, context: any) => {
		const options = configuration?.options;
		let selectedLegend: any = null;
		const {metrics} = configuration.data.configuration;
		const {enums} = options;

		if (options.selectedLegend
			&& Object.keys(options.selectedLegend).length !== 0
			&& metrics.length === Object.keys(options.selectedLegend).length) {
			// eslint-disable-next-line prefer-destructuring
			selectedLegend = options.selectedLegend;
		} else {
			selectedLegend = createSelectedLegend(metrics, true, true);
		}
		const selectedIndex = getSelectedLegend(selectedLegend);
		const padding = configuration?.data?.configuration?.timeline ? 12 : 25;

		return {
			formatter: (params: any) => getAlias(metrics, params, enums, context),
			itemGap: 32,
			itemHeight: 16,
			itemWidth: 16,
			...(options?.legendPosition === chartConstants.chartConst.BOTTOM && {padding: [0, 0, padding, 0]}),
			data: metrics.map((metric: any, index: number) => ({
				name: (index + 1).toString(),
				// @ts-ignore
				icon: `image://${window.location.protocol}//${window.location.host}${selectedIndex.includes((index + 1).toString()) ? checkBox : box}`,
				textStyle: {
					color: context.colors?.coloring?.[`metric${index}`] ?? context.colors.theme[index]
				}
			})),
			type: chartConstants.chartConst.SCROLL,
			selected: selectedLegend,
			show: options?.showLegend,
			top: [
				chartConstants.chartConst.LEFT,
				chartConstants.chartConst.RIGHT
			].includes(options?.legendPosition)
				? chartConstants.chartConst.MIDDLE
				: options?.legendPosition,
			left: options?.legendPosition === chartConstants.chartConst.BOTTOM
				? chartConstants.chartConst.CENTER
				: options?.legendPosition,
			orient: options?.legendPosition === chartConstants.chartConst.BOTTOM
				? chartConstants.chartConst.HORIZONTAL
				: chartConstants.chartConst.VERTICAL
		};
	};

	getSeries = (configuration: any, context: any, series: any) => series.map((item: any, index: number) => {
		const options = configuration?.options;
		const result = cloneDeep(item);
		result.stack = options?.stacked;
		result.barWidth = configuration?.data?.configuration?.metrics.length > 1 ? '' : configuration?.options?.barGap ? '82%' : '';
		result.barCategoryGap = options?.barGap ? null : '0';
		result.barGap = options?.barGap ? null : '0';
		if (options?.stackedLabelSum && options?.showLabel && options?.stacked) {
			// check for de-selected legend and in that case move stacked sum label to another available bar
			const availableIndexes = [];
			const selectedLegendKeys = Object.keys(configuration.options.selectedLegend);
			for (const availableIndex of selectedLegendKeys) {
				if (configuration.options.selectedLegend[availableIndex]) {
					availableIndexes.push(parseInt(availableIndex, 10));
				}
			}
			if (availableIndexes.length === selectedLegendKeys.length) {
				result.label = {
					show: index === series.length - 1,
					position: options?.horizontal ? chartConstants.chartConst.RIGHT : chartConstants.chartConst.TOP
				};
			} else {
				result.label = {
					show: (Math.max(...availableIndexes) - 1) === index,
					position: options?.horizontal ? chartConstants.chartConst.RIGHT : chartConstants.chartConst.TOP
				};
			}
		}
		result.labelLayout = {
			hideOverlap: true
		};
		result.encode = {
			x: options?.horizontal ? index + 1 : 0,
			y: options?.horizontal ? 0 : index + 1
		};
		return result;
	});

	// eslint-disable-next-line max-lines-per-function
	changeOptions = (optionName: string, options: any, configuration: any, context: any) => {
		const isTimeline = context.indexes?.Timeline?.index > -1;
		const chartOptions = {...options};
		switch (optionName) {
			case widgetOptionName.HORIZONTAL:
				chartOptions.tooltip = this.getTooltip(configuration, context);
				chartOptions.label = this.getLabel(configuration);
				chartOptions.xAxis = this.getXAxis(configuration);
				chartOptions.yAxis = this.getYAxis(configuration);
				break;
			case widgetOptionName.SHOW_LEGEND:
				chartOptions.grid = this.getGrid(configuration);
				chartOptions.legend = this.getLegend(configuration, context);
				break;
			case widgetOptionName.LABEL_ROTATE:
				chartOptions.label = this.getLabel(configuration);
				chartOptions.xAxis = this.getXAxis(configuration);
				chartOptions.yAxis = this.getYAxis(configuration);
				break;
			case widgetOptionName.TICK_ALIGN_WITH_LABEL:
			case widgetOptionName.GRID_BORDER:
			case widgetOptionName.X_AXIS_SHORT_LABEL:
			case widgetOptionName.X_AXIS_NUMBER_OF_CHARACTERS:
				chartOptions.xAxis = this.getXAxis(configuration);
				chartOptions.yAxis = this.getYAxis(configuration);
				break;
			case widgetOptionName.LEGEND_POSITION:
				chartOptions.grid = this.getGrid(configuration);
				chartOptions.legend = this.getLegend(configuration, context);
				break;
			case widgetOptionName.TITLE:
			case widgetOptionName.LEGEND_GRID_WIDTH:
				chartOptions.grid = this.getGrid(configuration);
				break;
			case widgetOptionName.SHOW_LABEL:
			case widgetOptionName.LABEL_POSITION:
				chartOptions.label = this.getLabel(configuration);
				break;
			case widgetOptionName.SELECTED_LEGEND:
				chartOptions.legend = this.getLegend(configuration, context);
				break;

			case widgetOptionName.STACKED:
			case widgetOptionName.BAR_GAP:
				if (!isTimeline) {
					chartOptions.series = this.getSeries(configuration, context, chartOptions.series);
				}
				break;
			case widgetOptionName.STACKED_LABEL_SUM:
				chartOptions.series = this.getSeries(configuration, context, chartOptions.series);
				chartOptions.label = this.getLabel(configuration);
				break;
			default:
				break;
		}
		return chartOptions;
	};
}

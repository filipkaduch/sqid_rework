/* eslint-disable no-invalid-this */
import {chartConstants} from '@/util/consts/chartsConstants';
import {getFormatter} from '@/util/formatingUtil';
import {
	getEchartAxisType,
	createSelectedLegend,
	getSelectedLegend
} from '@/util/echartsWidgetsUtil';
import box from '@/assets/box-icon.svg';
import checkBox from '@/assets/checkbox-icon.svg';
import {widgetOptionName} from '@/util/consts/widgetOptionsNames';
import {cloneDeep} from 'lodash';
import {labelRotateHandle} from '@/modules/widget/echartsWidgetControls';
import {getXYaxisGrid} from '@/modules/widget/utils/widget';


export default class BarMultiSeriesService {
	metricFormatter = null as any;

	columnXFormatter = null as any;

	columnYFormatter = null as any;

	optionsFormatter = null as any;

	dimensionType = null as any;

	axisPointerOption = {
		axisPointer: {
			show: true,
			z: -1,
			type: 'shadow',
			label: {
				show: false
			},
			shadowStyle: {
				color: '#F6F8F9'
			}
		}
	};

	constructor(data: any, configuration: any, context: any) {
		this.dimensionType = getEchartAxisType(context.indexes.Dimension1 ? data.columns[context.indexes.Dimension1.index].dataType : null);

		if (typeof context.indexes.Metric1?.index !== 'undefined') {
			this.metricFormatter = getFormatter(
				data.columns[context.indexes.Metric1.index].dataType,
				'metric',
				'metric',
				configuration?.options?.enums,
				configuration?.options?.selectedFormat
			);
		}

		if (typeof context.indexes.Dimension2?.index !== 'undefined') {
			this.columnYFormatter = getFormatter(
				data.columns[context.indexes.Dimension2.index].dataType,
				'dimension1',
				'yAxis',
				configuration?.options?.enums,
				configuration?.options?.selectedFormat
			);
		}

		if (typeof context.indexes.Dimension1?.index !== 'undefined') {
			this.columnXFormatter = getFormatter(
				data.columns[context.indexes.Dimension1.index].dataType,
				'dimension0',
				'xAxis',
				configuration?.options?.enums,
				configuration?.options?.selectedFormat,
				{tooltip: true}
			);

			this.optionsFormatter = getFormatter(
				data.columns[context.indexes.Dimension1.index].dataType,
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
	}

	getTitle = () => ({
		textStyle: {
			color: '#36363A',
			fontSize: 32
		}
	});

	getGrid = (configuration: any) => {
		const options = configuration?.options;
		return getXYaxisGrid(options);
	};

	getLabel = (configuration: any) => {
		const options = configuration?.options;
		return {
			show: options?.showLabel,
			position: options?.labelPosition,
			rotate: options?.horizontalFlip ? 0 : options?.labelRotate === chartConstants.chartConst.VERTICAL || options?.labelRotate === true ? 90 : 0,
			// eslint-disable-next-line array-element-newline
			color: ['inside', 'insideRight', 'insideLeft'].includes(options?.labelPosition)
				? 'white'
				: null,
			...(this.metricFormatter
				? {
					formatter: (params: any) => {
						if (params.encode) {
							return `${options?.horizontalFlip
								? this.metricFormatter(params.value[params.encode.x[0]])
								: this.metricFormatter(params.value[params.encode.y[0]])}`;
						}
						return '';
					}
				}
				: {})
		};
	};

	getTooltip = (configuration: any) => ({
		trigger: 'item',
		...(this.metricFormatter
			? {
				formatter: (params: any) => {
					if (!Array.isArray(params)) {
						if (params.encode) {
							return `${this.columnXFormatter(params.name)}<br>
				${params.marker}${this.columnYFormatter(params.seriesName)}:
				${configuration?.options?.horizontalFlip
				? this.metricFormatter(params.value[params.encode.x[0]])
				: this.metricFormatter(params.value[params.encode.y[0]])}`;
						}
					}
					return `${this.columnXFormatter(params[0].name)}<br>
				${params.map((param: any) => `${param.marker}${this.columnYFormatter(param.seriesName)}:
				${configuration?.options?.horizontalFlip
				? this.metricFormatter(param.value[param.encode.x[0]])
				: this.metricFormatter(param.value[param.encode.y[0]])}`)
				.join('<br>')}`;
				}
			}
			: {})
	});

	getYAxis = (configuration: any) => {
		const options = configuration?.options;
		return {
			type: options?.horizontalFlip ? this.dimensionType : chartConstants.chartConst.VALUE,
			inverse: options?.horizontalFlip,
			axisLabel: {
				color: '#808189',
				margin: 24,
				fontSize: 28,
				formatter: options?.horizontalFlip
					? this.optionsFormatter
					: this.metricFormatter
			},
			...(options?.horizontalFlip
				? this.axisPointerOption
				: {}
			),
			max: options?.horizontalFlip ? null : options?.gridBorder?.gridRight,
			min: options?.horizontalFlip ? null : options?.gridBorder?.gridLeft
		};
	};

	getXAxis = (configuration: any) => {
		const options = configuration?.options;
		return {
			type: options?.horizontalFlip ? chartConstants.chartConst.VALUE : this.dimensionType,
			axisLabel: {
				color: '#67686F',
				margin: 24,
				fontSize: 28,
				rotate: labelRotateHandle(options?.labelRotate),
				formatter: options?.horizontalFlip
					? this.metricFormatter
					: this.optionsFormatter
			},
			...(options?.horizontalFlip
				? {}
				: this.axisPointerOption
			),
			axisLine: {
				type: 'dashed'
			},
			max: options?.horizontalFlip ? options?.gridBorder?.gridRight : null,
			min: options?.horizontalFlip ? options?.gridBorder?.gridLeft : null
		};
	};

	getLegend = (configuration: any, context: any, dimensions: string[]) => {
		const options = configuration?.options;
		let selectedLegend = null;
		const keys = Object.keys(options.selectedLegend ?? {});
		if (options.selectedLegend
			&& keys.length
			&& dimensions.length === keys.length) {
			// eslint-disable-next-line prefer-destructuring
			selectedLegend = options.selectedLegend;
		} else {
			selectedLegend = createSelectedLegend(dimensions);
		}

		const selectedIndex = getSelectedLegend(selectedLegend);

		return {
			formatter: (params: any) => this.columnYFormatter(params),
			itemGap: 32,
			itemHeight: 16,
			itemWidth: 16,
			...(options?.legendPosition === chartConstants.chartConst.BOTTOM && {padding: [0, 0, 25, 0]}),
			data: dimensions.map((dim, index) => ({
				name: dim,
				// @ts-ignore
				icon: `image://${window.location.protocol}//${window.location.host}${selectedIndex.includes(dim) ? checkBox : box}`,
				textStyle: {
					color: context.colors?.coloring?.[chartConstants.dataConfiguration.DIMENSION1]?.[dim] ?? context.colors.theme[index]
				}
			})),
			type: dimensions.length >= 7 ? chartConstants.chartConst.SCROLL : chartConstants.chartConst.PLAIN,
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
		const result = cloneDeep(item);
		result.itemStyle.color = context.colors?.coloring?.[chartConstants.dataConfiguration.DIMENSION1]?.[item.name] ?? context.colors.theme[index];
		result.stack = configuration?.options?.stacked;
		result.barCategoryGap = '8%';
		result.barGap = configuration?.options?.barGap ? '0' : null;
		return result;
	});

	// eslint-disable-next-line max-lines-per-function
	changeOptions = (configuration: any, context: any, dimensions: any) => {
		const chartOptions = {...context.chartData};
		switch (context.optionName) {
			case widgetOptionName.HORIZONTAL_FLIP:
				chartOptions.tooltip = this.getTooltip(configuration);
				chartOptions.label = this.getLabel(configuration);
				chartOptions.xAxis = this.getXAxis(configuration);
				chartOptions.yAxis = this.getYAxis(configuration);
				break;
			case widgetOptionName.SHOW_LEGEND:
				chartOptions.grid = this.getGrid(configuration);
				chartOptions.legend = this.getLegend(configuration, context, dimensions);
				break;
			case widgetOptionName.LABEL_ROTATE:
				chartOptions.label = this.getLabel(configuration);
				chartOptions.xAxis = this.getXAxis(configuration);
				chartOptions.yAxis = this.getYAxis(configuration);
				break;
			case widgetOptionName.GRID_BORDER:
			case widgetOptionName.X_AXIS_SHORT_LABEL:
			case widgetOptionName.X_AXIS_NUMBER_OF_CHARACTERS:
				chartOptions.xAxis = this.getXAxis(configuration);
				chartOptions.yAxis = this.getYAxis(configuration);
				break;
			case widgetOptionName.LEGEND_POSITION:
				chartOptions.grid = this.getGrid(configuration);
				chartOptions.legend = this.getLegend(configuration, context, dimensions);
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
				chartOptions.legend = this.getLegend(configuration, context, dimensions);
				break;

			case widgetOptionName.STACKED:
			case widgetOptionName.BAR_GAP:
				chartOptions.series = this.getSeries(configuration, context, chartOptions.series);
				break;

			default:
				break;
		}
		return chartOptions;
	};
}

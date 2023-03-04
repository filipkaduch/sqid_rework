/* eslint-disable no-invalid-this */
import {chartConstants} from '@/util/consts/chartsConstants';
import {getFormatter} from '@/util/formatingUtil';
import {
	getEchartAxisType,
	createSelectedLegend,
	getSelectedLegend, addAverageAllRace, addAverageBucketingRace
} from '@/util/echartsWidgetsUtil';
import box from '@/assets/box-icon.svg';
import checkBox from '@/assets/checkbox-icon.svg';
import {widgetOptionName} from '@/util/consts/widgetOptionsNames';
import {labelRotateHandle} from '@/modules/widget/echartsWidgetControls';
import {getXYaxisGrid} from '@/modules/widget/utils/widget';

export const raceAnimationDataset = (data: any, configuration: any, context: any) => {
	let tmpData = [[]] as any;
	// eslint-disable-next-line guard-for-in
	for (const dim in configuration.data.configuration.dimensions) {
		tmpData[0].push(configuration.data.configuration.dimensions[dim].column);
	}
	tmpData[0].push(configuration.data.configuration.metrics[0].column);
	tmpData[0].push(data.columns[data.columns.length - 1].reference);
	// eslint-disable-next-line guard-for-in
	for (const row in data.rows) {
		// eslint-disable-next-line prefer-destructuring
		const val = data.rows[row][context.indexes.Metric1.index];
		if (val !== '' && typeof val !== 'undefined' && val !== null) {
			tmpData.push(data.rows[row]);
		} else if (configuration.options.replaceUndefined) {
			data.rows[row][context.indexes.Metric1.index] = 0;
			tmpData.push(data.rows[row]);
		}
	}

	if (configuration.options.averageLineAll) {
		tmpData = addAverageAllRace(tmpData, configuration);
	}

	if (configuration.options.averageLineBucketing) {
		tmpData = addAverageBucketingRace(tmpData, configuration);
	}

	return tmpData;
};

export default class LineMultiSeriesService {
	metricFormatter = null as any;

	columnXFormatter = null as any;

	columnYFormatter = null as any;

	dimensionType = null as any;

	constructor(data: any, configuration: any, context: any) {
		this.dimensionType = getEchartAxisType(data.columns[context.indexes.Dimension1.index].dataType);

		if (typeof context.indexes.Metric1?.index !== 'undefined') {
			this.metricFormatter = getFormatter(
				data.columns[context.indexes.Metric1.index].dataType,
				'metric',
				'metric',
				configuration.options.enums,
				configuration.options.selectedFormat
			);
		}

		this.columnYFormatter = getFormatter(
			data.columns[context.indexes.Dimension2.index].dataType,
			'dimension1',
			'yAxis',
			configuration.options.enums,
			configuration.options.selectedFormat
		);

		this.columnXFormatter = getFormatter(
			data.columns[context.indexes.Dimension1.index].dataType,
			'dimension0',
			'xAxis',
			configuration.options.enums,
			configuration.options.selectedFormat,
			{
				shortLabel: configuration?.options?.xAxisShortLabel,
				maxLength: configuration?.options?.xAxisNumberOfCharacter
			}
		);
	}

	getTitle = (configuration: any) => ({
		text: configuration.options.title,
		left: chartConstants.chartConst.CENTER,
		textStyle: {
			color: '#36363A',
			fontSize: 32
		}
	});

	getGrid = (configuration: any) => {
		const options = configuration?.options;
		return getXYaxisGrid(options);
	};

	getTooltip = (configuration: any) => ({
		trigger: 'axis',
		axisPointer: {
			type: configuration?.options.showAxisPointer ? 'cross' : 'line'
		},
		...(this.metricFormatter
			? {
				formatter: (params: any) => {
					if (params?.[0]?.componentType === 'series') {
						return `${this.columnXFormatter(params[0].name)}<br>
					${params.map((param: any) => `${param.marker}${this.columnYFormatter(param.seriesName)}:
						${this.metricFormatter(param.value[param.seriesIndex + 1])}`).join('<br>')}`;
					}
					return '';
				}
			}
			: {})
	});

	getYAxis = (configuration: any) => {
		const options = configuration?.options;
		return {
			type: options.switchToLog ? 'log' : 'value',
			axisLabel: {
				color: '#808189',
				margin: 24,
				fontSize: 28,
				...(this.metricFormatter
					? {
						formatter: (params: any) => this.metricFormatter(params)
					}
					: {})
			},
			splitLine: {
				show: true,
				lineStyle: {
					type: chartConstants.chartConst.DASHED,
					color: '#C9D4DA',
					width: 1
				}
			},
			max: configuration.options.gridBorder?.gridRight ?? null,
			min: configuration.options.gridBorder?.gridLeft ?? null,
			...(options.switchToLog ? {min: 1} : {}),
			...(options.minorGridLines
				? {
					minorTick: {
						show: true
					},
					minorSplitLine: {
						show: true
					}
				}
				: {}
			)
		};
	};

	getXAxis = (configuration: any) => {
		const options = configuration?.options;
		return {
			type: this.dimensionType,
			axisLabel: {
				color: '#808189',
				margin: 24,
				fontSize: 28,
				// for backward compatibility, when old verticalLabel exist and labelRotate is not used
				rotate: labelRotateHandle(options?.verticalLabel && !options?.labelRotate
					? options?.verticalLabel
					: options?.labelRotate),
				formatter: this.columnXFormatter
			},
			nameLocation: 'middle',
			minorTick: {
				show: true
			},
			minorSplitLine: {
				show: true
			},
			splitLine: {
				show: true,
				lineStyle: {
					type: chartConstants.chartConst.DASHED,
					color: '#C9D4DA',
					width: 1
				}
			},
			boundaryGap: false
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

	// eslint-disable-next-line max-lines-per-function
	getSeries = (configuration: any, context: any, series: any) => {
		const options = configuration?.options;
		// eslint-disable-next-line max-lines-per-function
		return series.map((item: any, index: number) => {
			const result = {...item};
			if (context.colors) {
				result.itemStyle = {};
				result.itemStyle.color = context.colors?.coloring?.[chartConstants.dataConfiguration.DIMENSION1]?.[item.name] ?? context.colors.theme[index];
			}
			result.showSymbol = options.graphSymbols === true;
			result.stack = options.stacked;
			result.smooth = options.smoothLine;
			result.connectNulls = options.connectUndefined;
			result.areaStyle = options.stacked ? {} : null;
			result.stack = options?.stacked;
			return result;
		});
	};

	// eslint-disable-next-line max-lines-per-function
	changeOptions = (configuration: any, context: any, dimensions: any) => {
		const chartOptions = {...context.chartData};
		switch (context.optionName) {
			case widgetOptionName.SHOW_LEGEND:
				chartOptions.grid = this.getGrid(configuration);
				chartOptions.legend = this.getLegend(configuration, context, dimensions);
				break;
			case widgetOptionName.LABEL_ROTATE:
			case widgetOptionName.VERTICAL_LABEL:
				chartOptions.xAxis = this.getXAxis(configuration);
				break;
			case widgetOptionName.GRID_BORDER:
			case widgetOptionName.SWITCH_TO_LOG:
			case widgetOptionName.MINOR_GRID_LINES:
				chartOptions.yAxis = this.getYAxis(configuration);
				break;
			case widgetOptionName.LEGEND_POSITION:
				chartOptions.grid = this.getGrid(configuration);
				chartOptions.legend = this.getLegend(configuration, context, dimensions);
				break;
			case widgetOptionName.TITLE:
			case widgetOptionName.LEGEND_GRID_WIDTH:
				chartOptions.title = this.getTitle(configuration);
				chartOptions.grid = this.getGrid(configuration);
				break;
			case widgetOptionName.SELECTED_LEGEND:
				chartOptions.legend = this.getLegend(configuration, context, dimensions);
				break;

			case widgetOptionName.STACKED:
			case widgetOptionName.GRAPH_SYMBOLS:
			case widgetOptionName.SMOOTH_LINE:
			case widgetOptionName.CONNECT_UNDEFINED:
				chartOptions.series = this.getSeries(configuration, context, chartOptions.series);
				break;

			case widgetOptionName.SHOW_AXIS_POINTER:
				chartOptions.tooltip = this.getTooltip(configuration);
				break;

			default:
				break;
		}
		return chartOptions;
	};
}

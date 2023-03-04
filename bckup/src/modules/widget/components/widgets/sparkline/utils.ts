/* eslint-disable no-invalid-this */
import {getFormatter} from '@/util/formatingUtil';
import {getEchartAxisType} from '@/util/echartsWidgetsUtil';
import {getTitleValueSparkline} from '@/modules/widget/components/widgets/sparkline/consts';
import {cloneDeep} from 'lodash';
import {widgetOptionName} from '@/util/consts/widgetOptionsNames';
import {chartConstants} from '@/util/consts/chartsConstants';

export default class SparklineService {
	metricFormatter = null as any;

	columnXFormatter = null as any;

	legendFormatter = null as any;

	dimensionType = null as any;

	constructor(data: any, configuration: any, context: any) {
		this.dimensionType = getEchartAxisType(data.columns[context.indexes.Dimension1.index].dataType);
		this.columnXFormatter = getFormatter(
			data.columns[context.indexes.Dimension1.index].dataType,
			'dimension0',
			'xAxis',
			configuration.options.enums,
			configuration.options.selectedFormat
		);
		this.legendFormatter = getFormatter(
			data.columns[context.indexes.Dimension1.index].dataType,
			'dimension1',
			'yAxis',
			configuration.options.enums,
			configuration.options.selectedFormat,
			{tooltip: true}
		);
		this.metricFormatter = getFormatter(
			data.columns[context.indexes.Metric1.index].dataType,
			'metric',
			'metric',
			configuration.options.enums,
			configuration.options.selectedFormat
		);
	}

	getTooltip = () => ({
		trigger: 'axis',
		axisPointer: {
			type: 'line'
		},
		formatter: (params: any) => {
			if (params?.[0]?.componentType === 'series') {
				return `${this.columnXFormatter(params[0].name)}<br>
									${params.map((param: any) => `${param.marker}${param.seriesName}: ${this.metricFormatter(param.value)}`).join('<br>')}`;
			}
			return '';
		}
	});

	getYAxis = (configuration: any) => {
		const options = configuration?.options;
		return {
			show: false,
			type: (options?.switchToLog) ? 'log' : 'value',
			min: (params: any) => (options?.switchToLog) ? 1 : params.min,
			axisLabel: {
				formatter: this.metricFormatter
			}
		};
	};

	getXAxis = (configuration: any) => {
		const options = configuration?.options;
		return {
			show: false,
			type: this.dimensionType,
			axisLabel: {
				rotate: options?.verticalLabel === chartConstants.chartConst.VERTICAL || options?.verticalLabel === true ? 90 : 0,
				formatter: this.columnXFormatter
			}
		};
	};

	getLegend = (configuration: any, context: any, dimensions: string[], data: any) => {
		const options = configuration?.options;
		return {
			formatter: (params: any) => {
				const valueToShow = getTitleValueSparkline(configuration, data);
				return `${this.legendFormatter(params)}: ${this.metricFormatter(valueToShow)}`;
			},
			show: !options?.hideLegend,
			icon: 'none',
			pageTextStyle: {
				overflow: 'break'
			}
		};
	};

	getSeries = (configuration: any, context: any, series: any, index: any) => {
		const options = configuration?.options;
		if (context.colors) {
			series.itemStyle = {};
			series.itemStyle.color = context.colors?.coloring?.[chartConstants.dataConfiguration.DIMENSION1]?.[series.name] ?? context.colors.theme[index];
			series.itemStyle.showSymbol = options.graphSymbols === true;
		}
		series.showSymbol = options.graphSymbols === true;
		series.markPoint.label = {
			color: 'black',
			show: options.graphSymbols === true
		};
		series.stack = options.stacked;
		series.smooth = options.smoothLine ? 0.6 : 0;
		series.connectNulls = options.connectUndefined;
		series.areaStyle = options.stacked ? {} : null;
		series.stack = options?.stacked;

		return series;
	};

	changeOptions = (configuration: any, context: any, dimensions: any, sparklineIndex: any) => {
		const sparklines = cloneDeep(context.chartData);

		switch (context.optionName) {
			case widgetOptionName.LABEL_ROTATE:
			case widgetOptionName.MARK_LINES:
				sparklines[sparklineIndex].xAxis = this.getXAxis(configuration);
				break;
			case widgetOptionName.SWITCH_TO_LOG:
				sparklines[sparklineIndex].yAxis = this.getYAxis(configuration);
				break;
			case widgetOptionName.HIDE_LEGEND:
			case widgetOptionName.SHOW_LAST:
			case widgetOptionName.SHOW_MIN:
			case widgetOptionName.SHOW_MAX:
				sparklines[sparklineIndex].legend = this.getLegend(configuration, context, dimensions, sparklines[sparklineIndex].dataset.source[1]);
				break;
			case widgetOptionName.STACKED:
			case widgetOptionName.GRAPH_SYMBOLS:
			case widgetOptionName.SMOOTH_LINE:
			case widgetOptionName.CONNECT_UNDEFINED:
				sparklines[sparklineIndex].series = this.getSeries(configuration, context, sparklines[sparklineIndex].series, sparklineIndex);
				break;
			default:
				break;
		}

		return sparklines[sparklineIndex];
	};
}

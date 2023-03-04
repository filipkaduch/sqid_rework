/* eslint-disable no-invalid-this */
import {chartConstants} from '@/util/consts/chartsConstants';
import {getFormatter} from '@/util/formatingUtil';
import {getEchartAxisType} from '@/util/echartsWidgetsUtil';
import {widgetOptionName} from '@/util/consts/widgetOptionsNames';
import {dataTypes} from '@/util/queryBuilder';
import {getDisplayName, getMetricAlias} from '@/util/widgetData';
import {labelRotateHandle} from '@/modules/widget/echartsWidgetControls';

export default class BubbleChartService {
	categoryXFormatter = null as any;

	categoryYFormatter = null as any;

	categoryYShortFormatter = null as any;

	dimension1Type = null as any;

	dimension2Type = null as any;

	constructor(data: any, configuration: any, context: any) {
		this.dimension1Type = getEchartAxisType(data.columns[context.indexes.Dimension1.index].dataType);
		this.dimension2Type = getEchartAxisType(data.columns[context.indexes.Dimension2.index].dataType);

		this.categoryXFormatter = getFormatter(
			data.columns[context.indexes.Dimension1.index].dataType,
			'dimension0',
			'xAxis',
			configuration.options.enums,
			configuration.options.selectedFormat,
			{tooltip: true}
		);

		this.categoryYFormatter = getFormatter(
			data.columns[context.indexes.Dimension2.index].dataType,
			'dimension1',
			'yAxis',
			configuration.options.enums,
			configuration.options.selectedFormat
		);

		this.categoryYShortFormatter = getFormatter(
			data.columns[context.indexes.Dimension2.index].dataType,
			'dimension1',
			'yAxis',
			configuration.options.enums,
			configuration.options.selectedFormat,
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

	getTooltip = (configuration: any, context: any) => ({
		confine: false,
		formatter: (params: any) => {
			const metrics = {...configuration?.data?.configuration};
			const enums = {...configuration?.options};
			if (params.componentType === 'series') {
				const subtype = params.value.length > 4;
				return `${getDisplayName(configuration.data.configuration.dimensions[0].column, context)}: ${this.categoryXFormatter(params.value[0])} <br/>
					${getDisplayName(configuration.data.configuration.dimensions[1].column, context)}: ${this.categoryYFormatter(params.value[1])} <br/>
					${subtype ? `type: ${params.value[2]}<br>` : ''}
					${getMetricAlias(params.seriesIndex, metrics, enums, context)}: ${params.value[subtype ? 3 : 2]}`;
			}
			return '';
		}
	});

	getYAxis = () => ({
		type: this.dimension2Type === dataTypes.NUMBER
			? chartConstants.chartConst.VALUE
			: chartConstants.chartConst.CATEGORY,
		scale: true,
		axisLabel: {
			formatter: this.categoryYShortFormatter
		}
	});

	getXAxis = (configuration: any) => ({
		type: this.dimension1Type === dataTypes.NUMBER
			? chartConstants.chartConst.VALUE
			: chartConstants.chartConst.CATEGORY,
		scale: true,
		axisLabel: {
			rotate: labelRotateHandle(configuration?.options?.labelRotate),
			formatter: this.categoryXFormatter
		}
	});

	getSeries = (series: any) => series;

	changeOptions = (optionName: string, options: any, configuration: any) => {
		const chartOptions = {...options};
		switch (optionName) {
			case widgetOptionName.LABEL_ROTATE:
				chartOptions.xAxis = this.getXAxis(configuration);
				chartOptions.yAxis = this.getYAxis();
				break;
			case widgetOptionName.X_AXIS_SHORT_LABEL:
			case widgetOptionName.X_AXIS_NUMBER_OF_CHARACTERS:
				chartOptions.xAxis = this.getXAxis(configuration);
				chartOptions.yAxis = this.getYAxis();
				break;

			default:
				break;
		}
		return chartOptions;
	};
}

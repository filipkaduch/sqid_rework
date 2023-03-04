<template>
	<v-chart
		v-if="widgetData"
		ref="chart"
		class="w-100 h-100 widget-padding"
		:class="readOnly && currentStackingVariant !== 'animated' ? 'widget-padding-bottom' : ''"
		autoresize
		:option="widgetData"
		@finished="setFinishedRender(true)"
		@click="onItemClicked" />
</template>
<script>
import {configuration as config, initialize, widgetGroup} from '@/modules/widget/components/widgets/scatter/consts';
import {selectData, selectionArrayComparer} from '@/util/echartsWidgetsUtil';
import {chartConstants} from '@/util/consts/chartsConstants';
import {dataTypes} from '@/util/queryBuilder';
import {dimensionLabel, getDisplayName} from '@/util/widgetData';
import {
	echartsDefaultControls,
	labelRotate,
	labelRotateHandle,
	xAxisNumberOfCharacter
} from '@/modules/widget/echartsWidgetControls';
import echartsMixin from '@/mixins/echartsMixin';
import {getFormatter} from '@/util/formatingUtil';
import selectionMixin from '@/mixins/selectionMixin';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import findIndex from 'lodash/findIndex';

export default {
	name: 'EChartsScatter',
	mixins: [
		selectionMixin,
		echartsMixin
	],
	props: {
		widgetInstanceId: {
			type: String,
			default: null
		}
	},
	widgetTypes() {
		return ['widget_scatter_chart'];
	},
	// eslint-disable-next-line max-lines-per-function
	widgetTypeMetadata() {
		return {
			widgetGroup,
			initialize,
			configuration: config,
			options: {
				...echartsDefaultControls(true),
				labelRotate,
				xAxisNumberOfCharacter: xAxisNumberOfCharacter(3)
			}
		};
	},
	widgetHooks: {
		dataAnalyze(data) {
			return {
				colors: {
					count: data.rows?.length
				}
			};
		},
		// eslint-disable-next-line max-lines-per-function
		dataTransformation(data, configuration, context) {
			const dimension1Index = data.columns.map((column) => column.reference).indexOf('Dimension1');
			const dimension2Index = data.columns.map((column) => column.reference).indexOf('Dimension2');
			const {enums} = configuration.options;
			let tmpData = [];

			if (dimension1Index >= 0 && dimension2Index >= 0) {
				tmpData = data.rows.map((item) => [
					dimensionLabel(item[dimension1Index], data.columns[dimension1Index].dataType),
					dimensionLabel(item[dimension2Index], data.columns[dimension2Index].dataType)
				]);
			}
			const isWarning = !(dimension1Index >= 0 && dimension2Index >= 0) || (data?.rows?.length ?? 0) === 0;
			return {
				isWarning: isWarning ? isWarning : null,
				coloring: context.colors,
				title: {
					text: configuration.options.title,
					left: chartConstants.chartConst.CENTER
				},
				tooltip: {
					confine: false,
					formatter: (params) => {
						const categoryXFormatter = getFormatter(
							data.columns[dimension1Index].dataType,
							'dimension0',
							'xAxis',
							enums,
							configuration.options.selectedFormat,
							{tooltip: true}
						);
						const categoryYFormatter = getFormatter(
							data.columns[dimension2Index].dataType,
							'dimension0',
							'yAxis',
							enums,
							configuration.options.selectedFormat
						);

						if (params.componentType === 'series') {
							return `${getDisplayName(configuration.data.configuration.dimensions[0].column, context)}: ${categoryXFormatter(params.value[0])} <br/>
									${getDisplayName(configuration.data.configuration.dimensions[1].column, context)}: ${categoryYFormatter(params.value[1])}`;
						}
						return '';
					}
				},
				xAxis: {
					type: data.columns[dimension1Index].dataType === dataTypes.NUMBER ? chartConstants.chartConst.VALUE : chartConstants.chartConst.CATEGORY,
					scale: true,
					axisLabel: {
						rotate: labelRotateHandle(configuration?.options?.labelRotate),
						formatter: getFormatter(
							data.columns[dimension1Index].dataType,
							'dimension0',
							'xAxis',
							enums,
							configuration.options.selectedFormat
						)
					}
				},
				yAxis: {
					type: data.columns[dimension2Index].dataType === dataTypes.NUMBER ? 'value' : 'category',
					scale: true,
					axisLabel: {
						formatter: getFormatter(
							data.columns[dimension2Index].dataType,
							'dimension0',
							'yAxis',
							enums,
							configuration.options.selectedFormat,
							{
								shortLabel: configuration?.options.xAxisShortLabel,
								maxLength: configuration?.options.xAxisNumberOfCharacter
							}
						)
					}
				},
				series: [
					{
						type: 'scatter',
						id: getDisplayName(configuration.data.configuration.dimensions[0].column, context),
						dataGroupId: getDisplayName(configuration.data.configuration.dimensions[0].column, context),
						data: tmpData.map((item) => ({
							value: item,
							itemStyle: {
								borderColor: context.colors.theme[0],
								color: context.colors.theme[0]
							}
						})),
						symbolSize: () => {
							const resizeParameter = 1200;
							return (10 / 450) * resizeParameter;
						},
						color: context.colors.theme[0],
						clip: true
					}
				]
			};
		}
	},
	computed: {
		widgetData() {
			let data = cloneDeep(this.$store.getters['widgetData/data'](this.widgetInstanceId));
			if (data && data.series) {
				data = merge(data, this.defaultThemeOptions);
				data = selectData(data, this.selected, data.coloring, selectionArrayComparer);
			}
			return data;
		},
		parentId() {
			return this.preview ? null : this.$store.getters['widgetInstances/parentId'](this.widgetInstanceId);
		},
		xAxisShortLabel() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'xAxisShortLabel');
		},
		currentStackingVariant() {
			return this.$store.getters['widgetInstances/configuration'](this.parentId)?.options?.stacking ?? 'animated';
		}
	},
	methods: {
		onItemClicked(evt) {
			if (evt.componentType !== 'series') {
				return;
			}

			const index = findIndex(this.selected, (selected) => (selected[0] === evt.value[0] && selected[1] === evt.value[1]));
			if (index === -1) {
				this.selected.push([
					evt.value[0],
					evt.value[1]
				]);
			} else {
				this.selected.splice(index, 1);
			}
		}
	}
};
</script>

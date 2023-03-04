<template>
	<v-chart
		ref="chart"
		class="w-100 h-100 widget-padding"
		:class="readOnly ? 'widget-padding-bottom' : ''"
		autoresize
		:option="widgetData"
		@click="onItemClicked"
		@finished="setFinishedRender(true)"
		@legendselectchanged="onLegendSelectChanged" />
</template>

<script>
import {calcPercentage, calcSum, dimensionLabel} from '@/util/widgetData';
import {configuration as config, initialize, widgetGroup} from '@/modules/widget/components/widgets/comparison/consts';
import {createSelectedLegend, getSelectedLegend, selectDataComparison} from '@/util/echartsWidgetsUtil';
import {getFormatter, tooltipFormatterComparison} from '@/util/formatingUtil';
import box from '@/assets/box-icon.svg';
import {chartConstants} from '@/util/consts/chartsConstants';
import checkBox from '@/assets/checkbox-icon.svg';
import {echartsDefaultControls, echartsLegendControls} from '@/modules/widget/echartsWidgetControls';
import echartsMixin from '@/mixins/echartsMixin';
import {mapActions} from 'vuex';
import selectionMixin from '@/mixins/selectionMixin';
import {CATEGORY_LEGEND} from '@/modules/widget/components/widget-controls/consts/categories';
import {widgetOptionName} from '@/util/consts/widgetOptionsNames';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import findIndex from 'lodash/findIndex';

export default {
	name: 'EChartsComparison',
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
		return ['widget_comparison_chart'];
	},
	// eslint-disable-next-line max-lines-per-function
	widgetTypeMetadata() {
		return {
			widgetGroup,
			configuration: config,
			initialize,
			options: {
				...echartsDefaultControls(true),
				...echartsLegendControls,
				selectedLegend: {
					type: 'widget_control_hidden',
					category: CATEGORY_LEGEND,
					default: {},
					needReload: true,
					needSaveConfiguration: false,
					needFetch: false
				},
				legendGridWidth: {
					type: 'widget_control_number_input',
					category: CATEGORY_LEGEND,
					props: {
						numberInputText: 't_maxLegendWidth',
						step: 5,
						unit: '%',
						minValue: 0,
						default: 10,
						maxValue: 50
					}
				}
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
			const dimensionIndex = data.columns.map((column) => column.reference).indexOf('Dimension1');
			const metricIndex = data.columns.map((column) => column.reference).indexOf('Metric1');
			let series = [];
			const {metrics} = configuration.data.configuration;
			const {enums} = configuration.options;
			const metricFormatter = getFormatter(
				data.columns[metricIndex].dataType,
				'metric0',
				'yAxis',
				configuration.options.enums,
				configuration.options.selectedFormat
			);

			const categories = [];

			if (dimensionIndex >= 0 && metricIndex >= 0) {
				const mappedData = data.rows.map((item) => {
					categories.push(item[dimensionIndex]);
					return [
						dimensionLabel(item[dimensionIndex], data.columns[dimensionIndex].dataType),
						item[metricIndex]
					];
				});
				series = mappedData.map((val, i) => ({
					color: context.colors?.coloring?.[chartConstants.dataConfiguration.DIMENSION0]?.[val[0]] ?? context.colors.theme[i],
					name: val[0],
					type: 'bar',
					stack: '%',
					data: [val[1]]
				}));

				const sum = calcSum(series, []);
				series = series.map((item) => ({
					...item,
					label: {
						show: true,
						formatter: calcPercentage(item.data[0], sum)
					}
				}));
			}

			let selectedLegend = null;
			if (configuration.options.selectedLegend
				&& Object.keys(configuration.options.selectedLegend).length !== 0
				&& categories.length === Object.keys(configuration.options.selectedLegend).length) {
				// eslint-disable-next-line prefer-destructuring
				selectedLegend = configuration.options.selectedLegend;
			} else {
				selectedLegend = createSelectedLegend(categories);
			}
			const selectedIndex = getSelectedLegend(selectedLegend);

			const options = {
				grid: {
					top: '15%',
					bottom: '15%',
					...(configuration.options.showLegend
						? {
							left: (configuration.options.legendPosition === chartConstants.chartConst.LEFT && configuration.options.legendGridWidth
								? `${configuration.options.legendGridWidth}%`
								: '10%'),
							right: (configuration.options.legendPosition === chartConstants.chartConst.RIGHT && configuration.options.legendGridWidth
								? `${configuration.options.legendGridWidth}%`
								: '10%')
						}
						: {})
				},
				tooltip: {
					trigger: 'item',
					formatter: (params) => tooltipFormatterComparison(params, metrics, enums, metricFormatter)
				},
				legend: {
					show: configuration.options.showLegend,
					itemGap: 32,
					itemHeight: 16,
					itemWidth: 16,
					formatter: getFormatter(
						data.columns[dimensionIndex].dataType,
						'dimension0',
						'xAxis',
						configuration.options.enums,
						configuration.options.selectedFormat
					),
					data: categories.map((category, index) => ({
						name: category,
						icon: `image://${window.location.protocol}//${window.location.host}${selectedIndex.includes(category)
							? checkBox
							: configuration?.options.selectedLegend === null
								? checkBox
								: box}`,
						textStyle: {
							color: context.colors?.coloring?.[chartConstants.dataConfiguration.DIMENSION0]?.[category] ?? context.colors.theme[index]
						}
					})),
					selected: selectedLegend,
					type: chartConstants.chartConst.SCROLL,
					top: (configuration.options.legendPosition === chartConstants.chartConst.LEFT || configuration.options.legendPosition === chartConstants.chartConst.RIGHT)
						? 'middle'
						: configuration.options.legendPosition,
					left: (configuration.options.legendPosition === chartConstants.chartConst.BOTTOM) ? chartConstants.chartConst.CENTER : configuration.options.legendPosition,
					orient: configuration.options.legendPosition === chartConstants.chartConst.BOTTOM ? chartConstants.chartConst.HORIZONTAL : chartConstants.chartConst.VERTICAL
				},
				xAxis: {
					id: 'x',
					type: chartConstants.chartConst.VALUE,
					max: calcSum(series, [])
				},
				yAxis: {
					type: chartConstants.chartConst.CATEGORY,
					data: ['%']
				},
				series
			};
			const isWarning = !(dimensionIndex >= 0 && metricIndex >= 0) || (data?.rows?.length ?? 0) === 0;

			return {
				isWarning: isWarning ? isWarning : null,
				colors: context.colors,
				...options
			};
		}
	},
	computed: {
		widgetData() {
			let data = cloneDeep(this.$store.getters['widgetData/data'](this.widgetInstanceId));

			if (data) {
				data = merge({}, this.defaultThemeOptions, data);
			}
			return selectDataComparison(data, this.selected);
		},
		parentId() {
			return this.preview ? null : this.$store.getters['widgetInstances/parentId'](this.widgetInstanceId);
		}
	},
	watch: {
		notHidden(value) {
			if (this.widgetData) {
				const sum = calcSum(this.widgetData.series, value);
				const series = this.widgetData.series.map((item) => ({
					label: {
						show: true,
						formatter: calcPercentage(item.data[0], sum)
					}
				}));

				this.updateData({
					widgetInstanceId: this.widgetInstanceId,
					data: {
						xAxis: {
							max: sum
						},
						legend: {
							selected: Object.assign({}, ...this.widgetData.series.map((item) => ({
								[item.name]: value.flat(1).includes(item.name)
							})))
						},
						series
					}
				});
			}
		}
	},
	methods: {
		...mapActions('widgetData', ['updateData']),
		onItemClicked(evt) {
			const i = findIndex(this.selected, (selected) => selected[0] === evt.seriesName);
			if (i === -1) {
				this.selected.push([evt.seriesName]);
			} else {
				this.selected.splice(i, 1);
			}
		},
		onLegendSelectChanged(evt) {
			const temp = [];
			for (const name in evt.selected) {
				if (Object.hasOwn(evt.selected, name) && evt.selected[name]) {
					temp.push([name]);
				}
			}
			this.setOptionLegend(widgetOptionName.SELECTED_LEGEND, evt.selected);
			this.notHidden = temp;
		}
	}
};
</script>

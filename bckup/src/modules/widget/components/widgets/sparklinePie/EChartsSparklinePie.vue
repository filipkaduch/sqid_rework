<template>
	<div class="h-100" :class="readOnly ? 'widget-padding-bottom' : ''">
		<ds-row class="w-100 d-flex justify-content-center">
			<h3>{{ displayName ? title : '' }}</h3>
		</ds-row>
		<div class="h-100 w-100 overflow-auto">
			<div>
				<ds-box
					ref="grid"
					class="h-100 w-100 flex-wrap"
					flex-type="row">
					<ds-col
						v-for="(item, index) in widgetData"
						:key="index"
						:cols="getColumnsCount(widgetData?.length, true)">
						<v-chart
							:key="index"
							:ref="'chart' + index"
							class="w-100 widget-padding"
							autoresize
							:style="getChartHeight(widgetData?.length)"
							:option="selectData(widgetData[index], selected)"
							:update-options="{notMerge: true}"
							@finished="setFinishedRender(true)"
							@pieselectchanged="onPieSelectChanged" />
					</ds-col>
				</ds-box>
			</div>
		</div>
	</div>
</template>

<script>
/* eslint-disable max-statements */
import {configuration as config, getChartHeight, initialize, titleFormat, widgetGroup} from '@/modules/widget/components/widgets/sparklinePie/consts';
import {getAlias, getColumnsCount, replaceUndefinedValues, selectData} from '@/util/echartsWidgetsUtil';
import {chartConstants} from '@/util/consts/chartsConstants';
import {dimensionLabel} from '@/util/widgetData';
import {echartsDefaultControls} from '@/modules/widget/echartsWidgetControls';
import echartsMixin from '@/mixins/echartsMixin';
import {getFormatter} from '@/util/formatingUtil';
import selectionMixin from '@/mixins/selectionMixin';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';

export default {
	name: 'EChartsSparklinePie',
	mixins: [
		echartsMixin,
		selectionMixin
	],
	props: {
		widgetInstanceId: {
			type: String,
			default: null
		},
		doughnut: {
			type: Boolean,
			default: true
		}
	},
	widgetTypes() {
		return ['widget_sparkline_doughnut'];
	},
	// eslint-disable-next-line max-lines-per-function
	widgetTypeMetadata() {
		return {
			widgetGroup,
			initialize,
			configuration: {...config},
			options: {
				...echartsDefaultControls(true)
			}
		};
	},
	widgetHooks: {
		dataAnalyze(data) {
			return {
				colors: {
					count: data.rows.length
				}
			};
		},
		// eslint-disable-next-line max-lines-per-function,complexity,max-statements
		dataTransformation(data, configuration, context) {
			const dimension1Index = data.columns.map((column) => column.reference).indexOf('Dimension1');
			const dimension2Index = data.columns.map((column) => column.reference).indexOf('Dimension2');
			const metricIndex = data.columns.map((column) => column.reference).indexOf('Metric1');

			const arr = [['_']];
			const Dim2arr = [''];
			const totalData = [];
			const names = [];

			if (dimension1Index >= 0 && metricIndex >= 0) {
				if (dimension2Index >= 0) {
					data.rows.map((item) => {
						if (!arr[0].includes(dimensionLabel(item[dimension2Index], data.columns[dimension2Index].dataType))) {
							arr[0].push(dimensionLabel(item[dimension2Index], data.columns[dimension2Index].dataType));
						}

						if (!arr.some((el) => el[0] === dimensionLabel(item[dimension1Index]))) {
							arr.push(['']);
							arr[Dim2arr.length][0] = dimensionLabel(item[dimension1Index], data.columns[dimension1Index].dataType);
							Dim2arr[Dim2arr.length] = dimensionLabel(item[dimension1Index], data.columns[dimension1Index].dataType);
						}
						const row = Dim2arr.indexOf(dimensionLabel(item[dimension1Index], data.columns[dimension1Index].dataType));
						const column = arr[0].indexOf(dimensionLabel(item[dimension2Index], data.columns[dimension2Index].dataType));
						arr[row][column] = dimensionLabel(item[metricIndex], data.columns[metricIndex].dataType);
						return null;
					});
				} else {
					data.columns.forEach((value, index) => {
						if (value.reference.includes('Metric')) {
							arr[0].push(getAlias(data.columns, index, null, context));
						}
					});

					data.rows.forEach((item) => {
						arr.push([...item]);
					});
				}

				let newData = arr;
				newData = replaceUndefinedValues(newData);
				const tempTotalData = [];
				for (let i = 1; i < newData.length; i++) {
					const tempArr = [];
					tempArr.push(newData[0]);
					tempArr.push(newData[i]);
					tempTotalData.push(tempArr);
				}
				for (let i = 0; i < tempTotalData.length; i++) {
					names.push(tempTotalData[i][1][0]);
					const tempArr = [];
					for (let j = 1; j < tempTotalData[i][0].length; j++) {
						if (tempTotalData[i][1][j] > 0) {
							tempArr.push({
								name: tempTotalData[i][0][j],
								value: tempTotalData[i][1][j],
								colorIndex: j
							});
						}
					}
					totalData.push(tempArr);
				}
			}
			const multiOptions = [];
			for (let i = 0; i < totalData.length; i++) {
				multiOptions.push({
					tooltip: {
						trigger: 'item',
						formatter: (params) => {
							const columnFormatter = getFormatter(
								data.columns[configuration?.data?.configuration?.dimensions.length === 1 ? dimension1Index : dimension2Index].dataType,
								'dimension0',
								'xAxis',
								configuration.options.enums,
								configuration.options.selectedFormat, {tooltip: true}
							);
							const metricFormatter = getFormatter(
								data.columns[metricIndex].dataType,
								'metric',
								'metric',
								configuration.options.enums,
								configuration.options.selectedFormat, {tooltip: true}
							);
							let colVal = null;
							if (configuration.data.configuration.dimensions.length === 1) {
								colVal = getAlias(configuration?.data?.configuration?.metrics, params.data.colorIndex, null, context);
							} else {
								colVal = columnFormatter(params.name);
							}

							if (params.componentType === 'series') {
								return `${params.marker} ${colVal}: ${metricFormatter(params.value)} (${params.percent}%)`;
							}
							return '';
						}
					},
					title: {
						text: titleFormat(names[i], getFormatter(
							data.columns[dimension1Index].dataType,
							'dimension0',
							'xAxis',
							configuration?.options?.enums,
							configuration?.options?.selectedFormat
						), configuration?.options?.enums),
						left: chartConstants.chartConst.CENTER
					},
					grid: {
						top: configuration.options?.displayName ? 45 : 10,
						bottom: data.columns.length >= 10 ? 50 : 30
					},
					series: [
						{
							id: 'data',
							type: 'pie',
							data: totalData[i].map((item, index) => ({
								...item,
								// selected: isSelected,
								itemStyle: {
									color: context.colors?.coloring?.[`metric${index}`] ?? context.colors.theme[index],
									borderColor: context.colors?.coloring?.[`metric${index}`] ?? context.colors.theme[index]
								}
							})),
							selectedMode: 'multiple',
							minShowLabelAngle: 10,
							radius: [
								'40%',
								'80%'
							],
							label: {
								position: chartConstants.chartConst.INSIDE,
								formatter: (params) => {
									const columnFormatter = getFormatter(
										data.columns[configuration?.data?.configuration?.dimensions.length === 1 ? dimension1Index : dimension2Index].dataType,
										'dimension0',
										'xAxis',
										configuration.options.enums,
										configuration.options.selectedFormat
									);
									if (configuration.data.configuration.dimensions.length === 1) {
										return getAlias(configuration?.data?.configuration?.metrics, params.data.colorIndex, configuration.options.enums, context);
									}
									return columnFormatter(params.name);
								}
							}
						}
					]
				});
			}
			return multiOptions;
		}
	},
	data() {
		return {
			selectData,
			getChartHeight,
			getColumnsCount
		};
	},
	computed: {
		widgetData() {
			return cloneDeep(this.$store.getters['widgetData/data'](this.widgetInstanceId));
		},
		parentId() {
			return this.preview ? null : this.$store.getters['widgetInstances/parentId'](this.widgetInstanceId);
		},
		colors() {
			return this.$store.getters['storyDetail/graphColors'];
		}
	},
	methods: {
		onPieSelectChanged(evt) {
			if (!this.isVisualStory) {
				const i = findIndex(this.selected, (selected) => selected[0] === evt.name);

				if (i === -1) {
					this.selected.push([evt.name]);
				} else {
					this.selected.splice(i, 1);
				}
			}
		},
		onLegendSelectChanged(evt) {
			if (!this.isVisualStory) {
				const temp = [];
				for (const name in evt.selected) {
					if (Object.hasOwn(evt.selected, name) && evt.selected[name]) {
						const index = findIndex(this.selected, (selected) => selected[0] === name);

						if (index !== -1) {
							this.selected.splice(index, 1);
						}

						temp.push([name]);
					}
				}

				this.notHidden = temp;
			}
		}
	}
};
</script>

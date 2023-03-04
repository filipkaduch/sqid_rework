<template>
	<v-chart
		ref="chart"
		class="w-100 h-100 widget-padding"
		:class="readOnly ? 'widget-padding-bottom' : ''"
		autoresize
		:option="widgetData"
		@finished="setFinishedRender(true)" />
</template>

<script>
import {configuration as config, getCountryByIso3, initialize, widgetGroup} from './consts';
import {echartsDefaultControls} from '@/modules/widget/echartsWidgetControls';
import echartsMixin from '@/mixins/echartsMixin';
import '@/modules/widget/components/widgets/country/maps/world';

export default {
	// eslint-disable-next-line vue/match-component-file-name
	name: 'AmChartCountryMap',
	mixins: [echartsMixin],
	props: {
		widgetInstanceId: {
			type: String,
			default: null
		}
	},
	// eslint-disable-next-line max-lines-per-function
	data: () => ({
		dataList: [],
		myChart: {},
		mapdata: [],
		mapName: 'world'
	}),
	widgetTypes() {
		return ['widget_country_map_new'];
	},
	// eslint-disable-next-line max-lines-per-function
	widgetTypeMetadata() {
		return {
			widgetGroup,
			initialize,
			configuration: {...config},
			options: {
				...echartsDefaultControls
			}
		};
	},
	widgetHooks: {
		dataAnalyze() {
			return {
				colors: {
					count: 1
				}
			};
		},
		// eslint-disable-next-line max-lines-per-function,complexity,no-unused-vars
		dataTransformation(data) {
			const mapData = (rawData) => {
				const dimensionIndex = rawData.columns.map((column) => column.reference).indexOf('Dimension1');
				const metricIndex = rawData.columns.map((column) => column.reference).indexOf('Metric1');
				return (dimensionIndex < 0 || metricIndex < 0)
					? null
					: rawData.rows.map((item) => ({
						value: item[metricIndex],
						name: getCountryByIso3(item[dimensionIndex])?.properties?.name
					}));
			};
			const dimensionIndex = data.columns.map((column) => column.reference).indexOf('Dimension1');
			const metricIndex = data.columns.map((column) => column.reference).indexOf('Metric1');
			const transformedData = mapData(data);
			const options = {
				backgroundColor: '#FFF',
				tooltip: {
					trigger: 'item'
				},
				visualMap: {
					min: 800,
					max: 50000,
					text: [
						'High',
						'Low'
					],
					realtime: false,
					calculable: true,
					inRange: {
						color: [
							'lightskyblue',
							'yellow',
							'orangered'
						]
					}
				}
			};

			const dataConfiguration = {
				series: [
					{
						name: 'World',
						type: 'map',
						map: 'world',
						label: {
							show: false
						},
						roam: true,
						data: transformedData
					}
					// TODO: TP-mapName for detail to map
				]
			};
			const isWarning = !(dimensionIndex >= 0 && metricIndex >= 0) || (data?.rows?.length ?? 0) === 0;

			return {
				isWarning: isWarning ? isWarning : null,
				...options,
				...dataConfiguration
			};
		}
	},
	computed: {
		widgetData() {
			return this.$store.getters['widgetData/data'](this.widgetInstanceId);
		}
	},
	methods: {
		getKeyByValue(object, value) {
			return Object.keys(object).find((key) => object[key] === value);
		}
		// TODO: This is for map deatail, next part of country map
		// clickHandler(params) {
		// let {name} = params;
		// if (params.data?.mapName) {
		// name = params.data.mapName;
		// }
		// const mapName = this.getKeyByValue(registry.PINYIN_MAP, name);
		// if (mapName) {
		// this.mapName = mapName;
		// } else {
		// this.mapName = 'world';
		// }
		// }
	}
};
</script>

<style scoped>

</style>

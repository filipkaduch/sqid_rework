<template>
	<div>
		<app-switch-bar
			v-model:state="showLegend"
			switchText="Show legend"
			@update-state="updateShowLegend" />
		<div class="my-2">
			<div class="form-group">
				<!--<b-form-radio-group-->
				<!--v-model="legendPosition"-->
				<!--:options="legendOptions"-->
				<!--class="d-flex"-->
				<!--buttons-->
				<!--button-variant="outline-chartOption"-->
				<!--:disabled="!showLegend"-->
				<!--@change="updateLegendPosition" />-->
			</div>
		</div>
		<div v-show="legendPosition !== chartConstants.chartConst.BOTTOM && showLegend && !disableWidthSlider">
			<span>Legend width</span>
			<ds-component-wrapper
				component-name="WidgetControlSlider"
				:value="legendGridWidth"
				:minValue="0"
				:maxValue="50"
				headingText="t_LegendOffset"
				unit="%"
				@update:value="updateGridWidth" />
		</div>
		<hr v-if="delimiter">
	</div>
</template>

<script>
import AppSwitchBar from '@/components/inputs/AppSwitchBar.vue';
import widgetControlComponentMixin from '@/mixins/widgetControlComponentMixin';
import {chartConstants} from '@/util/consts/chartsConstants';

export default {
	name: 'LegendOption',
	components: {AppSwitchBar},
	mixins: [widgetControlComponentMixin],
	props: {
		enabled: {
			type: Boolean,
			default: false
		},
		switchText: {
			type: String,
			default: 'Show Legend: '
		},
		disabled: {
			type: Boolean,
			default: false
		},
		delimiter: {
			type: Boolean,
			default: true
		},
		disableWidthSlider: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			legendOptions: [
				{
					text: 'Left',
					value: 'left'
				},
				{
					text: 'Bottom',
					value: 'bottom'
				},
				{
					text: 'Right',
					value: 'right'
				}
			],
			val: null
		};
	},
	computed: {
		chartConstants() {
			return chartConstants;
		},
		showLegend() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'showLegend') ?? true;
		},
		legendPosition: {
			get() {
				return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'legendPosition') ?? chartConstants.chartConst.BOTTOM;
			},
			set(value) {
				this.val = value;
			}
		},
		legendGridWidth() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'legendGridWidth') ?? 10;
		}
	},
	methods: {
		updateShowLegend(value) {
			this.setOption(value, 'showLegend');
		},
		updateLegendPosition(value) {
			this.setOption(value, 'legendPosition');
		},
		updateGridWidth(value) {
			this.setOption(value, 'legendGridWidth');
		}
	}
};
</script>

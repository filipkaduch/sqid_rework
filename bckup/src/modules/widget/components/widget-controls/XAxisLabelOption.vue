<template>
	<div>
		<app-switch-bar
			v-model:state="xAxisShortLabel"
			:switchText="switchText"
			@update:state="updateXAxisShortLabel" />
		<div class="my-2">
			<ds-component-wrapper
				component-name="WidgetControlSlider"
				:value="xAxisNumberOfCharacter"
				:disabled="!xAxisShortLabel"
				:minValue="0"
				:maxValue="30"
				@update:value="updateXAxisNumberOfCharacter" />
		</div>
	</div>
</template>

<script>
import AppSwitchBar from '@/components/inputs/AppSwitchBar.vue';
import widgetControlComponentMixin from '@/mixins/widgetControlComponentMixin';

export default {
	name: 'XAxisLabelOption',
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
		}
	},
	data() {
		return {
			val: null
		};
	},
	computed: {
		xAxisNumberOfCharacter: {
			get() {
				return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'xAxisNumberOfCharacter') ?? 5;
			},
			set(value) {
				this.val = value;
			}
		},
		xAxisShortLabel() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'xAxisShortLabel') ?? false;
		}
	},
	methods: {
		updateXAxisShortLabel(value) {
			this.setOption(value, 'xAxisShortLabel');
		},
		updateXAxisNumberOfCharacter(value) {
			this.setOption(value, 'xAxisNumberOfCharacter');
		}
	}
};
</script>

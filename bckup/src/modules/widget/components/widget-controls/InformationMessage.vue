<template>
	<div v-if="renderCondition">
		{{ $t(message) }}
	</div>
</template>

<script>
import widgetControlComponentMixin from '@/mixins/widgetControlComponentMixin';

export default {
	name: 'InformationMessage',
	mixins: [widgetControlComponentMixin],
	props: {
		message: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
		};
	},
	computed: {
		options() {
			return this.$store.getters['widgetInstances/options'](this.widgetInstanceId);
		},
		renderCondition() {
			return this.options.columns.length === 1 && this.options.metric.length === 1;
		}
	}
};
</script>

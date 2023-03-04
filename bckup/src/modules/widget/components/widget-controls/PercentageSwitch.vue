<template>
	<div class="d-flex justify-content-between">
		<span>
			Show percentage
		</span>
		<div class="custom-control custom-switch b-custom-control-lg mx-0 switch-left">
			<input
				:value="state"
				:disabled="disabled"
				type="checkbox"
				style="user-select: none;"
				class="custom-control-input"
				@change="setOption(!state)">
		</div>
	</div>
</template>

<script>
import widgetControlComponentMixin from '@/mixins/widgetControlComponentMixin';


export default {
	name: 'PercentageSwitch',
	mixins: [widgetControlComponentMixin],
	computed: {
		state() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'percentage') ?? true;
		}
	}
};
</script>

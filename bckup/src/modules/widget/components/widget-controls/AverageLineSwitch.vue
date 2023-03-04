<template>
	<div>
		<div class="d-flex">
			<p class="lead mb-2">
				<fa-icon class="mr-2 text-primary" :icon="headingIcon" />
				{{ $t(headingText) }}
			</p>
		</div>
		<div>
			<app-switch-bar
				v-model:state="averageBucketing"
				switchText="Average line bucketing: "
				@update:state="updateBucketing" />
			<app-switch-bar
				v-model:state="averageAll"
				switchText="Average line all: "
				@update:state="updateAll" />
		</div>
	</div>
</template>

<script>
import AppSwitchBar from '@/components/inputs/AppSwitchBar.vue';
import widgetControlComponentMixin from '@/mixins/widgetControlComponentMixin';

export default {
	name: 'AverageLineSwitch',
	components: {AppSwitchBar},
	mixins: [widgetControlComponentMixin],
	props: {
		enabled: {
			type: Boolean,
			default: false
		},
		switchText: {
			type: String,
			default: 'Average line: '
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		averageBucketing() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'averageLineBucketing') ?? false;
		},
		averageAll() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'averageLineAll') ?? false;
		}
	},
	methods: {
		updateBucketing(value) {
			this.setOption(value, 'averageLineBucketing');
		},
		updateAll(value) {
			this.setOption(value, 'averageLineAll');
		}

	}
};
</script>

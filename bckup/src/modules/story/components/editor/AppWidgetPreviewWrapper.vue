<template>
	<ds-component-wrapper v-if="initialized && !loadingComponent && loadedMetadata" v-bind="widgetProps" :component-name="componentName" />
</template>
<script>

export default {
	name: 'AppWidgetPreviewWrapper',
	props: {
		widgetType: {
			type: String,
			required: true
		},
		previewConfiguration: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			id: null,
			initialized: false
		};
	},
	computed: {
		loadedMetadata() {
			return this.$store.getters['widgetMetadata/initialized'];
		},
		loadingComponent() {
			return this.$store.getters['dependencies/loading'](this.componentName);
		},
		widgetTypeMetadata() {
			return this.$store.getters['widgetMetadata/widgetTypeMetadata'](this.widgetType);
		},
		componentName() {
			return typeof this.widgetTypeMetadata === 'string' ? this.widgetTypeMetadata : (this.widgetTypeMetadata?.component ?? null);
		},
		widgetProps() {
			return {
				...(this.widgetTypeMetadata?.props ?? {}),
				previewConfiguration: this.previewConfiguration,
				previewId: this.id
			};
		}
	}
};
</script>

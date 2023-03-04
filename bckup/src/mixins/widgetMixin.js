export default {
	props: {
		widgetInstanceId: {
			type: String,
			default: null
		},
		previewId: {
			type: String,
			default: null
		},
		editEnabled: {
			type: Boolean,
			default: true
		}
	},
	computed: {
		preview() {
			return this.previewId !== null;
		},
		title() {
			return this.preview ? null : this.$store.getters['widgetInstances/instance'](this.widgetInstanceId)?.name;
		},
		displayName() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'displayName');
		},
		backgroundColor() {
			return this.preview ? '#FFFFFF' : this.$store.getters['storyDetail/story'].layoutConfiguration.theme.colors.background;
		},
		fontFamily() {
			return this.preview ? null : this.$store.getters['storyDetail/story']?.layoutConfiguration?.theme?.font?.family;
		},
		fontColor() {
			return this.preview ? '#000' : this.$store.getters['storyDetail/story'].layoutConfiguration.theme.font?.color ?? '#000';
		},
		parentId() {
			return this.preview ? null : this.$store.getters['widgetInstances/parentId'](this.widgetInstanceId);
		},
		isVisualStory() {
			return this.preview ? false : this.$store.getters['storyDetail/story']?.storyType === 'visual-data-story';
		},
		fontScale() {
			return Math.min(1 / this.$store.getters['storyDetail/scale'], 2);
		},
		noDataMessage() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'noDataMessage');
		}
	},
	watch: {
		widgetInstanceId(newValue, oldValue) {
			if (newValue !== oldValue) {
				if (typeof this.loadConfiguration === 'function') {
					this.loadConfiguration();
				}
			}
		},
		newConfiguration(value) {
			if (value !== null && !this.widJustChanged) {
				this.saveConfiguration();
			}
		}
	},
	beforeMount() {
		if (typeof this.loadConfiguration === 'function') {
			this.loadConfiguration();
		}
	},
	methods: {
		saveConfiguration() {
			this.$store.dispatch('widgetInstances/setConfiguration', {
				widgetInstanceId: this.widgetInstanceId,
				configuration: this.newConfiguration
			});
		},
		setOptions(value) {
			this.$store.commit('widgetInstances/setOptions', {
				widgetInstanceId: this.widgetInstanceId,
				value
			});
		},
		setOption(optionName, value) {
			this.$store.commit('widgetInstances/setOption', {
				widgetInstanceId: this.widgetInstanceId,
				optionName,
				value
			});
		}
	}
};

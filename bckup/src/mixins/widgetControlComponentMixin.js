export default {
	props: {
		widgetInstanceId: {
			type: String,
			default: null
		},
		name: {
			type: String,
			default: null
		},
		headingIcon: {
			type: Array,
			default: null
		},
		headingText: {
			type: String,
			default: null
		}
	},
	methods: {
		setOption(value, name = this.name) {
			this.$store.dispatch('widgetInstances/setOption', {
				widgetInstanceId: this.widgetInstanceId,
				optionName: name,
				value
			});
		}
	}
};

<template>
	<div>
		<div v-if="headingText" class="d-flex">
			<ds-text variant="body" color="display-content">
				{{ $t(headingText) }}
			</ds-text>
		</div>

		<div v-if="!paragraphTrue" class="my-2 options-style">
			<textarea
				v-if="multiline"
				id="textarea"
				:value="value"
				class="px-3 form-control"
				:placeholder="$t(placeholder)"
				rows="4"
				@input="$emit('update:value', $event.target.value)" />

			<input
				v-else
				:placeholder="$t(placeholder)"
				:value="value"
				class="form-control mx-0 mb-2 px-3 select"
				@input="$emit('update:value', $event.target.value)">
		</div>
	</div>
</template>

<script>
import widgetControlComponentMixin from '@/mixins/widgetControlComponentMixin';

// TODO: remove this control once not needed
export default {
	name: 'TextInput',
	mixins: [widgetControlComponentMixin],
	props: {
		value: {
			type: [
				String,
				Number
			],
			default: ''
		},
		multiline: {
			type: Boolean,
			default: false
		},
		paragraphTrue: {
			type: Boolean,
			default: false
		},
		placeholder: {
			type: String,
			default: 't_EnterYourTextHere'
		},
		showFacts: {
			type: Boolean,
			default: false
		},
		showMetrics: {
			type: Boolean,
			default: false
		},
		headingText: {
			type: String,
			default: null
		},
		metric: {
			type: Array,
			default: null
		}
	},
	emits: ['update:value'],
	widgetControlTypes() {
		return ['widget_control_text_input'];
	},
	data() {
		return {
			editor: null,
			factsVisible: false,
			metricsVisible: false,
			selectedFact: null,
			selectedMetric: null,
			linkUrl: null,
			linkMenuIsActive: false
		};
	},
	computed: {
		facts() {
			return this.$store.getters['widgetFacts/allValues'] ?? {};
		},
		factOptions() {
			return Object.keys(this.facts).map((key) => ({
				value: key,
				text: `${key} - ${this.facts[key]}`
			}));
		},
		metricOptions() {
			const tempMap = [];
			if (this.metric) {
				this.metric.forEach((element, index) => {
					tempMap.push({
						value: index + 1,
						text: `${element.aggregation}(${element.column})`
					});
				});
			}
			return tempMap;
		}
	},
	methods: {
		showLinkMenu(attrs) {
			if (this.linkMenuIsActive === true) {
				this.hideLinkMenu();
				return;
			}
			this.linkUrl = attrs.href;
			this.linkMenuIsActive = true;
			this.$nextTick(() => {
				this.$refs.linkInput.focus();
			});
		},
		hideLinkMenu() {
			this.linkUrl = null;
			this.linkMenuIsActive = false;
		},
		setLinkUrl(command, url) {
			command({href: url});
			this.hideLinkMenu();
		}
	}
};
</script>

<style lang="scss" scoped>
.btn-group {
	height: unset;
}
</style>


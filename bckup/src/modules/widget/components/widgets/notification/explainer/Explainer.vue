<template>
	<div
		class="w-100 h-100" :class="`editor-content-${widgetInstanceId}`">
		<ds-rich-text-input
			class="w-100 h-100 d-flex justify-content-center align-items-center overflow-hidden"
			:editor-style="null"
			:widget-instance-id="widgetInstanceId"
			:presentation-mode="readOnly"
			:edit-enabled="editEnabled"
			:editor-class="readOnly ? 'presentation' : ''"
			:html="html"
			:placeholder="placeholder"
			:facts="factOptions"
			:metrics="metricOptions"
			@updated:content="onUpdated" />
	</div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import {chartConstants} from '@/util/consts/chartsConstants';
import widgetMixin from '@/mixins/widgetMixin';
import {widgetOptionName} from '@/util/consts/widgetOptionsNames';
import {configuration as config, initialize, options, widgetGroup} from './consts';
import DsRichTextInput from '@/components/shared/TextEditor/DataStoriesRichTextInput.vue';
import cloneDeep from 'lodash/cloneDeep';
import {$sanitizeHtml} from '@/util/sanitizeHtml';

export default {
	name: 'Explainer',
	components: {DsRichTextInput},
	mixins: [widgetMixin],
	props: {
		widgetInstanceId: {
			type: String,
			default: null
		},
		pageWidgetInstanceId: {
			type: String,
			default: null
		}
	},
	widgetTypes() {
		return ['widget_explainer'];
	},
	widgetTypeMetadata() {
		return {
			widgetGroup,
			initialize,
			configuration: config,
			options
		};
	},
	widgetHooks: {
		dataAnalyze() {
			return {};
		},
		dataTransformation(data, configuration) {
			const metricIndex = data.columns.findIndex((column) => column.reference === chartConstants.dataConfiguration.METRIC1);
			return {
				data,
				metrics: metricIndex >= 0 ? configuration.data.configuration.metrics : []
			};
		}
	},
	data() {
		return {
			switchedWidgetId: null
		};
	},
	computed: {
		...mapGetters('widgetInstances', ['pageWidgetInstanceIds']),
		widgetType() {
			return this.$store.getters['widgetInstances/widgetType'](this.widgetInstanceId);
		},
		placeholder() {
			return this.$store.getters['widgetMetadata/widgetTypeMetadata'](this.widgetType).options[widgetOptionName.TEXT].placeholder;
		},
		readOnly() {
			return Boolean(this.$store.getters['storyDetail/readOnly']);
		},
		text() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, widgetOptionName.TEXT) ?? '';
		},
		insightStyle() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'insightStyle');
		},
		widgetConfiguration() {
			return this.$store.getters['widgetInstances/configuration'](this.widgetInstanceId);
		},
		widgetLayoutConfiguration() {
			return this.$store.getters['widgetInstances/layoutConfiguration'](this.widgetInstanceId);
		},
		widgetInstanceIds() {
			return this.parentId ? this.$store.getters['widgetInstances/widgetInstanceIds'][this.parentId] ?? [] : [];
		},
		html() {
			return this.text ? $sanitizeHtml(this.text) : null;
		},
		facts() {
			return this.$store.getters['widgetFacts/allValues'] ?? null;
		},
		factOptions() {
			return this.facts
				? Object.entries(this.facts).map(([
					key,
					value
				]) => ({
					dataValue: value,
					value: key,
					text: `${key} - ${value}`,
					selectLabel: `${key} - ${value}`
				}))
				: [];
		},
		widgetData() {
			return this.$store.getters['widgetData/data'](this.widgetInstanceId);
		},
		metrics() {
			return this.widgetConfiguration?.data?.configuration?.metrics ?? null;
		},
		hasMetric() {
			return this.metrics?.length && this.metrics.every((el) => el && el.column && el.aggregation);
		},
		metricOptions() {
			return this.hasMetric
				? this.metrics.map((metric, index) => ({
					dataValue: this.getPlaceholderValue(index + 1),
					value: `M${index + 1}`,
					text: `${metric.aggregation} (${metric.column})`,
					selectLabel: `${metric.aggregation} (${metric.column})`
				}))
				: [];
		}
	},
	watch: {
		metrics: {
			immediate: true,
			handler(value) {
				if (value.length === 0 && this.switchedWidgetId === null) {
					this.compatibilitySwitch();
				}
			}
		}
	},
	methods: {
		...mapActions('widgetInstances', [
			'selectWidgetInstance',
			'createNewInstance',
			'removeInstance',
			'reorderWidgets'
		]),
		createWidget(wtuid, configuration) {
			return this.createNewInstance({
				widgetType: wtuid,
				configuration
			});
		},
		async deleteOldExplainer(oldIndex, oldSteps, id) {
			this.selectWidgetInstance(null);
			if (oldIndex > -1) {
				oldSteps[oldIndex] = id;
				this.selectWidgetInstance(id);
			}
			await this.removeInstance({widgetInstanceId: this.switchedWidgetId});
			await this.reorderWidgets({
				sectionId: this.pageWidgetInstanceId,
				newOrder: oldSteps
			});
		},
		async compatibilitySwitch() {
			this.switchedWidgetId = this.widgetInstanceId;
			const oldSteps = cloneDeep(this.widgetInstanceIds);
			if (this.pageWidgetInstanceId && this.widgetInstanceIds.length > 0) {
				const {id} = await this.createWidget('widget_explainer', this.oldConfiguration('widget_explainer', this.widgetConfiguration));
				const oldIndex = oldSteps.indexOf(this.switchedWidgetId);
				await this.deleteOldExplainer(oldIndex, oldSteps, id);
			}
		},
		oldConfiguration(wtuid, configuration) {
			const newConfiguration = cloneDeep(configuration);
			return {
				data: newConfiguration.data,
				options: newConfiguration.options,
				layout: cloneDeep(this.widgetLayoutConfiguration)
			};
		},
		onUpdated(data) {
			this.setOption('text', data);
			this.saveConfiguration();
		},
		getPlaceholderValue(metricIndex) {
			if (!this.widgetData?.data?.columns) {
				return metricIndex;
			}
			const dataIndex = this.widgetData.data.columns.findIndex((column) => column.reference === `Metric${metricIndex}`);
			const value = this.widgetData.data.rows[0][dataIndex];

			return dataIndex >= 0 ? value : `{${metricIndex}}`;
		}
	}
};
</script>

<style lang="scss" scoped>
/* TODO: remove once not needed for possible compatibility updates */
/*
.explainer-heading {
	border-left: 4px solid map-get($ds-colors, 'separate-content-200');
	margin-left: 2rem;

	.left-style {
		color: map-get($ds-colors, 'display-content-500');
		font-size: 35px;
		line-height: 1.3;
	}
}
*/

.explainer-insight {
	padding: 2rem;
	background-color: map-get($ds-colors, 'separate-content-0');
	margin-bottom: 0;
	border: 1px solid map-get($ds-colors, 'separate-content-200');
	border-radius: 4px;

	p {
		line-height: 28px;
		color: map-get($ds-colors, 'display-content-700');
		font-size: 17px;
		margin-bottom: 0;
	}
}
</style>

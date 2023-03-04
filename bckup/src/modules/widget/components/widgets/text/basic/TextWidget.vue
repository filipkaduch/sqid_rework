<template>
	<div class="w-100 h-100" :class="`editor-content-${widgetInstanceId}`">
		<ds-rich-text-input
			class="w-100 h-100 d-flex justify-content-center align-items-center overflow-hidden"
			:class="readOnly ? 'widget-padding-bottom' : ''"
			:editor-style="style"
			:presentation-mode="readOnly"
			:edit-enabled="editEnabled"
			:widget-instance-id="widgetInstanceId"
			:editor-class="readOnly ? 'presentation' : ''"
			:html="html"
			:placeholder="placeholder"
			:facts="factOptions"
			@updated="onUpdated" />
	</div>
</template>

<script>
import widgetMixin from '@/mixins/widgetMixin';
import {widgetOptionName} from '@/util/consts/widgetOptionsNames';
import {initialize, options, widgetGroup} from '@/modules/widget/components/widgets/text/basic/consts';
import DsRichTextInput from '@/components/shared/TextEditor/DataStoriesRichTextInput.vue';
import {widgetTypes} from '@/util/consts/widgetTypes';
import {$sanitizeHtml} from '@/util/sanitizeHtml';
import isEqual from 'lodash/isEqual';

export default {
	name: 'TextWidget',
	components: {DsRichTextInput},
	mixins: [widgetMixin],
	props: {
		widgetInstanceId: {
			type: String,
			default: null
		},
		fontSize: {
			type: Number,
			default: 24
		},
		textAlign: {
			type: String,
			default: 'left'
		},
		bold: {
			type: Number,
			default: 550
		},
		paragraph: {
			type: Boolean,
			default: false
		}
	},
	widgetTypes() {
		// TODO: remove widget_text_heading_one and widget_text_heading_two once they are not needed for backward compatibility
		return [
			'widget_text_paragraph',
			'widget_text_heading_one',
			'widget_text_heading_two'
		];
	},
	widgetTypeMetadata() {
		return {
			widgetGroup,
			initialize,
			options
		};
	},
	computed: {
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
		isConverted() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, widgetOptionName.TEXT_CONVERTED);
		},
		widgetSize() {
			return this.preview ? null : this.$store.getters['widgetInstances/size'](this.widgetInstanceId);
		},
		storyDimension() {
			return this.preview ? null : this.$store.getters['storyDetail/story'].layoutConfiguration.dimensions;
		},
		width() {
			return this.widgetSize.width * this.storyDimension.width;
		},
		style() {
			return {
				fontFamily: this.fontFamily,
				color: this.fontColor
				// 'font-size': `${this.fontSize * (this.fontSize > 30 ? 1 : this.fontScale)}px`,
			};
		},
		html() {
			let rawHtml = null;
			rawHtml = this.text ? $sanitizeHtml(this.text) : null;

			if (this.widgetType === widgetTypes.TEXT_HEADING_ONE) {
				rawHtml = rawHtml ?? 'Heading';
			}

			if (this.widgetType === widgetTypes.TEXT_PARAGRAPH) {
				rawHtml = rawHtml ?? '<h3 style="text-align: center">Double-click to start interaction</h3>'
					+ '<p style="text-align: center"><strong><span style="color: rgb(87, 114, 127)">use head navigation to style you text</span></strong></p>';
			}

			if (rawHtml && this.widgetType !== widgetTypes.TEXT_PARAGRAPH && !this.isConverted) {
				if (this.widgetType === widgetTypes.TEXT_HEADING_ONE) {
					rawHtml = `<h1 style="text-align: center">${rawHtml}</h1>`;
				}
				if (this.widgetType === widgetTypes.TEXT_HEADING_TWO) {
					rawHtml = `<h2 style="text-align: center">${rawHtml}</h2>`;
				}
				this.setOption('textConverted', true);
				this.onUpdated(rawHtml);
			}

			return rawHtml;
		},
		facts() {
			return this.$store.getters['widgetFacts/allValues'] ?? null;
		},
		factOptions() {
			return this.facts
				? Object.entries(this.facts).map(([key, value]) => ({
					dataValue: value,
					value: key,
					text: `${key} - ${value}`,
					selectLabel: `${key} - ${value}`
				}))
				: [];
		}
	},
	methods: {
		onUpdated(data) {
			if (!isEqual(data, this.text)) {
				this.setOption('text', data);
				this.saveConfiguration();
			}
		}
	}
};
</script>


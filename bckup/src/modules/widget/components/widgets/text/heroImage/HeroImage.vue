<template>
	<div class="w-100 h-100" :class="`editor-content-${widgetInstanceId}`">
		<div
			v-if="!backgroundImageUrl"
			class="position-absolute d-flex w-100 h-50 justify-content-center align-items-center widget-padding"
			style="top: 0; color: #C6C8D8;">
			<fa-icon style="font-size: 4em" class="mr-3" icon="image" />
			<span>Waiting for your image URL.</span>
		</div>

		<ds-rich-text-input
			class="w-100 h-100 d-flex justify-content-center align-items-center"
			:class="readOnly ? 'height-presenter' : 'h-100'"
			:editor-style="style"
			:presentation-mode="readOnly"
			:edit-enabled="editEnabled"
			editor-class="hero-image"
			:html="html"
			:widget-instance-id="widgetInstanceId"
			:placeholder="placeholder"
			:facts="factOptions"
			:background-image="backgroundImageUrl"
			:background-size="backgroundSize"
			:show-bg-image="true"
			@updated="onUpdated"
			@updated:bg-url="onBackgroundUrlUpdated"
			@updated:bg-size="onBackgroundSizeUpdated" />
	</div>
</template>

<script>
import {initialize, options, widgetGroup} from '@/modules/widget/components/widgets/text/heroImage/consts';
import widgetMixin from '@/mixins/widgetMixin';
import DsRichTextInput from '@/components/shared/TextEditor/DataStoriesRichTextInput.vue';
import {widgetOptionName} from '@/util/consts/widgetOptionsNames';
import {$sanitizeHtml} from '@/util/sanitizeHtml';

export default {
	name: 'HeroImage',
	components: {DsRichTextInput},
	mixins: [widgetMixin],
	props: {
		widgetInstanceId: {
			type: String,
			default: null
		}
	},
	widgetTypes() {
		return ['widget_hero_image'];
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
		format() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, widgetOptionName.FORMAT);
		},
		text() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, widgetOptionName.TEXT) ?? this.format ?? '';
		},
		backgroundSize() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'backgroundSize');
		},
		backgroundImageUrl() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'url');
		},
		isConverted() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, widgetOptionName.TEXT_CONVERTED);
		},
		fontColor() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, widgetOptionName.TEXT_COLOR);
		},
		fontSize() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, widgetOptionName.TEXT_SIZE);
		},
		style() {
			return {
				backgroundImage: this.backgroundImageUrl ? `url(${this.backgroundImageUrl})` : null,
				backgroundSize: this.backgroundSize ?? 'contain'
			};
		},
		html() {
			let rawHtml = null;

			rawHtml = this.text ? $sanitizeHtml(this.text) : null;

			if (rawHtml && !this.isConverted) {
				let colorStyle = '';
				if (this.fontColor === 'light') {
					colorStyle = '; color: rgb(255, 255, 255)';
				}
				rawHtml = `<${this.fontSize} style="text-align: center ${colorStyle}">${rawHtml}</${this.fontSize}>`;
				this.setOption('textConverted', true);
				this.onUpdated(rawHtml);
				return rawHtml;
			}
			return rawHtml;
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
		}
	},
	methods: {
		onUpdated(data) {
			this.setOption('text', data);
			this.saveConfiguration();
		},
		onBackgroundUrlUpdated(data) {
			this.setOption('url', data);
			this.saveConfiguration();
		},
		onBackgroundSizeUpdated(data) {
			this.setOption('backgroundSize', data);
			this.saveConfiguration();
		}
	}
};
</script>

<style lang="scss">
.height-presenter {
	height: 80vh;
	padding-bottom: 10vh;
}

.hero-image {
	background-position: center;
	background-repeat: no-repeat;
	transition: background-image 0.7s ease, background-size 0.7s ease;
}
</style>

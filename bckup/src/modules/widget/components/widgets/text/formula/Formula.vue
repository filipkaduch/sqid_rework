<template>
	<!-- eslint-disable vue/no-v-html -->
	<div
		ref="element"
		class="formula d-flex justify-content-center align-items-center h-100 overflow-hidden"
		:class="[`formula-${formulaType}`, {
			'widget-padding w-100': formulaType === 'button',
			'widget-padding': formulaType === 'shape',
			'w-100': formulaType === 'text'
		}]"
		:style="containerStyle">
		<p
			v-if="formulaType === 'text'"
			:style="paragraphStyle"
			class="m-0 text-center widget-padding"
			v-html="html" />
		<button
			v-else-if="formulaType === 'button'"
			ref="button"
			:style="style"
			class="btn btn-secondary px-3 py-1"
			@click="openLink">
			<span :style="paragraphStyle" v-html="html" />
		</button>
		<div v-else :style="style" class="d-flex text-center justify-content-center align-items-center">
			<p :style="paragraphStyle" class="m-0" v-html="html" />
		</div>
	</div>
</template>

<script>
import {configuration as config, initialize, options, widgetGroup} from '@/modules/widget/components/widgets/text/formula/formulaConsts';
import formulaMixin from '@/modules/widget/components/widgets/text/formula/formulaMixin';
import widgetMixin from '@/mixins/widgetMixin';

export default {
	name: 'Formula',
	mixins: [
		widgetMixin,
		formulaMixin
	],
	props: {
		widgetInstanceId: {
			type: String,
			default: null
		}
	},
	widgetTypes() {
		return [
			'widget_text_formula',
			'widget_notification_formula'
		];
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
		dataAnalyze(data) {
			return {
				colors: {
					count: data.rows?.length
				}
			};
		},
		dataTransformation(data, configuration, context) {
			const metricIndex = data.columns.map((column) => column.reference).indexOf('Metric1');
			if (metricIndex >= 0) {
				return {
					data,
					metrics: configuration.data.configuration.metrics,
					colors: context.colors
				};
			}
			return {};
		}
	},
	computed: {
		widgetData() {
			return this.preview ? null : this.$store.getters['widgetData/data'](this.widgetInstanceId);
		},
		parentId() {
			return this.preview ? null : this.$store.getters['widgetInstances/parentId'](this.widgetInstanceId);
		},
		formulaType() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'formulaType');
		},
		scale() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'scale');
		},
		color() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'color');
		},
		overlay() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'overlay');
		},
		widgetConfiguration() {
			return this.$store.getters['widgetInstances/configuration'](this.widgetInstanceId);
		},
		actualScale() {
			return (this.size / 300) * (this.scale / 100);
		},
		style() {
			switch (this.formulaType) {
				case 'shape':
				case 'button': {
					return {
						backgroundColor: this.coloring?.metric0 ?? this.widgetData?.colors?.theme?.[0],
						transform: `scale(${this.formulaType === 'shape' ? this.actualScale : 0.75 + (this.scale / 100)})`
					};
				}
				case 'notification': {
					return {
						backgroundColor: this.backgroundColor,
						alignSelf: this.position
					};
				}
			}

			return null;
		},
		paragraphStyle() {
			const styles = {
				fontFamily: this.fontFamily,
				color: this.fontColor,
				...this.textSizes[this.textSize]
			};

			if (this.formulaType === 'shape') {
				styles.transform = `scale(${1 / this.actualScale})`;
			}

			return styles;
		},
		containerStyle() {
			return this.overlay
				? {
					backgroundColor: this.backgroundColor,
					pointerEvents: 'auto'
				}
				: null;
		}
	},
	methods: {
		openLink() {
			const link = this.$refs.button.querySelector('a');

			if (link) {
				link.click();
			}
		}
	}
};
</script>

<style scoped lang="scss">

.formula-text {
	p {
		line-height: 1.2;
		font-weight: 600;
		transition: all 500ms ease;
	}
}

.formula-shape {
	div {
		height: 300px;
		width: 300px;
		min-width: 300px;
		border-radius: 50%;
		transition: all 500ms ease;
	}

	p {
		position: absolute;
		font-size: 2.5em;
		font-weight: 600;
		transition: all 500ms linear;
	}

	&.formula-transition-enter-from {
		transform: scale(0);
	}
}

.formula-notification {
	div {
		box-shadow: 0 14px 24px #00000021;
		border-radius: 8em;
		pointer-events: auto;
	}

	p {
		padding: 1.2rem 2rem;
	}

	&.formula-transition-enter-from {
		transform: translateY(1000%);
	}
}

.formula-button {
	a {
		display: none;
	}
}
</style>

<style lang="css">
p {
	margin-bottom: 0;
}
</style>

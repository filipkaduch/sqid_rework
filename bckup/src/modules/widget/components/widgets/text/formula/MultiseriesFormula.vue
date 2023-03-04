<template>
	<div ref="element" class="w-100 h-100 d-flex justify-content-around multiseries-formula widget-padding">
		<div
			v-for="(series, i) in widgetData?.data"
			:key="i"
			class="formula d-flex justify-content-center align-items-center formula-shape">
			<div
				:style="{
					backgroundColor: getMultiseriesFormulaColor(i),
					color: backgroundColor,
					minWidth: `${scale[i]}px`,
					height: `${scale[i]}px`
				}"
				class="d-flex justify-content-center align-items-center mx-1">
				<p
					:style="{
						fontFamily: fontFamily,
						lineHeight: '1em',
						backgroundColor: getMultiseriesFormulaColor(i, true),
						top: '45%',
						padding: '8px',
						borderRadius: '4px'
					}"
					class="m-0">
					<span class="title">{{ titles[i] ? titles[i] : '' }}</span>
					<br>
					<span class="metric font-weight-bold">{{ formatValue(series, selectedFormat) }} </span>
					<template v-if="state">
						<br>
						<span class="percentage">[{{ percentage(widgetData.data, i) }}]</span>
					</template>
				</p>
			</div>
		</div>
	</div>
</template>

<script>
import {configuration as conf, initialize, options, widgetGroup} from '@/modules/widget/components/widgets/text/formula/multiseriesFormulaConsts';
import colorMixin from '@/mixins/colorMixin';
import {formatNumber} from '@/plugins/formatting';
import formulaMixin from '@/modules/widget/components/widgets/text/formula/formulaMixin';
import widgetMixin from '@/mixins/widgetMixin';
import {rgbLinearShade} from '@/util/colors/shade';

export default {
	name: 'MultiseriesFormula',
	mixins: [
		colorMixin,
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
		return ['widget_multiseries_formula'];
	},
	widgetTypeMetadata() {
		return {
			widgetGroup,
			initialize,
			configuration: conf,
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
		dataTransformation(data, configuration) {
			const metricIndex = data.columns.map((column) => column.reference).indexOf('Metric1');
			if (metricIndex >= 0) {
				return {
					data: data.rows?.[0]?.map((metric) => metric) ?? [],
					metrics: configuration.data.configuration.metrics
				};
			}
			return {};
		}
	},
	computed: {
		widgetData() {
			return this.preview ? null : this.$store.getters['widgetData/data'](this.widgetInstanceId);
		},
		selectedFormat() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'selectedFormat');
		},
		scale() {
			const max = Math.max.apply(null, this.widgetData.data);
			const min = Math.min.apply(null, this.widgetData.data);

			return this.widgetData.data.map((metric) => (((1 - ((max - metric) / (max - min || 1))) * 0.5) + 0.2) * this.size);
		},
		titles() {
			return this.format?.split('\n') ?? [];
		},
		themeColors() {
			return this.$store.getters['storyDetail/story']?.layoutConfiguration?.theme?.colors?.graph ?? null;
		},
		state() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'percentage') ?? true;
		}
	},
	methods: {
		formatValue(series, selectedFormat) {
			return formatNumber(series, selectedFormat);
		},
		getMultiseriesFormulaColor(index, useOpacity = false) {
			const colorToUse = this.coloring?.[`metric${index}`] ?? this.themeColors?.[index];
			if (useOpacity) {
				return rgbLinearShade(0.6, colorToUse);
			}
			return colorToUse;
		},
		percentage(data, index) {
			const option = {
				style: 'percent',
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			};
			const formatter = new Intl.NumberFormat('en-US', option);

			let total = 0;
			data.forEach((dat) => {
				total += dat;
			});
			return formatter.format((data[index] / total));
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../../../../../../node_modules/bootstrap/scss/mixins/breakpoints";

p {
	text-align: center;
	position: absolute;
	line-height: 1.25;
}
@include media-breakpoint-down(sm) {
	p {
		font-size: 4em;
	}
	.title {
		font-size: 1.6em;
	}
}
@include media-breakpoint-up(md) {
	p {
		font-size: 2em;
	}
	.title {
		font-size: 0.8em;
	}
}
.formula-shape {
	div {
		border-radius: 50%;
	}
}

.percentage {
	font-size: 0.7em;
	opacity: 0.8;
}
</style>

<!-- eslint-disable max-lines, vue/no-v-html -->
<template>
	<div class="formula formula-notification d-flex justify-content-center align-items-center h-100 widget-padding py-0">
		<div :class="{'w-100 h-100 d-flex justify-content-center align-items-center': preview, 'w-100': true}">
			<template
				v-if="(checkInsightData(insightData) && insightData.status !== status.ERROR)
					|| checkForPreview()">
				<div class="container-fluid">
					<ds-row class="mr-0 ml-0 gx-5">
						<ds-col
							v-for="(showResult, index) in showResults"
							:key="'insight' + index"
							:cols="colsCount"
							class="p-0">
							<ds-card
								class="insight-card h-100 mx-2 p-1"
								:class="{'insight-card-better': showResult.sentiment, 'insight-card-worse': !showResult.sentiment}"
								body-class="d-block">
								<div class="d-flex flex-column">
									<div
										class="rounded h-100 w-100 transition-background mb-2"
										:class="{'emoticon-color-better': showResult.sentiment,'emoticon-color-worse': !showResult.sentiment}">
										<div
											class="d-inline-flex rounded"
											:class="{'sentiment-better': showResult.sentiment, 'sentiment-worse': !showResult.sentiment}">
											<p class="sentiment-text ml-2">
												{{ showResult.sentiment ? betterText : worseText }}
											</p>
											<ds-icon alt="arrow-up" style="width: 12px; height: 12px" class="m-2" name="arrow-up" />
										</div>
										<p class="ml-1 pl-2 mb-0"><b>{{ showResult.name }}</b></p>
									</div>
									<div class="d-flex">
										<ds-col v-if="sentimentVisible" :cols="sparklineVisible ? 8 : 12" class="p-0">
											<p class="p-0 m-0" :class="{'pr-3': !sparklineVisible}" v-html="getSanitizeHtml(showResult.paragraph)" />
										</ds-col>
										<ds-col v-if="sparklineVisible" :cols="sentimentVisible ? 4 : 12" class="p-0">
											<v-chart
												ref="chart"
												class="w-100 h-100 align-middle"
												style="min-height: 70px"
												autoresize
												:option="showResult.chartOptions" />
										</ds-col>
									</div>
								</div>
							</ds-card>
						</ds-col>
					</ds-row>
				</div>
			</template>
			<template v-else-if="preview || !(checkInsightData(insightData) && insightData.status !== status.ERROR)">
				<app-loading :loading="Boolean(insightLoading)">
					<p class="mb-0 text-center" :class="insightError ? 'text-danger' : 'text-warning'">{{ insightError ? $t('t_CantLoadData') : $t('t_NoData') }}</p>
				</app-loading>
			</template>
		</div>
	</div>
</template>

<script>
import {configuration as config, formatDate, initialize, options, widgetGroup} from './consts';
import {dimensionDefinition, metricDefinition} from '@/util/queryBuilder';
import AppLoading from '@/components/design/AppLoading.vue';
import {mapActions} from 'vuex';
import {status} from '@/util/consts/status';
import widgetMixin from '@/mixins/widgetMixin';
import {$sanitizeHtml} from '@/util/sanitizeHtml';

export default {
	name: 'Insight',
	components: {AppLoading},
	mixins: [widgetMixin],
	props: {
		previewConfiguration: {
			type: Object,
			default: null
		},
		readOnly: {
			type: Boolean,
			default: false
		}
	},
	widgetTypes() {
		return ['widget_insight_formula'];
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
		}
	},
	data() {
		return {
			intlFormatter: null,
			status
		};
	},
	computed: {
		colsCount() {
			return 12 / this.showResults.length;
		},
		position() {
			return this.preview
				? (this.previewConfiguration.options?.position ?? null)
				: this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'position');
		},
		betterColor() {
			return this.preview
				? (this.previewConfiguration.options?.betterColor ?? null)
				: this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'betterColor');
		},
		worseColor() {
			return this.preview
				? (this.previewConfiguration.options?.worseColor ?? null)
				: this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'worseColor');
		},
		betterText() {
			return this.preview
				? (this.previewConfiguration.options?.betterText ?? null)
				: this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'betterText');
		},
		worseText() {
			return this.preview
				? (this.previewConfiguration.options?.worseText ?? null)
				: this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'worseText');
		},
		sparklineVisible() {
			return this.preview
				? (this.previewConfiguration.options?.sparklineVisible ?? null)
				: this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'sparklineVisible');
		},
		sentimentVisible() {
			return this.preview
				? (this.previewConfiguration.options?.sentimentVisible ?? null)
				: this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'sentimentVisible');
		},
		insightName() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'insightName');
		},
		widgetConfiguration() {
			return this.preview
				? null
				: this.$store.getters['widgetInstances/configuration'](this.widgetInstanceId);
		},
		dimension() {
			return this.preview ? null : this.widgetConfiguration.data?.configuration.dimensions[0];
		},
		metric() {
			return this.preview ? null : this.widgetConfiguration.data?.configuration.metrics[0];
		},
		date() {
			return this.preview ? null : this.widgetConfiguration.data?.configuration.date;
		},
		periodDays() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'periodDays');
		},
		showPoints() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'showPoints');
		},
		smoothLine() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'smoothLine');
		},
		invertSentiment() {
			return this.preview
				? (this.previewConfiguration.options?.invertSentiment ?? null)
				: this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'invertSentiment');
		},
		topResults() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'topResults');
		},
		latestResult() {
			return this.preview
				? (this.previewConfiguration.options?.latestResult ?? null)
				: null;
		},
		insightConfig() {
			return this.insightId ? this.$store.getters['insightData/config'](this.insightId) : null;
		},
		insightId() {
			return this.preview
				? (this.previewConfiguration.options?.insightId ?? null)
				: this.$store.getters['widgetInstances/configuration'](this.widgetInstanceId).options?.insightId ?? null;
		},
		insightData() {
			if (this.preview) {
				return this.latestResult;
			}
			return this.insightId ? this.$store.getters['insightData/data'](this.insightId) : null;
		},
		insightLoading() {
			return this.insightId ? this.$store.getters['insightData/loading'](this.insightId) : null;
		},
		insightError() {
			return this.insightId ? this.$store.getters['insightData/error'](this.insightId) : null;
		},
		widgetLoading() {
			return this.$store.getters['widgetInstances/loading'](this.widgetInstanceId);
		},
		widgetError() {
			return this.$store.getters['widgetInstances/error'](this.widgetInstanceId);
		},
		widgetWarning() {
			return this.$store.getters['widgetInstances/warning'](this.widgetInstanceId);
		},
		showResults() {
			if (this.insightData.results) {
				return (this.insightData.results.length > 0
					? (this.preview ? [this.insightData.results[0]] : this.insightData.results)
					: [])
					.map((data) => ({
						name: this.insightName,
						paragraph: this.paragraphText(data.variables),
						chartOptions: this.chartOptions(data),
						sentiment: this.invertSentiment ? !data.variables.isUpwardsChange : data.variables.isUpwardsChange
					}));
			}
			if (this.insightData.insights) {
				return (this.insightData.insights.length > 0
					? (this.preview ? [this.insightData.insights[0]] : this.insightData.insights)
					: [])
					.map((data) => ({
						name: this.insightName,
						paragraph: this.paragraphText(data.variables),
						chartOptions: this.chartOptions(data),
						sentiment: this.invertSentiment ? !data.variables.isUpwardsChange : data.variables.isUpwardsChange
					}));
			}
			return [];
		},
		paragraphStyle() {
			return {
				fontFamily: this.fontFamily,
				color: this.fontColor,
				...this.textSizes[this.textSize]
			};
		},
		format() {
			return this.preview
				? (this.previewConfiguration.options?.format ?? null)
				: this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'format');
		},
		widgetSize() {
			return this.preview ? null : this.$store.getters['widgetInstances/size'](this.widgetInstanceId);
		},
		storyDimension() {
			return this.preview ? null : this.$store.getters['storyDetail/story'].layoutConfiguration.dimensions;
		},
		size() {
			return Math.min(
				this.storyDimension.width * this.widgetSize.width,
				this.storyDimension.height * this.widgetSize.height
			);
		},
		textSizes() {
			const baseFont = this.resizeFormula();
			return {
				paragraph: {
					fontSize: `${baseFont * this.fontScale}px`,
					fontWeight: 500
				},
				h1: {
					fontSize: `${baseFont * this.fontScale}px`
				},
				h2: {
					fontSize: `${baseFont * this.fontScale}px`
				}
			};
		}
	},
	watch: {
		insightId: {
			immediate: true,
			async handler(val) {
				if (val !== null && this.preview === false) {
					// Loading config and data for Editor
					if (this.insightConfig === null && this.readOnly === false) {
						await this.$store.dispatch('insightData/loadInsightConfig', val);
						this.setOption('periodDays', this.insightConfig.configuration.periodDays);
						this.setOption('topResults', this.insightConfig.configuration.topN);
						this.$store.commit('widgetInstances/setConfiguration', this.createWidgetInstanceConfiguration(this.insightConfig));
						// Loading only data for Presenter
					} else if (this.insightData === null) {
						this.$store.dispatch('insightData/loadInsightData', val);
					}
				}
			}
		},
		insightLoading: {
			immediate: true,
			handler(loading) {
				if (!this.preview && this.widgetLoading !== loading) {
					this.$store.commit('widgetInstances/setLoading', {
						widgetInstanceId: this.widgetInstanceId,
						loading
					});
				}
			}
		},
		insightData: {
			immediate: true,
			handler(data) {
				if (typeof data !== 'undefined' && !this.preview && this.widgetWarning !== (data !== null && data.results.length === 0)) {
					this.$store.commit('widgetInstances/setWarning', {
						widgetInstanceId: this.widgetInstanceId,
						warning: data !== null && data.results.length === 0
					});
				}
			}
		}
	},
	mounted() {
		[
			'insightName',
			'dimension',
			'metric',
			'date',
			'periodDays',
			'topResults'
		].forEach((val) => {
			this.$watch(val, this.updateInsightConfig);
		});
	},
	methods: {
		...mapActions('insights', ['loadInsights']),
		getSanitizeHtml(html) {
			return $sanitizeHtml(html);
		},
		createWidgetInstanceConfiguration(insightConfiguration) {
			return {
				widgetInstanceId: this.widgetInstanceId,
				configuration: {
					...this.widgetConfiguration,
					data: {
						configuration: {
							dimensions:
								[
									{
										column: insightConfiguration.configuration.dimensions[0],
										function: dimensionDefinition.NO_CHANGE
									}
								],
							metrics: [
								{
									column: insightConfiguration.configuration.metric,
									aggregation: insightConfiguration.configuration.aggregationFunction ?? metricDefinition.SUM
								}
							],
							date: {
								column: insightConfiguration.configuration.dateColumn,
								dataset: insightConfiguration.datasetId
							}
						},
						datasetId: insightConfiguration.datasetId,
						id: insightConfiguration.id,
						version: 'default/v0'
					}
				}
			};
		},
		// eslint-disable-next-line max-lines-per-function
		chartOptions(data) {
			this.$store.dispatch('storyDetail/generateColors', 2);
			return {
				legend: {
					show: false
				},
				xAxis: [
					{
						type: 'category',
						show: false,
						data: data.series.currentDate,
						scale: false
					},
					{
						type: 'category',
						show: false,
						data: data.series.previousDate,
						scale: false
					}
				],
				yAxis: {
					show: false
				},
				tooltip: {
					show: true,
					trigger: 'axis',
					axisPointer: {
						type: 'line'
					},
					formatter: (params) => params
						.map((seriesParams) => `${seriesParams.seriesName}<br>${seriesParams.marker}${formatDate(seriesParams.axisValue)}: ${seriesParams.value}`)
						.join('<br>')
				},
				series: [
					{
						data: data.series.currentMetric.map((value) => value ?? 0),
						name: 'Current',
						showSymbol: this.showPoints,
						smooth: this.smoothLine,
						symbol: 'emptyCircle',
						type: 'line',
						seriesLayoutBy: 'row',
						itemStyle: {
							showSymbol: true,
							color: this.$store.getters['storyDetail/graphColor'](0)
						},
						xAxisIndex: 0
					},
					{
						data: data.series.previousMetric.map((value) => value ?? 0),
						name: 'Previous',
						showSymbol: this.showPoints,
						smooth: this.smoothLine,
						symbol: 'emptyCircle',
						seriesLayoutBy: 'row',
						type: 'line',
						itemStyle: {
							showSymbol: true,
							color: this.$store.getters['storyDetail/graphColor'](1)
						},
						xAxisIndex: 1
					}
				]
			};
		},
		updateInsightConfig() {
			// eslint-disable-next-line max-len
			if (!this.preview && !this.readOnly && this.dimension && this.metric && this.metric && this.date && this.topResults && this.periodDays
			) {
				this.$store.dispatch('insightData/updateInsightConfig', {
					insightId: this.insightId,
					config: {
						name: this.insightName ?? 'My insight',
						type: 'PERIOD_OVER_PERIOD',
						datasetId: this.widgetConfiguration.data.datasetId,
						configuration: {
							dimensions: [this.dimension.column],
							metric: this.metric.column,
							aggregationFunction: this.metric.aggregation,
							dateColumn: this.date.column,
							limit: 5000,
							topN: this.topResults,
							periodDays: this.periodDays,
							referenceDate: null
						}
					}
				});
			}
		},
		paragraphText(variables) {
			let rawHtml = (this.format ?? '')
				.replace(/<a href="(?<href>[^"]*)" rel="(?<rel>[^"]*)">/gu, (match, href, rel) => `<a href="${href}" target="_blank" rel="${rel}">`)
				.replace(/\$[\w-]+/gu, (text) => this.$store.getters['widgetFacts/value'](text.substring(1)) ?? '...');

			rawHtml = rawHtml
				// eslint-disable-next-line prefer-named-capture-group
				.replace(/\{[^}]+\}/gu, (placeholder) => {
					const key = placeholder.slice(1, -1);
					return key in variables ? (variables[key] ?? 'None') : placeholder;
				});

			return $sanitizeHtml(rawHtml);
		},
		openLink() {
			const link = this.$refs.button.querySelector('a');

			if (link) {
				link.click();
			}
		},
		checkInsightData(data) {
			if (data !== null) {
				if (data.results) {
					return data.results.length > 0;
				}
				if (data.insights) {
					return data.insights.length > 0;
				}
			}
			return false;
		},
		checkForPreview() {
			return this.preview === true
				&& this.previewConfiguration?.options?.latestResult !== null
				&& this.previewConfiguration?.options?.latestResult?.insights?.length > 0;
		}
	}
};
</script>

<style scoped lang="scss">

.transition-background {
	transition: background-color ease-in-out 0.3s
}
.sentiment-text {
	font-size: 17px;
	vertical-align: middle;
	text-align: center;
	margin: auto;
}
.insight-card{
	font-size: 17px;
	border-radius: 4px;
}
.insight-card-better {
	color: map-get($ds-colors, 'success-700')!important;
	background: map-get($ds-colors, 'success-0');
	border: 1px solid map-get($ds-colors, 'success-200');
}
.insight-card-worse {
	color: map-get($ds-colors, 'error')!important;
	background: map-get($ds-colors, 'error-0');
	border: 1px solid map-get($ds-colors, 'error-100');
}
.sentiment-better {
	background-color: map-get($ds-colors, 'success');
	color: #FFFF;
}
.sentiment-worse {
	background-color: map-get($ds-colors, 'error-500');
	color: #FFFF;
}
.emoticon-color-better {
	color: map-get($ds-colors, 'success-700');
}
.emoticon-color-worse {
	color: map-get($ds-colors, 'error');
}
.line-separator{
	position: absolute;
	top: 0;
	left: 10%;
	right: 10%;
	border-top: 1px solid map-get($ds-colors, 'success-200');
}
.formula-transition-enter-active {
	transition: transform 750ms ease;
}
.formula-notification {
	p {
		font-weight: 500;
	}
}
</style>

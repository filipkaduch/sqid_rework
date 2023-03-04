import {chartConstants} from '@/util/consts/chartsConstants';
import {widgetTypes} from '@/util/consts/widgetTypes';

export default {
	props: {
		readOnly: Boolean
	},
	data: () => ({
		numColors: 4,
		widgetTypes
	}),
	computed: {
		resize() {
			return this.$store.state.widgetInstances.sizeSelectedWidget;
		},
		title() {
			return this.preview ? null : this.$store.getters['widgetInstances/instance'](this.widgetInstanceId)?.name;
		},
		displayName() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'displayName');
		},
		horizontalBar() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'horizontal');
		},
		horizontalFlip() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'horizontalFlip');
		},
		widgetType() {
			return this.$store.getters['widgetInstances/widgetType'](this.widgetInstanceId);
		},
		fontFamily() {
			return this.preview ? null : this.$store.getters['storyDetail/story'].layoutConfiguration.theme.font?.family;
		},
		fontScale() {
			return Math.min(1 / this.$store.getters['storyDetail/scale'], 2) ?? 1;
		},
		// eslint-disable-next-line max-lines-per-function,complexity
		defaultThemeOptions() {
			const separateContent = '#57727F';
			return {
				animationThreshold: 10000,
				animationDuration: 333,
				textStyle: {
					// TODO Roboto Mono is 'monospace'
					fontFamily: this.fontFamily,
					fontWeight: 500,
					fontSize: 14 * this.fontScale,
					color: chartConstants.colors.legend
				},
				tooltip: {
					textStyle: {
						fontWeight: 500,
						fontSize: 17 * this.fontScale
					}
				},
				title: [
					{
						show: Boolean(this.displayName),
						text: this.title,
						left: chartConstants.chartConst.CENTER,
						padding: 10,
						textStyle: {
							fontWeight: 500,
							fontSize: 23 * this.fontScale
						}
					}
				],
				grid: {
					top: (this.title && this.displayName) || this.timelineShow ? 50 : 10,
					...([widgetTypes.LINE_CHARTS, widgetTypes.BAR_CHARTS].includes(this.widgetType) ? {} : {bottom: 35}),
					containLabel: true
				},
				xAxis: {
					...(widgetTypes.BAR_CHART !== this.widgetType && {axisTick: false}),
					...(widgetTypes.LINE_CHARTS.includes(this.widgetType)
					|| (((widgetTypes.BAR_CHART === this.widgetType || widgetTypes.CATEGORY_BAR === this.widgetType) && (!this.horizontalBar && !this.horizontalFlip))
						|| ((!this.horizontalBar && !this.horizontalFlip) && this.widgetType === widgetTypes.BAR_MULTISERIES))
						? {
							axisLine: {
								show: true,
								lineStyle: {
									type: 'solid',
									color: chartConstants.colors.axis,
									width: 1
								}
							}
						}
						: {axisLine: false}),
					axisLabel: {
						color: separateContent,
						fontSize: 14 * this.fontScale,
						fontWeight: 400
					}
				},
				yAxis: {
					axisTick: false,
					...(widgetTypes.LINE_CHARTS.includes(this.widgetType)
						|| (widgetTypes.BAR_CHARTS.includes(this.widgetType) && (this.horizontalBar || this.horizontalFlip))
						? {
							axisLine: {
								show: true,
								lineStyle: {
									type: 'solid',
									color: chartConstants.colors.axis,
									width: 1
								}
							}
						}
						: {axisLine: false}),
					axisLabel: {
						color: separateContent,
						fontSize: 14 * this.fontScale,
						fontWeight: 400
					},
					...(widgetTypes.LINE_CHARTS.includes(this.widgetType)
						? {}
						: {
							splitLine: {
								lineStyle: {
									type: 'dashed',
									color: chartConstants.colors.split
								}
							}
						}),
					...(widgetTypes.BAR_CHARTS.includes(this.widgetType)
						? {
							splitLine:
							{
								lineStyle: {
									type: 'dashed',
									color: chartConstants.colors.split
								}
							}
						}
						: {}
					)
				},
				legend: {
					textStyle: {
						color: chartConstants.colors.legend,
						fontSize: 14 * this.fontScale,
						padding: [
							0,
							0,
							0,
							8
						],
						fontWeight: 400
					}
				}
			};
		}
	},
	watch: {
		widgetData(val) {
			if (val) {
				this.$store.commit('widgetInstances/setWarning', {
					widgetInstanceId: this.widgetInstanceId,
					warning: val.isWarning
				}, {root: true});
			}
		}
	},
	methods: {
		setOption(optionName, value) {
			this.$store.commit('widgetInstances/setOption', {
				widgetInstanceId: this.widgetInstanceId,
				optionName,
				value
			});
		},
		setOptionLegend(optionName, value) {
			this.$store.dispatch('widgetInstances/setOption', {
				widgetInstanceId: this.widgetInstanceId,
				optionName,
				value
			});
		},
		setFinishedRender(isFinished) {
			this.$store.dispatch('widgetInstances/setFinishedRender', {widgetInstanceId: this.widgetInstanceId, isRenderFinished: isFinished});
		}
	}
};

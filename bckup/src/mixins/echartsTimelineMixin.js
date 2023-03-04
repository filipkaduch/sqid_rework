import {chartConstants} from '@/util/consts/chartsConstants';
import leftArrow from '@/assets/leftTimelineArrow.svg';
import rightArrow from '@/assets/rightTimelineArrow.svg';
import {selectData} from '@/util/echartsWidgetsUtil';
import timelineMixin from '@/mixins/timelineMixin';
import {widgetTypes} from '@/util/consts/widgetTypes';
import merge from 'lodash/merge';

export default {
	mixins: [timelineMixin],
	data: () => ({
		widgetTypes,
		timelineFinished: false
	}),
	computed: {
		rawData() {
			return this.$store.getters['widgetData/rawData'](this.widgetInstanceId);
		},
		timelineDatatype() {
			return this.timelineShow ? this.rawData.columns.filter((column) => column.reference === 'Timeline')[0]?.dataType : null;
		},
		title() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'title');
		},
		horizontalFlip() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'horizontal');
		},
		widgetType() {
			return this.$store.getters['widgetInstances/widgetType'](this.widgetInstanceId);
		},
		timelineSeries() {
			return this.timelineShow
				? this.widgetData?.timeline?.timelineSeries.map((item) => selectData(item, this.selected, this.widgetData.coloring, this.widgetData?.comparer ?? null))
					?? []
				: [];
		},
		timelineData() {
			return this.timelineShow ? this.widgetData?.timeline?.timelineData : [];
		},
		timelineDatasets() {
			return this.timelineShow ? this.widgetData?.timeline?.timelineDatasets : [];
		},
		// TODO return with timelineseries and data in mixin or from widget
		timelineColors() {
			// if (this.timelineSeries.length > 0) {
			// const maxColors = this.timelineSeries.reduce((max, item) => max.series.data.length > item.series.data.length ? max : item);
			// return maxColors.series.data.map((item, index) => ({
			// index,
			// color: item.itemStyle.color
			// }));
			// }
			return [];
		},
		fontFamily() {
			return this.preview ? null : this.$store.getters['storyDetail/story'].layoutConfiguration.theme.font?.family;
		},
		fontScale() {
			return Math.min(1 / this.$store.getters['storyDetail/scale'], 2);
		},
		// eslint-disable-next-line max-lines-per-function
		themeOptions() {
			return {
				animationEasingUpdate: (k) => k,
				color: this.timelineColors,
				title: [
					{
						show: this.timelineShow && this.timeline?.fontSize !== 0,
						text: '',
						subtext: '',
						left: chartConstants.chartConst.RIGHT,
						right: '8%',
						bottom: this.horizontalFlip ? '25%' : '85%',
						z: 0,
						padding: 0,
						textStyle: {
							color: 'rgba(0,0,0,0.3)',
							fontWeight: 'bold',
							fontSize: this.timeline?.fontSize ?? 24 * this.fontScale,
							align: chartConstants.chartConst.RIGHT
						},
						subtextStyle: {
							align: chartConstants.chartConst.RIGHT
						}
					}
				],
				grid: {
					top: this.title ? 50 : 10,
					containLabel: true,
					bottom: 40
				},
				...(widgetTypes.LINE_CHART === this.widgetType
					? {}
					: {
						yAxis: {
							splitLine: {
								lineStyle: {
									color: chartConstants.colors.split
								}
							}
						}
					}
				),
				legend: {
					textStyle: {
						color: chartConstants.colors.legend
					}
				}
			};
		},
		dataOptions() {
			const series = this.widgetData?.baseOption?.series ?? this.widgetData?.series;
			return this.widgetData
				? {
					...(this.widgetData ?? {}),
					series
				}
				: {};
		},
		// eslint-disable-next-line max-lines-per-function
		timelineOptions() {
			return {
				timeline: {
					show: false,
					axisType: 'category',
					playInterval: this.playInterval,
					left: '0%',
					bottom: '0%',
					width: '80%',
					controlStyle: {
						showNextBtn: true,
						showPrevBtn: true,
						showPlayBtn: true,
						itemSize: 22,
						prevIcon: `image://${window.location.protocol}//${window.location.host}${leftArrow}`,
						nextIcon: `image://${window.location.protocol}//${window.location.host}${rightArrow}`,
						color: '#8C76C6'
					},
					lineStyle: {
						width: 3,
						color: '#C8D4DA'
					},
					checkpointStyle: {
						symbolSize: 14,
						color: '#E7E2F3',
						borderWidth: 1,
						borderColor: '#8C76C6'
					},
					itemStyle: {
						color: '#C8D4DA'
					},
					label: {
						show: false
					},
					progress: {
						lineStyle: {
							width: 3,
							color: '#8C76C6'
						},
						checkpointStyle: {
							symbolSize: 12,
							color: '#E7E2F3',
							borderWidth: 1,
							borderColor: '#8C76C6'
						},
						itemStyle: {
							color: '#8C76C6'
						},
						label: {
							show: true,
							interval: 2,
							rotate: 90
						}
					},
					emphasis: {
						controlStyle: {
							color: '#8C76C6',
							borderColor: '#8C76C6',
							itemSize: 20
						},
						checkpointStyle: {
							symbolSize: 12,
							color: '#E7E2F3',
							borderWidth: 1,
							borderColor: '#8C76C6'
						},
						itemStyle: {
							color: '#8C76C6'
						}
					},
					symbol: 'circle',
					symbolSize: 6,
					data: this.timelineData
				}
			};
		},
		timelineDataOptions() {
			if (this.timelineShow && this.widgetData) {
				return merge({}, this.dataOptions, this.timelineOptions, this.themeOptions);
			}
			return null;
		},
		timelineConfiguration() {
			return {
				interval: this.timeline?.interval ?? 30000,
				fontSize: this.timeline?.fontSize ?? 24
			};
		},
		playInterval() {
			return this.timelineData?.length > 0 ? ((this.timeline?.interval ?? 30000) / this.timelineData?.length) : 10000;
		},
		stepInterval() {
			const interval = this.timeline.interval ?? this.timelineConfiguration.interval;
			return (interval / this.timelineData?.length);
		}
	},
	watch: {
		state(newState) {
			this.setTimelineState(newState);
		},
		timelineShow: {
			handler() {
				if (this.timelineShow) {
					this.$store.commit('widgetTimeline/addId', this.widgetInstanceId);
				} else {
					this.$store.commit('widgetTimeline/removeId', this.widgetInstanceId);
				}
			},
			immediate: true
		}
	},
	methods: {
		updateTimeline(val) {
			this.$refs.chart.dispatchAction({
				type: 'timelineChange',
				currentIndex: val
			});
		},
		onTimelineStateChanged(evt) {
			this.timelineFinished = this.timelineData?.length - 1 === evt.currentIndex;
		},
		setTimelineState(state) {
			if (!this.$refs.chart) {
				return;
			}

			if ((state && this.timelineFinished) || state === null) {
				this.$refs.chart.dispatchAction({
					type: 'timelineChange',
					currentIndex: 0
				});

				if (state === null) {
					return;
				}
			}

			this.$refs.chart.dispatchAction({
				type: 'timelinePlayChange',
				playState: Boolean(state)
			});
		}
	}
};

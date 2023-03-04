<template>
	<div
		class="d-flex"
		:class="[readOnly ? 'scatter-map-range-input-container-read-only' : 'scatter-map-range-input-container']">
		<div class="my-auto timeline-buttons">
			<img width="20" height="20" src="@/assets/leftTimelineArrow.svg" @click="prevStep">
		</div>
		<div class="my-auto timeline-buttons mt-1" @click="play">
			<img v-if="isPlaying" width="30" height="30" src="@/assets/pauseTimeline.svg">
			<img v-else width="30" height="30" src="@/assets/playTimeline.svg">
		</div>
		<div class="my-auto timeline-buttons">
			<img width="20" height="20" src="@/assets/rightTimelineArrow.svg" @click="nextStep">
		</div>
		<vue-slider
			:model-value="value"
			:min="0"
			:max="numberOfValues"
			:contained="true"
			:adsorb="true"
			:marks="true"
			:hideLabel="true"
			tooltip="none"
			:process="true"
			class="slider-size mt-2 mx-3"
			@change="moveTimeline">
			<template #dot="{focus}">
				<div :class="['custom-dot', {focus}]" />
			</template>
			<template #step="{active}">
				<div :class="['custom-step', {active}]" />
			</template>
			<template #process="{style}">
				<div class="vue-slider-process slider-process" :style="style" />
			</template>
		</vue-slider>
		<div class="mt-1 timeline-buttons step-info">
			{{ currentStepValue }} / {{ lastStepValue }}
		</div>
	</div>
</template>

<script>
import {getFormatter} from '@/util/formatingUtil';
import timelineMixin from '@/mixins/timelineMixin';

export default {
	name: 'AppTimelineSlider',
	mixins: [timelineMixin],
	props: {
		widgetInstanceId: {
			type: String,
			default: null
		},
		values: {
			type: Array,
			required: true
		},
		map: {
			type: Boolean,
			default: false
		}
	},
	emits: ['update-timeline', 'update'],
	data() {
		return {
			value: 0,
			myInterval: null
		};
	},
	computed: {
		numberOfValues() {
			return this.values.length ? this.values.length - 1 : 0;
		},
		stepInterval() {
			const interval = this.timeline.interval ?? this.timelineConfiguration.interval;
			return Math.round(interval / this.numberOfValues);
		},
		isPlaying() {
			return this.$store.getters['widgetTimeline/playState'](this.widgetInstanceId) ?? false;
		},
		currentStepValue() {
			const formatter = getFormatter('DATETIME', 'timeline');
			return formatter(this.values[this.value]);
		},
		lastStepValue() {
			const formatter = getFormatter('DATETIME', 'timeline');
			return formatter(this.values[this.numberOfValues]);
		},
		readOnly() {
			return this.$store.getters['storyDetail/readOnly'];
		}
	},
	watch: {
		isPlaying(newValue) {
			if (newValue) {
				this.myInterval = setInterval(() => {
					if (this.value < this.numberOfValues) {
						this.value += 1;
					}
				}, this.stepInterval);
			} else {
				clearInterval(this.myInterval);
			}
		},
		value(newValue) {
			if (newValue === this.numberOfValues) {
				this.$store.commit('widgetTimeline/setState', {
					id: this.widgetInstanceId,
					playState: false
				});
			}
			if (this.map) {
				this.$emit('update', newValue);
			}
		}
	},
	methods: {
		moveTimeline(val) {
			this.value = val;
			this.$emit('update-timeline', val);
		},
		play() {
			this.$store.commit('widgetTimeline/setState', {
				id: this.widgetInstanceId,
				playState: !this.isPlaying
			});
			if (this.value === this.numberOfValues) {
				this.value = 0;
			}
		},
		nextStep() {
			this.value += 1;
		},
		prevStep() {
			this.value -= 1;
		}
	}
};
</script>

<style lang="scss" scoped>
.scatter-map-range-input-container {
	position: absolute;
	bottom: 2%;
	left: 5%;
	right: 5%;
	z-index: 2;
}

.scatter-map-range-input-container-read-only {
	width: 100%;
	position: fixed;
	bottom: 5%;
	left: 5%;
	right: 5%;
	z-index: 2;
}

.slider-size {
	flex-grow: 1;
}

.step-info {
	min-width: 15%;
	color: map-get($ds-colors, 'secondary-400');
}

.custom-dot {
	width: 16px;
	height: 16px;
	border: 2px solid map-get($ds-colors, 'secondary-400');
	border-radius: 100px;
	background-color: map-get($ds-colors, 'secondary-100');
	transition: all .3s;
}

.custom-step {
	margin-top: -1px;
	width: 6px;
	height: 6px;
	background-color: map-get($ds-colors, 'separate-content-200');
	border-radius: 100px;
}
.custom-step.active {
	margin-top: -1px;
	width: 6px;
	height: 6px;
	background-color: map-get($ds-colors, 'separate-content-200');
	border-radius: 100px;
}

.vue-slider-rail {
	height: 2px;
}

.slider-process {
	background-color: map-get($ds-colors, 'ds-secondary-400');
	width: 1px;
	z-index: 2;
}

.timeline-buttons {
	padding: 0 11px;
}
</style>

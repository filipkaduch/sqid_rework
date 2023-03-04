<template>
	<div>
		<hr role="separator" aria-orientation="horizontal" class="dropdown-divider w-100">
		<ds-box v-if="headingText" flex-type="row">
			<ds-text>{{ $t(headingText) }}</ds-text>
		</ds-box>

		<div class="pb-1">
			<vue-slider
				:model-value="sliderValue"
				:disabled="disabled"
				:min="minValue"
				:max="maxValue"
				:interval="interval"
				:tooltip="'always'"
				:contained="true"
				:lazy="true"
				:marks="marks"
				:use-keyboard="!editing"
				class="mt-5 mb-4"
				@drag-start="dragStart"
				@drag-end="dragStop"
				@dragging="draggingHandler"
				@change="update">
				<template #tooltip>
					<div
						class="vue-slider-dot-tooltip-inner vue-slider-dot-tooltip-inner-top vue-slider-dot-tooltip-inner-focus d-flex justify-content-center"
						style="min-height: 24.8px">
						<span
							ref="slider-tooltip"
							:contenteditable="!disabled"
							class="vue-slider-dot-tooltip-text p-1"
							@keydown="ignoreInvalid"
							@blur="update"
							@focus="editing = true"
							v-text="dragging ? dragValue : value" />
						<span v-if="unit" class="vue-slider-dot-tooltip-text py-1 pr-1">{{ unit }}</span>
					</div>
				</template>
			</vue-slider>
		</div>
	</div>
</template>

<script>
import widgetControlComponentMixin from '@/mixins/widgetControlComponentMixin';

export default {
	name: 'Slider',
	mixins: [widgetControlComponentMixin],
	props: {
		value: {
			type: Number,
			default: null
		},
		disabled: {
			type: Boolean,
			default: false
		},
		minValue: {
			type: Number,
			default: 1
		},
		maxValue: {
			type: Number,
			default: 100
		},
		interval: {
			type: Number,
			default: 1
		},
		unit: {
			type: String,
			default: null
		},
		mapType: {
			type: Boolean,
			default: false
		}
	},
	emits: ['update:value'],
	widgetControlTypes() {
		return ['widget_control_slider'];
	},
	data() {
		return {
			editing: false,
			dragging: false,
			dragValue: 0
		};
	},
	computed: {
		sliderValue() {
			return Number(this.value < this.minValue ? this.minValue : this.value);
		},
		marks() {
			return {
				[this.minValue.toString()]: {
					label: this.minValue + (this.unit ? ` ${this.unit}` : ''),
					labelStyle: {
					}
				},
				[this.maxValue.toString()]: {
					label: this.maxValue + (this.unit ? ` ${this.unit}` : ''),
					labelStyle: {
						'padding-right': this.maxValue > 1000 ? '40px' : '10px'
					}
				}
			};
		}
	},
	watch: {
		value: {
			handler() {
				this.dragValue = this.value;
			},
			immediate: true
		}
	},
	methods: {
		ignoreInvalid(evt) {
			const position = window.getSelection().getRangeAt(0);
			// left/right arrow, backspace, delete
			if (evt.keyCode === 39 || evt.keyCode === 37 || evt.keyCode === 8 || evt.keyCode === 46) {
				return;
			}
			// arrow up
			if (evt.keyCode === 38) {
				if (this.value < this.maxValue) {
					this.emitValue(this.value + this.interval);
				}
				evt.preventDefault();
				return;
			}
			// arrow down
			if (evt.keyCode === 40) {
				if (this.internalValue > this.minValue) {
					this.emitValue(this.value - this.interval);
				}
				evt.preventDefault();
				return;
			}
			// enter
			if (evt.keyCode === 13) {
				evt.preventDefault();
				evt.target.blur();
				this.editing = false;
				return;
			}
			if (this.value > 0 && !evt.target.innerText.startsWith('-') && evt.keyCode === 109 && position.startOffset === 0) {
				return;
			}
			if (evt.key.match(/^[0-9]/u)) {
				if ((this.value < 0 || evt.target.innerText.startsWith('-')) && position.startOffset === 0) {
					evt.preventDefault();
				} else {
					return;
				}
			}
			evt.preventDefault();
		},
		dragStart() {
			this.dragging = true;
		},
		dragStop() {
			this.dragging = false;
			if (this.value !== this.dragValue) {
				this.update(this.dragValue);
			}
		},
		draggingHandler(value) {
			if (this.editing) {
				this.editing = false;
				this.$refs['slider-tooltip'].blur();
			}
			this.dragValue = value;
		},
		emitValue(newValue) {
			this.$emit('update:value', newValue);
		},
		update(evt) {
			let newValue = isNaN(evt) ? parseInt((evt.target.innerText || '').trim(), 10) : evt;
			newValue = isNaN(newValue)
				? this.minValue
				: Math.min(
					Math.max(
						(Math.round((newValue - this.minValue) / this.interval) * this.interval) + this.minValue,
						this.minValue
					),
					this.maxValue
				);
			this.emitValue(newValue);
			this.$refs['slider-tooltip'].innerText = newValue.toString();
			this.editing = false;
		}
	}
};
</script>

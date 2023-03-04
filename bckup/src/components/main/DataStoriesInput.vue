<template>
	<ds-box class="position-relative">
		<ds-box v-if="title" padding-bottom="S">
			<ds-text variant="body" color="display-content">
				{{ $t(title) }}
			</ds-text>
		</ds-box>
		<ds-box v-if="$slots.icon" class="ds-input-icon">
			<slot name="icon" />
		</ds-box>
		<ds-box v-if="$slots.rightIcon" class="ds-input-right-icon">
			<slot name="rightIcon" />
		</ds-box>
		<input
			v-model="inputValue"
			class="form-control text-color"
			:class="{'input-icon-padding': $slots.icon, 'input-right-icon-padding': $slots.rightIcon, 'border-0 border-radius-0': !hasBorder}"
			:style="inputStyle"
			:placeholder="placeholder"
			:type="type"
			:min="min"
			:max="max">
		<span v-if="unit" class="input-unit">{{ unit }}</span>
		<div v-if="type === INPUT_TYPES.NUMBER && !hideNumberButtons" class="input-controls d-flex position-absolute">
			<ds-btn
				variant="secondary"
				small
				icon-only
				class="btn-square p-0 m-0 mr-1 d-flex align-items-center justify-content-center"
				@click="inputValue <= min ? min : inputValue -= step">
				<template #icon>
					<ds-icon name="icon-minus-sign" alt="minus" />
				</template>
			</ds-btn>
			<ds-btn
				variant="secondary"
				small
				icon-only
				class="btn-square p-0 m-0 d-flex align-items-center justify-content-center"
				@click="inputValue >= max ? max : inputValue += step">
				<template #icon>
					<ds-icon name="icon-plus-sign" alt="plus" />
				</template>
			</ds-btn>
		</div>
	</ds-box>
</template>

<script>
const INPUT_TYPES = {
	TEXT: 'text',
	PASSWORD: 'password',
	EMAIL: 'email',
	NUMBER: 'number',
	URL: 'url',
	TEL: 'tel',
	SEARCH: 'search',
	RANGE: 'range',
	COLOR: 'color',
	DATE: 'date',
	TIME: 'time',
	DATETIME: 'datetime',
	DATETIME_LOCAL: 'datetime-local',
	MONTH: 'month',
	WEEK: 'week'
};

export default {
	name: 'DataStoriesInput',
	props: {
		type: {
			type: String,
			default: 'text'
		},
		hasBorder: {
			type: Boolean,
			default: true
		},
		placeholder: {
			type: String,
			default: ''
		},
		value: {
			type: [
				String,
				Number
			],
			default: null
		},
		debounce: {
			type: Boolean,
			default: false
		},
		blockEmit: {
			type: Boolean,
			default: false
		},
		max: {
			type: Number,
			default: Number.MAX_SAFE_INTEGER
		},
		min: {
			type: Number,
			default: Number.MIN_SAFE_INTEGER
		},
		lg: {
			type: Boolean,
			default: null
		},
		width: {
			type: String,
			default: '100%'
		},
		md: {
			type: Boolean,
			default: false
		},
		sm: {
			type: Boolean,
			default: false
		},
		step: {
			type: Number,
			default: 1
		},
		unit: {
			type: String,
			default: null
		},
		title: {
			type: String,
			default: ''
		},
		textColor: {
			type: String,
			default: ''
		},
		hideNumberButtons: {
			type: Boolean,
			default: false
		}
	},
	emits: ['update', 'update:value'],
	data() {
		return {
			INPUT_TYPES,
			timeout: null,
			isNumberDefault: this.type === INPUT_TYPES.NUMBER && this.lg === null,
			mdOrDefault: this.md ? '31px !important' : '36px',
			checkLg: this.lg === null || this.lg === true,
			inputValue: this.type === INPUT_TYPES.NUMBER ? Number(this.value) : this.value
		};
	},
	computed: {
		inputStyle() {
			const heightComputed = () => {
				if (this.isNumberDefault) {
					return this.mdOrDefault;
				} else if (this.sm) {
					return '26.8px !important';
				} else if (this.checkLg) {
					return '48px';
				}
				return this.mdOrDefault;
			};

			return {
				height: heightComputed(),
				width: this.width
			};
		}
	},
	watch: {
		value(value) {
			this.inputValue = this.type === INPUT_TYPES.NUMBER ? Number(value) : value;
		},
		inputValue(value) {
			if (!this.blockEmit) {
				if (this.debounce) {
					if (this.timeout) {
						clearTimeout(this.timeout);
					}
					this.timeout = setTimeout(() => {
						this.$emit('update:value', value);
						this.$emit('update', value);
					}, 500);
				} else {
					this.$emit('update:value', value);
					this.$emit('update', value);
				}
			}
		}
	}
};
</script>

<style lang="scss" scoped>
input {
	border-color: map-get($ds-colors, 'separate-content-400');
	color: map-get($ds-colors, 'display-content-700');
	font-size: 14px;
	line-height: 20px;
	height: 36px !important;
	border-radius: 4px;
}
input::placeholder {
	color: map-get($ds-colors, 'display-content-300');
}
.input-controls {
	right: 8px;
	top: 6px;
}
.input-unit {
	top: 8px;
	color: map-get($ds-colors, 'display-content-700');
	right: calc(100% - 40px);
	position: absolute;
}
.input-icon-padding {
	padding-left: 50px;
}
.input-right-icon-padding {
	padding-right: 50px;
}
.ds-input-icon {
	position: absolute;
	top: 50%;
	left: 16px;
	transform: translate(0, -50%);
}
.ds-input-right-icon {
	position: absolute;
	top: 50%;
	right: 16px;
	transform: translate(0, -50%);
}

.btn-square {
	width: 24px;
	height: 24px;
	background: white;
	border: 1px solid map-get($ds-colors, 'separate-content-400');
	box-sizing: border-box;
	box-shadow: 0 2px 6px map-get($ds-colors, 'separate-content-100');
	border-radius: 4px;
}

// Hide default number arrows/spinners
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

/* Firefox */
input[type=number] {
	-moz-appearance: textfield;
}

</style>

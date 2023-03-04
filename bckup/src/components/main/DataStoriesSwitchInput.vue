<template>
	<ds-box class="position-relative">
		<input
			v-model="inputValue"
			class="form-control text-color"
			:style="inputStyle"
			:placeholder="placeholder"
			type="number"
			:min="min"
			:max="max">
		<div class="input-controls d-flex position-absolute">
			<ds-btn
				variant="secondary"
				:disabled="inputValue === null"
				small
				icon-only
				class="btn-square p-0 m-0 mr-1 d-flex align-items-center justify-content-center"
				@click="handleBtnAction(true)">
				<template #icon>
					<ds-icon name="icon-minus-sign" alt="minus" />
				</template>
			</ds-btn>
			<ds-btn
				variant="secondary"
				:disabled="inputValue === max"
				small
				icon-only
				class="btn-square p-0 m-0 d-flex align-items-center justify-content-center"
				@click="handleBtnAction(false)">
				<template #icon>
					<ds-icon name="icon-plus-sign" alt="plus" />
				</template>
			</ds-btn>
		</div>
	</ds-box>
</template>

<script lang="ts">
import {defineComponent, ref, Ref, watch, computed} from 'vue';

export default defineComponent({
	name: 'DataStoriesSwitchInput',
	props: {
		placeholder: {
			type: String,
			default: ''
		},
		value: {
			type: Number,
			default: null
		},
		entryValue: {
			type: Number,
			default: 10
		},
		max: {
			type: Number,
			default: Number.MAX_SAFE_INTEGER
		},
		min: {
			type: Number,
			default: Number.MIN_SAFE_INTEGER
		},
		step: {
			type: Number,
			default: 1
		}
	},
	emits: ['update:value', 'update'],
	setup(props, {emit}) {
		const timeout: Ref<any> = ref(null);
		const inputValue: Ref<number | null> = ref(null);
		const inputStyle = computed(() => ({
			height: '36px',
			width: '100%'
		}));

		watch(inputValue, (val) => {
			if (timeout.value) {
				clearTimeout(timeout.value);
			}
			timeout.value = setTimeout(() => {
				emit('update:value', val);
				emit('update', val);
			}, 500);
		});

		watch(() => props.value, (val) => {
			if (!val) {
				inputValue.value = null;
				// eslint-disable-next-line no-negated-condition
			} else if (!isNaN(val)) {
				inputValue.value = parseInt(String(val), 10);
			} else {
				inputValue.value = val;
			}
			if (inputValue.value && inputValue.value > props.max) {
				inputValue.value = props.max;
			}
		}, {immediate: true});

		const handleBtnAction = (decrement: boolean = false) => {
			if (decrement) {
				if (inputValue.value && inputValue.value <= props.min) {
					inputValue.value = null;
				} else if (inputValue.value && inputValue.value > props.min) {
					inputValue.value -= props.step;
				}
			} else {
				// eslint-disable-next-line no-lonely-if
				if (!inputValue.value) {
					inputValue.value = props.entryValue;
				} else if (inputValue.value <= props.max) {
					inputValue.value += props.step;
				}
			}
		};

		return {
			inputStyle,
			inputValue,
			handleBtnAction
		};
	}
});
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

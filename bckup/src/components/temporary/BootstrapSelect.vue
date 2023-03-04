<template>
	<select v-model="selected" class="form-control" :class="[size ? 'form-control-' + size : '']" :disabled="disabled">
		<option
			v-for="option in options"
			:key="option"
			:value="valueField ? option[valueField] : option"
			:disabled="option.disabled ?? false"
			:selected="valueField ? option[valueField] === value : option === value">
			{{ textField ? option[textField] : option }}
		</option>
	</select>
</template>

<script lang="ts">
import {Ref, ref, watchEffect, defineComponent, onMounted, watch} from 'vue';
import isEqual from 'lodash/isEqual';

export default defineComponent({
	name: 'BootstrapSelect',
	props: {
		options: {
			type: Array,
			default: () => []
		},
		value: {
			type: String || Object,
			required: true
		},
		size: {
			type: String,
			default: null
		},
		textField: {
			type: String,
			default: null
		},
		valueField: {
			type: String,
			default: null
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	emits: ['update:value'],
	setup(props, {emit}) {
		const selected: Ref<String | Object | null> = ref(null);

		onMounted(() => {
			if (props.options.filter((item: any) => isEqual(item.value, props.value)).length > 0) {
				selected.value = props.value;
			}
		});

		watch(() => props.value, (val) => {
			if (props.options.filter((item: any) => isEqual(item.value, props.value)).length > 0
				|| props.options.filter((item: any) => item.selected).length > 0) {
				selected.value = val;
			}
		}, {deep: true, immediate: true});

		watchEffect(() => {
			if (selected.value !== props.value) {
				emit('update:value', selected.value);
			}
		});

		return {
			selected
		};
	}
});
</script>

<style scoped>

</style>

<template>
	<ul class="b-form-tags-list list-unstyled mb-0 d-flex flex-wrap align-items-center flex-grow-1 p-1">
		<li
			v-for="(val, index) in value" :key="val + index"
			class="badge b-form-tag d-inline-flex align-items-baseline mw-100" :class="[tagClass + ' ' + 'badge-' + tagVariant]">
			<span class="b-form-tag-content flex-grow-1 text-truncate">{{ val }}</span>
			<button
				aria-keyshortcuts="Delete" type="button" aria-label="Remove tag" class="close b-form-tag-remove"
				@click="removeTag(index)">
				×
			</button>
		</li>
		<li role="none" aria-live="off" class="b-form-tags-field flex-grow-1">
			<div role="group" class="d-flex">
				<input
					v-model="input"
					:placeholder="$t(placeholder)" type="text"
					class="b-form-tags-input w-100 flex-grow-1 p-0 pl-1 m-0 bg-transparent border-0"
					style="outline: 0px; min-width: 5rem;">
				<button
					type="button"
					:disabled="!input"
					:class="{invisible: !input}"
					class="btn b-form-tags-button py-0 btn-outline-secondary disabled"
					style="font-size: 90%;"
					@click="addTag">
					Add
				</button>
			</div>
		</li>
	</ul>
</template>

<script>
import {defineComponent, ref} from 'vue';
import cloneDeep from 'lodash/cloneDeep';

export default defineComponent({
	name: 'BootstrapTags',
	props: {
		value: {
			type: Array,
			required: true
		},
		placeholder: {
			type: String,
			default: 't_AddTags'
		},
		tagClass: {
			type: String,
			default: ''
		},
		tagVariant: {
			type: String,
			default: 'secondary'
		}
	},
	emits: ['update:value'],
	setup(props, {emit}) {
		const input = ref(null);
		const addTag = () => {
			if (input.value) {
				const newVal = [...props.value, input.value];
				emit('update:value', newVal);
				input.value = null;
			}
		};
		const removeTag = (index) => {
			const clonedValue = cloneDeep(props.value);
			clonedValue.splice(index, 1);
			emit('update:value', clonedValue);
		};
		return {
			addTag,
			removeTag,
			input
		};
	}
});
</script>

<style scoped>

</style>

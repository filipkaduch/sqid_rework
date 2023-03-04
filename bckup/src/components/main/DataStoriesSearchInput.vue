<template>
	<ds-input
		v-model:value="input"
		width="100%"
		:lg="false"
		:debounce="debounce"
		:placeholder="$t('t_search')">
		<template #rightIcon>
			<ds-icon name="ds-icon-search-input" />
		</template>
	</ds-input>
</template>

<script lang="ts">
import {defineComponent, reactive, watch, toRefs} from 'vue';

export default defineComponent({
	name: 'DataStoriesSearchInput',
	props: {
		search: {
			type: String,
			required: true
		},
		debounce: {
			type: Boolean,
			default: false
		}
	},
	emits: ['update:search'],
	setup(props, {emit}) {
		const state = reactive({
			inputValue: '',
			input: props.search
		});

		watch(() => props.search, (value) => {
			state.input = value;
		});

		watch(() => state.input, (value) => {
			state.inputValue = value;
		});

		watch(() => state.inputValue, (value) => {
			emit('update:search', value);
		});

		return {
			...toRefs(state)
		};
	}
});
</script>

<style scoped>

</style>

<template>
	<app-btn
		variant="ghost"
		:small="small"
		icon-only
		class="d-flex align-items-center justify-content-center"
		@click="emitClose">
		<template #icon>
			<app-icon :fill="fill" name="icon-close" alt="Close" />
		</template>
	</app-btn>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import {DsColorsTypes} from '@/styles/exportFlamingo/types';

export default defineComponent({
	props: {
		small: {
			type: Boolean,
			default: false
		},
		fill: {
			type: String as PropType<DsColorsTypes | null>,
			default: 'display-content'
		}
	},
	emits: ['close'],
	setup(props, {emit}) {
		const emitClose = () => {
			emit('close');
		};
		return {
			emitClose
		};
	}

});
</script>

<style scoped>
</style>

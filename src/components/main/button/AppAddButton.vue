<template>
	<app-btn
		variant="ghost"
		:small="small"
		icon-only
		class="d-flex align-items-center justify-content-center"
		@click="emitAdd">
		<template #icon>
			<app-icon name="icon-plus-sign" alt="plus" />
		</template>
	</app-btn>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
	props: {
		small: {
			type: Boolean,
			default: false
		}
	},
	emits: ['close', 'add'],
	setup(props, {emit}) {
		const emitAdd = () => {
			emit('add');
		};
		return {
			emitAdd
		};
	}

});
</script>

<style scoped>
</style>

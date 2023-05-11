<template>
	<inline-svg v-if="svg" :class="[`app-fill-${fill}`]" :src="svg" :style="{opacity}" />
</template>

<script lang="ts">
import {defineComponent, PropType, computed} from 'vue';
import inlineSvg from 'vue-inline-svg';
import {AppColorsTypes} from '@/styles/values/types';

export default defineComponent({
	name: 'AppIcon',
	components: {
		inlineSvg
	},
	props: {
		name: {
			type: String,
			default: null
		},
		fill: {
			type: String as PropType<AppColorsTypes>,
			default: 'not-set'
		},
		opacity: {
			type: Number,
			default: null
		}
	},
	setup(props) {
		// @ts-ignore
		const modules = import.meta.glob('/src/assets/**/*.svg', {
			as: 'url',
			eager: true
		});
		const svg = computed(() => modules?.[`/src/assets/icons/${props.name}.svg`]);
		return {
			svg
		};
	}
});
</script>

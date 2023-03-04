<template>
	<inline-svg v-if="svg" :class="[`ds-fill-${fill}`]" :src="svg" :style="{opacity}" />
</template>

<script lang="ts">
import {defineComponent, PropType, computed} from 'vue';
import inlineSvg from 'vue-inline-svg';
import {DsColorsTypes} from '@/styles/exportFlamingo/types';

export default defineComponent({
	name: 'DataStoriesIcon',
	components: {
		inlineSvg
	},
	props: {
		name: {
			type: String,
			default: null
		},
		fill: {
			type: String as PropType<DsColorsTypes>,
			default: 'not-set'
		},
		opacity: {
			type: Number,
			default: null
		}
	},
	setup(props) {
		// @ts-ignore
		const widgetIcons = import.meta.glob('/src/assets/widgets/**/*', {
			as: 'url',
			eager: true
		});
		// @ts-ignore
		const modules = import.meta.glob('/src/assets/**/*.svg', {
			as: 'url',
			eager: true
		});
		const svg = computed(() => modules?.[`/src/assets/${props.name}.svg`]
			?? widgetIcons?.[`/src/assets/widgets/${props.name}/icon.svg`]
			?? widgetIcons?.[`/src/assets/widgets/${props.name}.svg`]);
		return {
			svg,
			widgetIcons
		};
	}
});
</script>

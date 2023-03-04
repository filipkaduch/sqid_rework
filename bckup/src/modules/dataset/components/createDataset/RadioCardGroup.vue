<template>
	<div class="grid-container" :class="{'max-width-card': explorerIcon}">
		<radio-card
			v-for="(item, key) in items"
			:id="key.toString()"
			:key="key"
			:item="item"
			:horizontal="horizontal"
			:active="key === selected"
			:explorer-icon="explorerIcon"
			@selected="$emit('selected', $event)" />
	</div>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import {defineComponent, PropType} from 'vue';
import RadioCard from './RadioCard.vue';
// eslint-disable-next-line no-unused-vars
import {SelectTypes} from '@/modules/dataset/components/createDataset/types';

export default defineComponent({
	name: 'RadioCardGroup',
	components: {RadioCard},
	props: {
		items: {
			type: Object as PropType<SelectTypes>,
			required: true
		},
		selected: {
			type: String,
			required: true
		},
		horizontal: {
			type: Boolean,
			default: false
		},
		explorerIcon: {
			type: Boolean,
			default: false
		}
	},
	emits: ['selected']
});
</script>

<style lang="scss" scoped>
.grid-container {
	display: grid;
	gap: 1rem;
	grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
}
.grid-container.max-width-card {
	grid-template-columns: repeat(auto-fit, minmax(180px, 180px));
}
</style>

<template>
	<div class="d-flex justify-content-start">
		<ds-box
			v-for="(item, key) in items"
			:key="key"
			class="cursor-pointer user-select-none"
			:class="{'active': key === selected}"
			border-radius="big"
			align-y="center"
			align="left"
			padding-bottom="S"
			@click="$emit('selected', key)">
			<ds-box
				flex-type="column"
				padding-top="S"
				padding-left="NONE"
				align-y="top"
				align="center">
				<ds-text variant="bodyMedium" :class="{'active-source': key === selected}">
					{{ $t(item.text) }}
				</ds-text>
			</ds-box>
		</ds-box>
	</div>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import {defineComponent, PropType} from 'vue';
// eslint-disable-next-line no-unused-vars
import {SelectTypes} from '@/modules/dataset/components/createDataset/types';

export default defineComponent({
	name: 'ImportTypesList',
	props: {
		items: {
			type: Object as PropType<SelectTypes>,
			required: true
		},
		selected: {
			type: String,
			required: true
		}
	},
	emits: ['selected']
});
</script>

<style lang="scss" scoped>
.active-source {
	border-bottom: 2px solid map-get($ds-colors, 'primary');
}
</style>

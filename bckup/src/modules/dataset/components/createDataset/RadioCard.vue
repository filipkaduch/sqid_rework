<template>
	<ds-box
		class="cursor-pointer upload-type-card user-select-none"
		:class="{active, 'disabled-radio-card': item.disabled}"
		border="separate"
		border-radius="big"
		:align="align"
		align-y="center"
		:flex-type="explorerIcon ? 'row' : ''"
		padding="M"
		@click="$emit('selected', id)">
		<ds-box :align="align" :flex-type="horizontal ? 'row' : 'column'">
			<ds-icon
				v-if="explorerIcon"
				:fill="item.disabled ? 'separate-content-500' : 'secondary-500'"
				:name="item.icon" />
			<ds-icon v-else :name="item.icon" :alt="item.icon" />
			<ds-box :align="align" :padding-top="horizontal ? 'NONE' : 'S'" :padding-left="horizontal ? 'S' : 'NONE'" :align-y="horizontal ? 'center' : 'top'">
				<ds-text variant="bodyMedium" :class="{'text-center': explorerIcon}" :color="item.disabled ? 'separate-content-400' : explorerIcon ? 'display-content-700' : ''">
					{{ $t(item.text) }}
				</ds-text>
			</ds-box>
		</ds-box>
	</ds-box>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import {defineComponent, PropType} from 'vue';
// eslint-disable-next-line no-unused-vars
import {SelectTypesItem} from '@/modules/dataset/components/createDataset/types';
// eslint-disable-next-line no-unused-vars
import {Align} from '@/components/main/layout/utils/types';

export default defineComponent({
	name: 'RadioCard',
	props: {
		id: {
			type: [String, Number],
			required: true
		},
		item: {
			type: Object as PropType<SelectTypesItem>,
			required: true
		},
		horizontal: {
			type: Boolean,
			default: false
		},
		active: {
			type: Boolean,
			default: false
		},
		explorerIcon: {
			type: Boolean,
			default: false
		}
	},
	emits: ['selected'],
	setup(props) {
		const align: Align = props.horizontal ? 'left' : 'center';
		return {
			align
		};
	}
});
</script>

<style lang="scss" scoped>
.upload-type-card:hover {
	background-color: map-get($ds-colors, 'interaction-0');
}

.max-width-card {
	max-width: calc(100% / 6);
}

.disabled-radio-card {
	pointer-events: none;
	background-color: map-get($ds-colors, 'separate-content-0');
}

.upload-type-card.active {
	background-color: map-get($ds-colors, 'interaction-0');
	box-shadow: 0 0 0 1px map-get($ds-colors, 'interaction-500');
	border-color: map-get($ds-colors, 'interaction-500')!important;
	pointer-events: none;
}
</style>

<template>
	<ds-inline gap="S">
		<ds-inline-item
			v-for="(item) in selectedItems"
			:key="`${item.selectLabel}`"
			class="mb-1 inline-tag">
			<ds-box class="ds-tag position-relative" flex-type="row" border-radius="small">
				<ds-text class="truncated">
					{{ item.selectLabel }}
				</ds-text>
				<ds-btn
					variant="interaction"
					:small="true"
					class="show-cross d-flex position-absolute justify-content-center align-items-center h-100 p-0"
					style="right: 0; top: 0;"
					icon-only
					@click="removeValue(item)">
					<template #icon>
						<ds-icon name="ds-icon-cross" class="p-0" alt="Remove tag" />
					</template>
				</ds-btn>
			</ds-box>
		</ds-inline-item>
		<ds-multi-select
			v-model:selected="selectedItems"
			:items="items"
			:placement="placement"
			:container="container"
			:select-all="true"
			:has-search="true"
			:auto-size="false"
			:clear-btn="false"
			:create-btn="false">
			<template #triggerContent>
				<ds-btn variant="secondary" :small="true">
					<template #icon>
						<ds-icon name="icon-plus-sign" alt="Add item" />
					</template>
					{{ placeholder }}
				</ds-btn>
			</template>
		</ds-multi-select>
	</ds-inline>
</template>

<script lang="ts">
/* eslint-disable no-unused-vars */
import {defineComponent, PropType, reactive, toRefs, watch} from 'vue';
import {PlacementVariants, PopupListItem} from '@/components/main/layout/utils/types';

/* Usage (value is required in each item): <ds-tags :items="[{selectLabel: 'LABEL', value: 'VALUE'}]" /> */

export default defineComponent({
	name: 'DataStoriesTags',
	props: {
		placeholder: {
			type: String,
			default: 'Add values'
		},
		container: {
			type: [
				String,
				Object,
				Element,
				Boolean
			],
			default: 'body'
		},
		items: {
			type: Array as PropType<PopupListItem<string>[]>,
			default: () => []
		},
		placement: {
			type: String as PropType<PlacementVariants>,
			default: 'bottom'
		}
	},
	emits: ['selected'],
	setup(props, {emit}) {
		const state = reactive({
			selectedItems: [] as any
		});

		watch(() => state.selectedItems, (value: any) => {
			emit('selected', value);
		});

		const removeValue = (evt: any) => {
			const selItemIndex = state.selectedItems.indexOf(evt);
			state.selectedItems.splice(selItemIndex, 1);
			emit('selected', state.selectedItems);
		};

		return {
			...toRefs(state),
			removeValue
		};
	}
});
</script>

<style lang="scss" scoped>
.ds-tag {
	height: 22px;
	padding: 2px 8px 2px 8px;
	background-color: map-get($ds-colors, 'interaction-600');
}

.truncated {
	white-space: nowrap;
	overflow: hidden;
	max-width: 95px;
	color: map-get($ds-colors, 'white');
	text-overflow: ellipsis;
}

.show-cross {
	visibility: hidden !important;
}

.inline-tag:hover .show-cross {
	visibility: visible !important;
}

</style>

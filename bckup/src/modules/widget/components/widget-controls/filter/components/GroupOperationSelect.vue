<template>
	<ds-select
		:items="andOr"
		max-width
		:container="`.add-${index}`">
		<template #triggerContent>
			<ds-box align="center">
				<ds-inline-item :width="75" :class="`add-${index}`">
					<ds-box
						border="separate"
						border-radius="basic"
						class="cursor-pointer ds-bg-separate-content-0"
						flex-type="row"
						align="center"
						padding-x="S">
						<ds-text class="pl-1" color="display-content-700" variant="body">
							{{ filter.groupOperation }}
						</ds-text>
						<ds-icon name="ds-icon-chevron-down" />
					</ds-box>
				</ds-inline-item>
			</ds-box>
		</template>
		<template #selectContent>
			<div class="dropdown-item" @click="emit('updateGroupOperation', filterLogic.AND, index)">{{ $t('filters.and') }}</div>
			<div class="dropdown-item" @click="emit('updateGroupOperation', filterLogic.OR, index)">{{ $t('filters.or') }}</div>
		</template>
	</ds-select>
</template>

<script setup lang="ts">
import {filterLogic} from '@/util/queryBuilder';

// script setup has problem with this one
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
	filter: {
		type: Object,
		default: null
	},
	index: {
		type: Number,
		default: null
	}
});
const emit = defineEmits(['updateGroupOperation']);

const andOr = [{value: filterLogic.AND}, {value: filterLogic.OR}];

</script>

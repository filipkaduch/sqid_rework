<template>
	<ds-dropdown placement="right-start">
		<template #triggerContent>
			<ds-btn
				variant="ghost"
				center
				:small="small"
				:padding-x="small ? 'NONE' : 'S'"
				:padding-y="small ? 'NONE' : 'S'"
				:disabled="disabled"
				icon-only
				@click.stop.prevent>
				<template #icon>
					<ds-icon fill="display-content-500" name="ds-icon-three-dots-vertical" alt="Actions" />
				</template>
			</ds-btn>
		</template>
		<template #dropdownContent>
			<slot name="dropdownContent" />
		</template>
	</ds-dropdown>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
	name: 'DataStoriesKebabButton',
	props: {
		disabled: {
			type: Boolean,
			default: false
		},
		small: {
			type: Boolean,
			default: false
		}
	}
});
</script>


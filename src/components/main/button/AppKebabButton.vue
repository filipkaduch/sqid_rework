<template>
	<app-dropdown placement="right-start">
		<template #triggerContent>
			<app-btn
				variant="ghost"
				center
				:small="small"
				:padding-x="small ? 'NONE' : 'S'"
				:padding-y="small ? 'NONE' : 'S'"
				:disabled="disabled"
				icon-only
				@click.stop.prevent>
				<template #icon>
					<app-icon fill="display-content-500" name="ds-icon-three-dots-vertical" alt="Actions" />
				</template>
			</app-btn>
		</template>
		<template #dropdownContent>
			<slot name="dropdownContent" />
		</template>
	</app-dropdown>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
	name: 'AppKebabButton',
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


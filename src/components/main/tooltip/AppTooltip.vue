<template>
	<div :class="height === 'auto' ? '' : 'align-icon-center'">
		<template v-if="!show">
			<slot />
		</template>
		<v-tooltip
			v-else
			:style="`height: ${height};`"
			:disabled="disabled"
			:placement="placement"
			:container="container">
			<slot />
			<slot name="icon" />
			<template #popper>
				<slot name="tooltip" />
			</template>
		</v-tooltip>
	</div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import {PlacementVariants} from '@/components/main/layout/utils/types';

export default defineComponent({
	props: {
		placement: {
			type: String as PropType<PlacementVariants>,
			default: 'top'
		},
		// This param is used for global component with conditional tooltip option.
		// if is true it will use tooltip, if not tooltip will work like wrapper only
		show: {
			type: Boolean,
			default: true
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
		height: {
			type: String,
			default: 'auto'
		},
		disabled: {
			type: Boolean,
			default: false
		},
		baseClass: {
			type: String,
			default: 'popover-base'
		}
	}
});
</script>

<style lang="scss">
	.v-popper--theme-tooltip .v-popper__arrow-container {
		display: block !important;
	}

	.app-btn-group .v-popper:nth-child(n):not(:first-child):not(:last-child) button {
		border-left: 0;
		border-radius: 0;
	}

	.app-btn-group .v-popper:first-child:not(:last-child) button {
		border-bottom-right-radius: 0;
		border-top-right-radius: 0;
	}

	.app-btn-group .v-popper:last-child:not(:first-child) button {
		border-left: 0;
		border-bottom-left-radius: 0;
		border-top-left-radius: 0;
	}

	.align-icon-center {
		height: 100%;
		width: 100%;
		align-items: center;
		justify-content: center;
		display: flex;
	}
</style>

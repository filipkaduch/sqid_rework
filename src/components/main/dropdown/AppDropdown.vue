<template>
  <v-dropdown :placement="placement" :container="container" :triggers="['touch', 'click']" @apply-hide="$emit('hidden')">
    <slot name="triggerContent" />
    <!-- eslint-disable-next-line vue/no-unused-vars --->
    <template #popper="{hide}">
      <app-box>
        <slot name="dropdownContent" :hide="hide"/>
      </app-box>
    </template>
  </v-dropdown>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import {PlacementVariants} from '@/components/main/layout/utils/types';
type ButtonVariants = 'primary' | 'secondary' | 'inverted' | 'ghost';

export default defineComponent({
	name: 'AppDropdown',
	props: {
		variant: {
			type: String as PropType<ButtonVariants>,
			default: 'secondary'
		},
		placement: {
			type: String as PropType<PlacementVariants>,
			default: 'auto'
		},
		container: {
			type: [
				String,
				Object,
				Element,
				Boolean
			],
			default: 'body'
		}
	},
	emits: ['hidden', 'click']
});
</script>
<style lang="scss">
.v-popper--theme-dropdown .v-popper__arrow-container {
	display: none !important;
}
.v-popper__popper {
	outline: none;
}
</style>

<style lang="scss" scoped>
.app-dropdown-item {
	border-radius: 0;
	border: 0;
}

.app-dropdown-body {
	max-height: 200px;
	overflow-y: auto;
}
</style>


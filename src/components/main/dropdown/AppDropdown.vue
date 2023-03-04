<template>
	<v-dropdown :placement="placement" :container="container" @apply-hide="$emit('hidden')">
		<slot name="triggerContent" />
		<!-- eslint-disable-next-line vue/no-unused-vars --->
		<template #popper="{hide}">
			<app-box>
				<slot name="dropdownContent" :hide="hide">
					<app-card body-class="px-0 py-2">
						<div class="ds-dropdown-body">
							<app-btn
								v-for="(item, index) in items"
								:key="`${index}-dropdown-key`"
								v-close-popper
								:variant="variant"
								class="ds-dropdown-item"
								block
								@click="$emit('click', item.value)">
								{{ item.label }}
							</app-btn>
						</div>
					</app-card>
				</slot>
			</app-box>
		</template>
	</v-dropdown>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import {defineComponent, PropType} from 'vue';
// eslint-disable-next-line no-unused-vars
import {PlacementVariants} from '@/components/main/layout/utils/types';
// eslint-disable-next-line no-unused-vars
import {SelectItem} from '@/components/main/Dropdown/types';
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
		},
		items: {
			type: Array as PropType<SelectItem[]>,
			default: () => []
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


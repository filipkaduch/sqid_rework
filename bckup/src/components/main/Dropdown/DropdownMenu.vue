<template>
	<ul class="m-0 p-0">
		<li
			v-for="(item, index) in items"
			:key="item.value"
			v-close-popper
			class="p-0"
			:class="{disabled: item.disabled}"
			@click="emitSelected(item)">
			<ds-box
				class="user-select-none w-100 p-0"
				:class="item.properties?.subText ? 'h-auto' : ''"
				align-y="center"
				:border-bottom="!showUnderline(index) || item?.properties?.hideBorder ? 'none' : 'disabled'">
				<ds-inline align-y="center" no-wrap>
					<ds-select
						v-if="item?.properties?.submenu && item?.properties?.submenuType === SUBMENU_COMPONENT_TYPES.SELECT"
						class="w-100"
						:items="item?.properties?.submenuItems"
						placement="left-start"
						:clear-btn-text="item?.properties?.clearBtnText"
						:clear-btn-icon="item?.properties?.clearBtnIcon"
						:clear-btn="item?.properties?.clearBtn"
						max-width
						checker
						:groups="item?.properties?.submenuGroups ? item?.properties?.submenuGroups : []"
						@input="$emit('update:selected', {value: item?.properties?.submenu, $event})">
						<template #triggerContent>
							<ds-box
								:class="{'disabled': item?.disabled}"
								:padding-y="item.properties?.subText || item?.properties?.extraPadding || item.properties?.submenu ? 'S' : ''"
								:padding-x="item.properties?.subText ? 'L' : item.properties?.submenu ? 'S' : ''"
								:padding-right="isThereIcon ? 'M' : ''"
								:padding-left="isThereIcon ? 'M' : ''"
								class="w-100 h-100">
								<ds-box
									class="w-100" align-y="center" flex-type="row" align="space-between"
									:padding-left="item.properties?.subText || alignX ? '' : 'S'">
									<ds-box flex-type="row">
										<ds-box v-if="item.icon || isThereIcon" :class="{'check-separator': isThereIcon}">
											<ds-icon
												v-if="item.icon"
												:name="`${item.icon}${darkIcon && item.value === 'reupload' ? '-dark' : ''}`"
												:alt="item.icon"
												:class="item.smallIcon ? '' : 'icon'" />
										</ds-box>
										<ds-text
											wrap-tooltip
											:tooltip="item?.properties?.tooltipText ? item?.properties?.tooltipText : ''"
											:variant="item.properties?.subText || item.properties?.submenu ? 'bodyMedium' : 'body'"
											:color="item?.properties?.color ? item?.properties?.color : ''">
											{{ item.label }}
										</ds-text>
									</ds-box>
									<ds-icon name="ds-icon-chevron-right" fill="display-content-300" />
								</ds-box>
							</ds-box>
						</template>
					</ds-select>
					<ds-dropdown v-else-if="item?.properties?.submenu && item?.properties?.submenuType === SUBMENU_COMPONENT_TYPES.DROPDOWN" class="w-100">
						<template #triggerContent>
							<ds-box
								:padding-y="item.properties?.subText || item?.properties?.extraPadding || item.properties?.submenu ? 'S' : ''"
								:padding-x="item.properties?.subText ? 'L' : item.properties?.submenu ? 'S' : ''"
								class="w-100" align-y="center" flex-type="row" align="space-between"
								:padding-left="item.properties?.subText || alignX ? '' : 'S'">
								<ds-box flex-type="row">
									<ds-box v-if="item.icon || isThereIcon" :align-x="alignX" :class="{'check-separator': isThereIcon}">
										<ds-icon
											v-if="item?.icon"
											:name="`${item.icon}${darkIcon && item.value === 'reupload' ? '-dark' : ''}`"
											:alt="item.icon"
											:class="item.smallIcon ? '' : 'icon'" />
									</ds-box>
									<ds-text
										wrap-tooltip
										:tooltip="item?.properties?.tooltipText ? item?.properties?.tooltipText : ''"
										:variant="item.properties?.subText || item.properties?.submenu ? 'bodyMedium' : 'body'"
										:color="item?.properties?.color ? item?.properties?.color : ''">
										{{ item.label }}
									</ds-text>
								</ds-box>
								<ds-icon name="ds-icon-chevron-right" fill="display-content-300" />
							</ds-box>
						</template>
						<template #dropdownContent>
							<dropdown-menu :items="item?.properties?.submenuItems" @update:selected="$emit('update:selected', {value: item?.properties?.submenu, $event})" />
						</template>
					</ds-dropdown>
					<ds-dropdown v-else-if="item?.properties?.submenuType === SUBMENU_COMPONENT_TYPES.COMPONENT" class="w-100">
						<template #triggerContent>
							<ds-box
								:padding-y="item.properties?.subText || item?.properties?.extraPadding || item.properties?.submenu ? 'S' : ''"
								:padding-x="item.properties?.subText ? 'L' : item.properties?.submenu ? 'S' : ''"
								class="w-100" align-y="center" flex-type="row" align="space-between"
								:padding-left="item.properties?.subText || alignX ? '' : 'S'">
								<ds-box v-if="item.icon || isThereIcon" :align-x="alignX" :class="{'check-separator': isThereIcon}">
									<ds-icon
										v-if="item.icon"
										:name="`${item.icon}${darkIcon && item.value === 'reupload' ? '-dark' : ''}`"
										:alt="item.icon"
										:class="item.smallIcon ? '' : 'icon'" />
								</ds-box>
								<ds-text
									wrap-tooltip
									:tooltip="item?.properties?.tooltipText ? item?.properties?.tooltipText : ''"
									:variant="item.properties?.subText || item.properties?.submenu ? 'bodyMedium' : 'body'"
									:color="item?.properties?.color ? item?.properties?.color : ''">
									{{ item.label }}
								</ds-text>
								<ds-icon name="ds-icon-chevron-right" fill="display-content-300" />
							</ds-box>
						</template>
						<template #dropdownContent>
							<ds-box padding="S">
								<component
									v-bind="item?.properties?.submenuComponentProps"
									:is="{...item?.properties?.submenuComponent}"
									@update="$emit('update:selected', {value: item?.properties?.submenu, $event})" />
							</ds-box>
						</template>
					</ds-dropdown>
					<ds-box
						v-else
						:class="{'disabled': item?.disabled}"
						class="cursor-pointer"
						:padding-top="item?.properties?.extraPadding || item.properties?.subText ? 'S' : 'XS'"
						:padding-bottom="item?.properties?.extraPadding || item.properties?.subText ? 'S' : 'XS'"
						:padding-x="item.properties?.subText ? 'L' : 'S'"
						:padding-right="isThereSubmenu ? 'M' : 'S'"
						flex-type="row">
						<ds-box v-if="item.icon || isThereIcon" :align-x="alignX" :class="{'check-separator': isThereIcon}">
							<ds-icon
								v-if="item.icon"
								:name="`${item.icon}${darkIcon && item.value === 'reupload' ? '-dark' : ''}`"
								:alt="item.icon"
								:class="item.smallIcon ? '' : 'icon'" />
						</ds-box>
						<slot name="check" :item="item" />
						<ds-box align-y="center" :align-x="alignX" :padding-left="item.properties?.subText || alignX !== 'center' ? '' : 'S'">
							<slot name="text" :item="item">
								<ds-text
									:tooltip="item?.properties?.tooltipText ? item?.properties?.tooltipText : ''"
									:variant="item.properties?.subText ? 'bodyMedium' : 'body'"
									:color="item?.properties?.color ? item?.properties?.color : ''">
									{{ item.label }}
								</ds-text>
							</slot>
						</ds-box>
					</ds-box>
				</ds-inline>
				<ds-box
					v-if="item.properties?.subText"
					padding-bottom="S"
					padding-x="L"
					:align-x="alignX"
					align-y="center">
					<ds-text color="display-content-500" variant="body">
						{{ item.properties.subText }}
					</ds-text>
				</ds-box>
			</ds-box>
		</li>
	</ul>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import {defineComponent, PropType, computed} from 'vue';
// eslint-disable-next-line no-unused-vars
import {SelectItem, SUBMENU_COMPONENT_TYPES} from '@/components/main/Dropdown/types';

export default defineComponent({
	name: 'DropdownMenu',
	props: {
		items: {
			type: Array as PropType<SelectItem[]>,
			required: true
		},
		selected: {
			type: Object as PropType<SelectItem| null>,
			default: null
		},
		darkIcon: {
			type: Boolean,
			default: false
		},
		alignX: {
			type: String,
			default: 'center'
		},
		last: {
			type: Boolean,
			default: false
		}
	},
	emits: ['update:selected', 'selected'],
	setup(props, {emit}) {
		const emitSelected = (item: SelectItem) => {
			// @ts-ignore
			if (item.value !== props.selected?.value && !item?.properties?.submenu) {
				emit('update:selected', item);
				emit('selected', item);
			}
		};

		const isThereIcon = computed(() => props.items.find((item: any) => item.icon));
		const isThereSubmenu = computed(() => {
			let found = false;
			for (const prop of props.items) {
				if (prop?.properties?.submenu) {
					found = true;
					break;
				}
			}
			return found;
		});
		const showUnderline = (index: number) => (index !== props.items.length - 1 && !props.last)
			|| (props.last && index === props.items.length - 2);

		return {
			emitSelected,
			showUnderline,
			isThereIcon,
			isThereSubmenu,
			SUBMENU_COMPONENT_TYPES
		};
	}
});
</script>

<style lang="scss" scoped>
.icon {
	height: 20px;
	width: 20px;
	fill: map-get($ds-colors, 'display-content');
}

.disabled {
	pointer-events: none;
	opacity: 0.6;
}
.check-separator {
	width: 12px;
	height: 100%;
	margin-right: 9px;
}
ul {
	list-style-type: none;
}
</style>

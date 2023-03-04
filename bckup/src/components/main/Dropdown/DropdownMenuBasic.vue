<template>
	<ds-box padding-y="XS">
		<ul class="m-0">
			<li
				v-for="(item, index) in items"
				:key="item.value"
				v-close-popper
				class="dd-item user-select-none cursor-pointer"
				:class="{disabled: item.disabled}"
				@click="emitSelected(item)">
				<ds-box
					:class="item.properties?.subText ? 'h-auto' : ''"
					padding-y="S"
					padding-x="GROUP"
					align-y="center"
					:border-bottom="showUnderline(index) ? 'disabled' : 'none'">
					<ds-inline align-y="center" no-wrap>
						<ds-box v-if="item.icon" padding-right="S">
							<ds-icon :name="`${item.icon}${darkIcon && item.value === 'reupload' ? '-dark' : ''}`" :alt="item.icon" class="icon" />
						</ds-box>
						<ds-box align-y="center">
							<ds-text :variant="item.properties?.subText ? 'bodyMedium' : 'body'" class="d-inline-flex">
								{{ item.label }}
							</ds-text>
						</ds-box>
					</ds-inline>
					<ds-box v-if="item.properties?.subText" padding-y="XS" align-y="center">
						<ds-text color="display-content-500" variant="body">
							{{ item.properties.subText }}
						</ds-text>
					</ds-box>
				</ds-box>
			</li>
		</ul>
	</ds-box>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import {defineComponent, PropType} from 'vue';
// eslint-disable-next-line no-unused-vars
import {SelectItem} from '@/components/main/Dropdown/types';

export default defineComponent({
	name: 'DropdownMenuBasic',
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
		last: {
			type: Boolean,
			default: false
		}
	},
	emits: ['update:selected', 'selected'],
	setup(props, {emit}) {
		const emitSelected = (item: SelectItem) => {
			if (item.value !== props.selected?.value) {
				emit('update:selected', item);
				emit('selected', item);
			}
		};
		const showUnderline = (index: number) => (index !== props.items.length - 1 && !props.last)
			|| (props.last && index === props.items.length - 2);

		return {
			emitSelected,
			showUnderline
		};
	}
});
</script>

<style lang="scss" scoped>
ul {
	list-style: none;
	padding: 0;
}
.icon {
	height: 20px;
	width: 20px;
	fill: map-get($ds-colors, 'display-content');
}

.disabled {
	pointer-events: none;
	opacity: 0.6;
}

.dd-item:hover, .dd-item:focus {
	text-decoration: none;
	background-color: map-get($ds-colors, 'separate-content-0');
}

.dd-item.active, .dd-item:active {
	background-color: map-get($ds-colors, 'separate-content-0');
}
</style>

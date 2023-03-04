<template>
	<ds-box>
		<ds-dropdown placement="bottom-end" @click="selected = $event">
			<template #triggerContent>
				<ds-inline class="user-select-none cursor-pointer">
					<ds-btn v-if="pill" pill variant="secondary">
						<ds-text class="pr-2">
							{{ chooseItemLabel(selected) }}
						</ds-text>
						<ds-icon name="icon-chevron" alt="chevron-down" />
					</ds-btn>
					<template v-else>
						<ds-text>
							{{ chooseItemLabel(selected) }}
						</ds-text>
						<ds-icon name="ds-icon-chevron-down" alt="chevron-down" />
					</template>
				</ds-inline>
			</template>
			<template #dropdownContent>
				<ds-box v-if="multipleOptions">
					<ds-box v-for="group in groups" :key="`${group[0]}-key`">
						<ds-box v-if="checkIfShowGroup(group)">
							<ds-box padding-left="S" padding-y="S">
								<ds-box padding-left="XS">
									<ds-text variant="caption">{{ group[0] }}</ds-text>
								</ds-box>
							</ds-box>
							<ds-box
								v-for="(item,index) in group[1]"
								:key="`${index}-select-key`"
								v-close-popper
								class="w-100 dropdown-item"
								padding-x="NONE"
								@click="selectNewValue(item)">
								<ds-box flex-type="row" padding-x="S">
									<ds-box padding-x="XS">
										<ds-icon
											v-if="checkSelected(item)"
											name="ds-icon-checkmark-round"
											alt="Check"
											class="action-icon"
											fill="display-content-700" />
										<ds-box v-else padding-x="XS" padding-right="M" />
									</ds-box>
									<ds-box v-if="item.group === group[0]" flex-type="row" padding-x="S">
										<ds-box flex-type="row" class="w-100" padding-right="XS">
											<ds-text :color="checkSelected(item) ? 'display-content-700' : 'display-content'" :variant="checkSelected(item) ? 'bodyMedium' : 'body'">
												{{ chooseItemLabel(item) }}
											</ds-text>
										</ds-box>
									</ds-box>
								</ds-box>
							</ds-box>
						</ds-box>
					</ds-box>
				</ds-box>
				<dropdown-menu v-else v-model:selected="selected" :items="items">
					<template #check="{item}">
						<ds-box padding-x="XS">
							<ds-icon
								v-if="isEqual(item, selected)"
								name="ds-icon-checkmark-round"
								alt="Check"
								class="action-icon"
								fill="display-content-700" />
							<ds-box v-else padding-x="XS" padding-right="M" />
						</ds-box>
					</template>
					<template #text="{item}">
						<ds-box padding-right="S">
							<ds-text :color="isEqual(item, selected) ? 'display-content-700' : 'display-content'" :variant="isEqual(item, selected) ? 'bodyMedium' : 'body'">
								{{ item?.label }}
							</ds-text>
						</ds-box>
					</template>
				</dropdown-menu>
			</template>
		</ds-dropdown>
	</ds-box>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import {defineComponent, reactive, toRefs, watch, PropType, computed} from 'vue';
// eslint-disable-next-line no-unused-vars
import {SelectItem} from '@/components/main/Dropdown/types';
import DropdownMenu from '@/components/main/Dropdown/DropdownMenu.vue';
import groupBy from 'lodash/groupBy';
import isEqual from 'lodash/isEqual';

export default defineComponent({
	name: 'FilterSelect',
	components: {DropdownMenu},
	props: {
		items: {
			type: Array as PropType<SelectItem[]>,
			required: true
		},
		defaultValue: {
			type: Array,
			default: () => []
		},
		multipleOptions: {
			type: Boolean,
			default: false
		},
		pill: {
			type: Boolean,
			default: false
		}
	},
	emits: ['selected', 'updateMultipleSelected'],
	setup(props, {emit}) {
		const state = reactive({
			selected: props.defaultValue[0],
			selectedMultiple: props.defaultValue as any
		});

		watch(() => state.selected, (value) => {
			emit('selected', value);
		});

		const groups = computed(() => Object.entries(groupBy(props.items, 'group')));

		const selectNewValue = (evt: any) => {
			if (!state.selectedMultiple.find((item: any) => item.label === evt.label && item.value === evt.value)) {
				const newValues = state.selectedMultiple.filter((item: any) => item.group !== evt.group);
				newValues.push(evt);
				state.selectedMultiple = newValues;
				state.selected = evt;
				emit('updateMultipleSelected', newValues);
			}
		};

		const checkSelected = (evt: any) => state.selectedMultiple.find((item: any) => item.label === evt.label && item.value === evt.value);

		const chooseItemLabel = (item: any) => item?.alias?.[state.selectedMultiple[0].value] ?? item?.alias?.[state.selectedMultiple[1].value] ?? item?.label;

		const checkIfShowGroup = (group: any) => {
			// Check if group contains item that have hideAt attribute which needs to be included in currently selected
			const result = group[1].some((item: any) => {
				const slct = state.selectedMultiple.map((selected: any) => selected.value);
				return item?.hideAt?.some((hide: string) => slct.includes(hide));
			});
			return !result;
		};

		return {
			...toRefs(state),
			selectNewValue,
			groups,
			checkSelected,
			isEqual,
			chooseItemLabel,
			checkIfShowGroup
		};
	}
});
</script>

<style lang="scss">
.user-select-none {
	user-select: none;
}
.v-popper__popper {
	outline: none;
}

.dropdown-item {
	cursor: pointer;
	height: 32px;
	background-color: map-get($ds-colors, 'white');
}
.dropdown-item:hover {
	background-color: map-get($ds-colors, 'separate-content-0');
}
</style>

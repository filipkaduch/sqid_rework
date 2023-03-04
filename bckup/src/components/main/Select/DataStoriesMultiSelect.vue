<template>
	<v-dropdown
		v-model:shown="isOpen" :placement="placement" :container="container" auto-hide
		:auto-size="autoSize">
		<slot name="triggerContent">
			<ds-box
				class="cursor-pointer ds-select ds-bg-white"
				:class="{'active': isOpen}"
				flex-type="row"
				border="box"
				border-radius="basic"
				padding-x="S"
				align-y="center">
				<span class="truncated">{{ selectedItems.length > 0 ? outputValues : placeholder }}</span>
				<fa-icon :icon="isOpen ? ['fal','chevron-up'] : ['fal','chevron-down']" class="mx-3" />
			</ds-box>
		</slot>
		<template #popper>
			<slot name="selectContent">
				<ds-card
					body-class="px-0 pt-0 pb-0">
					<div v-if="hasSearch" class="border-bottom">
						<app-input-bar
							v-model:input="search"
							class="d-flex w-100"
							:rounded="false"
							:border="false"
							style="color:#AAABAE;"
							placeholder="Search"
							:left-icon="['fal', 'search']" />
					</div>
					<ds-box
						v-if="selectAll" flex-type="row" padding-x="M" padding-y="S"
						border-bottom="layout" align-y="center">
						<ds-check-box :state="allSelectedValues" :outline="true" class="mr-2" @update:state="allSelectedValues = $event" />
						<ds-text>{{ $t('t_SelectAll') }}</ds-text>
					</ds-box>
					<ul class="ds-select-body py-2 m-0">
						<li
							v-for="(item,index) in filteredValues"
							:key="`${index}-select-key`"
							class="d-flex"
							@click="selectValue(item)">
							<ds-btn
								variant="secondary"
								class="border-0 ds-select-item"
								block>
								<ds-box flex-type="row">
									<ds-check-box :state="isSelected(item)" :outline="true" class="mr-2" />
									<ds-text :variant="isSelected(item) ? 'bodyMedium' : 'body'">{{ item.selectLabel }}</ds-text>
								</ds-box>
							</ds-btn>
						</li>
					</ul>
					<ds-box flex-type="row" class="w-100">
						<ds-btn
							v-if="clearBtn"
							class="bottom-btn-clear select-actions"
							:style="!createBtn ? 'border-right: 0' : ''"
							:disabled="selectedItems.length === 0"
							variant="secondary"
							block
							@click="selectedItems = []">
							<ds-icon name="ds-icon-clear" alt="Clear" class="action-icon" />
							<ds-text> {{ $t('t_Clear') }}</ds-text>
						</ds-btn>
						<ds-btn
							v-if="createBtn"
							v-close-popper
							class="bottom-btn-create select-actions"
							:style="!clearBtn ? 'border-left: 0' : ''"
							:disabled="selectedItems.length === 0"
							variant="secondary"
							block
							@click="createSelection">
							<ds-icon name="ds-icon-create" alt="Create" class="action-icon" />
							<ds-text> {{ $t('t_Create') }}</ds-text>
						</ds-btn>
					</ds-box>
				</ds-card>
			</slot>
		</template>
	</v-dropdown>
</template>

<script lang="ts">
import AppInputBar from '@/components/inputs/AppInputBar.vue';
/* eslint-disable no-unused-vars */
import {defineComponent, PropType, reactive, toRefs, computed, watch, onMounted} from 'vue';
import {PlacementVariants, PopupListItem} from '@/components/main/layout/utils/types';
import isEqual from 'lodash/isEqual';
// TODO: search component for dropdowns (no box shadows)

/* Usage (value is required in each item): <ds-multi-select :items="[{selectLabel: 'LABEL', value: 'VALUE'}]" @update:selected=""/> */

export default defineComponent({
	name: 'DataStoriesMultiSelect',
	components: {
		AppInputBar
	},
	props: {
		hasSearch: {
			type: Boolean,
			default: false
		},
		selectAll: {
			type: Boolean,
			default: false
		},
		autoSize: {
			type: Boolean,
			default: true
		},
		showLabels: {
			type: Boolean,
			default: false
		},
		placeholder: {
			type: String,
			default: 'Select values'
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
			default: 'auto'
		},
		createBtn: {
			type: Boolean,
			default: true
		},
		clearBtn: {
			type: Boolean,
			default: true
		},
		initialValues: {
			type: Array as PropType<PopupListItem<string>[]>,
			default: () => []
		}
	},
	emits: ['selected', 'update:selected', 'search-change'],
	setup(props, {emit}) {
		const state = reactive({
			isOpen: false,
			search: '',
			allSelectedValues: false,
			selectedItems: [] as PopupListItem<string>[]
		});

		onMounted(() => {
			if (props.initialValues.length) {
				state.selectedItems = props.initialValues;
			}
		});

		const selectValue = (evt: PopupListItem<string>) => {
			const selItemIndex = state.selectedItems.map((item) => item.value).indexOf(evt.value);
			if (selItemIndex > -1) {
				state.selectedItems.splice(selItemIndex, 1);
			} else {
				state.selectedItems.push(evt);
			}
			if (props.createBtn === false) {
				emit('update:selected', state.selectedItems);
			}
		};

		const createSelection = () => {
			emit('update:selected', state.selectedItems);
		};

		const outputValues = computed(() => {
			let outputString = '';
			for (const item of state.selectedItems) {
				outputString += `${props.showLabels ? item.selectLabel : item.value}; `;
			}

			return outputString;
		});

		watch(() => state.search, (value: any) => {
			emit('search-change', value);
		});

		watch(() => state.allSelectedValues, (value: any) => {
			if (value) {
				for (const item of props.items) {
					state.selectedItems.push(item);
				}
			} else {
				state.selectedItems = [];
			}
			emit('update:selected', state.selectedItems);
		});

		const filteredValues = computed(() => {
			if (state.search !== '') {
				return props.items.filter((item) => item?.selectLabel?.toLowerCase().includes(state.search));
			}
			return props.items;
		});

		const isSelected = (item: any) => state.selectedItems.some((tmp) => isEqual(tmp, item));

		return {
			...toRefs(state),
			selectValue,
			createSelection,
			outputValues,
			filteredValues,
			isSelected,
			isEqual
		};
	}
});
</script>

<style lang="scss" scoped>
.v-popper__popper {
	outline: none;
}
:deep(.v-popper__arrow-container) {
	display: none !important;
}
.v-popper--theme-dropdown .v-popper__inner {
	background: map-get($ds-colors, 'white');
	border-radius: 4px;
	border-color: map-get($ds-colors, 'separate-content-200');
}
.ds-select {
	height: 36px;
	flex-flow: row;
	justify-content: space-between !important;
}
.ds-select-item {
	border-radius: 0;
	border: 0;
}

.ds-select-body {
	max-height: 200px;
	overflow-y: scroll;
}

.active {
	box-shadow: 0 0 0 3px map-get($ds-colors, 'interaction-200');
}
select:invalid {
	box-shadow: none;
}
.input-icon, .input-icon-pill {
	margin-right: 0 !important;
}

.bottom-btn-clear {
	border-left: 0;
	border-right: 0;
	box-shadow: 0 0 -.5px #8CA4B0;
	border-bottom: 0;
	border-top-right-radius: 0;
	border-top-left-radius: 0;
	border-bottom-right-radius: 0;
}

.bottom-btn-create {
	border-right: 0;
	border-bottom: 0;
	box-shadow: -.5px 0 0 #8CA4B0;
	border-left: 0;
	border-top-left-radius: 0;
	border-top-right-radius: 0;
	border-bottom-left-radius: 0;
}

.select-actions {
	min-height: 52px;
}

.truncated {
	display: block;
	white-space: nowrap; /* forces text to single line */
	overflow: hidden;
	text-overflow: ellipsis;
}

.action-icon {
	height: 20px;
	width: 20px;
	fill: map-get($ds-colors, 'display-content');
	margin-right: 4px;
}
</style>

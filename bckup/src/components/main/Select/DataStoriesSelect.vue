<template>
	<v-dropdown
		v-model:shown="isOpen"
		:container="container"
		:placement="placement"
		auto-hide
		:auto-size="!maxWidth">
		<slot name="triggerContent">
			<ds-box
				class="cursor-pointer ds-select ds-bg-white"
				:class="{'active': isOpen}"
				flex-type="row"
				border="box"
				border-radius="basic"
				:style="disabled ? 'cursor: disabled;' : ''"
				padding-x="S"
				align-y="center">
				<ds-box flex-type="row" padding-left="S">
					<slot name="triggerContentIcon" />
					<ds-text>
						{{ selectedValue ?? placeholder }}
					</ds-text>
				</ds-box>
				<fa-icon :icon="isOpen ? ['fal','chevron-up'] : ['fal','chevron-down']" class="mx-3" />
			</ds-box>
		</slot>
		<template #popper>
			<slot name="selectContent">
				<ds-box>
					<ds-card
						:body-class="cardBodyClass">
						<ds-box v-if="hasSearch" border-bottom="layout">
							<app-input-bar
								v-model:input="search"
								class="d-flex w-100"
								:border="false"
								style="color:#AAABAE;"
								placeholder="Search"
								:left-icon="['fal', 'search']" />
						</ds-box>
						<div class="ds-dropdown-body" :class="{'max-width': maxWidth}">
							<ul v-if="groups.length === 0" class="m-0" :class="{'max-height': maxHeight}">
								<li
									v-for="(item,index) in filteredValues"
									:key="`${index}-select-key`"
									v-close-popper
									class="w-100"
									@click="selectValue(item)">
									<ds-btn
										variant="secondary"
										:disabled="item.disabled ? item.disabled : false"
										class="ds-select-item w-100"
										block>
										<ds-box v-if="checker" flex-type="row">
											<ds-box
												:padding-left="selectedValue === item.selectLabel || item.selected ? 'NONE' : 'L'"
												:padding-right="selectedValue === item.selectLabel || item.selected ? 'GROUP' : 'NONE'">
												<ds-icon
													v-if="selectedValue === item.selectLabel || item.selected"
													name="ds-icon-checkmark"
													alt="Check"
													class="action-icon"
													fill="display-content-700" />
											</ds-box>
											{{ item.selectLabel }}
										</ds-box>
										<ds-box v-else flex-type="row">
											{{ item.selectLabel }}
										</ds-box>
									</ds-btn>
								</li>
							</ul>
							<ds-box v-else>
								<ds-box v-for="group in groups" :key="`${group}-key`">
									<ds-box padding-left="GROUP" padding-y="S">
										<ds-text variant="caption">{{ group }}</ds-text>
									</ds-box>
									<ul class="m-0" :class="{'max-height': maxHeight}">
										<li
											v-for="(item,index) in filteredValues"
											:key="`${index}-select-key`"
											v-close-popper
											class="w-100">
											<slot
												name="groupItem" :item="item" :group="group" :selectedValue="selectedValue"
												:checker="checker" :selectValue="selectValue">
												<ds-btn
													v-if="item.group === group"
													variant="secondary"
													:disabled="item.disabled ? item.disabled : false"
													class="ds-select-item w-100"
													block
													@click="selectValue(item)">
													<ds-box flex-type="row" class="w-100">
														<ds-box
															v-if="checker"
															:padding-left="selectedValue === item.selectLabel || item?.selected ? 'NONE' : 'L'"
															:padding-right="selectedValue === item.selectLabel || item?.selected ? 'GROUP' : 'NONE'">
															<ds-icon
																v-if="selectedValue === item.selectLabel || item?.selected"
																name="ds-icon-checkmark"
																alt="Check"
																class="action-icon"
																fill="display-content-700" />
														</ds-box>
														<ds-text :variant="checker && (selectedValue === item.selectLabel || item?.selected) ? '' : 'paragraph'">
															{{ item.selectLabel }}
														</ds-text>
													</ds-box>
												</ds-btn>
											</slot>
										</li>
									</ul>
								</ds-box>
							</ds-box>
							<slot name="selectFooter">
								<ds-box
									v-if="clearBtn"
									v-close-popper
									flex-type="row"
									class="w-100"
									padding-top="XS"
									@click="selectValue({value: null, selectLabel: initialValue})">
									<ds-btn
										class="cleanBtn w-100"
										:disabled="selectedValue === null"
										variant="secondary"
										block>
										<ds-box class="w-100" flex-type="row">
											<ds-icon :name="clearBtnIcon" alt="Clear" class="action-icon" fill="display-content-0" />
											<ds-box padding-left="S">
												<ds-text> {{ clearBtnText }}</ds-text>
											</ds-box>
										</ds-box>
									</ds-btn>
								</ds-box>
							</slot>
						</div>
					</ds-card>
				</ds-box>
			</slot>
		</template>
	</v-dropdown>
</template>

<script lang="ts">
import AppInputBar from '@/components/inputs/AppInputBar.vue';
import i18n from '@/plugins/i18n/index';
const {t} = i18n.global;
/* eslint-disable no-unused-vars */
import {computed, defineComponent, PropType, reactive, toRefs, watch, onMounted} from 'vue';
import {PlacementVariants, PopupListItem} from '@/components/main/layout/utils/types';

// TODO: search component for dropdowns (no box shadows)
export default defineComponent({
	name: 'DataStoriesSelect',
	components: {
		AppInputBar
	},
	props: {
		hasSearch: {
			type: Boolean,
			default: false
		},
		items: {
			type: Array as PropType<PopupListItem<string>[]>,
			default: () => []
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
		disabled: {
			type: Boolean,
			default: false
		},
		checker: {
			type: Boolean,
			default: false
		},
		groups: {
			type: Array,
			default: () => []
		},
		maxWidth: {
			type: Boolean,
			default: false
		},
		maxHeight: {
			type: Boolean,
			default: false
		},
		clearBtnText: {
			type: String,
			default: t('t_Clear')
		},
		clearBtnIcon: {
			type: String,
			default: 'ds-icon-cross-dark'
		},
		initialValue: {
			type: String,
			default: t('t_selectValue')
		},
		createBtn: {
			type: Boolean,
			default: true
		},
		clearBtn: {
			type: Boolean,
			default: true
		},
		placement: {
			type: String as PropType<PlacementVariants>,
			default: 'auto'
		},
		placeholder: {
			type: String,
			default: t('t_selectValue')
		}
	},
	emits: ['search-change', 'input', 'selectedItem'],
	setup(props, {emit}) {
		const state = reactive({
			isOpen: false,
			search: '',
			selectedValue: props.initialValue
		});

		const selectValue = (evt: PopupListItem<string>) => {
			if (evt?.value !== state.selectedValue) {
				state.selectedValue = evt?.selectLabel ?? evt?.value;
				emit('input', evt?.value);
				emit('selectedItem', evt);
			}
		};

		onMounted(() => {
			state.selectedValue = props.initialValue;
		});

		watch(() => state.search, (value: string) => {
			emit('search-change', value);
		});

		watch(() => props.initialValue, (value: string) => {
			state.selectedValue = value;
		});

		watch(() => props.items, (value: any) => {
			for (const option of value) {
				if (option.selected && props.checker) {
					state.selectedValue = option.selected;
				}
			}
		}, {immediate: true, deep: true});

		const cardBodyClass = computed(() => ({'px-0 pt-0 pb-1': props.hasSearch, 'px-0 py-1': props.groups.length === 0, 'py-0 pb-0 px-0': props.groups.length > 0}));

		const filteredValues = computed(() => {
			if (state.search !== '') {
				return props.items.filter((item) => item?.selectLabel?.toLowerCase().includes(state.search));
			}
			return props.items;
		});

		return {
			...toRefs(state),
			filteredValues,
			cardBodyClass,
			selectValue
		};
	}
});
</script>

<style lang="scss" scoped>
.disabled {
	pointer-events: none;
}

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
.active {
	box-shadow: 0 0 0 3px map-get($ds-colors, 'interaction-200');
}
select:invalid {
	box-shadow: none;
}
.max-height {
	overflow-y: auto;
	max-height: 200px;
}
.input-icon, .input-icon-pill {
	margin-right: 0 !important;
}
.select {
	border: 0 !important;
	border-bottom: 1px solid #CFD8DD !important;
	border-bottom-right-radius: 0 !important;
	border-bottom-left-radius: 0 !important;
}
</style>

<template>
	<v-dropdown
		v-model:shown="isOpen" :placement="placement" :container="container"
		auto-size :triggers="[]" :autoHide="false" :distance="0">
		<ds-box
			class="ds-select ds-bg-white"
			:class="{'active': isOpen}"
			border="box"
			flex-type="row"
			align-y="center"
			border-radius="basic"
			padding-x="S">
			<ds-box flex-type="row" align-y="center" class="flex-wrap tag-padding">
				<ds-box
					align-y="center"
					padding-right="S"
					no-grow flex-type="row"
					class="flex-wrap">
					<filter-tag
						v-for="(item, index) in selectedItems"
						:key="`${item.selectLabel}-${index}`"
						:deletable="true"
						:value="item.selectLabel"
						@remove-filter="removeTag(index)" />
					<ds-btn
						v-show="showAddButton" variant="ghost" small
						padding-x="XS" no-wrap @click="openModal">
						<template #icon>
							<ds-icon name="icon-plus-sign" />
						</template>
						{{ selectedItems.length > 0 ? $t('filters.add') : $t('filters.addItems') }}
					</ds-btn>
				</ds-box>
				<ds-box v-show="!showAddButton" ref="inputDiv" class="flex-grow-1" @click="isOpen = true">
					<input
						ref="searchInput"
						v-model="searchValue"
						class="input-height w-100"
						:placeholder="$t('t_search')"
						type="text">
				</ds-box>
			</ds-box>
		</ds-box>
		<template #popper>
			<ds-card
				ref="dropdownCard"
				no-body>
				<ds-box padding-y="XS" class="max-height">
					<ds-box padding-x="GROUP">
						<ds-text variant="caption" color="display-content">
							{{ $t('filters.recommended') }}
						</ds-text>
					</ds-box>
					<app-loading :loading="loadingValues" relative-parent class="loading-min-height">
						<ul class="ds-select-body m-0">
							<li
								v-for="(item,index) in filteredValues"
								:key="`${index}-select-key`"
								class="d-flex"
								@click="selectValue(item)">
								<ds-btn
									variant="secondary"
									class="border-0 ds-select-item"
									block>
									<ds-box flex-type="row" align-y="center">
										<ds-check-box :state="isSelected(item)" :outline="true" class="mr-2" />
										<ds-text :variant="isSelected(item) ? 'bodyMedium' : 'body'">{{ item.selectLabel }}</ds-text>
									</ds-box>
								</ds-btn>
							</li>
						</ul>
					</app-loading>
				</ds-box>
				<ds-box class="sticky-bottom ds-bg-white">
					<ds-box
						class="w-100 cursor-pointer" padding-y="S" padding-x="GROUP"
						flex-type="row" align="space-between" border-bottom="separate" border-top="separate">
						<ds-box flex-type="row" align-y="center">
							<ds-icon name="ds-icon-all" />
							<ds-box padding-left="XS">
								<ds-text variant="bodyMedium">
									{{ $t('filters.searchInAllValues') }}
								</ds-text>
							</ds-box>
						</ds-box>
						<ds-switch v-model:value="searchInAllValues" @update="searchInAllValues = $event" />
					</ds-box>
					<ds-box class="w-100">
						<ds-box
							:class="{
								'cursor-pointer': selectedItems.length !== 0
							}"
							flex-type="row"
							padding-y="M"
							padding-x="GROUP"
							@click="selectedItems = []">
							<ds-icon name="ds-icon-close" alt="Clear" :fill="selectedItems.length !== 0 ? 'display-content' : 'display-content-400'" />
							<ds-box padding-left="XS">
								<ds-text :color="selectedItems.length !== 0 ? 'display-content-700' : 'display-content-400'" variant="bodyMedium"> {{ $t('t_Clear') }}</ds-text>
							</ds-box>
						</ds-box>
					</ds-box>
				</ds-box>
			</ds-card>
		</template>
	</v-dropdown>
</template>

<script setup lang="ts">
import {PropType, ref, computed, watch, onMounted, nextTick} from 'vue';
import {PlacementVariants, PopupListItem} from '@/components/main/layout/utils/types';
import {isEqual, uniqWith, debounce} from 'lodash';
import useFilters from '@/modules/widget/components/widget-controls/filter/useFilters';
import {onClickOutside} from '@vueuse/core';
import DsSwitch from '@/components/inputs/DsSwitch.vue';
import AppLoading from '@/components/design/AppLoading.vue';
import FilterTag from '@/modules/story/components/presenter/components/globalFilters/FilterTag.vue';

const props = defineProps({
	filter: {
		type: Object,
		default: null
	},
	source: {
		type: Object as PropType<{type: any, id: string}>,
		default: null
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
	placement: {
		type: String as PropType<PlacementVariants>,
		default: 'auto'
	},
	initialValues: {
		type: Array as PropType<PopupListItem<string>[]>,
		default: () => []
	}
});

const emit = defineEmits(['update-selected']);

const isOpen = ref(false);
const items = ref([] as PopupListItem<string>[]);
const allItems = ref([] as any);
const selectedItems = ref([] as PopupListItem<string>[]);
const searchValue = ref('');
const searchInput = ref(null);
const dropdownCard = ref(null);
const inputDiv = ref(null);
const showAddButton = ref(true);
const searchInAllValues = ref(false);
const loadingValues = ref(false);

onClickOutside(dropdownCard, () => {
	isOpen.value = false;
	showAddButton.value = true;
	searchValue.value = '';
}, {ignore: [inputDiv]});

const openModal = () => {
	isOpen.value = true;
	showAddButton.value = false;
	nextTick(() => {
		searchInput.value.focus();
	});
};

watch(() => props.filter, async() => {
	await setInitialValues();
});

onMounted(async() => {
	await setInitialValues();
});

const setInitialValues = async() => {
	items.value = await valuesForMultiselect(props.filter, props.source);
	items.value = props.initialValues.concat(items.value);
	allItems.value = items.value;

	if (props.initialValues.length) {
		selectedItems.value = props.initialValues;
	}
};

const selectValue = (evt: PopupListItem<string>) => {
	const selItemIndex = selectedItems.value.map((item) => item.value).indexOf(evt.value);
	if (selItemIndex > -1) {
		selectedItems.value.splice(selItemIndex, 1);
	} else {
		selectedItems.value.push(evt);
	}
	emit('update-selected', selectedItems.value);
};

const debouceUpdate = debounce(async() => {
	loadingValues.value = true;
	if (searchInAllValues.value && searchValue.value.length) {
		allItems.value = await valuesForMultiselect(props.filter, props.source, searchValue.value);
	} else {
		allItems.value = items.value.filter((item) => item.selectLabel?.toLowerCase().includes(searchValue.value.toLowerCase()));
	}
	loadingValues.value = false;
}, 500);

watch(searchValue, async() => {
	await debouceUpdate();
});

watch(searchInAllValues, async() => {
	await debouceUpdate();
});

const {
	valuesForMultiselect
} = useFilters();

const filteredValues = computed(() => uniqWith(allItems.value, isEqual));

const isSelected = (item: any) => selectedItems.value.some((tmp) => isEqual(tmp, item));

const removeTag = (index: number) => {
	selectedItems.value.splice(index, 1);
};
</script>

<style scoped lang="scss">
.max-height {
	max-height: 240px;
	overflow-y: auto;
}

.ds-select {
	min-height: 36px;
	flex-flow: row;
	justify-content: space-between !important;
}
.ds-select-item {
	border-radius: 0;
	border: 0;
}

.ds-select-item:focus {
	box-shadow: 0 0 0 3px transparent;
}

.tag-padding {
	padding-block: 6px;
}

.input-height {
	height: 22px;
	padding: 0;
	border: 0;
	outline: none !important;
}

.flex-wrap {
	flex-wrap: wrap;
	gap: 6px 8px;
}

.sticky-bottom {
	position: sticky;
	bottom: 0;
	z-index: 2;
}

.card-body {
	padding: 0 !important;
	overflow-y: hidden;
}

.loading-min-height {
	min-height: 22px;
}
</style>

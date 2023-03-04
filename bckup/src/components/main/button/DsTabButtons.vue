<template>
	<div id="tab-line" ref="tabLinebar" :class="{'tab-style-height': isTabVariant, 'limit-tabs': limitChars && showArrows}">
		<ds-inline
			class="d-flex"
			:class="{'tab-style': isTabVariant, 'border-bottom-0': icons, 'prelimit-tabs': limitChars && showArrows}"
			:style="computedMainContainerStyle">
			<ds-box
				v-for="(tab, index) in tabs"
				:id="`tab-${tab.name}`"
				:key="tab.name + index"
				:data-testid="tab.name"
				class="cursor-pointer"
				:style="icons ? `width: calc((100% - 36px) / ${tabs.length}) !important;` : ''"
				:padding-x="isTabVariant && !icons ? 'M' : ''"
				:padding-right="tabsPaddingRight"
				:class="classesString(tab)"
				@click="handleActiveTab(tab)">
				<ds-tooltip class="h-100" height="100%" :disabled="!tab.tooltip">
					<template #icon>
						<ds-inline
							:style="tabWidth !== null && limitChars && showArrows ? `width: calc(${tabWidthCondition}) !important;` : ''"
							:class="icons ? 'justify-content-center h-100 align-items-center' : ''">
							<ds-box
								flex-type="row"
								:style="tabWidth !== null && limitChars && showArrows
									? `width: calc(${tabWidth > MIN_CHARS_IN_PX ? tabWidth : MIN_CHARS_IN_PX}px) !important;` : ''"
								:padding-y="icons ? '' : 'S'">
								<ds-text
									v-if="!icons"
									variant="body"
									:style="tabWidth !== null && limitChars && overflowLength > 0 ? `width: ${tabWidth}px !important; max-width: ${tab.nameLength}px` : ''"
									:class="{'btn-active': isEqual(tab, activeTab) && !isTabVariant, 'tab-text-max ': limitChars}">
									{{ tab.name }}
								</ds-text>
								<ds-icon v-else :name="tab.icon" :fill="isEqual(tab, activeTab) ? 'display-content' : ''" />
								<slot name="countBadge" :tab="tab" />
							</ds-box>
							<ds-box :padding-left="icons ? '' : 'S'" class="tab-actions">
								<slot :tab="tab" name="tab-actions" />
							</ds-box>
						</ds-inline>
					</template>
					<template #tooltip>
						{{ tab.tooltip }}
					</template>
				</ds-tooltip>
			</ds-box>
			<ds-box
				v-if="canAdd" class="h-100" align-y="center"
				padding-x="S">
				<ds-add-button small @add="$emit('add')" />
			</ds-box>
			<slot name="rightSlot" />
		</ds-inline>
		<ds-box
			v-if="showArrows" class="h-100 arrows-controls" align-y="center"
			border="separate"
			padding-x="S">
			<ds-btn-group>
				<ds-btn
					:disabled="disabledLeftScroll"
					class="arrow-control"
					variant="ghost"
					@click="scrollToSide(false)">
					<ds-icon name="ds-icon-chevron-left-small" fill="icon-default" alt="Left" />
				</ds-btn>
				<ds-btn
					:disabled="disabledRightScroll"
					variant="ghost"
					class="border-left arrow-control"
					@click="scrollToSide(true)">
					<ds-icon name="ds-icon-chevron-right-small" fill="icon-default" alt="right" />
				</ds-btn>
			</ds-btn-group>
		</ds-box>
		<template v-for="(tab, index) in tabs" :key="index">
			<div v-if="tab.name === activeTab">
				<slot :name="tab.name" />
			</div>
		</template>
	</div>
</template>

<script lang="ts">
import {computed, defineComponent, PropType, ref, watch, nextTick} from 'vue';
import DsAddButton from '@/components/main/button/DsAddButton.vue';
import isEqual from 'lodash/isEqual';

type Tab = {
	[key: string]: any,
	name: string,
	tooltip?: string,
	icon?: string
}
type Variant = 'tab' | 'button';
export const PLUS_SIGN_WIDTH = 52;
export const MIN_CHARS_IN_PX = 40;
export const KEBAB_SIZE_IN_TAB = 32;
const MIN_CALCULATED_TAB_WIDTH = 97;
const SCROLL_STEP = 36;

export default defineComponent({
	components: {DsAddButton},
	props: {
		editable: {
			type: Boolean,
			default: false
		},
		isClosable: {
			type: Boolean,
			default: false
		},
		canAdd: {
			type: Boolean,
			default: false
		},
		showArrows: {
			type: Boolean,
			default: false
		},
		limitChars: {
			type: Boolean,
			default: false
		},
		icons: {
			type: Boolean,
			default: false
		},
		tabWidth: {
			type: Number,
			default: null
		},
		allTabs: {
			type: Number,
			default: 0
		},
		tabs: {
			type: Array as PropType<Tab[]>,
			required: true
		},
		activeTab: {
			type: [Object],
			required: true
		},
		variant: {
			type: String as PropType<Variant>,
			required: false,
			default: () => 'tab'
		}
	},
	emits: ['add', 'update:activeTab', 'tabClicked'],
	setup(props, {emit}) {
		const handleActiveTab = (tab: Tab) => {
			emit('update:activeTab', tab);
			emit('tabClicked', tab);
		};
		const isTabVariant = computed(() => props.variant === 'tab');
		const overflowLength = ref(0);
		const tabLinebar = ref(null);
		const disabledLeftScroll = ref(true);
		const disabledRightScroll = ref(false);
		let scrollAmount = 0;

		const tabsPaddingRight = computed(() => {
			if (!isTabVariant.value && !props.icons) {
				return 'L';
			} else if (!props.icons) {
				return 'S';
			}
			return '';
		});

		const tabWidthCondition = computed(() => `${props.tabWidth > MIN_CHARS_IN_PX ? props.tabWidth : MIN_CHARS_IN_PX}px + ${KEBAB_SIZE_IN_TAB}px`);
		// This should calculate the width for all tabs underlying the tabs-line container
		const computedMainContainerStyle = computed(() => {
			if (props.limitChars && props.showArrows) {
				let soloTabWidth = 0;
				if (props.tabWidth > 45) {
					soloTabWidth = props.tabWidth + PLUS_SIGN_WIDTH;
				} else {
					soloTabWidth = MIN_CALCULATED_TAB_WIDTH;
				}
				return `width: calc((${props.tabs.length} * ${soloTabWidth}px) + ${PLUS_SIGN_WIDTH}px) !important;`;
			}
			return '';
		});

		watch(() => props.tabs, (val) => {
			nextTick(() => {
				if (props.limitChars && val) {
					// 56px is for navbar
					const tabLineLength = props.allTabs - (PLUS_SIGN_WIDTH + 56);
					let countWidth = 0;
					for (const iterTab of val) {
						const queriedTab = document.getElementById(`tab-${iterTab.name}`);
						if (queriedTab) {
							// @ts-ignore
							countWidth += queriedTab?.offsetWidth;
						}
					}
					if (countWidth > tabLineLength) {
						countWidth = val.length * props.tabWidth;
						overflowLength.value = tabLineLength - countWidth;
					} else {
						overflowLength.value = -1;
					}
				}
			});
		}, {deep: true});


		const scrollToSide = (side: boolean) => {
			// 136 is a sum of navbar and arrow controls width
			const actualTabWidth = props.tabWidth > 45 ? props.tabWidth : MIN_CALCULATED_TAB_WIDTH;
			const maxScroll = Math.abs(((props.tabs.length * (actualTabWidth)) + PLUS_SIGN_WIDTH) - (window.innerWidth - 136));
			if (side) {
				if (scrollAmount < maxScroll) {
					// @ts-ignore
					tabLinebar?.value.scroll({
						left: scrollAmount += SCROLL_STEP,
						behavior: 'smooth'
					});
					disabledLeftScroll.value = false;
				} else if (scrollAmount >= maxScroll) {
					disabledRightScroll.value = true;
				} else {
					disabledLeftScroll.value = true;
				}
			} else {
				// eslint-disable-next-line no-lonely-if
				if (scrollAmount >= SCROLL_STEP) {
					// @ts-ignore`
					tabLinebar?.value.scroll({
						left: scrollAmount -= SCROLL_STEP,
						behavior: 'smooth'
					});
					disabledRightScroll.value = false;
				} else if (scrollAmount === 0) {
					disabledLeftScroll.value = true;
				} else if (scrollAmount >= maxScroll) {
					disabledRightScroll.value = false;
				}
			}
		};

		const classesString = (tab: Tab) => {
			let classString = '';
			if (isTabVariant.value) {
				classString += 'tab ';
				if (isEqual(tab, props.activeTab) && !props.icons) {
					classString += 'tab-active ';
				}
			}
			if (props.icons) {
				classString += 'tab-icon ';
				if (isEqual(tab, props.activeTab)) {
					classString += 'tab-icon-active ';
				}
			}
			return classString;
		};

		return {
			handleActiveTab,
			isTabVariant,
			tabsPaddingRight,
			classesString,
			isEqual,
			scrollToSide,
			overflowLength,
			tabLinebar,
			MIN_CHARS_IN_PX,
			KEBAB_SIZE_IN_TAB,
			PLUS_SIGN_WIDTH,
			computedMainContainerStyle,
			tabWidthCondition,
			disabledLeftScroll,
			scrollAmount,
			disabledRightScroll
		};
	}
});
</script>

<style lang="scss" scoped>
.btn-active {
	border-bottom: solid 2px map-get($ds-colors, 'primary');
}
.tab-style {
  width: 100%;
	height: 100%;
  background-color: map-get($ds-colors, 'white');
  border-bottom: 1px solid map-get($ds-colors, 'separate-content-200');
}
.tab-style-height{
	width: 100%;
	height: 36px;
}
.tab-active {
  background-color: map-get($ds-colors, 'separate-content-0');
  border-right: 1px solid map-get($ds-colors, 'display-content-0');
	border-bottom: 0;
  position: relative;
}
.tab-active::before {
  width: 100%;
  height: 2px;
  position: absolute;
  content: "";
  background-color: map-get($ds-colors, 'display-content-0');
  bottom: -2px;
  left: 0;
}
.tab-icon-active {
	background-color: map-get($ds-colors, 'white') !important;
	border-bottom: 0 !important;
}
.tab-icon {
	justify-content: center;
	border-top: 1px solid map-get($ds-colors, 'separate-content-200');
	background-color: map-get($ds-colors, 'separate-content-0');
	border-bottom: 1px solid map-get($ds-colors, 'separate-content-200');
}
.tab-text-flow {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.tab-text-max {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 30ch;
	min-width: 4ch;
}
.limit-tabs {
	// 56px for left navbar and 76 for arrows
	width: calc(100vw - 56px - 74px);
	overflow-x: hidden;
	overflow-y: hidden;
}
.prelimit-tabs {
	width: 100vw;
}
.tab {
  height: 100%;
  border-right: 1px solid map-get($ds-colors, 'separate-content-200');
}
.tab-actions {
	opacity: 0;
}
.tab:hover {
	.tab-actions {
		opacity: 1;
	}
}
.arrows-controls {
	padding-left: 0 !important;
	position: absolute;
	background-color: map-get($ds-colors, 'white');
	right: 0;
	border-top: 0 !important;
	top: 0;
}
</style>

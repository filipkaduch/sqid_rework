<template>
	<div>
		<ds-text v-if="headingText" variant="body" color="display-content">
			{{ $t(headingText) }}
		</ds-text>
		<ds-dropdown class="h-100">
			<template #triggerContent>
				<ds-box ref="colorPickerDropdown" class="h-100">
					<!-- If explorer show only small square with color -->
					<ds-box
						v-if="explorer && isPickerShowed"
						class="cursor-pointer"
						:style="'background:' + baseColor(index) + '; height:12px; width:12px;border-radius:2px;'"
						@click="handleColor(index)" />
					<!-- Editor style -->
					<ds-box v-else-if="!explorer" class="h-100">
						<ds-btn
							:id="singleMetric"
							ref="index"
							:key="index"
							variant="ghost"
							small
							:style="generateStyle && isFormulaWidget || isMapWidget
								? 'width: 40px;' : 'border-top-left-radius: 0; border-bottom-left-radius: 0;'"
							:class="{
								'm-2': generateStyle && !isFormulaWidget,
								'h-100': heightFit,
								'my-2': isFormulaWidget
							}"
							class="d-flex justify-content-between align-items-center m-0 p-0 border h-100"
							:tabindex="index"
							@click="handleColor(index)">
							<div
								:class="{
									'm-2': generateStyle && !isFormulaWidget}"
								class="flex-fill rounded color-div"
								:style="'background:' + baseColor(index) + '; height:22px; width:22px;'" />
						</ds-btn>
					</ds-box>
				</ds-box>
			</template>
			<template #dropdownContent>
				<ds-box padding="S">
					<ds-box padding-x="XS">
						<ds-text color="display-base" variant="caption">
							{{ $t('colorPicker.themeColors') }}
						</ds-text>
						<compact-picker
							ref="compact-picker"
							class="w-100 shadow-none"
							:modelValue="defaultColor"
							:palette="twelveThemeColors"
							@update:model-value="changeColorSwitch" />
						<ds-text color="display-base" variant="caption">
							{{ $t('colorPicker.customColor') }}
						</ds-text>
						<ds-box padding-bottom="M" @click="toggleCustomColorsPicker">
							<img src="@/assets/ds-icon-all-colors-gradient.svg" alt="gradient">
						</ds-box>
						<transition name="fade">
							<ds-box v-show="expandedPicker">
								<chrome-picker
									ref="picker"
									class="w-100"
									:disableAlpha="true"
									:modelValue="baseColor(index)"
									@update:model-value="changeCustomColorSwitch" />
							</ds-box>
						</transition>
						<div v-if="type !== 'theme' || isFormulaWidget || isMapWidget">
							<ds-btn
								v-if="singleMetric === 'metric'"
								variant="secondary"
								center
								block
								@click="resetColors">
								{{ $t('colorPicker.resetColors') }}
							</ds-btn>
							<ds-btn
								v-if="singleMetric !== 'metric'"
								variant="secondary"
								center
								block
								@click="resetColor(index)">
								{{ $t('colorPicker.resetColors') }}
							</ds-btn>
						</div>
					</ds-box>
				</ds-box>
			</template>
		</ds-dropdown>
	</div>
</template>

<script>
import {Chrome, Compact} from '@ckpack/vue-color';
import colorMixin from '@/mixins/colorMixin';
import widgetControlComponentMixin from '@/mixins/widgetControlComponentMixin';
import {widgetTypes} from '@/util/consts/widgetTypes';
import {widgetOptionName} from '@/util/consts/widgetOptionsNames';
import cloneDeep from 'lodash/cloneDeep';

export default {
	name: 'CombinedColorPicker',
	components: {
		'chrome-picker': Chrome,
		'compact-picker': Compact
	},
	mixins: [
		colorMixin,
		widgetControlComponentMixin
	],
	props: {
		index: {
			type: Number,
			default: null
		},
		groupType: {
			type: String,
			default: null
		},
		groupIndex: {
			type: Number,
			default: null
		},
		groupKey: {
			type: String,
			default: null
		},
		// Two possible values ['widget', 'theme']
		type: {
			type: String,
			default: null
		},
		singleMetric: {
			type: String,
			default: null
		},
		inputColor: {
			type: String,
			default: null
		},
		heightFit: {
			type: Boolean,
			default: false
		},
		explorer: {
			type: Boolean,
			default: false
		},
		rowIdx: {
			type: Number,
			default: null
		},
		pickerValues: {
			type: Object,
			default: null
		}
	},
	emits: ['update:color', 'resetPickerValues'],
	widgetControlTypes() {
		return ['widget_control_combined_color_picker'];
	},
	data() {
		return {
			value: {},
			expanded: false,
			expandedPicker: false,
			numColors: 4,
			colors: [],
			chosenIndex: -1,
			defaultColor: '#6d5af9',
			widgetTypes
		};
	},
	computed: {
		color() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'color') ?? 0;
		},
		coloring() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'coloring') ?? null;
		},
		rawData() {
			return this.$store.getters['widgetData/rawData'](this.widgetInstanceId ?? null);
		},
		widgetType() {
			return this.$store.getters['widgetInstances/widgetType'](this.widgetInstanceId) ?? null;
		},
		dimensionColoring() {
			return this.$store.getters['widgetMetadata/widgetTypeMetadata'](this.widgetType)?.configuration?.colors?.dimensionColoring ?? false;
		},
		generateStyle() {
			return (this.widgetType === widgetTypes.TEXT_FORMULA || this.widgetType === widgetTypes.NOTIFICATION_FORMULA || this.type === 'theme');
		},
		themeColors() {
			return this.$store.getters['storyDetail/story'].layoutConfiguration.theme.colors;
		},
		widgetConfiguration() {
			return this.$store.getters['widgetInstances/configuration'](this.widgetInstanceId);
		},
		metric() {
			return this.widgetConfiguration?.data?.configuration?.metrics ?? null;
		},
		isMapWidget() {
			return this.widgetType === this.widgetTypes.SCATTER_MAP;
		},
		isFormulaWidget() {
			return this.widgetType === this.widgetTypes.INSIGHT
				|| this.widgetType === this.widgetTypes.TEXT_FORMULA
				|| this.widgetType === this.widgetTypes.NOTIFICATION_FORMULA;
		},
		twelveThemeColors() {
			return this.themeColors.graph.slice(0, 12);
		},
		isPickerShowed() {
			if (this.groupType === 'metric') {
				return true;
			}

			if (this.coloring && this.coloring[`${this.groupType}${this.groupIndex}`]) {
				return Boolean(this.coloring[`${this.groupType}${this.groupIndex}`][this.groupKey]);
			}
			return false;
		}
	},
	watch: {
		pickerValues(val) {
			// Check vales so we know which color picker to open then fire click event to open it
			if (val) {
				if (val?.groupType === this.groupType
					&& val?.groupIndex === this.groupIndex
					&& val?.groupKey === this.groupKey
					&& val?.rowIdx === this.rowIdx) {
					this.$refs.colorPickerDropdown.$el.click();
				}
			}
		}
	},
	methods: {
		toggleCustomColorsPicker() {
			this.expandedPicker = !this.expandedPicker;
		},
		getOption(column) {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, column) ?? {};
		},
		getRGBColor(colorValue) {
			return `rgb(${colorValue.rgba.r},${colorValue.rgba.g},${colorValue.rgba.b})`;
		},
		changeColorSwitch(colorValue) {
			const rgbColor = this.getRGBColor(colorValue);
			if (this.type === 'theme') {
				this.changeValue(rgbColor);
			} else {
				this.changeValueOption(rgbColor);
			}
		},
		changeCustomColorSwitch(colorValue) {
			this.changeValueOption(this.getRGBColor(colorValue));
		},
		baseColor(index) {
			if (this.type === 'theme') {
				if (this.inputColor !== null) {
					return this.inputColor;
				}

				if (this.widgetType === widgetTypes.INSIGHT) {
					return this.getOption(this.name) ?? 'rgb(44, 133, 248)';
				}
			}
			if (this.singleMetric === 'metric') {
				// TODO: make gradient if any value in dimension is changed
				return this.coloring?.[`${this.groupType}${this.groupIndex}`] ?? this.getColor(0, true);
				// eslint-disable-next-line max-len
				// return `linear-gradient(to right, ${this.coloring[0].color} 25%, ${this.coloring[1].color} 25%, ${this.coloring[1].color} 50%, ${this.coloring[2].color} 50%, ${this.coloring[2].color} 75%, ${this.coloring[3].color} 75%);`;
			}
			if (this.groupType === 'metric') {
				return this.coloring?.[`${this.groupType}${this.groupIndex}`] ?? this.getColor(index, true);
			}
			if (this.groupType === 'dimension') {
				return this.coloring?.[`${this.groupType}${this.groupIndex}`]?.[this.groupKey]
					?? (this.dimensionColoring ? this.getColor(index, true) : this.coloring?.metric0)
					?? this.getColor(0, true);
			}
			return this.getColor(index, true);
		},
		handleColor(index) {
			this.chosenIndex = index;
			if (this.coloring && this.coloring.length && this.widgetInstanceId !== '0' && this.widgetType !== widgetTypes.INSIGHT) {
				this.defaultColor = this.getColor(index);
			}
		},
		changeValue(rgbColor) {
			clearTimeout(this.updateTimer);
			this.updateTimer = setTimeout(() => {
				if (this.widgetType === widgetTypes.INSIGHT || this.color === null) {
					this.setOption(rgbColor);
				} else {
					this.$emit('update:color', rgbColor);
				}
			}, 256);
			this.$emit('resetPickerValues');
		},
		changeValueOption(rgbColor) {
			if (this.type === 'widget') {
				const coloringValues = this.coloring ? cloneDeep(this.coloring) : {};
				if (this.groupType === 'metric') {
					coloringValues[`${this.groupType}${this.groupIndex}`] = rgbColor;
				} else {
					const valueToAdd = {[this.groupKey]: rgbColor};
					coloringValues[`${this.groupType}${this.groupIndex}`] = {...coloringValues[`${this.groupType}${this.groupIndex}`], ...valueToAdd};
				}
				this.setOption(coloringValues, widgetOptionName.COLORING);
			}
			if (this.type === 'theme') {
				this.changeValue(rgbColor);
			}
		},
		resetColor(index) {
			const coloringValues = cloneDeep(this.coloring);
			if (this.groupType === 'metric') {
				delete coloringValues[`${this.groupType}${this.groupIndex}`];
			} else if (this.groupType === 'dimension') {
				delete coloringValues[`${this.groupType}${this.groupIndex}`][this.groupKey];
			} else {
				coloringValues[index].color = this.getColor(index, false);
			}
			this.setOption(coloringValues, widgetOptionName.COLORING);
			this.$emit('resetPickerValues');
		},
		resetColors() {
			if (this.type === 'theme' && this.widgetType === widgetTypes.INSIGHT) {
				if (this.name === 'betterColor') {
					this.setOption('rgb(174,243,89)');
				}
				if (this.name === 'worseColor') {
					this.setOption('rgb(204,19,19)');
				}
			} else if (this.coloring?.[`${this.groupType}${this.groupIndex}`]) {
				const coloringValues = cloneDeep(this.coloring);
				if (this.groupType === 'metric') {
					delete coloringValues[`${this.groupType}${this.groupIndex}`];
				}
				this.setOption(coloringValues, widgetOptionName.COLORING);
			}
		},
		setOption(value, name = this.name) {
			this.$store.dispatch('widgetInstances/setOption', {
				widgetInstanceId: this.widgetInstanceId,
				optionName: name,
				value
			});
			// TODO: dataTransformation no reload series TP
			this.$store.dispatch('widgetInstances/setConfiguration', {
				widgetInstanceId: this.widgetInstanceId
			});
		}
	}
};
</script>

<style lang="css" scoped>
.vc-compact {
	padding: 2px 0 0;
}

.vc-chrome {
	box-shadow: none;
}
:deep(li.vc-compact-color-item) {
	margin-bottom: 4px;
	margin-right: 0;
	border-radius: 2px;
	width: 22px;
	height: 22px;
	float: unset;
}
:deep(li.vc-compact-color-item:last-of-type) {
	margin: 0;
}

.fade-enter-active, .fade-leave-active {
	transition: all .5s ease-in-out;
}
.fade-enter-from {
	transform: translateY(80px);
	opacity: 0;
}
.fade-leave-to {
	transform: translateY(80px);
	opacity: 0;
}

:deep(ul.vc-compact-colors) {
	gap: 4px;
	columns: 6;
}
</style>

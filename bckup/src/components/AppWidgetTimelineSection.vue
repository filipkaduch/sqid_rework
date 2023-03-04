<template>
	<div
		class="mx-0 mb-0 mt-4 p-0 col-12"
		style="border-radius: 5px; box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15); background-color: white">
		<div class="mx-2">
			<button
				class="btn btn-clean w-100 m-0 p-0 bg-white"
				style="border-radius: 5px;"
				@click="toggleCollapse">
				<span class="d-flex justify-content-between align-items-center">
					<span class="d-inline-flex align-items-center p-3" style="color: #2D3038; font-size: 17px; font-weight: bold;">
						<span
							style="border-radius: 50%;
								background-color: #D3E0FC;
								height: 35px;
								width: 35px;
								color: #1357E9;
								padding: 8px;
								justify-content: center;
								display: inline-flex;
								margin-right: 5px">
							<fa-icon :icon="['fas', 'history']" class="mr-0" />
						</span>
						{{ $t('t_TimeMachine') }}
					</span>
					<span class="text-black">
						<fa-icon :icon="collapse ? ['fal','chevron-up'] : ['fal','chevron-down']" class="m-2 mr-3" />
					</span>
				</span>
			</button>
			<ds-collapse :is-open="collapse" class="w-100 mt-1 pb-2 pl-3 pr-3 bg-white">
				<div v-if="!hideTimeline">
					<div class="mb-2 d-flex options-grey-style">
						<span>
							{{ $t('t_Timeline') }}
						</span>
						<fa-icon class="ml-auto my-auto" style="cursor: pointer" :icon="['fal', 'times']" @click="deleteOption" />
					</div>

					<div class="mb-2">
						<column-select
							v-model:value="timelineColumn"
							:widgetInstanceId="widgetInstanceId"
							:showOrdering="false"
							:automap="false"
							hide-formatting-button
							filterDatasetsByColumnSelect="dimension0"
							:showChooseButtonSection="true"
							@update:value="updateConfigurationHandler($event)" />
					</div>

					<div class="mb-2 d-flex options-grey-style">
						Background text
					</div>

					<ds-box padding-bottom="S">
						<ds-btn-group class="d-inline-flex">
							<ds-toggle-bar :items="fontSizeButtons" :value="timelineOptions.fontSize" @selected="updateFontSize" />
						</ds-btn-group>
					</ds-box>

					<div class="d-flex justify-content-between mb-1">
						<span class="options-grey-style mb-2">
							{{ $t('t_customDuration') }}
						</span>
						<ds-check-box
							class="z-bump"
							name="check-button"
							:state="customDuration"
							outline
							@update:state="customDuration = $event" />
					</div>

					<slider
						v-if="customDuration"
						:value="(timelineOptions.interval / 1000)"
						:minValue="1"
						:maxValue="120"
						unit="s"
						@update:value="updateOptionsHandler('interval', $event * 1000)" />
					<template v-else>
						<ds-toggle-bar :items="intervalOptions" :value="timelineOptions.interval" @selected="updateInterval" />

						<p class="mb-1 mt-2 options-grey-style">
							Duration: {{ timelineOptions.interval / 1000 }} seconds
						</p>
					</template>
				</div>
				<div v-if="widgetTimelineMetadata.race === true">
					<single-switch
						switchText="t_raceAnimation"
						:value="raceAnimation"
						@update:value="updateRaceAnimation" />
				</div>
			</ds-collapse>
		</div>
	</div>
</template>

<script>
import {mapDimensionAxes, mapDimensionAxesConfiguration} from '@/util/widgetDataBinding';
import ColumnSelect from '@/modules/widget/components/widget-controls/ColumnSelect.vue';
import SingleSwitch from '@/modules/widget/components/widget-controls/SingleSwitch.vue';
import Slider from '@/modules/widget/components/widget-controls/Slider.vue';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import clone from 'lodash/clone';

const intervalOptions = [
	{
		label: 't_Short',
		value: 15000
	},
	{
		label: 't_Normal',
		value: 30000
	},
	{
		label: 't_Long',
		value: 60000
	}
];
const fontSizeButtons = [
	{
		icon: 'ds-icon-eye-disabled',
		value: 0
	},
	{
		icon: 'ds-icon-paragraph',
		value: 24
	},
	{
		icon: 'ds-icon-h2',
		value: 60
	},
	{
		icon: 'ds-icon-h1',
		value: 120
	}
];

export default {
	name: 'AppWidgetTimelineSection',
	components: {
		ColumnSelect,
		SingleSwitch,
		Slider
	},
	props: {
		widgetInstanceId: {
			type: String,
			default: null
		}
	},
	data() {
		return {
			collapse: false,
			timelineOptions: null,
			timelineColumn: null,
			fontSizeButtons,
			intervalOptions,
			customDuration: false
		};
	},
	computed: {
		widgetConfiguration() {
			return this.$store.getters['widgetInstances/configuration'](this.widgetInstanceId);
		},
		widgetTimelineOptions() {
			return this.widgetConfiguration?.options?.timeline ?? {};
		},
		widgetTimelineColumn() {
			return this.widgetConfiguration?.data?.configuration?.timeline ?? {};
		},
		widgetType() {
			return this.$store.getters['widgetInstances/widgetType'](this.widgetInstanceId);
		},
		widgetTimelineMetadata() {
			return this.$store.getters['widgetMetadata/widgetTypeMetadata'](this.widgetType)?.configuration?.timeline;
		},
		raceAnimation() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'raceAnimation');
		},
		hideTimeline() {
			return typeof this.widgetTimelineMetadata.hide === 'undefined' ? false : this.widgetTimelineMetadata.hide;
		},
		catalogItems() {
			return this.$store.getters['storyDetail/catalogItems'] ?? [];
		}
	},
	watch: {
		widgetTimelineOptions: {
			handler() {
				if (isEmpty(this.widgetTimelineOptions)) {
					const widgetType = this.$store.getters['widgetInstances/widgetType'](this.widgetInstanceId);
					this.timelineOptions = this.$store.getters['widgetMetadata/widgetTypeMetadata'](widgetType)?.configuration?.timeline;
				} else {
					this.timelineOptions = this.widgetTimelineOptions;
					this.customDuration = !intervalOptions.map((option) => option.value).includes(this.widgetTimelineOptions.interval);
				}
			},
			immediate: true
		},
		widgetConfiguration: {
			handler() {
				this.timelineColumn = mapDimensionAxesConfiguration(
					this.widgetTimelineColumn,
					this.widgetConfiguration?.data
				);
			},
			immediate: true
		}
	},
	methods: {
		toggleCollapse() {
			this.collapse = !this.collapse;
		},
		updateConfigurationHandler(value) {
			if (value.column && value.dataset && value.function) {
				const configuration = cloneDeep(this.widgetConfiguration.data.configuration);
				configuration.timeline = mapDimensionAxes(value);
				const newConfiguration = {
					data: {
						configuration,
						id: this.widgetConfiguration.data.id
					}
				};
				if (this.catalogItems?.find((catalog) => catalog.id === value.dataset)) {
					newConfiguration.data.catalogItemId = value.dataset;
				} else {
					newConfiguration.data.datasetId = value.dataset;
				}
				this.$store.dispatch('widgetInstances/setConfiguration', {
					widgetInstanceId: this.widgetInstanceId,
					configuration: {
						...newConfiguration
					}
				});
			}
		},
		deleteOption() {
			this.$store.dispatch('widgetInstances/removeTimeline', {
				widgetInstanceId: this.widgetInstanceId,
				optionName: 'timeline',
				reloadData: true
			});
			this.timelineColumn = {};
		},
		updateRaceAnimation(value) {
			this.$store.dispatch('widgetInstances/setOption', {
				widgetInstanceId: this.widgetInstanceId,
				optionName: 'raceAnimation',
				value
			});
		},
		updateFontSize(fontsize) {
			this.updateOptionsHandler('fontSize', fontsize);
		},
		updateInterval(interval) {
			this.updateOptionsHandler('interval', interval);
		},
		updateOptionsHandler(key, value) {
			if (isEqual(this.timelineOptions[key], value)) {
				return;
			}

			const temp = clone(this.timelineOptions);
			temp[key] = value;
			this.$store.dispatch('widgetInstances/setOption', {
				widgetInstanceId: this.widgetInstanceId,
				optionName: 'timeline',
				value: temp
			});
		}
	}
};
</script>

<style scoped>
.z-bump {
	z-index: 1;
}
</style>

<template>
	<div
		class="mx-0 mb-0 mt-4 p-0 col-12"
		style="border-radius: 5px; box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15); background-color: white">
		<ds-box>
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
								<fa-icon :icon="['fal', 'cog']" class="mr-0" />
							</span>
							{{ isVisualStory ? $t('t_Options') : $t('t_chartProperties') }}
						</span>
						<span class="text-black">
							<fa-icon :icon="collapse ? ['fal','chevron-up'] : ['fal','chevron-down']" class="m-2 mr-3" />
						</span>
					</span>
				</button>
			</div>
			<ds-collapse :is-open="collapse" class="w-100 mt-1 pb-2 bg-white">
				<ds-box padding-x="S">
					<explorer-chart-properties />
				</ds-box>
			</ds-collapse>
		</ds-box>
	</div>
</template>

<script>
import widgetControlComponentMixin from '@/mixins/widgetControlComponentMixin';
import ExplorerChartProperties
	from '@/modules/explorer/components/detail/attributeBar/component/ExplorerChartProperties.vue';

export default {
	name: 'AppWidgetOptionsSection',
	components: {ExplorerChartProperties},
	mixins: [widgetControlComponentMixin],
	data() {
		return {
			collapse: false,
			stepName: ''
		};
	},
	computed: {
		widgetInstance() {
			return (this.$store.getters['widgetInstances/instance'](this.widgetInstanceId) ?? null);
		},
		widgetTypeMetadata() {
			return this.$store.getters['widgetMetadata/widgetTypeMetadata'](this.widgetType);
		},
		widgetType() {
			return this.$store.getters['widgetInstances/widgetType'](this.widgetInstanceId);
		},
		widgetControls() {
			// TODO: no need to send to child component
			return Object.keys(this.widgetTypeMetadata.options);
		},
		isVisualStory() {
			return this.$store.getters['storyDetail/story']?.storyType === 'visual-data-story';
		}
	},
	watch: {
		widgetInstance: {
			handler(val) {
				if (val?.name && !this.isVisualStory) {
					this.stepName = val.name;
				}
			},
			immediate: true
		},
		stepName(value) {
			if (!this.isVisualStory) {
				if (this.widgetInstance?.configuration?.options?.isDefaultName) {
					this.$store.dispatch('widgetInstances/setOption', {
						widgetInstanceId: this.widgetInstanceId,
						optionName: 'isDefaultName',
						value: false
					});
				}
				this.$store.dispatch('widgetInstances/setName', {
					widgetInstanceId: this.widgetInstanceId,
					name: value
				});
			}
		}
	},
	methods: {
		toggleCollapse() {
			this.collapse = !this.collapse;
		}
	}
};
</script>

<style scoped>

</style>

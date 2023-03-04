<template>
	<div
		style="border-radius: 5px; box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15); background-color: white">
		<div :class="fill ? 'mt-4' : 'mt-4 mx-2'">
			<button
				class="btn btn-clean w-100 m-0 p-0 bg-white"
				:class="{'no-pointer-events': !collapsible}"
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
							<fa-icon v-if="headingIcon" :icon="headingIcon" class="mr-0" />
							<ds-icon
								v-if="headingIconSvg"
								class="inline-svg"
								:class="headingIconSvg === 'icon filter blue' ? 'mt-1' : 'mt-0'"
								fill="#1357e9"
								:name="headingIconSvg"
								alt="icon" />
						</span>
						{{ $t(headingText) }}
					</span>
					<span v-if="collapsible" style="color: #000000">
						<fa-icon :icon="collapse ? ['fal','chevron-up'] : ['fal','chevron-down']" class="m-2 mr-3" />
					</span>
				</span>
				<p v-if="description !== '' && !collapse" class="d-flex justify-content-start mx-3">
					{{ description }}
				</p>
			</button>

			<ds-collapse :is-open="collapse" :class="fill ? 'w-100 mt-1 pb-2 bg-white' : 'w-100 mt-1 pb-2 pl-3 pr-3 bg-white'">
				<template v-if="controls">
					<ds-col
						v-for="(control, name) in controls"
						:key="'WidgetControl' + widgetInstanceId + name"
						cols="12"
						class="mx-0 mb-0 mt-2 p-0">
						<app-widget-control-wrapper :widget-instance-id="`${widgetInstanceId}`" :name="name" :control="control" />
					</ds-col>
				</template>

				<ds-col v-else cols="12" class="m-0 p-0">
					<slot />
				</ds-col>

				<ds-col v-if="headingText === 't_Data' && !dataPreviewBlacklist[widgetType(widgetInstanceId)]" class="mx-0 px-0">
					<button class="btn btn-white mx-0 btn-block" @click="showDataGridModal = true">
						{{ $t('t_DataPreviewRows', {rows: rows(widgetInstanceId)}) }}
					</button>
				</ds-col>
			</ds-collapse>
		</div>
		<app-data-grid-modal
			v-if="headingText === 't_Data' && !dataPreviewBlacklist[widgetType(widgetInstanceId)]"
			:show-modal="showDataGridModal"
			:widget-instance-id="widgetInstanceId"
			@close-modal="showDataGridModal = false" />
	</div>
</template>

<script>
import AppWidgetControlWrapper from '@/modules/story/components/editor/AppWidgetControlWrapper.vue';
import AppDataGridModal from '@/modules/story/components/editor/AppDataGridModal.vue';
import dataPreviewBlacklist from '@/util/consts/dataPreviewBlacklist';
import widgetControlComponentMixin from '@/mixins/widgetControlComponentMixin';

export default {
	name: 'CategoriesWrapper',
	components: {
		AppWidgetControlWrapper,
		AppDataGridModal
	},
	mixins: [widgetControlComponentMixin],
	props: {
		headingText: {
			type: String,
			default: null
		},
		headingIcon: {
			type: Array,
			default: null
		},
		headingIconSvg: {
			type: String,
			default: null
		},
		controls: {
			type: Object,
			default: null
		},
		description: {
			type: String,
			default: ''
		},
		collapsible: {
			type: Boolean,
			default: true
		},
		open: {
			type: Boolean,
			default: false
		},
		fill: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			dataPreviewBlacklist,
			collapse: false,
			showDataGridModal: false
		};
	},
	computed: {
		isVisualStory() {
			return this.$store.getters['storyDetail/story']?.storyType === 'visual-data-story';
		}
	},
	beforeMount() {
		if (!this.collapsible || this.open || this.headingText === 't_Data') {
			this.collapse = true;
		}
	},
	methods: {
		toggleCollapse() {
			if (this.collapsible) {
				this.collapse = !this.collapse;
			}
		},
		widgetType(id) {
			return this.$store.getters['widgetInstances/widgetType'](id);
		},
		rows(id) {
			return this.$store.getters['widgetData/rawData'](id)?.rows.length || 0;
		}
	}
};
</script>

<style>
.no-pointer-events {
	pointer-events: none;
}
</style>

<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
	<div
		:key="canvasContainer"
		ref="canvasContainer"
		:class="{
			'position-relative visual-data-story': storyType === 'visual-data-story',
			'position-relative': isDataDashboard
		}"
		:style="pageStyle">
		<transition-group
			v-if="storyType === 'visual-data-story'"
			ref="section-window"
			tag="div"
			class="h-100 position-relative overflow-hidden">
			<div
				v-for="(widgetInstanceId, index) in widgetInstanceIds"
				v-show="showObj[widgetInstanceId].show || !showObj[widgetInstanceId].isAnimated"
				:key="widgetInstanceId + '-wrapper'"
				:class="[
					currentStackingVariant !== sectionStackingModes.ANIMATED ? '' : 'position-absolute tinder-widget w-100',
					isOverlay(widgetInstanceId) ? 'h-25' : 'h-100']">
				<transition
					v-if="isOverlay(widgetInstanceId)"
					v-show="showObj[widgetInstanceId].show"
					:key="widgetInstanceId + '-overlay'"
					class="h-100 position-relative overflow-hidden"
					tag="div">
					<div
						v-show="widgetInstanceId === selectedWidgetInstanceId"
						:key="'overlayWidget-' + widgetInstanceId"
						class="w-100 h-100 tinder-widget position-absolute">
						<widget-wrapper
							:key="'overlayWidget-' + widgetInstanceId"
							:read-only="false"
							class="pe-none py-4 position-absolute h-100 w-100"
							:variant="storyType"
							:widget-instance-id="widgetInstanceId"
							:style="{
								opacity: selectedWidgetInstanceState,
								transition: 'opacity 0.1s'
							}" />
					</div>
				</transition>
				<widget-wrapper
					v-else
					:key="widgetInstanceId + '-chart'"
					:read-only="false"
					class="transition-height"
					:class="[
						showObj[widgetInstanceId].show && isSameWidget(widgetInstanceId) ? 'overlay-size' : '',
						currentStackingVariant !== sectionStackingModes.ANIMATED
							? `position-absolute ${stackingPaddingClassMap[currentStackingVariant][index]}`
							: 'w-100 h-100 position-absolute'
					]"
					:variant="storyType"
					:stacking-config="currentStackingVariant !== sectionStackingModes.ANIMATED
						? sectionStackingVariants[currentStackingVariant].configuration[index]
						: null"
					:size-parent="stackedParentSize"
					:widget-instance-id="widgetInstanceId" />
			</div>
		</transition-group>
		<template v-else>
			<template v-for="widgetInstanceId in widgetInstanceIds">
				<transition
					v-if="isOverlay(widgetInstanceId)"
					v-show="showObj[widgetInstanceId].show"
					:key="`${widgetInstanceId}-overlay`"
					mode="out-in"
					name="notification">
					<app-widget-wrapper
						v-if="widgetInstanceId === selectedWidgetInstanceId"
						:key="'overlayWidget-' + widgetInstanceId"
						:page-widget-instance-id="pageWidgetInstanceId"
						class="overlay-top"
						:variant="storyType"
						:widget-instance-id="widgetInstanceId"
						@delete-selected-widget="deleteSelectedWidget" />
				</transition>
				<app-widget-wrapper
					v-else
					v-show="showObj[widgetInstanceId].show || !showObj[widgetInstanceId].isAnimated"
					:key="widgetInstanceId + '-chart'"
					:page-widget-instance-id="pageWidgetInstanceId"
					:class="{
						'overlay-size': showObj[widgetInstanceId].show && showObj[widgetInstanceId].isAnimated && isSameWidget(widgetInstanceId) && !isDataDashboard,
						'transition-height': showObj[widgetInstanceId].show && showObj[widgetInstanceId].isAnimated && isSameWidget(widgetInstanceId) && !isDataDashboard
					}"
					:variant="storyType"
					:widget-instance-id="widgetInstanceId"
					@delete-selected-widget="deleteSelectedWidget" />
			</template>
		</template>
		<filter-button v-if="isFilterOnPage(pageWidgetInstanceId)" :page-widget-instance-id="pageWidgetInstanceId" />
	</div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import sectionStackingVariants, {
	sectionStackingModes,
	stackingPaddingClassMap
} from '@/util/consts/sectionStackingVariants';
import AppWidgetWrapper from '@/modules/story/components/editor/MovableWidgetWrapper.vue';
import {storyType} from '@/modules/story/consts/storyType';
import FilterButton from '@/modules/story/components/FilterButton.vue';
import WidgetWrapper from '@/modules/story/components/editor/WidgetWrapper.vue';

export default {
	name: 'AppStoryPage',
	components: {
		WidgetWrapper,
		FilterButton,
		AppWidgetWrapper
	},
	props: {
		pageWidgetInstanceId: {
			type: String,
			required: true
		},
		overrideHeight: {
			type: Number,
			default: null
		}
	},
	data() {
		return {
			sectionStackingVariants,
			stackingPaddingClassMap,
			sectionStackingModes,
			canvasContainer: 1,
			overlayTypes: [
				'widget_notification_formula',
				'widget_insight_formula',
				'widget_explainer'
			]
		};
	},
	computed: {
		...mapGetters('storyDetail', [
			'story',
			'scale'
		]),
		...mapGetters('widgetInstances', [
			'selectedPageWidgetInstanceId',
			'isFilterOnPage'
		]),
		showObj() {
			return this.widgetInstanceIds.reduce((obj, widgetInstanceId, index) => {
				obj[widgetInstanceId] = {
					show: this.isShow(widgetInstanceId, index),
					isAnimated: !this.isDataDashboard
						&& !(this.currentStackingVariant !== 'animated'
							&& this.widgetInstanceIds.indexOf(widgetInstanceId) < sectionStackingVariants[this.currentStackingVariant].configuration.length)
				};
				return obj;
			}, {});
		},
		widgetInstanceIds() {
			return this.$store.getters['widgetInstances/widgetInstanceIds'][this.pageWidgetInstanceId] ?? [];
		},
		selectedWidgetInstanceId() {
			return this.$store.getters['widgetInstances/selectedWidgetInstanceIds'][this.pageWidgetInstanceId] ?? (this.widgetInstanceIds[0] ?? null);
		},
		stackedParentSize() {
			return this.currentStackingVariant === sectionStackingModes.ANIMATED ? null : this.parentSize === null ? this.getParentSize() : this.parentSize;
		},
		selectedWidgetInstanceState() {
			return this.selectedWidgetInstanceId ? this.$store.getters['widgetInstances/widgetInstanceState'](this.selectedWidgetInstanceId) : 1;
		},
		storyType() {
			return this.story?.storyType ?? null;
		},
		isDataDashboard() {
			return this.storyType === storyType.DATA_DASHBOARD;
		},
		show() {
			return this.storyType === 'visual-data-story' || this.pageWidgetInstanceId === this.selectedPageWidgetInstanceId;
		},
		dimensions() {
			if (this.storyType === 'visual-data-story') {
				return {
					width: 1200,
					height: 600
				};
			}
			const dimensions = this.story?.layoutConfiguration.dimensions ?? {};
			if (!dimensions.width) {
				dimensions.width = 1000;
			}
			if (!dimensions.height) {
				dimensions.height = 1000;
			}
			return dimensions;
		},
		height() {
			return (this.overrideHeight ?? this.dimensions.height)
				* this.scale
				* (this.$store.getters['widgetInstances/configuration'](this.pageWidgetInstanceId)?.options?.heightRatio ?? 1);
		},
		pageStyle() {
			return {
				width: '100%',
				zIndex: this.show ? 1 : -1,
				height: this.height ? `${this.height}px` : '100%'
			};
		},
		selectedStep() {
			if (this.selectedWidgetInstanceId) {
				const index = this.widgetInstanceIds.indexOf(this.selectedWidgetInstanceId);

				return index < 0 ? 1 : index + 1;
			}
			return 1;
		},
		playState() {
			return this.$store.getters['widgetTimeline/playState'](this.widgetInstanceIds[this.selectedStep - 1]);
		},
		currentStackingVariant() {
			return this.isDataDashboard
				? null
				: (this.$store.getters['widgetInstances/configuration'](this.pageWidgetInstanceId)?.options?.stacking ?? 'animated');
		}
	},
	watch: {
		pageStyle: {
			immediate: true,
			handler() {
				// Hack for rerender, container will render at start with wired size. Move have bad zone after
				if (this.isDataDashboard) {
					this.canvasContainer += 1;
				}
			}
		}
	},
	created() {
		this.sectionStackingVariants = sectionStackingVariants;
	},
	methods: {
		...mapActions('widgetInstances', [
			'selectWidgetInstance',
			'resetPageFilters',
			'removeInstance'
		]),
		deleteSelectedWidget() {
			if (this.widgetInstanceIds.includes(this.selectedWidgetInstanceId)) {
				if (this.widgetInstanceIds.length > 1) {
					this.removeInstance({widgetInstanceId: this.selectedWidgetInstanceId});
					if (!this.isDataDashboard) {
						this.selectWidgetInstance(this.widgetInstanceIds[this.selectedStep === 1 ? 0 : this.selectedStep - 2]);
					}
				}
			}
		},
		resetWidgetPageFilters() {
			this.resetPageFilters(this.pageWidgetInstanceId);
		},
		isSameWidget(widgetInstanceId) {
			return widgetInstanceId !== this.selectedWidgetInstanceId;
		},
		isOverlay(widgetInstanceId) {
			const widgetType = this.$store.getters['widgetInstances/widgetType'](widgetInstanceId);
			return this.currentStackingVariant === 'animated' && this.overlayTypes.includes(widgetType) && !this.isDataDashboard;
		},
		isShow(widgetInstanceId, index) {
			if (this.isDataDashboard) {
				return true;
			}
			const widgetType = this.$store.getters['widgetInstances/widgetType'](widgetInstanceId);

			// Check if its overlayWidget and is selected right now
			if (this.overlayTypes.includes(widgetType)) {
				return widgetInstanceId === this.selectedWidgetInstanceId;
			}

			// If its regular widget get all overlay widgets to right till next regular widget.
			const overLayWidgets = this.findAllOverlayToRight(index + 1);
			if (overLayWidgets.includes(this.selectedWidgetInstanceId)) {
				return true;
			}

			return widgetInstanceId === this.selectedWidgetInstanceId;
		},
		findAllOverlayToRight(indexFrom) {
			const result = [];
			for (let i = indexFrom; i < this.widgetInstanceIds.length; i++) {
				const widgetType = this.$store.getters['widgetInstances/widgetType'](this.widgetInstanceIds[i]);
				if (!this.overlayTypes.includes(widgetType)) {
					break;
				}
				result.push(this.widgetInstanceIds[i]);
			}
			return result;
		}
	}
};
</script>

<style lang="scss" scoped>
	.overlay-size {
		top: 25% !important;
		height: 75% !important;
		position: absolute;
		:deep(.deckgl-container) {
			height: 80% !important;
		}
	}
	.transition-height {
		transition:top .7s ease-out;
		transition-delay: .2s;
	}

	.notification-enter-active, .notification-leave-active {
		transition: opacity 0.5s
	}
	.notification-enter-from, .notification-leave-to {
		opacity: 0
	}

	.overlay-top {
		height: 25% !important;
		top: 0;
		position: absolute;
	}
</style>

<template>
	<div
		class="w-100 h-100 visual-data-story position-relative">
		<div
			v-if="renderWidgets"
			class="page-container position-relative overflow-hidden parent-container">
			<filter-button v-if="isFilterOnPage(pageWidgetInstanceId)" class="position-top" :pageWidgetInstanceId="pageWidgetInstanceId" />
			<transition-group
				ref="section-window"
				tag="div"
				class="h-100 position-relative overflow-hidden"
				:name="scrollDirectionDown ? 'tinder' : 'reverse-tinder'">
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
						tag="div"
						:name="scrollDirectionDown ? 'tinder' : 'reverse-tinder'">
						<div
							v-show="widgetInstanceId === selectedWidgetInstanceId"
							:key="'overlayWidget-' + widgetInstanceId"
							class="w-100 h-100 tinder-widget position-absolute">
							<widget-wrapper
								:key="'overlayWidget-' + widgetInstanceId"
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
		</div>
	</div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex';
import sectionStackingVariants, {sectionStackingModes, stackingPaddingClassMap} from '@/util/consts/sectionStackingVariants';
import WidgetWrapper from '@/modules/story/components/editor/WidgetWrapper.vue';
import {overlayTypes} from '@/modules/story/components/presenter/consts';
import FilterButton from '@/modules/story/components/FilterButton.vue';

export default {
	name: 'PresenterSection',
	components: {
		WidgetWrapper,
		FilterButton
	},
	props: {
		activeWidgetGroup: {
			type: Object,
			default: () => ({})
		},
		pageWidgetInstanceId: {
			type: String,
			required: true
		},
		sectionIndex: {
			type: Number,
			default: 0
		},
		scrollDirectionDown: {
			type: Boolean,
			default: true
		},
		renderWidgets: {
			type: Boolean,
			required: true
		},
		activeResize: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			parentSize: null,
			sectionStackingVariants,
			sectionStackingModes,
			stackingPaddingClassMap
		};
	},
	computed: {
		...mapGetters('storyDetail', ['story']),
		...mapGetters('widgetInstances', ['selectedPageWidgetInstanceId', 'isFilterOnPage']),
		showObj() {
			const result = {};
			this.widgetInstanceIds.forEach((widgetInstanceId, index) => {
				result[widgetInstanceId] = {
					show: this.isShow(widgetInstanceId, index),
					isAnimated: !(this.currentStackingVariant !== 'animated'
						&& this.widgetInstanceIds.indexOf(widgetInstanceId) < sectionStackingVariants[this.currentStackingVariant].configuration.length)
				};
			});
			return result;
		},
		widgetInstanceIds() {
			return this.$store.getters['widgetInstances/widgetInstanceIds'][this.pageWidgetInstanceId] ?? [];
		},
		selectedWidgetInstanceId() {
			return this.$store.getters['widgetInstances/selectedWidgetInstanceIds'][this.pageWidgetInstanceId] ?? (this.widgetInstanceIds[0] ?? null);
		},
		selectedWidgetInstanceState() {
			return this.selectedWidgetInstanceId ? this.$store.getters['widgetInstances/widgetInstanceState'](this.selectedWidgetInstanceId) : 1;
		},
		stackedParentSize() {
			return this.currentStackingVariant === sectionStackingModes.ANIMATED ? null : this.parentSize === null ? this.getParentSize() : this.parentSize;
		},
		storyType() {
			return this.story?.storyType ?? null;
		},
		currentStackingVariant() {
			return this.storyType === 'data-dashboard'
				? null
				: (this.story.sections[this.sectionIndex]?.configuration?.stacking ?? sectionStackingModes.ANIMATED);
		}
	},
	watch: {
		selectedWidgetInstanceId(val) {
			if (this.activeWidgetGroup.widgetInstanceId === this.pageWidgetInstanceId) {
				const resizedWidgetOpt = {
					opt: {
						animation: {
							duration: 400
						}
					},
					widgetId: this.selectedWidgetInstanceId
				};
				const isOverlayWidget = overlayTypes.includes(this.$store.getters['widgetInstances/widgetType'](this.selectedWidgetInstanceId));
				let widgetToResize = null;
				if (isOverlayWidget) {
					const indexOfOverlayWidget = this.activeWidgetGroup.stepMap.indexOf(this.selectedWidgetInstanceId);
					// find first non overlay widget to resize
					for (let i = indexOfOverlayWidget; i >= 0; i--) {
						if (!overlayTypes.includes(this.$store.getters['widgetInstances/widgetType'](this.activeWidgetGroup.stepMap[i]))) {
							widgetToResize = this.activeWidgetGroup.stepMap[i];
							break;
						}
					}
				}
				if (val && widgetToResize) {
					const el = this.$refs['section-window']?.$el;
					if (el) {
						const style = getComputedStyle(el);
						resizedWidgetOpt.widgetId = widgetToResize;
						resizedWidgetOpt.opt.height = Number(style.height.replace('px', '')) * 0.70;
					}
				} else {
					resizedWidgetOpt.opt.height = 'auto';
				}
				this.setResize(resizedWidgetOpt);
			}
		},
		// Resizer fo a case when sidebar is closed on active section other then the stacked one
		activeResize() {
			this.resizeHandler();
		}
	},
	mounted() {
		if (this.currentStackingVariant !== sectionStackingModes.ANIMATED) {
			this.resizeHandler();
		}
	},
	created() {
		this.sectionStackingVariants = sectionStackingVariants;

		if (this.currentStackingVariant !== sectionStackingModes.ANIMATED) {
			window.addEventListener('resize', this.resizeHandler);
		}
	},
	unmounted() {
		if (this.currentStackingVariant !== sectionStackingModes.ANIMATED) {
			window.removeEventListener('resize', this.resizeHandler);
		}
	},
	methods: {
		...mapMutations('widgetInstances', ['setResize']),
		isSameWidget(widgetInstanceId) {
			return widgetInstanceId !== this.selectedWidgetInstanceId;
		},
		isOverlay(widgetInstanceId) {
			const widgetType = this.$store.getters['widgetInstances/widgetType'](widgetInstanceId);
			return this.currentStackingVariant === 'animated' && overlayTypes.includes(widgetType);
		},
		isShow(widgetInstanceId, index) {
			const widgetType = this.$store.getters['widgetInstances/widgetType'](widgetInstanceId);

			// Check if its overlayWidget and is selected right now
			if (overlayTypes.includes(widgetType)) {
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
				if (!overlayTypes.includes(widgetType)) {
					break;
				}
				result.push(this.widgetInstanceIds[i]);
			}
			return result;
		},
		getParentSize() {
			const parentElement = document.getElementsByClassName('parent-container').item(0);
			if (parentElement) {
				const style = getComputedStyle(parentElement);
				const height = window.innerHeight - Number(style.paddingTop.replace('px', ''));
				let width = window.innerWidth - (Number(style.paddingLeft.replace('px', ''))
					+ Number(style.paddingRight.replace('px', '')));

				if (this.currentStackingVariant !== sectionStackingModes.ANIMATED) {
					const stackedRight = document.getElementsByClassName('stacked-right')
						.item(0);
					if (stackedRight) {
						const paddingStyle = getComputedStyle(stackedRight);
						width -= (Number(paddingStyle.paddingRight.replace('px', '')) * 2);
					}
				}

				return {
					height,
					width
				};
			}
			return null;
		},
		resizeHandler() {
			this.parentSize = this.getParentSize();
		}
	}
};
</script>

<style lang="scss" scoped>
	.page-container {
		padding-right: calc(100vw / 12);
		padding-left: calc(100vw / 12);
		padding-top: 10vh;
		height: 100%;
	}
	.tinder-widget {
		top: 0;
		left: 0;
		bottom: 0;
		right:0;
	}

	.stacked-left {
		padding-right: 1rem;
	}

	.stacked-right {
		padding-right: 1rem;
	}

	.reverse-tinder-enter-active,
	.reverse-tinder-leave-active {
		transition: all 0.5s;
		transition-delay: 200ms;
	}

	.reverse-tinder-enter-from {
		transform: translate(-100%, 0);
	}

	.reverse-tinder-leave-to {
		transform: translate(100%, 0);
	}
	.tinder-enter-active,
	.tinder-leave-active {
		transition: all 0.5s;
		transition-delay: 200ms;
	}

	.tinder-enter-from {
		transform: translate(100%, 0);
	}

	.tinder-leave-to {
		transform: translate(-100%, 0);
	}
	.overlay-size {
		top: 25% !important;
		height: 75% !important;
		position: absolute;
		:deep(.deckgl-container) {
			height: 80% !important;
		}
	}
	.transition-height {
		transition: top 0.5s ease-out;
	}

	.notification-enter-active, .notification-leave-active {
		transition: opacity 0.5s
	}
	.notification-enter-from, .notification-leave-to {
		opacity: 0
	}

	.custom-progress {
		height: 2px;
		border-radius: 0;
		background: white;
	}
	.position-top {
		top: 60px;
		right: 80px;
	}
</style>

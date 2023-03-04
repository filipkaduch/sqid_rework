<template>
	<div
		v-if="story"
		class="navigation-height transition-animation navigation position-fixed overflow-auto"
		data-testid="presenter-sidebar"
		:class="[sidebarActive ? 'navigation-active' : 'navigation-hidden']">
		<ds-box padding-bottom="M" class="sections-menu">
			<div v-for="(section, index) in storySections" :key="index">
				<template v-if="isSingleStepSection(index)">
					<ds-box padding-x="M" padding-top="M">
						<ds-box
							border-radius="basic"
							padding-y="M"
							padding-x="M"
							align-y="center"
							box-shadow="low"
							class="transition-animation cursor-pointer step-card"
							:class="[
								activeSection === index ? 'ds-bg-secondary-0 active ds-text-secondary' : 'ds-bg-white ds-text-display-content-700',
								seenWidgets.includes(indexOfSection(index)) ? 'seen' : ''
							]"
							@click="$emit('scrollToSection', index, false, index > activeSection)"
							@touchend="$emit('scrollToSection', index, false, index > activeSection)">
							<ds-inline align-y="center" no-wrap gap="M">
								<ds-inline-item>
									<ds-text variant="captionMedium" class="inherit-font-color">
										{{ indexOfSection(index) }}.
									</ds-text>
								</ds-inline-item>
								<ds-inline-item class="text-ellipsis">
									<ds-text
										class="inherit-font-color"
										:variant="activeSection === index ? 'captionMedium' : 'caption'"
										:color="activeSection === index ? 'secondary' : 'display-content-700'">
										{{ getSingleStepTitle(index) ?? '' }}
									</ds-text>
								</ds-inline-item>
							</ds-inline>
						</ds-box>
					</ds-box>
				</template>
				<template v-else>
					<ds-box padding-x="M" padding-top="M">
						<ds-box border-radius="basic" box-shadow="low" class="ds-bg-white">
							<ds-box
								v-for="(subSection, stepIndex) in section.widgets"
								:key="`sub-${subSection.id}`"
								align="space-between"
								padding-x="M"
								padding-y="M"
								class="step-card transition-animation cursor-pointer"
								:class="{
									'ds-bg-secondary-0 active': isActiveGroupStep(index, stepIndex + 1),
									'border-top-radius': stepIndex === 0,
									'border-bottom-radius': stepIndex === section.widgets.length - 1,
									'seen': seenWidgets.includes(indexOfSection(index) + stepIndex) ? 'seen' : ''
								}"
								@click="$emit('scrollToSection',
									index,
									false,
									index === activeSection ? stepIndex + 1 > activeWidgetGroup.step : index > activeSection,
									stepIndex)"
								@touchend="$emit('scrollToSection',
									index,
									false,
									index === activeSection ? stepIndex + 1 > activeWidgetGroup.step : index > activeSection,
									stepIndex)">
								<ds-inline align-y="center" no-wrap gap="M">
									<ds-inline-item>
										<ds-text
											variant="captionMedium"
											:color="isActiveGroupStep(index, stepIndex + 1) ? 'secondary' : 'display-content-700'">
											{{ indexOfSection(index) + stepIndex }}.
										</ds-text>
									</ds-inline-item>
									<ds-inline-item
										class="text-ellipsis"
										:class="isActiveGroupStep(index, stepIndex + 1) ? 'ds-text-secondary' : 'ds-text-display-content-700'">
										<ds-text
											class="inherit-font-color"
											:variant="isActiveGroupStep(index, stepIndex + 1) ? 'captionMedium' : 'caption'">
											{{ getStepTitle(index, stepIndex) }}
										</ds-text>
									</ds-inline-item>
								</ds-inline>
							</ds-box>
						</ds-box>
					</ds-box>
				</template>
			</div>
		</ds-box>
	</div>
</template>

<script>
import {endPageName} from '@/modules/story/components/presenter/consts';
import {mapGetters} from 'vuex';
import {sectionStackingModes} from '@/util/consts/sectionStackingVariants';
import clone from 'lodash/clone';

export default {
	name: 'PresenterNavigation',
	props: {
		activeSection: {
			type: Number,
			required: true
		},
		sidebarActive: {
			type: Boolean,
			default: true
		},
		activeWidgetGroup: {
			type: Object,
			default: () => ({})
		},
		seenWidgets: {
			type: Array,
			required: true
		}
	},
	emits: ['scrollToSection', 'sidebar-state', 'active-widget'],
	data() {
		return {
			firstLoad: true
		};
	},
	computed: {
		...mapGetters('storyDetail', ['story']),
		storySections() {
			const result = clone(this.story.sections);
			result.push({widgets: [{name: endPageName}]});
			return result;
		}
	},
	watch: {
		sidebarActive(value) {
			this.$emit('sidebar-state', value);
		},
		activeWidgetGroup: {
			handler(value) {
				this.$emit('active-widget', this.indexOfSection(this.activeSection) + value.step - 1);
			},
			deep: true
		}
	},
	methods: {
		getStepTitle(sectionIndex, stepIndex) {
			let sectionTitle = this.story.sections[sectionIndex].widgets[stepIndex].name ?? null;
			if (!sectionTitle) {
				sectionTitle = this.$t(`widgetTypes.${this.story.sections[sectionIndex].widgets[stepIndex].widgetType}_title`);
			}
			return sectionTitle;
		},
		isAnimated(index) {
			return (this.storySections[index].configuration?.stacking ?? sectionStackingModes.ANIMATED) === sectionStackingModes.ANIMATED;
		},
		getSingleStepTitle(index) {
			if (!this.isAnimated(index)) {
				return this.storySections[index].name
					? this.storySections[index].name
					: this.$t('t_Stacked');
			}
			if (this.storySections[index].widgets[0].name === endPageName) {
				return this.$t('presenterLastPage.navigationName');
			}
			return this.getStepTitle(index, 0);
		},
		isSingleStepSection(index) {
			return this.sectionLen(index) === 1 || !this.isAnimated(index);
		},
		sectionLen(index) {
			return this.storySections[index].widgets.length;
		},
		isActiveGroupStep(index, stepIndex) {
			return this.activeSection === index && this.activeWidgetGroup?.step === stepIndex;
		},
		indexOfSection(index) {
			let iteratedIndex = 0;
			for (let i = 0; i < this.storySections.length; i++) {
				if (i === index) {
					break;
				}
				iteratedIndex += this.storySections[i].widgets.length;
			}
			return iteratedIndex + 1;
		}
	}
};
</script>
<style lang="scss" scoped>
.inherit-font-color {
	color: inherit;
}
.text-ellipsis {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.step-card {
	border-left: 4px solid map-get($ds-colors, 'separate-content-0');
}
.step-card.active {
	border-left: 4px solid map-get($ds-colors, 'secondary');
}
.step-card:hover:not(.active) {
	background-color: map-get($ds-colors, 'separate-content-0');
}
.step-card.seen:not(.active) {
	border-left: 4px solid map-get($ds-colors, 'separate-content-200');
}
.navigation-active {
	left: 0;
}
.navigation-hidden{
	left: -327px;
}
.navigation {
	background-color: map-get($ds-colors, 'separate-content-0');
	border-right: 1px solid map-get($ds-colors, 'separate-content-200');
	top: 52px;
	height: calc(100vh - 52px);
	width: 327px;
}

.set-nav {
	z-index: 1031;
	left: 0;
}

.transition-animation {
	transition: all 400ms ease;
}

.sections-menu {
	background-color: map-get($ds-colors, 'separate-content-100');
	text-overflow: ellipsis;
	white-space: nowrap;
	z-index: 12;
	transition: all 400ms ease;
}

.menu-point {
	width: 8px;
	height: 8px;
	border: 1px solid map-get($ds-colors, 'separate-content-500');
	border-radius: 50%;
	transition: .4s ease all;
	display: block;
}

.menu-point.seen {
	background-color: map-get($ds-colors, 'separate-content-200');
	border: 1px solid map-get($ds-colors, 'separate-content-200');
}
.menu-point.active {
	border: none;
}

.sections-menu .menu-point.active {
	background-color: map-get($ds-colors, 'secondary');
}
.sections-menu .sub-menu-point.active {
	background-color: map-get($ds-colors, 'secondary');
}
</style>

<template>
	<ds-inline class="header-bar" align="space-between" align-y="center">
		<ds-inline class="h-100 menu-wrapper" align-y="center" align="left">
			<ds-box
				class="h-100 cursor-pointer kebab-menu"
				:class="{active: sidebarActive}"
				data-testid="presenter-open-sidebar"
				padding-x="M"
				border-right="separate"
				align-y="center"
				@touchend="$emit('update:sidebar-active', !sidebarActive)"
				@click="$emit('update:sidebar-active', !sidebarActive)">
				<ds-icon name="ds-icon-kebab-menu" alt="menu" />
			</ds-box>
			<ds-box v-if="storyProgress?.storyLength && storyProgress?.currentStep" padding-left="M">
				<ds-inline>
					<ds-text variant="subheadline" color="secondary">
						{{ storyProgress.currentStep }}&nbsp;
					</ds-text>
					<ds-text variant="subheadline" color="display-content-300">
						/ {{ storyProgress.storyLength }}
					</ds-text>
				</ds-inline>
			</ds-box>
		</ds-inline>
		<ds-text variant="subheadline">
			{{ story?.name }}
		</ds-text>
		<ds-inline-item>
			<ds-box padding-right="S" align-y="center">
				<ds-btn
					variant="ghost"
					:disabled="(story?.configuration?.globalFilters?.length ?? 0) === 0"
					@touchend="$emit('open-filters')"
					@click="$emit('open-filters')">
					<ds-box flex-type="row">
						<ds-icon
							class="mr-2 align-self-center"
							name="icon-filter"
							alt="icon" />
						{{ $t('presenterFilter.t_filter') }}
						<div class="d-flex filter-circle ml-2 justify-content-center align-items-center">
							{{ story?.configuration?.globalFilters?.length ?? 0 }}
						</div>
					</ds-box>
				</ds-btn>
			</ds-box>
		</ds-inline-item>
	</ds-inline>
</template>

<script>
export default {
	name: 'PresenterHeaderNavigation',
	props: {
		story: {
			type: Object,
			required: true
		},
		sidebarActive: {
			type: Boolean,
			default: false
		},
		activeWidgetGroup: {
			type: Object,
			required: true
		},
		activeSection: {
			type: Number,
			required: true
		}
	},
	emits: ['update:sidebar-active', 'open-filters'],
	data() {
		return {
			storyProgress: {}
		};
	},
	computed: {
		storyLen() {
			let len = 0;
			this.story.sections.forEach((section) => {
				len += section.widgets.length;
			});
			return len + 1;
		}
	},
	watch: {
		activeWidgetGroup: {
			handler(value) {
				if (value) {
					this.storyProgress = {
						storyLength: this.storyLen,
						currentStep: this.indexOfSection(this.activeSection) + value.step - 1
					};
				}
			},
			deep: true,
			immediate: true
		}
	},
	methods: {
		indexOfSection(index) {
			let iteratedIndex = 0;
			for (let i = 0; i < this.story.sections.length; i++) {
				if (i === index) {
					break;
				}
				iteratedIndex += this.story.sections[i].widgets.length;
			}
			return iteratedIndex + 1;
		}
	}
};
</script>

<style lang="scss" scoped>
.kebab-menu {
	user-select: none;
	flex-grow: 0 !important;
}
@media (hover: hover) {
	.kebab-menu:hover {
		background-color: map-get($ds-colors, 'secondary-100');
	}
}

.kebab-menu.active {
	background-color: map-get($ds-colors, 'secondary-100');
}

.menu-wrapper {
	width: 150px;
}

.header-bar {
	font-size: 17px;
	width: 100%;
	max-height: 52px;
	height: 52px;
	z-index: 1000;
	position: fixed;
	line-height: 52px;
	border-bottom: 1px solid map-get($ds-colors, 'separate-content-200');
	background-color: white!important;
}
</style>

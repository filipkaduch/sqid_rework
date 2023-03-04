<template>
	<ds-col v-click-outside="onClickOutside" cols="wp" class="p-0 m-0 h-100">
		<div class="bg-white h-100">
			<ds-row class="m-0 p-0">
				<ds-col cols="12" class="p-0 m-0">
					<button
						class="m-0 btn-icon btn-palette-nav-icon btn btn-light btn-square btn-block"
						@click="navClick(selectedStep)">
						<fa-icon class="text-primary" fixed-width :icon="['fal', selectedWidgetInstanceId ? 'database' : 'info']" />}
					</button>
				</ds-col>
			</ds-row>
			<div :class="{show: showSidebar && sidebarClosingTimeout === null}" class="palette-sidebar border-left shadow">
				<div class="mx-2 mt-2" @click="closeSidebar">
					<fa-icon class="text-primary" fixed-width :icon="['fas', 'chevron-double-right']" size="lg" />
				</div>
				<div class="h-100 bg-white">
					<app-loading :loading="storyInicialized" class="h-100">
						<app-widget-controls @go-to-section="scrollToSection($event)" />
					</app-loading>
				</div>
			</div>
		</div>
	</ds-col>
</template>

<script>
import AppLoading from '@/components/design/AppLoading.vue';
import AppWidgetControls from '@/modules/story/components/editor/AppWidgetControls.vue';
import sidebarMixin from '@/mixins/sidebarMixin';

export default {
	name: 'AppWidgetControlsMobile',
	components: {
		AppLoading,
		AppWidgetControls
	},
	mixins: [sidebarMixin],
	props: {
		storyInicialized: {
			type: Boolean,
			default: false
		}
	},
	emits: ['scrollToIndex'],
	data() {
		return {
			selectedWidgetInstanceId: null
		};
	},
	computed: {
		selectedStep() {
			return this.$store.getters['widgetInstances/selectedWidgetInstanceId'];
		}
	},
	methods: {
		scrollToSection(index) {
			this.$emit('scrollToIndex', index);
		}
	}
};
</script>

<style lang="scss" scoped>
	$sidebar-width: 32rem;
	$widget-col-width: calc(#{$sidebar-width} / 2);
	$widget-col-height: calc(#{$widget-col-width}/3 + 3*(#{$widget-col-width}/8) + 2);
	$sidebar-padding-scrollbar: 0.5rem;
	$sidebar-padding: 0.5rem;
	$sidebar-nav-width: 3rem;

	.col-wp {
		flex: 0 0 $sidebar-nav-width;
		max-width: $sidebar-nav-width;
		z-index: 101;
	}

	.btn-palette-nav-icon {
		width: $sidebar-nav-width;
		height: $sidebar-nav-width;
		position: relative;
	}

	.btn-palette-nav-icon [class^="fa-"], .btn-palette-nav-icon [class*=" fa-"] {
		font-size: ($sidebar-nav-width * 0.5) !important;
	}

	.btn-palette-nav-icon .palette-selector {
		display: none;
		position: absolute;
		top: 0;
		right: 0;
		height: $sidebar-nav-width;
		width: ($sidebar-nav-width * 0.05);
		border-radius: 0 0.25rem 0.25rem 0;
	}

	.btn-palette-nav-icon.selected .palette-selector {
		display: block;
	}

	.palette-sidebar {
		overflow: hidden;
		position: fixed;
		top: $sidebar-nav-width;
		right: $sidebar-width * -1;
		height: calc(100% - #{$sidebar-nav-width});
		width: $sidebar-width;
		z-index: 1022;
		background-color: $body-bg;
		transition: right 0.5s;
	}

	.palette-sidebar.show {
		right: 0
	}

	.palette-sidebar .palette-sidebar-content-wrapper {
		padding: 0 ($sidebar-padding + $sidebar-padding-scrollbar) $sidebar-padding $sidebar-padding;
	}

	.widget-col {
		height: $widget-col-height;
	}

	.widget {
		cursor: pointer;
		overflow: hidden;
	}

	.widget:hover .widget-info {
		display: none;
	}

	.widget:hover .widget-description {
		display: block;
	}

	.widget .widget-info {
		display: block;
		background-color: white;
	}

	.widget .widget-info img {
		width: calc(#{$widget-col-width} / 3);
		height: calc(#{$widget-col-width} / 3);
		margin: calc(#{$widget-col-width} / 8) 0;
	}

	.widget .widget-description {
		display: none;
		background-color: mix(white, $action, 83%);
	}

	.widget .widget-description .btn {
		margin: calc(#{$widget-col-width} / 8) 0;
	}
	dd {
		font-weight: 500;
	}

	dt {
		font-size: 1.25rem;
		font-weight: 300;
	}

	.row.constrolStyle {
		color: #000000;
	}

</style>

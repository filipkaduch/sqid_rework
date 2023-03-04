<template>
	<ds-col cols="wp" class="p-0 m-0 min-vh-100">
		<app-loading :loading="!widgetTypesInitialized || !metadataInitialized" class="h-100">
			<div class="h-100">
				<ds-box flex-type="column" class="palette-nav m-0 p-0 h-100">
					<li class="nav-item">
						<router-link
							class="btn-home p-0 m-0 d-flex align-items-center cursor-pointer"
							:to="{name: 'homepage'}">
							<span class="icon-logo mx-auto">
								<ds-icon name="a-logo-dark" alt="Data Stories" />
							</span>
						</router-link>
					</li>
					<template v-for="(group, index) in widgetTypes" :key="'tooltip-' + index">
						<ds-tooltip placement="right">
							<template #icon>
								<button
									:id="group.tkTitle + '_create'"
									class="btn btn-light btn-block btn-square m-0 btn-icon btn-palette-nav-icon"
									:data-testid="`menu-item-${group.tkTitle}`"
									:class="{selected: selectedMenu === index && sidebarClosingTimeout === null}"
									@click="navClick(index)">
									<div class="palette-selector" />
									<ds-icon fill="interaction-400" :name="paletteIcons[group.icon]" alt="icon" /><br>
								</button>
							</template>
							<template #tooltip>
								{{ $t(`widgetTypes.navigation.${group.tkTitle}_create`) }}
							</template>
						</ds-tooltip>
					</template>
					<ds-dropdown class="w-100 mt-auto" placement="right-end">
						<template #triggerContent>
							<button class="w-100 btn btn-light btn-block btn-square py-3 m-0 border-radius-0 help-btn">
								<ds-icon name="icon-help-dark" alt="Help" />
							</button>
						</template>
						<template #dropdownContent>
							<ds-box padding-y="XS">
								<a :href="documentationLink" target="_blank">
									<ds-box class="dd-item" padding-y="S" padding-x="GROUP">
										<ds-text variant="body" color="display-content" no-wrap>{{ $t("helpNavigationLinks.documentation") }}</ds-text>
									</ds-box>
								</a>
								<a href="https://community.ataccama.com/data-stories-5" target="_blank">
									<ds-box class="dd-item" padding-y="S" padding-x="GROUP">
										<ds-text variant="body" color="display-content" no-wrap> {{ $t("helpNavigationLinks.community") }} </ds-text>
									</ds-box>
								</a>
								<a href="https://www.ataccama.com/legal/privacy-policy" target="_blank">
									<ds-box class="dd-item" padding-y="S" padding-x="GROUP">
										<ds-text variant="body" color="display-content" no-wrap> {{ $t("helpNavigationLinks.privacyPolicy") }} </ds-text>
									</ds-box>
								</a>
							</ds-box>
						</template>
					</ds-dropdown>
					<ds-dropdown class="w-100" placement="right-end">
						<template #triggerContent>
							<button class="w-100 btn btn-light btn-block btn-square m-0 border-radius-0">
								<img
									:src="'https://www.gravatar.com/avatar/' + gravatarHash + '?d=mp'"
									class="user-img"
									alt="user-img">
							</button>
						</template>
						<template #dropdownContent>
							<avatar-dropdown-content />
						</template>
					</ds-dropdown>
				</ds-box>
				<div :class="{show: selectedMenu !== null && sidebarClosingTimeout === null}" class="palette-sidebar border-right shadow position-absolute">
					<div v-if="selectedMenu !== null" class="p-4 mt-1 d-flex align-content-center">
						<h5 class="m-0"><strong>{{ $t(`widgetTypes.navigation.${widgetTypes[selectedMenu].tkTitle}_create`) }}</strong></h5>
					</div>
					<template v-if="selectedMenu !== null">
						<div class="h-100 overflow-auto">
							<div class="palette-sidebar-content-wrapper">
								<ds-row v-for="(subGroup, index) in widgetTypes[selectedMenu].subGroups" :key="'subGroup' + selectedMenu + index" class="m-0 p-0">
									<app-widget-group
										:open="index === 0"
										:icons="icons"
										:icon="subGroup.icon"
										:data-testid="`subgroup-${subGroup.tkTitle}`"
										:title="`widgetTypes.navigation.${subGroup.tkTitle}`"
										:widgets="subGroup.widgets"
										@create="createWidget" />
								</ds-row>
							</div>
						</div>
					</template>
				</div>
			</div>
		</app-loading>
	</ds-col>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import AppLoading from '@/components/design/AppLoading.vue';
import AppWidgetGroup from '../../../../components/design/AppWidgetGroup.vue';
import AvatarDropdownContent from '@/components/design/AvatarDropdownContent.vue';

export default {
	name: 'AppWidgetPalette',
	components: {
		AppLoading,
		AppWidgetGroup,
		AvatarDropdownContent
	},
	inject: ['appConfig'],
	props: {
		storyType: {
			type: String,
			required: true
		}
	},
	emits: ['create-widget', 'palette-open'],
	data() {
		return {
			selectedMenu: null,
			plan: '',
			sidebarClosingTimeout: null
		};
	},
	computed: {
		...mapGetters('widgetTypes', {
			widgetTypesUnfiltered: 'widgetTypes',
			widgetTypesInitialized: 'initialized'
		}),
		...mapGetters('widgetMetadata', {
			metadataInitialized: 'initialized',
			widgetTypesMetadata: 'widgetTypesMetadata',
			metadataOptions: 'options'
		}),
		...mapGetters('storyDetail', ['story']),
		...mapGetters('authLogin', ['gravatarHash']),
		widgetTypes() {
			let unfilteredWidgetGroups = this.widgetTypesUnfiltered;
			// Feature flag for clients without deckGl maps
			if (this.appConfig?.denyMaps || this.appConfig?.oneIntegration) {
				unfilteredWidgetGroups = this.widgetTypesUnfiltered.filter((group) => group.icon !== 'map');
			}
			return unfilteredWidgetGroups
				.map((group) => ({
					...group,
					subGroups: group.subGroups
						.map((subGroup) => ({
							...subGroup,
							widgets: subGroup.widgets.filter((widget) => this.icons[widget.wtuid]
								// TODO: remove this fallback hack
								&& widget.wtuid !== 'widget_text_heading_two')
						}))
						.filter((subGroup) => subGroup.widgets.length > 0)
				}))
				.filter((group) => group.subGroups.length > 0);
		},
		subscription() {
			return this.$store.getters['authLogin/user']?.subscription ?? null;
		},
		icons() {
			return Object.keys(this.widgetTypesMetadata).reduce((result, key) => {
				if (this.widgetTypesMetadata[key] && (key !== 'widget_notification_formula' && key !== 'widget_insight_formula')) {
					result[key] = key;
				}
				return result;
			}, {});
		},
		oneIntegration() {
			return this.appConfig?.oneIntegration;
		},
		documentationLink() {
			return this.oneIntegration
				? 'https://support.ataccama.com/home/docs/aip/latest/user-guides/data-stories-user-guide'
				: 'https://support.ataccama.com/home/docs/datastories';
		},
		paletteIcons() {
			return this.widgetTypes.reduce((result, group) => {
				result[group.icon] = `widget_palette/${group.icon}`;
				return result;
			}, {});
		}
	},
	mounted() {
		this.initialized();
		document.addEventListener('click', this.close);
	},
	beforeUnmount() {
		document.removeEventListener('click', this.close);
	},
	methods: {
		...mapActions('widgetInstances', ['createNewInstance']),
		close(event) {
			if (!this.$el.contains(event.target)) {
				this.closeSidebar();
			}
		},
		closeSidebar() {
			this.sidebarClosingTimeout = setTimeout(() => {
				this.sidebarClosingTimeout = null;
				this.selectedMenu = null;
			}, 500);
		},
		createWidget(wtuid) {
			if (this.storyType === 'visual-data-story') {
				this.$emit('create-widget', wtuid);
			} else {
				this.createNewInstance({
					widgetType: wtuid
				});
			}
			this.closeSidebar();
		},
		navClick(index) {
			if (index === this.selectedMenu && this.sidebarClosingTimeout === null) {
				this.closeSidebar();
			} else {
				this.$emit('palette-open');
				this.selectedMenu = index;
				if (this.sidebarClosingTimeout !== null) {
					clearTimeout(this.sidebarClosingTimeout);
					this.sidebarClosingTimeout = null;
				}
			}
		},
		initialized() {
			this.plan = this.subscription.subscriptionPlan.name;
		}
	}
};
</script>

<style lang="scss" scoped>
$sidebar-width: 16.25rem;
$widget-col-width: calc(#{$sidebar-width} / 2);
$widget-col-height: calc(#{$widget-col-width}/3 + 3*(#{$widget-col-width}/8) + 2);
$sidebar-padding-scrollbar: 0.5rem;
$sidebar-padding: 0.5rem;
$sidebar-nav-width: 56px;
li {
	list-style: none;
}
.col-wp {
	flex: 0 0 $sidebar-nav-width;
	max-width: $sidebar-nav-width;
	z-index: 1000;
}
.palette-nav {
	background-color: #CFD8DD;
}
.btn-palette-nav-icon {
	width: $sidebar-nav-width;
	height: $sidebar-nav-width;
	position: relative;
}

.btn-palette-nav-icon .palette-selector {
	display: none;
	position: absolute;
	top: 0;
	left: 0;
	background-color: #2D3039;
	height: $sidebar-nav-width;
	width: ($sidebar-nav-width * 0.05);
	border-radius: 0 0.25rem 0.25rem 0;
}

.btn-palette-nav-icon.selected .palette-selector {
	display: block;
}

.palette-sidebar {
	overflow: hidden;
	top: 0;
	left: $sidebar-width * -1;
	height: 100%;
	width: $sidebar-width + $sidebar-padding-scrollbar + (2 * $sidebar-padding);
	z-index: -1;
	background-color: white;
	transition: left 0.5s;
}

.palette-sidebar.show {
	left: $sidebar-nav-width
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

.widget .widget-info svg {
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
.logo {
	left: -10.2001953125px;
}
.help-btn {
	border-top: 1px solid #FFFFFF4B;
}
.user-img {
	display: inline-block;
	margin-top: 11px;
	margin-bottom: 11px;
	width: 30px;
	height: 30px;
	border-radius: 50%;
	object-fit: cover;
}
.btn-home {
	height: 72px!important;
}
.help-btn {
	border-top: 1px solid #2D30394A;
}
</style>

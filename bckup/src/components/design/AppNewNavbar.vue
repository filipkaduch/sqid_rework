<template>
	<ds-box v-if="showMenu" flex-type="column" class="custom-nav vh-100">
		<ds-box flex-type="column" align="space-between" class="w-100 h-100">
			<ds-box flex-type="column">
				<li class="nav-item">
					<router-link
						class="btn-home p-0 m-0 d-flex align-items-center cursor-pointer"
						:to="{name: 'homepage'}">
						<span class="icon-logo mx-auto">
							<ds-icon name="ds-icon-logo-small" alt="Data Stories" />
						</span>
					</router-link>
				</li>
				<template v-for="(menuItem, index) in menuItems" :key="index">
					<li :id="menuItem.title + index">
						<ds-tooltip placement="right">
							<template #icon>
								<button
									class="btn btn-light btn-block btn-square py-3 m-0 border-radius-0"
									@click="$router.push({name: menuItem.pathName})">
									<ds-icon :name="menuItem.icon" fill="white" :alt="$t(menuItem.title)" />
								</button>
							</template>
							<template #tooltip>
								<ds-box padding-y="XS">
									<ds-text color="white" variant="bodyMedium">
										{{ $t(menuItem.title) }}
									</ds-text>
								</ds-box>
							</template>
						</ds-tooltip>
					</li>
				</template>
			</ds-box>
			<ds-box flex-type="column">
				<li class="nav-item mt-auto">
					<ds-dropdown class="w-100" placement="right-end">
						<template #triggerContent>
							<button class="w-100 btn btn-light btn-block btn-square py-3 m-0 border-radius-0 help-btn">
								<ds-icon name="icon-help" alt="Help" />
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
				</li>
				<li class="nav-item">
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
				</li>
			</ds-box>
		</ds-box>
		<ds-modal
			:show="onboardingModal">
			<template #modal-title>
				{{ $t('t_OnboardingVideo') }}
			</template>
			<template #modal-text>
				<iframe
					width="470"
					height="300"
					src="https://www.youtube.com/embed/odylNu3ptGs"
					allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
					allowfullscreen />
			</template>
			<template #modal-footer>
				<a
					type="button"
					class="btn btn-white border"
					href="https://www.youtube.com/playlist?list=PL8DUgmgn_nE-yXwRwkVGJjy32xDW81mRJ"
					target="_blank">
					<fa-icon :icon="['fal', 'external-link-alt']" />
					{{ $t('t_open_YT') }}
				</a>
				<a
					type="button"
					class="btn btn-white border"
					href="https://support.ataccama.com/home/docs/datastories"
					target="_blank">
					<fa-icon :icon="['fal', 'external-link-alt']" />
					Documentation
				</a>
				<a
					type="button"
					class="btn btn-white border"
					href="https://community.ataccama.com/data-stories-5"
					target="_blank">
					<fa-icon :icon="['fal', 'external-link-alt']" />
					Community
				</a>
				<button
					class="btn btn-action mr-auto"
					@click="onboardingModal = false">
					OK
				</button>
			</template>
		</ds-modal>
	</ds-box>
</template>

<script>
import {mapGetters} from 'vuex';
import AvatarDropdownContent from '@/components/design/AvatarDropdownContent.vue';

export default {
	name: 'AppNewNavbar',
	components: {
		AvatarDropdownContent
	},
	inject: ['appConfig'],
	// eslint-disable-next-line max-lines-per-function
	data() {
		return {
			defaultAvatar: encodeURIComponent('https://tellstory.cloud/img/missing-avatar.png'),
			menuItems: [
				{
					title: 't_Datasets',
					pathName: 'dataset-list',
					icon: 'ds-icon-datasets'
				},
				{
					title: 't_StoriesAndDashboards',
					pathName: 'story-list',
					icon: 'icon-stories'
				}
			],
			menuHiddenPathNames: [
				'login',
				'signout',
				'register',
				'error',
				'confirm-registration',
				'password-reset',
				'confirm-password-reset',
				'story-publish-section',
				'terms-and-conditions',
				'story-editor',
				'dashboard-editor',
				'story-publish',
				'story-present',
				'disabled-present',
				'story-present-dashboard',
				'story-present-dashboard-vertical',
				'story-publish-restricted',
				'story-publish-dashboard',
				'dashboard-publish-restricted',
				'present-dashboard',
				'story-publish-dashboard-vertical'
			],
			onboardingModal: false
		};
	},
	computed: {
		...mapGetters('authLogin', ['gravatarHash']),
		showMenu() {
			return this.$route.name && !this.menuHiddenPathNames.some((pathName) => pathName === this.$route.name);
		},
		oneIntegration() {
			return this.appConfig?.oneIntegration;
		},
		isMobile() {
			return screen.width < 576;
		},
		subscription() {
			return this.$store.getters['authLogin/user']?.subscription?.subscriptionPlan?.name ?? null;
		},
		documentationLink() {
			if (!this.oneIntegration) {
				return 'https://support.ataccama.com/home/docs/datastories';
			}
			return 'https://support.ataccama.com/home/docs/aip/latest/user-guides/data-stories-user-guide';
		}
	}
};
</script>

<style lang="scss" scoped>
li {
	list-style: none;
}
.custom-nav {
	width: 56px;
	max-width: 56px;
	z-index: 1022;
	background: linear-gradient(0deg, rgba(0, 0, 0, 0.36), rgba(0, 0, 0, 0.36)), linear-gradient(179.93deg, rgb(88, 63, 153) 0%, rgb(214, 0, 109) 100%)
}

.nav-item {
	width: 56px;
}

.help-btn {
	border-top: 1px solid #FFFFFF4B;
}

.btn-home {
	height: 80px;
	text-decoration: none;
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

.dropdown-menu {
	left: 5px
}

.dd-item:hover, .dd-item:focus {
	cursor: pointer;
	text-decoration: none;
	background-color: map-get($ds-colors, 'separate-content-0');
}

.dd-item.active, .dd-item:active {
	background-color: map-get($ds-colors, 'separate-content-0');
}

a {
	text-decoration: none;
}

.icon-logo {
	line-height: 0;
	width: 20px;
}
</style>

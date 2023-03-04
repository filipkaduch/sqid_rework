<template>
	<ds-box
		v-if="showMenu && (publisherMenu || editorMenu)"
		flex-type="row"
		padding-y="S"
		padding-right="M"
		class="pl-0 justify-content-end ds-bg-white"
		style="z-index: 900"
		:variant="navbarVariant">
		<template v-if="publisherMenu || editorMenu">
			<ds-box class="ml-4 mt-1 w-100 d-flex justify-content-between">
				<h5
					ref="storyNameRef"
					style="font-size: 24px;"
					data-testid="storyName"
					:class="publisherMenu ? 'story-name' : ''"
					class="p-1 m-0 align-items-center d-flex"
					:contenteditable="!publisherMenu"
					@blur="saveStoryName"
					@keydown.enter.prevent>
					{{ storyName }}
				</h5>
			</ds-box>
		</template>
		<ds-inline v-if="!publisherMenu" :class="{'ml-auto': !editorMenu}" no-wrap align-y="center">
			<ds-inline no-wrap align-y="center">
				<router-link class="text-decoration-none d-flex align-items-center" style="outline: none !important;" :to="routeTo()" target="_blank">
					<ds-btn
						variant="secondary"
						class="openPreviewBtn">
						<template #icon>
							<ds-icon name="ds-icon-eye-preview" />
						</template>
						<ds-text>{{ $t('t_preview') }}</ds-text>
					</ds-btn>
				</router-link>
				<ds-box v-if="companyShare" padding-left="M" align-y="center">
					<ds-btn variant="secondary" @click="syncToCatalog">
						{{ $t('t_syncToDataCatalog') }}
						<template #icon>
							<ds-icon name="ds-icon-synchronization" />
						</template>
					</ds-btn>
				</ds-box>
			</ds-inline>
			<button
				v-if="editorMenu"
				data-testid="storyShareBtn"
				class="btn btn-action mx-3 py-2 px-4"
				@click="showSharingModal = true">
				{{ $t('t_export') }}
			</button>
		</ds-inline>
		<app-sharing-modal :showModal="showSharingModal" @close-modal="showSharingModal = false" @change-company-share="isShared" />
	</ds-box>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import DOMPurify from 'dompurify';
import {storyType} from '@/modules/story/consts/storyType';
import {shareService} from '@/modules/sharing/shareService';
import {sharingOptions} from '@/util/queryBuilder';
import AppSharingModal from '@/modules/story/components/editor/AppSharingModal.vue';

export default {
	name: 'AppEditorNavbar',
	components: {
		AppSharingModal
	},
	inject: ['appConfig'],
	data() {
		return {
			menuItems: [
				{
					title: 't_Datasets',
					pathName: 'dataset-list',
					icon: 'database'
				},
				{
					title: 't_Stories',
					pathName: 'story-list',
					icon: [
						'far',
						'file-chart-pie'
					]
				},
				{
					title: 't_Dbconsole',
					pathName: 'dbConsole',
					icon: 'terminal'
				}
			],
			menuItems2: [
				{
					title: 't_Datasets',
					pathName: 'dataset-list',
					icon: 'database'
				},
				{
					title: 't_Stories',
					pathName: 'story-list',
					icon: [
						'far',
						'file-chart-pie'
					]
				}
			],
			menuHiddenPathNames: [
				'login',
				'register',
				'error',
				'confirm-registration',
				'password-reset',
				'confirm-password-reset',
				'terms-and-conditions'
			],
			editorMenuPathNames: [
				'story-editor',
				'dashboard-editor'
			],
			publisherMenuPathNames: [
				'story-publish',
				'story-publish-dashboard',
				'story-publish-dashboard-vertical',
				'story-publish-restricted',
				'story-publish-section'
			],
			timeout: null,
			adding: false,
			deleting: false,
			paginatorSelectedPage: 1,
			paginatorPageCount: 1,
			paginatorInitialized: false,
			companyShare: false,
			showSharingModal: false
		};
	},
	computed: {
		...mapGetters('widgetInstances', ['pageCount']),
		selectedPage() {
			const selectedPage = this.$store.getters['widgetInstances/selectedPage'];
			return selectedPage === null ? null : selectedPage + 1;
		},
		showMenu() {
			return this.$route.name && !this.menuHiddenPathNames.some((pathName) => pathName === this.$route.name);
		},
		editorMenu() {
			return this.$route.name && this.editorMenuPathNames.some((pathName) => pathName === this.$route.name);
		},
		publisherMenu() {
			return this.$route.name && this.publisherMenuPathNames.some((pathName) => pathName === this.$route.name);
		},
		navbarVariant() {
			return this.editorMenu || this.publisherMenu
				? 'ts-menu-white'
				: 'ts-menu-base';
		},
		storyId() {
			return this.$store.getters['storyDetail/story']?.id;
		},
		storyName() {
			return this.$store.getters['storyDetail/story']?.name ?? '';
		},
		storyType() {
			return this.$store.getters['storyDetail/story']?.storyType ?? null;
		},
		storyDimensions() {
			return this.$store.getters['storyDetail/story']?.layoutConfiguration?.dimensions ?? null;
		},
		subscription() {
			return this.$store.getters['authLogin/user']?.subscription?.isActive ?? null;
		}
	},
	watch: {
		storyId(val) {
			this.checkSharing(val);
		}
	},
	methods: {
		...mapActions('widgetInstances', [
			'selectPage',
			'removePageInstanceByIndex'
		]),
		isShared(companyShareCount) {
			this.companyShare = companyShareCount > 0;
		},
		addPage() {
			this.adding = true;
			this.$store.dispatch('widgetInstances/addPage', this.selectedPage)
				.then(() => {
					this.adding = false;
				});
		},
		saveStoryName(evt) {
			const newName = (evt.target.innerText || '').trim();
			if (!newName) {
				return;
			}
			if (this.storyName !== newName) {
				this.$refs.storyNameRef.innerHTML = DOMPurify.sanitize(this.$refs.storyNameRef.innerHTML, {ALLOWED_TAGS: []});
				this.$store.dispatch('storyDetail/updateStory', {name: newName});
			}
		},
		routeTo() {
			if (this.editorMenu) {
				if (this.storyType === storyType.VISUAL_DATA_STORY) {
					return `/story/${this.storyId}/present`;
				} else if (this.storyType !== storyType.VISUAL_DATA_STORY && this.storyDimensions?.width > this.storyDimensions?.height) {
					return `/story/${this.storyId}/present-dashboard`;
				}
				return `/story/${this.storyId}/present-dashboard-vertical`;
			}
			return '/dashboard';
		},
		async syncToCatalog() {
			await shareService.syncToDataCatalog(this.storyId);
		},
		async checkSharing(storyId) {
			if (this.appConfig?.oneIntegration && storyId) {
				const {data} = await shareService.getStorySharingRecords(storyId, sharingOptions.GEN2_PERSONS_GROUPS);
				if (data?.length) {
					this.companyShare = true;
				}
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.openPreviewBtn:focus {
	outline: none !important;
	box-shadow: none !important;
}

.navbar .navbar-brand img {
	width: 4rem;
}

.buttonUndo:hover {
	border-radius: 50%;
	background: #E1E7EA;
}

.paginatorPlus:hover,
.paginatorTrash:hover {
	background: transparent;
}

.paginatorTrash {
	border-radius: 0 4px 4px 0;
}

.paginatorPlus {
	border-radius: 4px 0 0 4px;
}

.paginatorBar {
	border-left: 2px solid #D0D9DE;
	border-right: 2px solid #D0D9DE;
}

.navbar.bg-ts-menu-base {
	background: $navbar-background;
	background: linear-gradient(to right, $navbar-logo-background 0, $navbar-logo-background 6rem, $navbar-background 6rem);
	filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=$navbar-logo-background, endColorstr=$navbar-background, GradientType=1);
}

.navbar.bg-ts-menu-white {
	background: white;
}

.navbar.bg-ts-menu-base {
	background: $navbar-background;
}

.navbar-nav {
	flex-direction: row;
}

.story-name {
	color: #2C2E3E;
	left: -11rem;
}

.editor-menu-right {
	max-width: 12rem;
}

.mobile {
	display: block;
	float: right;
	text-align: right;
}

.modal-dialog {
	position: fixed;
	left: 0;
	bottom: 0;
}
</style>

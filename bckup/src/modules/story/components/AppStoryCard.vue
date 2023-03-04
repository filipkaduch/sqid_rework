<template>
	<ds-box
		border-radius="basic"
		class="card-container"
		@mouseenter="hover = true"
		@mouseleave="hover = false">
		<ds-box
			class="story-card card-shadow"
			border="disabled"
			flex-type="column"
			border-radius="basic">
			<ds-box
				flex-type="column"
				class="cursor-pointer story-thumbnail-container ds-bg-secondary-0"
				border-bottom="disabled"
				:style="thumbnailStyle"
				@click="$router.push(routeToEditor)">
				<ds-box padding="M">
					<ds-inline align-y="center" align="space-between">
						<ds-icon
							v-if="isVisualStory" name="ds-icon-story-type" fill="display-content-400" :opacity="0.5"
							class="card-icon" />
						<ds-icon
							v-else-if="isExploration" name="ds-icon-exploration" fill="display-content-400" :opacity="0.5"
							class="card-icon" />
						<ds-icon
							v-else name="ds-icon-dashboard" fill="display-content-400" :opacity="0.5"
							class="card-icon" />
						<ds-inline-item :width="36" no-shrink>
							<data-stories-sharing-avatar
								v-if="story.ownedBy.id !== user.id && story.ownedBy.lastName"
								:first-name="story.ownedBy.firstName"
								:last-name="story.ownedBy.lastName" />
						</ds-inline-item>
					</ds-inline>
					<ds-icon v-if="thumbnailLoading" class="spinner" fill="white" name="ds-icon-loader-big" />
				</ds-box>
			</ds-box>
			<ds-box padding="M" class="border-bottom-radius">
				<ds-box padding-bottom="S">
					<ds-inline no-wrap align-y="center" gap="M">
						<ds-inline-item flex-grow="0">
							<ds-box padding-right="M">
								<ds-text variant="headline2" color="display-content-700" class="two-row-text">
									{{ story.name }}
								</ds-text>
							</ds-box>
						</ds-inline-item>
						<div class="cursor-pointer" @click="markAsFavorite">
							<ds-icon name="ds-icon-star" :fill="story.isFavorite ? 'warning-300' : 'display-content-200'" />
						</div>
						<ds-dropdown placement="bottom-start">
							<template #triggerContent>
								<ds-box flex-type="row" align-y="center" no-grow>
									<ds-btn variant="ghost" icon-only small padding-x="NONE">
										<template #icon>
											<ds-icon name="ds-icon-three-dots-vertical" fill="display-content-300" />
										</template>
									</ds-btn>
								</ds-box>
							</template>
							<template #dropdownContent>
								<dropdown-menu-basic :items="actionMenu" @update:selected="executeAction($event.value)" />
							</template>
						</ds-dropdown>
					</ds-inline>
				</ds-box>
				<ds-box padding-bottom="M">
					<ds-inline gap="M" class="position-relative">
						<transition name="fade">
							<ds-inline
								v-if="!hover"
								key="not-hovered"
								class="story-subtext"
								gap="S"
								no-wrap
								align-y="center">
								<ds-icon name="ds-icon-calendar" fill="display-content-300" />
								<ds-text variant="caption" color="display-content-500">
									{{ formatToRelativeDate(story.updatedAt) }}
								</ds-text>
							</ds-inline>
							<ds-inline
								v-else
								key="hovered"
								class="story-subtext"
								gap="M"
								no-wrap
								align-y="center">
								<ds-inline gap="S" align-y="center">
									<ds-icon name="ds-icon-views" fill="display-content-300" />
									<ds-text variant="caption">
										{{ $t('presenterLastPage.t_views', {count: story.storyStatistics.visitorsCount}) }}
									</ds-text>
								</ds-inline>
								<ds-inline gap="S" align-y="center">
									<ds-icon name="ds-icon-likes" fill="display-content-300" />
									<ds-text variant="caption">
										{{ $t('presenterLastPage.t_likes', {count: story.storyStatistics.clapsCount}) }}
									</ds-text>
								</ds-inline>
							</ds-inline>
						</transition>
					</ds-inline>
				</ds-box>
			</ds-box>
		</ds-box>
		<ds-modal
			:show="showDeleteModal"
			header-text="modals.deleteStoryTitle"
			confirmText="modals.delete"
			cancelText="modals.cancel"
			@ok="deleteStory"
			@cancel="showDeleteModal = false">
			<template #modal-text>
				<ds-text variant="body">
					{{ $t('modals.deleteStory?') }}
				</ds-text>
			</template>
		</ds-modal>
	</ds-box>
</template>

<script lang="ts">
import {storyServices} from '@/modules/story/storyServices';
import {storyType as storyTypes} from '@/modules/story/consts/storyType';
import DataStoriesSharingAvatar from '@/components/shared/DataStoriesSharingAvatar.vue';
import DropdownMenuBasic from '@/components/main/Dropdown/DropdownMenuBasic.vue';
import {computed, defineComponent, reactive, toRefs, onBeforeMount} from 'vue';
// eslint-disable-next-line no-unused-vars
import {TranslateResult} from 'vue-i18n';
import {i18n} from '@/plugins/all';
const {t} = i18n.global;
import {formatToRelativeDate} from '@/modules/dataset/utils/dataset';
import {EXPLORER_NAME} from '@/modules/explorer/router';
import {favoriteService} from '@/modules/story/favoriteService';
import {useNotification} from '@kyvg/vue3-notification';
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';
import {useSaasLimits} from '@/modules/limits/store/limits';
import {SelectItem} from '@/components/main/Dropdown/types';
import {LimitStatus} from '@/modules/limits/consts/enums';

const checkImage = async(url: string) => {
	const res = await fetch(url);
	return res.status === 200;
};

const actionMenuItems = [
	{
		label: t('t_preview'),
		value: 'preview-story',
		icon: 'ds-icon-eye-preview'
	},
	{
		label: t('t_Duplicate'),
		value: 'duplicate-story',
		icon: 'ds-icon-duplicate'
	},
	{
		label: t('t_Remove'),
		value: 'remove-story',
		icon: 'icon-trash'
	}
];

export default defineComponent({
	name: 'AppStoryCard',
	components: {
		DataStoriesSharingAvatar,
		DropdownMenuBasic
	},
	props: {
		story: {
			type: Object,
			required: true
		}
	},
	emits: ['storyRemove', 'storyDuplicate'],
	// eslint-disable-next-line max-lines-per-function
	setup(props, {emit}) {
		const store = useStore();
		const router = useRouter();
		const notification = useNotification();
		const state = reactive({
			hover: false,
			cloning: false,
			numberOfViews: 0,
			numberOfLikes: 0,
			showDeleteModal: false,
			thumbnail: null,
			thumbnailLoading: false
		});

		const user = computed(() => store.getters['authLogin/user']) as any;
		const saasLimitsState = useSaasLimits();

		const actionMenu = computed(() => {
			const actionMenuItemsLimited = actionMenuItems.map((item: SelectItem) => {
				if (saasLimitsState.limitStatusStories.value === LimitStatus.ERROR) {
					if (item.value === 'duplicate-story') {
						item.disabled = true;
					}
				} else {
					item.disabled = false;
				}
				return item;
			});

			if (props.story.storyType === storyTypes.DATA_EXPLORE) {
				// remove 'Preview' from menu
				return actionMenuItemsLimited.slice(1);
			}
			// If story shared, remove delete
			if (props.story.userSharingRecord) {
				return actionMenuItemsLimited.filter((item) => item.value !== 'remove-story');
			}

			return actionMenuItemsLimited;
		});

		const isVisualStory = computed(() => storyTypes.VISUAL_DATA_STORY === props.story.storyType);
		const isExploration = computed(() => storyTypes.DATA_EXPLORE === props.story.storyType);
		const routeToEditor = computed(() => {
			// If story is shared with us, return presenter route
			if (props.story.createdById !== user.value.id) {
				return getRestrictedPresenterRoute();
			}

			if (props.story.storyType === storyTypes.VISUAL_DATA_STORY) {
				return {
					name: 'story-editor',
					params: {id: props.story.id}
				};
			}
			if (props.story.storyType === storyTypes.DATA_DASHBOARD) {
				return {
					name: 'dashboard-editor',
					params: {id: props.story.id}
				};
			}
			if (props.story.storyType === storyTypes.DATA_EXPLORE) {
				return {
					name: EXPLORER_NAME,
					params: {id: props.story.id}
				};
			}
			return {
				name: 'dashboard-editor',
				params: {id: props.story.id}
			};
		});

		const getRestrictedPresenterRoute = () => {
			const {publicToken} = props.story.userSharingRecord;
			if (props.story.storyType === storyTypes.VISUAL_DATA_STORY) {
				return {
					name: 'story-publish-restricted',
					params: {token: publicToken}
				};
			}

			if (props.story.storyType === storyTypes.DATA_DASHBOARD) {
				const {dimensions} = props.story.layoutConfiguration;
				if (dimensions.height > dimensions.width) {
					return {
						name: 'dashboard-vertical-publish-restricted',
						params: {token: publicToken}
					};
				}

				return {
					name: 'dashboard-publish-restricted',
					params: {token: publicToken}
				};
			}
			return {
				name: null
			};
		};

		const routeToPresenter = computed(() => {
			// If story is shared with us, return restricted presenter route
			if (props.story.userSharingRecord) {
				return getRestrictedPresenterRoute();
			}

			if (props.story.storyType === storyTypes.VISUAL_DATA_STORY) {
				return {
					name: 'story-present',
					params: {token: props.story.id}
				};
			}

			if (props.story.storyType === storyTypes.DATA_DASHBOARD) {
				const {dimensions} = props.story.layoutConfiguration;
				if (dimensions.height > dimensions.width) {
					return {
						name: 'story-present-dashboard-vertical',
						params: {token: props.story.id}
					};
				}

				return {
					name: 'story-present-dashboard',
					params: {token: props.story.id}
				};
			}
			return {
				name: null
			};
		});

		const pushToastNotification = (type: string, message: TranslateResult, duration = 5000) => {
			// @ts-ignore
			notification.notify({
				type,
				text: message,
				duration
			});
		};

		const deleteStory = async() => {
			try {
				await storyServices.deleteStory(props.story.id);
				emit('storyRemove', props.story.id);
				pushToastNotification('success', t('t_successfullyDeletedStory'));
			} catch (err) {
				pushToastNotification('danger', t('t_deleteStoryError'));
			}
			state.showDeleteModal = false;
		};

		const duplicateStory = async() => {
			try {
				state.cloning = true;
				// @ts-ignore
				const data = await storyServices.duplicateStory(props.story.id, {
					name: `${props.story.name} (${new Date().toISOString()
						.replace(/T/u, ' ')
						.replace(/\..+/u, '')})`
				});
				emit('storyDuplicate', data);
				pushToastNotification('success', t('t_successfullyClonedStory'));
			} catch (err) {
				pushToastNotification('danger', t('t_cloneStoryError'));
			}
			state.cloning = false;
		};

		const executeAction = (selected: any) => {
			switch (selected) {
				case 'preview-story':
					// @ts-ignore
					router.push(routeToPresenter.value);
					break;
				case 'duplicate-story':
					duplicateStory();
					break;
				case 'remove-story':
					state.showDeleteModal = true;
					break;
			}
		};

		onBeforeMount(async() => {
			state.thumbnailLoading = true;
			const res = await storyServices.getStoryThumbnails([props.story.id]);
			state.thumbnail = await checkImage(res?.mapping?.[props.story.id]) ? res?.mapping?.[props.story.id] : null;
			state.thumbnailLoading = false;
		});
		const thumbnailStyle = computed(() => (state.thumbnail
			? {
				'background-image': `url(${state.thumbnail})`,
				'background-position': 'center',
				'background-size': 'cover',
				'background-repeat': 'no-repeat',
				'background-color': 'white'
			}
			: {}));

		const markAsFavorite = async() => {
			// If favorite, delete it
			if (props.story.isFavorite) {
				favoriteService.unmarkAsFavorite({
					objectId: props.story.id,
					objectType: 'STORY'
				});
				store.commit('stories/setFavorite', {
					id: props.story.id,
					isFavorite: false
				});
			// If not, add
			} else {
				await favoriteService.markAsFavorite({
					objectId: props.story.id,
					objectType: 'STORY'
				});
				store.commit('stories/setFavorite', {
					id: props.story.id,
					isFavorite: true
				});
			}
		};

		return {
			user,
			...toRefs(state),
			formatToRelativeDate,
			isVisualStory,
			isExploration,
			routeToEditor,
			routeToPresenter,
			executeAction,
			deleteStory,
			thumbnailStyle,
			actionMenu,
			markAsFavorite
		};
	}
});
</script>

<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active {
	transition: all .4s ease;
}
.fade-enter-from {
	transform: rotateX(90deg);
	opacity: 0;
}
.fade-leave-to {
	transform: rotateX(-90deg);
	opacity: 0;
}
.story-card {
	transition: all .4s ease;
	.story-thumbnail-container {
		position: relative;
		transition: all .4s ease;
		opacity: 0.6;
		border-top-left-radius: 4px;
		border-top-right-radius: 4px;
		background-color: map-get($ds-colors, 'secondary-0');
		width: 100%;
		aspect-ratio: 2 / 1;
	}

	.story-subtext {
		position: absolute;
		left: 0
	}
}

.story-card:hover {
	.story-thumbnail-container {
		opacity: 1;
	}
}

.card-container {
	transition: all 0.4s ease;
	box-shadow: 0 0 0 rgba(0, 0, 0, 0.3);
}
.card-container:hover {
	box-shadow: 0 2px 16px 0 rgba(87,114,127, 0.24);
}

.two-row-text {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 1; /* number of lines to show */
	line-clamp: 1;
	-webkit-box-orient: vertical;
}

.card-icon {
	min-width: 24px;
	min-height: 24px;
}
.spinner {
	position: absolute;
	top: 50%;
	left: 50%;
	margin-left: -10px;
	margin-top: -10px;
	animation: spin 1s linear infinite;
}

@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}
</style>

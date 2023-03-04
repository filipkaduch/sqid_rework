<template>
	<div>
		<ds-box padding-x="M">
			<stories-filter />
		</ds-box>
		<app-loading :loading="!initialized || loading">
			<ds-box class="container-grid" :class="{'container-grid__large': largeGrid}" padding-top="XL" padding-x="M">
				<app-new-story-card v-if="storiesToShow.length === 0" :story-type="storyType" @create-story="createStory" />
				<app-story-card
					v-for="(story) in storiesToShow"
					:key="story.id"
					:story="story"
					@story-duplicate="prependStory"
					@story-remove="deleteStory" />
			</ds-box>
			<ds-box v-if="stories.length > 12 && !showAll" class="container-grid" padding-top="XL" padding-x="M">
				<ds-btn variant="secondary" @click="$router.push('/story')">{{ $t('t_ShowMore') }}</ds-btn>
			</ds-box>
		</app-loading>
	</div>
</template>

<script lang="ts">
import AppStoryCard from '@/modules/story/components/AppStoryCard.vue';
import AppNewStoryCard from '@/modules/story/components/AppNewStoryCard.vue';
import AppLoading from '@/components/design/AppLoading.vue';
import StoriesFilter from '@/modules/homepage/components/StoriesFilter.vue';
import {computed, defineComponent, inject, onMounted, reactive, toRefs} from 'vue';
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';
import {storyFilterType} from '@/modules/story/consts/storyType';

export default defineComponent({
	name: 'HomepageStoryList',
	components: {
		AppLoading,
		AppNewStoryCard,
		AppStoryCard,
		StoriesFilter
	},
	props: {
		largeGrid: {
			type: Boolean,
			default: false
		},
		showAll: {
			type: Boolean,
			default: false
		}
	},
	emits: ['refreshStatistics'],
	// eslint-disable-next-line max-lines-per-function
	setup(props, {emit}: any) {
		const store = useStore();
		const router = useRouter();
		const state = reactive({
			storyType: null,
			initialized: false
		});

		const appConfig = inject('appConfig');
		// @ts-ignore
		const oneIntegration = appConfig?.oneIntegration;

		const loading = computed(() => store.getters['stories/loading']);
		const storiesToShow = computed(() => {
			const stories = store.getters['stories/stories'];
			if (!props.showAll) {
				return stories.slice(0, 12);
			}
			return stories;
		});
		const stories = computed(() => store.getters['stories/stories']);

		onMounted(() => {
			state.initialized = true;
			store.dispatch('stories/loadNextPage', {
				reset: true,
				storyFilter: oneIntegration ? storyFilterType.OWNED_OR_SHARED_GEN2 : storyFilterType.ONLY_OWNED
			});
		});

		const prependStory = (story: any) => {
			store.dispatch('stories/prependStory', story);
			emit('refreshStatistics');
		};

		const createStory = () => {
			router.push('create-story');
		};

		const deleteStory = (id: any) => {
			store.dispatch('stories/deleteStory', id);
			emit('refreshStatistics');
		};

		return {
			...toRefs(state),
			loading,
			storiesToShow,
			prependStory,
			createStory,
			deleteStory,
			stories
		};
	}
});
</script>

<style lang="scss" scoped>
.container-grid {
	grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
	gap: 32px;
	display: grid;

	&__large {
		grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
	}
}
</style>

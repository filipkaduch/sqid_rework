<!-- eslint-disable max-lines -->
// TODO use body only to report scroll event and sync it with position
<template>
	<div>
		<app-title v-if="story" :title="story.name" />
		<preview-banner :is-dashboard="true" />
		<ds-box
			padding-top="S"
			padding-right="S" flex-type="row" align-y="center" align="right"
			class="w-100">
			<ds-btn
				variant="ghost"
				:disabled="(story?.configuration?.globalFilters?.length ?? 0) === 0"
				@click="filterSidebarActive = true">
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
		<app-loading :loading="!initialized || !metadataInitialized || storyLoading" class="window-size">
			<div class="w-100 h-100">
				<div class="h-100">
					<app-dashboard-page
						v-for="pageWidgetInstanceId in pageWidgetInstanceIds"
						:key="'story-page-' + pageWidgetInstanceId"
						:page-widget-instance-id="pageWidgetInstanceId"
						:read-only="true" />
				</div>
			</div>
			<presenter-global-filters :dashboard="true" :open="filterSidebarActive" :story="story" @close-filters="filterSidebarActive = false" />
		</app-loading>
	</div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex';
import AppLoading from '@/components/design/AppLoading.vue';
import AppDashboardPage from '@/modules/story/components/editor/AppDashboardPage.vue';
import {
	publicRouteNameDashboard,
	restrictedDashboard,
	restrictedDashboardVertical
} from '@/modules/story/components/presenter/consts';
import PreviewBanner from '@/modules/story/components/presenter/components/microcomponents/PreviewBanner.vue';
import PresenterGlobalFilters from '@/modules/story/components/presenter/components/PresenterGlobalFilters.vue';
import cloneDeep from 'lodash/cloneDeep';

export default {
	name: 'DashboardPresenter',
	components: {
		PreviewBanner,
		PresenterGlobalFilters,
		AppDashboardPage,
		AppLoading
	},
	props: {
		token: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			initialized: false,
			clapAdded: false,
			filterSidebarActive: false,
			collapse: false,
			collapseFilters: false,
			showBanner: false,
			initialFilters: null
		};
	},
	computed: {
		...mapGetters('storyDetail', {
			story: 'story',
			storyLoading: 'loading',
			storyError: 'error',
			scale: 'scale'
		}),
		...mapGetters('widgetInstances', ['pageWidgetInstanceIds']),
		...mapGetters('widgetMetadata', {metadataInitialized: 'initialized'}),
		storyType() {
			return this.story?.storyType ?? null;
		},
		isVisualStory() {
			return this.storyType === 'visual-data-story';
		},
		globalFilters() {
			return this.story?.configuration?.globalFilters ?? [];
		},
		globalFilterMap() {
			return this.$store.getters['storyDetail/story'].configuration.globalFilterMap ?? [];
		},
		preparedFilters() {
			const prepareFilters = [];
			this.globalFilters.forEach((element) => {
				const tempFilter = [];
				Object.values(element.columnReference).forEach((col) => {
					col.forEach((val) => {
						tempFilter.push(val);
					});
				});

				prepareFilters.push(tempFilter);
			});

			return prepareFilters;
		}
	},
	watch: {
		storyError(error) {
			if (error) {
				this.addMessage({
					variant: 'danger',
					text: error
				});
			}
		}
	},
	async mounted() {
		// set story to be read only in public view
		if ([publicRouteNameDashboard, restrictedDashboard, restrictedDashboardVertical].includes(this.$route.name)) {
			this.widgetInstanceSetReadOnly();
			this.setStoryReadOnly();
		}
		this.setReadOnly();
		await this.loadStory(this.token);
		this.initialFilters = cloneDeep(this.globalFilters);
		this.initialized = true;
	},
	methods: {
		...mapMutations('storyDetail', ['setReadOnly']),
		...mapActions('storyDetail', [
			'setStoryReadOnly',
			'loadStory',
			'setScale',
			'addClap'
		]),
		...mapActions('widgetInstances', {widgetInstanceSetReadOnly: 'setReadOnly'}),
		...mapActions('flashMessages', ['addMessage'])
	}
};
</script>

<style lang='scss' scoped>
@import "../../../../../node_modules/bootstrap/scss/mixins/breakpoints";

.window-size {
	height: 100vh;
	width: 100vw;
	padding: 5% 15%;
}

.inner-div {
	margin: 5%;
}
</style>

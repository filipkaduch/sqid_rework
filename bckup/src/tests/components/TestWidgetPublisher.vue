<template>
	<div class="testing-widget-size">
		<widget-wrapper
			data-test-id="test-widget"
			variant="published-widget"
			:widget-instance-id="token" />
	</div>
</template>

<script>

import {mapActions, mapGetters, mapMutations} from 'vuex';
import WidgetWrapper from '@/modules/story/components/editor/WidgetWrapper.vue';
import {STORY_DETAIL_ACTIONS, STORY_DETAIL_MUTATIONS, STORY_DETAIL_NAME} from '@/modules/story/store/types';

export default {
	name: 'TestWidgetPublisher',
	components: {
		WidgetWrapper
	},
	props: {
		token: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			initialized: false
		};
	},
	computed: {
		...mapGetters('storyDetail', {
			storyLoading: 'loading'
		}),
		...mapGetters('widgetMetadata', {metadataInitialized: 'initialized'}),
		theme() {
			const theme = this.story?.layoutConfiguration.theme ?? {};
			if (!theme.colors) {
				theme.colors = {
					background: '#FFFFFF'
				};
			} else if (!theme.colors.background) {
				theme.colors.background = '#FFFFFF';
			}

			return theme;
		},
		cardStyle() {
			return {
				'background-color': this.theme.colors.background
			};
		}
	},
	async mounted() {
		await this.loadMetadata(true);
		await this.widgetInstanceSetReadOnly();
		await this[STORY_DETAIL_ACTIONS.SET_STORY_READ_ONLY]();
		this[STORY_DETAIL_MUTATIONS.SET_READONLY]();
		await this[STORY_DETAIL_ACTIONS.LOAD_STORY](this.token);
		this.initialized = true;
	},
	methods: {
		...mapActions('widgetInstances', {widgetInstanceSetReadOnly: 'setReadOnly'}),
		...mapActions(STORY_DETAIL_NAME, [
			STORY_DETAIL_ACTIONS.SET_STORY_READ_ONLY,
			STORY_DETAIL_ACTIONS.LOAD_STORY
		]),
		...mapActions('widgetMetadata', ['loadMetadata']),
		...mapMutations(STORY_DETAIL_NAME, [STORY_DETAIL_MUTATIONS.SET_READONLY])
	}
};
</script>
<style scoped>
.testing-widget-size {
	width: 700px;
	height: 700px;
	position: relative;
	margin-left: 100px;
}
</style>


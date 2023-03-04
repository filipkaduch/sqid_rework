<template>
	<app-loading :loading="!initialized || !metadataInitialized || storyLoading" class="py-0 h-100 w-100 position-absolute" :style="cardStyle">
		<widget-wrapper
			variant="published-widget"
			:widget-instance-id="widgetId" />
	</app-loading>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import AppLoading from '@/components/design/AppLoading.vue';
import WidgetWrapper from '@/modules/story/components/editor/WidgetWrapper.vue';

export default {
	name: 'SectionPublisher',
	components: {
		WidgetWrapper,
		AppLoading
	},
	props: {
		storyId: {
			type: String,
			required: true
		},
		widgetId: {
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
			story: 'story',
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
	mounted() {
		this.setReadOnly();
		this.loadStory(this.storyId);
		this.initialized = true;
	},
	methods: {
		...mapActions('storyDetail', ['loadStory']),
		...mapActions('widgetInstances', ['setReadOnly'])
	}
};
</script>

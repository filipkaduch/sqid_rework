<template>
	<div class="h-100 d-flex flex-column align-items-center">
		<h4 v-if="showDisplayName" class="mx-auto mt-1 mb-0">
			<strong>{{ title }}</strong>
		</h4>
		<div v-if="url" class="w-100 h-100">
			<youtube
				class="w-100 h-100"
				:video-id="videoId"
				:player-vars="ytPlayerVariables"
				@ended="ended" />
		</div>
	</div>
</template>

<script>
import Youtube from '@/modules/widget/components/widgets/youtube/Youtube.vue';
import {widgetDefaultControls} from '@/util/consts/WidgetControls';
import {CATEGORY_GENERAL} from '@/modules/widget/components/widget-controls/consts/categories';
import {widgetOptionName} from '@/util/consts/widgetOptionsNames';
import widgetMixin from '@/mixins/widgetMixin';
import getYouTubeID from 'get-youtube-id';
import {echartsDefaultControls} from '@/modules/widget/echartsWidgetControls';

export default {
	name: 'YoutubeWidget',
	components: {
		Youtube
	},
	mixins: [widgetMixin],
	props: {
		widgetInstanceId: {
			type: String,
			default: null
		}
	},
	data() {
		return {
			ytPlayerVariables: {
				// No autoplay
				autoplay: 0,
				// Show controls
				controls: 1,
				// Dont show related videos at the end (was update, now it always show related vid at the end)
				rel: 0,
				// Hide some of youtube logos
				modestbranding: 1,
				// Disable fullscreen mode
				fs: 0
			}
		};
	},
	widgetTypes() {
		return ['widget_media_youtube'];
	},
	widgetTypeMetadata() {
		return {
			widgetGroup: {
				group: 'text',
				subGroup: 'text_paragraph'
			},
			initialize: {
				size: {
					width: 950,
					height: 430
				}
			},
			options: {
				displayName: widgetDefaultControls.displayName,
				...echartsDefaultControls(false),
				url: {
					type: 'widget_control_text_input',
					default: '',
					needReload: false,
					category: CATEGORY_GENERAL,
					props: {
						headingText: 'youtubeURL',
						name: 'text'
					}
				}
			}
		};
	},
	computed: {
		showDisplayName() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'displayName');
		},
		url() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, widgetOptionName.URL);
		},
		videoId() {
			return getYouTubeID(this.url);
		}
	},
	methods: {
		ended() {
			document.activeElement.blur();
		}
	}
};
</script>

<style scoped>
</style>

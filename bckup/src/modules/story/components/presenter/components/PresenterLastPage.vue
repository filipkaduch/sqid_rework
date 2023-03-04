<template>
	<div class="w-100 section-layout position-relative" :style="style">
		<div class="w-100 h-100 end-section d-flex flex-column align-items-center">
			<div class="title-section">
				{{ story.name }}
			</div>
			<div class="d-flex justify-content-center text-black info-div">
				<img width="20" height="20" src="@/assets/icon-eye.svg">
				<span class="mx-2">
					{{ $t('presenterLastPage.t_views', {count: story.storyStatistics.visitorsCount}) }}
				</span>
			</div>
			<div class="d-flex justify-content-center flex-row button-section">
				<div>
					<div
						class="d-flex justify-content-center align-items-center button-frame"
						:class="{'cursor-pointer': !clapAdded}"
						@click="addClapHandler"
						@touchend="addClapHandler">
						<img width="20" height="20" src="@/assets/icon-like.svg">
						<div class="d-flex justify-content-center align-items-center button-badget-frame">
							<span>
								{{ story.storyStatistics.clapsCount }}
							</span>
						</div>
					</div>
					<div class="button-text">
						{{ $t('presenterLastPage.t_like') }}
					</div>
				</div>
				<div>
					<div
						class="d-flex justify-content-center align-items-center button-frame"
						@click="copyUrl"
						@touchend="copyUrl">
						<img width="20" height="20" src="@/assets/icon-link.svg">
					</div>
					<div class="button-text">
						{{ $t('presenterLastPage.t_copyUrl') }}
					</div>
				</div>
				<div>
					<div
						class="d-flex flex-column justify-content-center align-items-center button-frame"
						@click="$emit('replayStory')"
						@touchend="$emit('replayStory')">
						<img width="20" height="20" src="@/assets/icon-replay.svg">
					</div>
					<div class="button-text">
						{{ $t('presenterLastPage.t_replay') }}
					</div>
				</div>
			</div>
			<div class="created-by-div">
				<div>
					<span><a href="https://ataccama.com/platform/data-stories" target="_blank">{{ $t('base.appName') }}</a></span>
				</div>
				<div class="mt-2">
					<span v-if="!oneIntegration">
						<a href="mailto:datastories@ataccama.com" target="_blank">{{ $t('presenterLastPage.t_contact_us') }}</a>
						{{ $t('presenterLastPage.t_for_pricing') }}
					</span>
					<span>
						{{ $t('presenterLastPage.t_join') }}
						<a href="https://community.ataccama.com/data-stories-5" target="_blank">{{ $t('presenterLastPage.t_community') }}</a>
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {mapActions} from 'vuex';
import {privateRouteName} from '@/modules/story/components/presenter/consts';
import {notify} from '@kyvg/vue3-notification';

export default {
	name: 'PresenterLastPage',
	inject: ['appConfig'],
	props: {
		story: {
			type: Object,
			required: true
		}
	},
	emits: ['replayStory'],
	data() {
		return {
			clapAdded: false
		};
	},
	computed: {
		storyType() {
			return this.story?.storyType ?? null;
		},
		oneIntegration() {
			return this.appConfig?.oneIntegration;
		},
		style() {
			return {
				top: this.storyType === 'published-widget' ? '0' : '0px',
				left: this.storyType === 'published-widget' ? '0' : '0px',
				width: this.storyType === 'published-widget' ? '100%' : '100%',
				height: this.storyType === 'published-widget' ? '100%' : '100%',
				zIndex: this.storyType === 'published-widget' ? '1' : '0'
			};
		},
		isVisualStory() {
			return this.storyType === 'visual-data-story';
		},
		dimensions() {
			if (this.isVisualStory) {
				return {
					width: 1200,
					height: 600
				};
			}
			const dimensions = this.story?.layoutConfiguration.dimensions ?? {};
			if (!dimensions.width) {
				dimensions.width = 1000;
			}
			if (!dimensions.height) {
				dimensions.height = 1000;
			}
			return dimensions;
		}
	},
	methods: {
		...mapActions('storyDetail', ['addClap']),
		addClapHandler() {
			if (!this.clapAdded && this.$route.name !== privateRouteName) {
				this.addClap();
				this.clapAdded = true;
			}
		},
		copyUrl() {
			if (this.$route.name !== privateRouteName) {
				navigator.clipboard.writeText(window.location.href);
				notify({
					type: 'success',
					title: this.$t('t_copiedToClipboard'),
					text: this.$t('t_storyLinkWasCopiedToClipboard'),
					duration: 5000
				});
			}
		}
	}
};
</script>
<style lang="scss" scoped>
.end-section {
	font-family: Roboto, sans-serif;
	size: 1.2rem !important;
	padding: 2.5% 9%;
	background-color: map-get($ds-colors, 'separate-content-0');
}

.title-section {
	font-family: Roboto, sans-serif;
	font-style: normal;
	font-weight: 600;
	font-size: 35px !important;
	line-height: 42px;
	color: map-get($ds-colors, 'display-content-700');
	margin-top: 30vh;
}

.created-by-div {
	font-family: Roboto, sans-serif;
	font-style: normal;
	font-weight: 400;
	font-size: 12px !important;
	line-height: 16px;
	color: map-get($ds-colors, 'display-content-500');
	text-align: center;
	margin-top: 30vh;
}

.info-div {
	font-family: Roboto, sans-serif;
	font-size: 14px !important;
	line-height: 20px;
	margin-top: 1.5vh;
	color: map-get($ds-colors, 'display-content-500');
}

.button-frame {
	background: #FFFFFF;
	border: 1px solid map-get($ds-colors, 'separate-content-200');
	box-sizing: border-box;
	border-radius: 40px;
	width: 64px;
	height: 64px;
	position: relative;
	margin: 0 1.5vh;
}

.button-badget-frame {
	position: absolute;
	top: 0;
	right: 0;
	background: #FFFFFF;
	border: 1px solid map-get($ds-colors, 'separate-content-200');
	color: map-get($ds-colors, 'secondary');
	box-sizing: border-box;
	font-size: 12px;
	border-radius: 50px;
	width: 24px;
	height: 24px;
}

.button-section{
	margin-top: 6vh;
}

.button-text {
	font-size: 12px;
	line-height: 16px;
	color: map-get($ds-colors, 'display-content-500');
	text-align: center;
	margin-top: 8px;
}

.button-frame:hover {
	background: map-get($ds-colors, 'separate-content-0');
	border-color: map-get($ds-colors, 'separate-content-400');
	cursor: pointer;
}

.button-icon {
	color: map-get($ds-colors, 'secondary');
}

.button-icon:disabled {
	color: map-get($ds-colors, 'separate-content-400');
}

.colapse-window {
	position: absolute;
	top: 40px;
	right: 40px
}
</style>

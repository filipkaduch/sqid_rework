<!-- eslint-disable max-lines -->
<template>
	<ds-row class="m-0 p-0 w-100">
		<app-title v-if="story" :title="`${story.name} - Recorder`" />
		<ds-col cols="9" class="m-0 p-0 d-flex align-items-center flex-column">
			<div class="container mw-100 px-5 bg-white sticky-top mb-4" style="height: 76px;">
				<app-loading :loading="storyLoading">
					<app-page-header>
						<template #heading>
							<h3>{{ story ? story.name : '' }}</h3>
							<div class="bread">
								<router-link style="color: #2D3039;" :to="{name: 'story-editor'}">{{ story ? story.name : '' }}</router-link>
								<fa-icon :icon="['fas', 'angle-right']" fixed-width />
								<span>
									Recorder
								</span>
								<span class="badge ml-1" variant="danger">Beta</span>
							</div>
						</template>
					</app-page-header>
				</app-loading>
			</div>
			<ds-card body-class="p-0" style="border-radius: 0.25rem 0.25rem 0 0;">
				<div ref="container" class="panel-container">
					<div class="overlay" />

					<div ref="panel" class="panel">
						<app-loading :loading="!initialized || !metadataInitialized || storyLoading">
							<div ref="storyEditorCanvas">
								<app-story-page
									v-for="pageWidgetInstanceId in pageWidgetInstanceIds"
									:key="'story-page-' + pageWidgetInstanceId"
									:page-widget-instance-id="pageWidgetInstanceId"
									:style="{height: `${sectionHeight}px`}"
									hide-pagination
									read-only />
							</div>
						</app-loading>
					</div>
				</div>
			</ds-card>

			<div class="progress">
				<div class="progress-bar" style="width: 1280px; height: 2px; border-radius: 0 0 0.25rem 0.25rem;" :value="progress" :max="steps" />
			</div>
		</ds-col>

		<ds-col cols="3" class="m-0 p-0 pt-5 bg-white shadow-sm" style="height: 100vh">
			<app-loading :loading="!initialized || !metadataInitialized || storyLoading" class="h-100">
				<div class="h-100">
					<div>
						<div class="pt-3 pl-3 pr-4 pb-3">
							<ds-row class="m-0 p-0">
								<ds-col cols="12" class="mx-0 mb-0 p-0">
									<categories-wrapper :collapsible="false" headingText="t_Playback">
										<div class="controls">
											<div class="form-group" label="Speed">
												<div class="btn-group" role="group">
													<button
														v-for="option in intervalOptions"
														:key="option.text"
														class="btn btn-primary px-3 py-2 mr-2 rounded"
														:class="{active: interval === option.value}"
														@click="interval = option.value">
														<span v-text="$t(option.text)" />
													</button>
												</div>
											</div>

											<div class="form-group" label="Controls">
												<button v-if="!playing" class="btn btn-primary" @click="play">
													<fa-icon icon="play" />
													Play
												</button>
												<button v-else class="btn btn-primary" @click="stop">
													<fa-icon icon="stop" />
													Stop
												</button>
												<button :disabled="recording" class="btn btn-primary" @click="record">
													<fa-icon icon="video" />
													Record
												</button>
												<button :disabled="!canDownload" class="btn btn-action" @click="download">
													<fa-icon icon="download" />
													Download
												</button>
											</div>

											<div class="form-group" label="Status">
												<button v-if="recording" class="btn btn-outline-danger">
													<fa-icon icon="circle" />
													Recording
												</button>
												<button v-else-if="error" class="btn btn-outline-dark">
													<fa-icon icon="exclamation-circle" />
													Problem
												</button>
												<button v-else-if="canDownload" class="btn btn-outline-success">
													<fa-icon icon="check-circle" />
													Finished
												</button>
												<button v-else class="btn btn-outline-primary">
													<fa-icon icon="circle" />
													Idle
												</button>
											</div>

											<p class="text-black-50 m-0 mb-1">
												Do not close this tab until recording is finished.
											</p>
										</div>
									</categories-wrapper>

									<categories-wrapper :collapsible="false" headingText="t_How to guide">
										<div class="controls">
											<p class="m-0 help-text">
												<span class="text-warning">This is a beta feature</span>
												<br>
												<span>This functionality only works in Chrome, Opera, <i title="version 79 or newer">Edge</i> and Firefox.</span>
												<br>
												<span>Minimal resolution is 2560x1440</span>
												<br>
												<br>
												When you click <b>"Record"</b> a popup will open, click on Tab option,
												and select Data Stories tab ending with text "- Recorder" <i>(e.g. Data Stories - My cool story - Recorder)</i>.
												<br>
												When you stop sharing, you must reload the page to share again.
												It's also advised to keep your mouse out of the recording section (Chrome & Opera only).
											</p>

											<div class="mt-3 carousel slide" indicators>
												<div
													v-for="item in carouselItems"
													:key="item.text"
													class="carousel-item"
													:img-src="item.image">
													<h3 :class="item.captionClass || null">{{ item.text }}</h3>
												</div>
											</div>
										</div>
									</categories-wrapper>
								</ds-col>
							</ds-row>
						</div>
					</div>
				</div>
			</app-loading>
		</ds-col>
	</ds-row>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import AppLoading from '@/components/design/AppLoading.vue';
import AppPageHeader from '@/components/design/AppPageHeader.vue';
import AppStoryPage from '@/modules/story/components/editor/AppStoryPage.vue';
import CategoriesWrapper from '@/modules/widget/components/widget-controls/CategoriesWrapper';
import VideoRecorder from '@/util/videoRecorder';

export default {
	name: 'Recorder',
	components: {
		AppLoading,
		AppStoryPage,
		CategoriesWrapper,
		AppPageHeader
	},
	props: {
		storyId: {
			type: String,
			required: true
		}
	},
	data: () => ({
		recorderInitialized: false,
		playing: false,
		recording: false,
		initialized: false,
		error: null,
		interval: 4,
		currentPage: 0,
		currentStep: 0,
		canDownload: false,
		progress: 0,
		steps: 0,
		timer: null,
		intervalOptions: [
			{
				text: 'Slow',
				value: 6
			},
			{
				text: 'Normal',
				value: 4
			},
			{
				text: 'Fast',
				value: 2
			}
		],
		carouselItems: [
			{
				// eslint-disable-next-line global-require
				image: import.meta.glob('../../../assets/recorder/chrome+opera.png'),
				text: 'Chrome, Opera & Edge',
				captionClass: 'text-white'
			},
			{
				// eslint-disable-next-line global-require
				image: import.meta.glob('../../../assets/recorder/firefox.png'),
				text: 'Firefox'
			}
		]
	}),
	computed: {
		...mapGetters('storyDetail', {
			story: 'story',
			storyLoading: 'loading',
			storyError: 'error',
			scale: 'scale'
		}),
		...mapGetters('widgetInstances', [
			'pageWidgetInstanceIds',
			'widgetInstanceIds',
			'selectedWidgetInstanceIds'
		]),
		...mapGetters('widgetMetadata', {metadataInitialized: 'initialized'}),
		dimensions() {
			const dimensions = this.story?.layoutConfiguration.dimensions ?? {};
			if (!dimensions.width) {
				dimensions.width = 1200;
			}
			if (!dimensions.height) {
				dimensions.height = 600;
			}
			return dimensions;
		},
		sectionHeight() {
			return this.dimensions?.height ?? 600;
		},
		allWidgets() {
			const temp = [];
			this.pageWidgetInstanceIds.forEach((pageId) => {
				this.widgetInstanceIds[pageId].forEach((widget) => {
					temp.push(widget);
				});
			});
			return temp;
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
		},
		metadataInitialized() {
			this.recomputeScale();
		},
		storyLoading() {
			this.recomputeScale();
		},
		dimensions() {
			this.recomputeScale();
		}
	},
	mounted() {
		this.recorder = VideoRecorder;
		this.loadStory(this.storyId);
		this.setReadOnly();
		this.initialized = true;
		this.$nextTick(() => {
			this.recomputeScale();
		});
	},
	methods: {
		...mapActions('storyDetail', [
			'loadStory',
			'setScale'
		]),
		...mapActions('flashMessages', ['addMessage']),
		...mapActions('widgetInstances', [
			'setReadOnly',
			'setWidgetInstanceState',
			'selectWidgetInstance'
		]),
		setWidgetPlayState({widgetInstanceId, state}) {
			this.$store.commit('widgetTimeline/setState', {
				id: widgetInstanceId,
				playState: state
			});
		},
		recomputeScale() {
			this.$nextTick(() => {
				const storyEditorWidth = this.$refs.storyEditorCanvas?.getBoundingClientRect().width ?? 1000;

				this.setScale(storyEditorWidth / this.dimensions.width);
			});
		},
		isTimelineChart(id) {
			return this.$store.getters['widgetTimeline/hasId'](id);
		},
		init() {
			return this.recorder.initialize(this.$refs.container, 'video/webm;codecs=vp8').then(() => {
				this.recorderInitialized = true;
			});
		},
		play() {
			return new Promise((resolve) => {
				this.steps = this.reset() - 1;
				this.pageWidgetInstanceIds.forEach((pageId) => {
					if ((this.$store.getters['widgetInstances/configuration'](pageId)?.options?.stacking ?? 'animated') !== 'animated') {
						this.steps -= this.widgetInstanceIds[pageId].length - 1;
					}
				});
				this.progress = 0;
				this.playing = true;

				const nextStep = () => {
					if (!this.playing) {
						return;
					}

					this.next().then((result) => {
						if (result === false) {
							this.stop();
							resolve();
						} else {
							this.timer = setTimeout(nextStep, this.interval * 1000);
						}

						this.progress += 1;
					});
				};

				this.timer = setTimeout(nextStep, this.interval * 1000);
			});
		},
		stop() {
			clearTimeout(this.timer);
			this.timer = null;
			this.playing = false;

			this.allWidgets.forEach((widget) => {
				if (this.isTimelineChart(widget)) {
					this.setWidgetPlayState({
						widgetInstanceId: widget,
						state: false
					});
				}
			});

			this.stopRecording();
		},
		stopRecording() {
			this.recorder.stop().then(() => {
				this.recording = false;
				this.canDownload = true;
			});
		},
		record() {
			this.init()
				.then(() => new Promise((resolve) => {
					setTimeout(resolve, 2000);
				}))
				.then(() => this.recorder.start())
				.then(() => {
					this.canDownload = false;
					this.recording = true;

					return this.play();
				})
				.then(() => {
					this.timer = setTimeout(() => this.stopRecording(), this.interval * 1000);
				})
				.catch((err) => {
					this.error = err;
				});
		},
		download() {
			if (this.canDownload) {
				this.recorder.download();
			}
		},
		reset() {
			let steps = 0;
			this.currentPage = 0;
			this.currentStep = 0;
			this.$refs.panel.scroll({top: 0});

			this.allWidgets.forEach((widget) => {
				steps += 1;
				if (this.isTimelineChart(widget)) {
					this.setWidgetPlayState({
						widgetInstanceId: widget,
						state: null
					});
				} else {
					this.setWidgetInstanceState({
						widgetInstanceId: widget,
						state: 0
					});
				}
			});

			return steps;
		},
		// eslint-disable-next-line max-lines-per-function
		next() {
			// eslint-disable-next-line max-lines-per-function,max-statements
			return new Promise((resolve) => {
				let pageId = this.pageWidgetInstanceIds[this.currentPage];
				let steps = this.widgetInstanceIds[pageId];
				let nextId = null;
				const stackedSection = (this.$store.getters['widgetInstances/configuration'](pageId)?.options?.stacking ?? 'animated') !== 'animated';

				if (this.currentStep >= steps.length - 1 || stackedSection) {
					if (!this.pageWidgetInstanceIds[this.currentPage + 1]) {
						resolve(false);
						return;
					}

					pageId = this.pageWidgetInstanceIds[this.currentPage + 1];
					this.currentPage += 1;
					this.currentStep = 0;

					steps = this.widgetInstanceIds[pageId];
					nextId = steps[this.currentStep];

					this.$refs.panel.scroll({
						top: 600 * this.currentPage,
						behavior: 'smooth'
					});
				} else {
					this.currentStep += 1;
					nextId = steps[this.currentStep];
				}

				if (!nextId) {
					resolve(false);
				}

				if (this.isTimelineChart(nextId)) {
					const unwatch = this.$store.watch((state, getters) => getters['widgetTimeline/playState'](nextId), (value) => {
						if (value === false) {
							unwatch();

							resolve(true);
						}
					});

					this.setWidgetPlayState({
						widgetInstanceId: nextId,
						state: true
					});
				} else {
					let state = 0;
					const tick = () => {
						this.setWidgetInstanceState({
							widgetInstanceId: nextId,
							state: state += 0.075
						});

						if (state >= 1) {
							resolve(true);
							return;
						}
						requestAnimationFrame(tick);
					};
					requestAnimationFrame(tick);
				}
			});
		}
	}
};
</script>

<style scoped lang="scss">
.panel-container {
	display: flex;
	flex-direction: column;
	overflow: auto;
	width: 1280px;
	height: 720px;
	position: relative;
}

.overlay {
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: 2;
}

.bread {
	display: inline-flex;
	position: absolute;
	top: 52px;
	left: 50px;
	font-size: 12px;
	color: #6B6E74;
}

.panel {
	width: 1200px;
	height: 600px;
	margin: auto;
	overflow: hidden;
}

.controls {
	color: #000;

	.form-group:last-child {
		margin-bottom: 0;
	}

	.btn:first-child {
		margin-left: 0;
	}

	.btn-primary:hover:not(:disabled):not(.disabled), .btn-primary:focus:not(:disabled):not(.disabled) {
		color: #4E75FD !important;
	}
	.btn-primary:hover:disabled, .btn-primary:focus:disabled,
	.btn-primary:hover.disabled, .btn-primary:focus.disabled,
	.btn-primary.disabled, .btn-primary:disabled {
		color: lighten(#4E75FD, 10) !important;
	}
	.btn-primary:not(:disabled):not(.disabled) {
		color: #4E75FD !important;
	}
	.btn-primary {
		background: #D9E7FC;
	}
	.btn-primary:hover:not(:disabled) {
		background: darken(#D9E7FC, 10);
	}
	.btn-primary:active:not(:disabled):not(.disabled), .btn-primary.active:not(:disabled):not(.disabled) {
		background: #4E75FD;
		color: #fff !important;
	}
	.btn-outline-success {
		color: #62C554;
		border-color: #62C554;
	}
	.btn-outline-success:hover {
		color: #fff;
		background: #62C554;
	}
	.btn-outline-dark {
		color: #000;
		border-color: #000;
	}
	.btn-outline-dark:hover {
		color: #fff;
		background: #000;
	}
}

.help-text {
	b {
		font-weight: bold;
	}
}
</style>

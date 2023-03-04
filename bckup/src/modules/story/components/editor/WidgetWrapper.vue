<template>
	<div :style="style">
		<div v-if="initialized && !loadingComponent && !widgetError" :style="widgetStyle" @click="selectWidget">
			<ds-component-wrapper v-bind="widgetProps" :component-name="componentName" />
		</div>
		<div
			v-if="haveTimeline && !timelinePlayed"
			:class="{
				'border border-danger': widgetError,
				'overlay': true}">
			<div
				style="background-color: rgba(255,255,255, 0.5);"
				class="d-flex align-items-center justify-content-center h-100">
				<div
					class="d-flex align-items-center justify-content-center play-button-container"
					@click="setPlayState">
					<ds-icon width="64" height="64" name="playTimeline" />
				</div>
			</div>
		</div>
		<div
			v-if="!initialized || loadingComponent || widgetLoading || widgetError || widgetWarning"
			:class="{
				'border': widgetError || widgetWarning,
				'border-danger text-danger': widgetError,
				'border-warning text-warning': widgetWarning,
				'bg-white-50': !noLoadingOverlay,
				'overlay': !noLoadingOverlay
			}">
			<app-loading
				v-if="!initialized || loadingComponent || widgetLoading"
				class="h-100"
				:loading="true"
				:no-overlay="noLoadingOverlay" />
			<div v-else class="d-flex align-items-center justify-content-center h-100">
				{{ $t(overlayText.text) }}
				<div v-if="widgetError && widgetError.errorCode">
					{{ overlayText.errorCode }}
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import AppLoading from '@/components/design/AppLoading.vue';
import {mapActions} from 'vuex';
import {storyType} from '@/modules/story/consts/storyType';
import sectionStackingVariants from '@/util/consts/sectionStackingVariants';
import {STORY_DETAIL_GETTERS, STORY_DETAIL_NAME} from '@/modules/story/store/types';

export default {
	components: {AppLoading},
	props: {
		widgetInstanceId: {
			type: String,
			required: true
		},
		variant: {
			type: String,
			default: 'data-dashboard'
		},
		stackingConfig: {
			type: Object,
			default: null
		},
		sizeParent: {
			type: Object,
			default: null
		},
		readOnly: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			timelinePlayed: false,
			sectionStackingVariants,
			initialized: false
		};
	},
	computed: {
		story() {
			return this.$store.getters[`${STORY_DETAIL_NAME}/${STORY_DETAIL_GETTERS.STORY}`];
		},
		isVisualStory() {
			return this.story?.storyType === storyType.VISUAL_DATA_STORY;
		},
		isSelectedWidget() {
			return this.$store.getters['widgetInstances/selectedWidgetInstanceId'] === this.widgetInstanceId;
		},
		storyDimensions() {
			return this.$store.getters[`${STORY_DETAIL_NAME}/${STORY_DETAIL_GETTERS.STORY}`]?.layoutConfiguration?.dimensions;
		},
		style() {
			// If we have portrait dashboard use old presenter.
			if (!this.isVisualStory && this.storyDimensions?.width > this.storyDimensions?.height) {
				const widgetRelativeSize = this.$store.getters['widgetInstances/size'](this.widgetInstanceId);
				return {
					top: `${this.relativePosition.y * 100}%`,
					left: `${this.relativePosition.x * 100}%`,
					width: `${widgetRelativeSize.width * 100}%`,
					height: `${widgetRelativeSize.height * 100}%`,
					transform: `rotate(${this.rotation}deg)`,
					position: 'absolute',
					zIndex: this.relativePosition.z
				};
			}
			return {
				top: this.variant === 'published-widget' ? '0' : `${this.position.y}px`,
				left: this.variant === 'published-widget' ? '0' : `${this.position.x}px`,
				width: this.variant === 'published-widget'
					? '100%'
					: this.scaledSizeWidth,
				height: this.variant === 'published-widget' ? '100%' : this.scaledSizeHeight,
				transform: this.variant === 'published-widget' ? '' : `rotate(${this.rotation}deg)`,
				zIndex: this.variant === 'published-widget' ? '1' : this.position.z,
				...(this.isVisualStory && this.isSelectedWidget && !this.readonly
					? {border: '1px solid #1E55EC', borderRadius: '5px', borderTopRightRadius: '0', borderTopLeftRadius: '0'}
					: {}),
				...(this.isVisualStory ? null : {position: 'absolute'})
			};
		},
		scaledSizeWidth() {
			if (this.stackingConfig === null) {
				return this.scale === 1 ? '100%' : `${this.size.width}px`;
			}
			return `${this.size.width}px`;
		},
		scaledSizeHeight() {
			if (this.stackingConfig === null) {
				return this.scale === 1 ? '100%' : `${this.size.height}px`;
			}
			return `${this.size.height}px`;
		},
		loadingComponent() {
			return this.$store.getters['dependencies/loading'](this.componentName);
		},
		widgetType() {
			return this.$store.getters['widgetInstances/widgetType'](this.widgetInstanceId);
		},
		widgetTypeMetadata() {
			return this.$store.getters['widgetMetadata/widgetTypeMetadata'](this.widgetType);
		},
		componentName() {
			return typeof this.widgetTypeMetadata === 'string' ? this.widgetTypeMetadata : this.widgetTypeMetadata?.component ?? '';
		},
		widgetProps() {
			return {
				...(this.widgetTypeMetadata?.props ?? {}),
				widgetInstanceId: this.widgetInstanceId,
				readOnly: this.readOnly
			};
		},
		relativePosition() {
			return this.$store.getters['widgetInstances/position'](this.widgetInstanceId);
		},
		position() {
			return {
				x: this.storyDimension.width * this.scale * this.relativePosition.x,
				y: this.storyDimension.height * this.scale * this.relativePosition.y,
				z: this.relativePosition.z
			};
		},
		size() {
			const widgetRelativeSize = this.$store.getters['widgetInstances/size'](this.widgetInstanceId);
			return {
				width: this.storyDimension.width * this.scale * widgetRelativeSize.width,
				height: this.storyDimension.height * this.scale * widgetRelativeSize.height
			};
		},
		rotation() {
			return this.$store.getters['widgetInstances/rotation'](this.widgetInstanceId);
		},
		widgetLoading() {
			return this.$store.getters['widgetInstances/loading'](this.widgetInstanceId);
		},
		widgetError() {
			return this.$store.getters['widgetInstances/error'](this.widgetInstanceId);
		},
		widgetWarning() {
			return this.$store.getters['widgetInstances/warning'](this.widgetInstanceId);
		},
		scale() {
			return this.$store.getters['storyDetail/scale'];
		},
		storyDimension() {
			const tmpDimensions = (this.variant === 'visual-data-story' || this.variant === 'published-widget')
				? {
					width: this.sizeParent === null ? 1200 : this.sizeParent.width,
					height: this.sizeParent === null ? 600 : this.sizeParent.height
				}
				: this.$store.getters['storyDetail/story'].layoutConfiguration.dimensions;
			return {
				width: tmpDimensions.width,
				height: tmpDimensions.height * this.$store.getters['widgetInstances/pageHeightRatio'](this.widgetInstanceId)
			};
		},
		widgetStyle() {
			return {
				height: `${100 / this.scale}%`,
				width: `${100 / this.scale}%`,
				transform: `scale(${this.scale})`,
				'transform-origin': 'top left'
			};
		},
		noLoadingOverlay() {
			return Boolean(this.widgetTypeMetadata?.renderOptions?.noLoadingOverlay) && !this.widgetError;
		},
		noDataMessage() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'noDataMessage') ?? 'No Data';
		},
		widgetConfiguration() {
			return this.$store.getters['widgetInstances/configuration'](this.widgetInstanceId);
		},
		overlayText() {
			const id = this.widgetConfiguration.data.datasetId ?? this.widgetConfiguration.data.catalogItemId;
			const widgetError = this.$store.getters['error/widgetError'](id);
			const errorMsg = widgetError ? 't_insufucientPermission' : 't_CantLoadData';
			return {
				text: this.widgetError === null
					? (typeof this.widgetWarning === 'string' ? this.widgetWarning : this.noDataMessage)
					: (typeof this.widgetError === 'string' ? this.widgetError : errorMsg),
				errorCode: this.widgetError?.response?.headers?.['x-correlation-id'] ? this.widgetError.response.headers['x-correlation-id'] : null
			};
		},
		haveTimeline() {
			return this.$store.getters['widgetInstances/configuration'](this.widgetInstanceId)?.data?.configuration?.timeline ?? false;
		}
	},
	watch: {
		componentName: {
			handler(value) {
				if (value && !this.initialized) {
					this.loadComponent(this.componentName);
					this.initialized = true;
				}
			},
			immediate: true
		}
	},
	methods: {
		...mapActions('widgetInstances', ['selectWidgetInstance']),
		...mapActions('dependencies', {loadComponent: 'loadDependency'}),
		selectWidget() {
			this.selectWidgetInstance(this.widgetInstanceId);
		},
		setPlayState() {
			this.$store.commit('widgetTimeline/setState', {
				id: this.widgetInstanceId,
				playState: true
			});
			this.timelinePlayed = true;
		}
	}
};
</script>

<style lang="scss" scoped>
:deep(.widget-padding.echarts) {
		padding: 16px 0;
	}
	.overlay {
		position: absolute;
		height: 100%;
		width: 100%;
		left: 0;
		top: 0;
	}

	.bg-white-50 {
		background-color: rgba(#ffffff, 0.5);
	}
.play-button-container {
	width: 104px;
	height: 104px;
	color: map-get($ds-colors, 'secondary-400');
	background: map-get($ds-colors, 'secondary-100');
	border-radius: 100px;
}

.play-button {
	position: absolute;
	left: 5%;
	right: 5%;
	top: 5%;
	bottom: 5%;
}
</style>

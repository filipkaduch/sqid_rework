<template>
	<vue-drag-resize
		parentLimitation
		:isActive="active"
		:x="position.x"
		:y="position.y"
		:z="position.z"
		:h="size.height"
		:w="size.width"
		:isDraggable="draggable && variant === 'data-dashboard'"
		:isResizable="variant === 'data-dashboard'"
		@activated="onActivated"
		@deactivated="onDeactivated"
		@dragging="updatePosition"
		@rotating="updateRotation"
		@resizing="onResize">
		<div tabindex="0" class="h-100 overflow-hidden" @keydown.delete="deleteSelectedWidget">
			<template v-if="active && variant === storyType.DATA_DASHBOARD">
				<fa-icon class="control-icon z-index z-index-plus" :icon="['fal', 'plus']" @click.prevent="updateZIndex(position.z + 1)" />
				<fa-icon class="control-icon z-index z-index-minus" :icon="['fal', 'minus']" @click.prevent="updateZIndex(position.z - 1)" />
				<ds-icon
					v-if="variant === 'data-dashboard'"
					class="control-icon delete"
					name="icon bin"
					alt="Delete section"
					@click.prevent="deleteWidget" />
				<fa-layers class="control-icon z-index edit-mode" @click.prevent="hideOverlay">
					<fa-icon :icon="['fal', 'hand-pointer']" />
					<fa-icon v-if="overlay" :icon="['fal', 'slash']" rotation="90" />
				</fa-layers>
			</template>
			<div v-if="initialized && !loadingComponent && !unsupportedWidget" :style="widgetStyle">
				<ds-component-wrapper v-bind="widgetProps" :component-name="componentName" />
			</div>
			<div v-if="unsupportedWidget" class="overlay">
				<div class="d-flex align-items-center justify-content-center h-100">
					<ds-text>{{ $t('unsupported') }}</ds-text>
				</div>
			</div>
			<div
				v-else-if="!initialized || loadingComponent || widgetLoading || widgetError || widgetWarning"
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
			<div class="overlay bg-transparent" :class="{'d-none': !overlay}" @dblclick.prevent="hideOverlay" />
		</div>
	</vue-drag-resize>
</template>

<script>
import AppLoading from '@/components/design/AppLoading.vue';
import {mapActions} from 'vuex';
import VueDragResize from 'vue-drag-resize';
import {storyType} from '@/modules/story/consts/storyType';

export default {
	components: {
		AppLoading,
		VueDragResize
	},
	inject: ['appConfig'],
	props: {
		widgetInstanceId: {
			type: String,
			required: true
		},
		pageWidgetInstanceId: {
			type: String,
			default: null
		},
		variant: {
			type: String,
			default: 'data-dashboard'
		}
	},
	emits: ['deleteSelectedWidget'],
	data() {
		return {
			initialized: false,
			active: false,
			overlay: true,
			draggable: true,
			storyType
		};
	},
	computed: {
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
			return this.widgetTypeMetadata?.component;
		},
		unsupportedWidget() {
			return this.componentName === 'Insight' && !this.appConfig?.widget?.showInsights;
		},
		widgetProps() {
			return {
				...(this.widgetTypeMetadata?.props ?? {}),
				...(this.widgetType === 'widget_explainer' ? {pageWidgetInstanceId: this.pageWidgetInstanceId} : {}),
				widgetInstanceId: this.widgetInstanceId,
				editEnabled: !this.overlay
			};
		},
		relativePosition() {
			return this.$store.getters['widgetInstances/position'](this.widgetInstanceId);
		},
		position() {
			// eslint-disable-next-line no-constant-condition
			return {
				x: this.storyDimension.width * this.scale * (Number.isNaN(this.relativePosition.x) ? 0 : this.relativePosition.x),
				y: this.storyDimension.height * this.scale * (Number.isNaN(this.relativePosition.y) ? 0 : this.relativePosition.y),
				z: this.relativePosition.z
			};
		},
		size() {
			const widgetRelativeSize = this.$store.getters['widgetInstances/size'](this.widgetInstanceId);
			return {
				width: this.storyDimension.width * this.scale * (Number.isNaN(widgetRelativeSize.width) ? 200 : widgetRelativeSize.width),
				height: this.storyDimension.height * this.scale * (Number.isNaN(widgetRelativeSize.height) ? 200 : widgetRelativeSize.height)
			};
		},
		rotation() {
			return this.variant === 'data-dashboard' ? this.$store.getters['widgetInstances/rotation'](this.widgetInstanceId) : 0;
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
		widgetConfiguration() {
			return this.$store.getters['widgetInstances/configuration'](this.widgetInstanceId);
		},
		scale() {
			return this.$store.getters['storyDetail/scale'];
		},
		storyDimension() {
			const tmpDimensions = this.variant === 'visual-data-story'
				? {
					width: 1200,
					height: 600
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
		}
	},
	mounted() {
		this.loadComponent(this.componentName);
		this.initialized = true;
	},
	methods: {
		...mapActions('widgetInstances', [
			'selectWidgetInstance',
			'setPosition',
			'setSize',
			'setRotation',
			'removeInstance'
		]),
		...mapActions('dependencies', {loadComponent: 'loadDependency'}),
		deleteSelectedWidget(event) {
			if (!event.srcElement.isContentEditable) {
				this.$emit('deleteSelectedWidget');
			}
		},
		updatePosition(rect) {
			this.setPosition({
				widgetInstanceId: this.widgetInstanceId,
				position: {
					x: rect.left / (this.storyDimension.width * this.scale),
					y: rect.top / (this.storyDimension.height * this.scale),
					z: this.relativePosition.z
				}
			});
		},
		updateZIndex(z) {
			this.setPosition({
				widgetInstanceId: this.widgetInstanceId,
				position: {
					x: this.relativePosition.x,
					y: this.relativePosition.y,
					z
				}
			});
		},
		updateSize(rect) {
			this.setSize({
				widgetInstanceId: this.widgetInstanceId,
				size: {
					width: rect.width / (this.storyDimension.width * this.scale),
					height: rect.height / (this.storyDimension.height * this.scale)
				}
			});
		},
		updateRotation(rotation) {
			this.setRotation({
				widgetInstanceId: this.widgetInstanceId,
				rotation
			});
		},
		deleteWidget() {
			this.selectWidgetInstance(null);
			this.removeInstance({widgetInstanceId: this.widgetInstanceId});
		},
		onResize(rect) {
			if (this.variant === 'data-dashboard') {
				this.updatePosition(rect);
				this.updateSize(rect);
			}
		},
		onActivated() {
			this.active = true;
			this.selectWidgetInstance(this.widgetInstanceId);
		},
		onDeactivated() {
			this.active = false;
			this.overlay = true;
			this.draggable = true;
		},
		hideOverlay() {
			this.overlay = false;

			if (this.widgetTypeMetadata?.renderOptions?.dragWithoutOverlay === false) {
				this.draggable = false;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
:deep(.handle-rot) {
		z-index: 1;
	}

	@media only screen and (max-width: 768px) {
		.handle-rot:before {
			content: '';
			top: 9px;
			left: 50%;
			right: unset;
			bottom: unset;
			position: absolute;
		}
	}
	.control-icon{
		position: absolute;
		cursor: pointer;
	}
	.z-index {
		left: -20px;
	}
	.z-index-plus {
		top: 0;
	}
	.z-index-minus {
		top: 20px;
	}
	.edit-mode {
		top: 40px;
	}
	.delete {
		right: -20px;
		top: 0;
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
</style>

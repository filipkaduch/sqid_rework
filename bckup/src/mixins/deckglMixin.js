import {inject} from 'vue';
import noop from 'lodash/noop';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

export default {
	props: {
		readOnly: Boolean
	},
	data: () => ({
		imports: {},
		map: null,
		initialPosition: {},
		position: {},
		widJustChanged: false,
		timeoutId: null
	}),
	computed: {
		data() {
			return this.$store.getters['widgetData/data'](this.widgetInstanceId);
		},
		parentId() {
			return this.preview ? null : this.$store.getters['widgetInstances/parentId'](this.widgetInstanceId);
		},
		mapOptions() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'mapOptions');
		},
		widgetConfiguration() {
			return this.$store.getters['widgetInstances/configuration'](this.widgetInstanceId);
		},
		isVisualStory() {
			return this.preview ? false : this.$store.getters['storyDetail/story']?.storyType === 'visual-data-story';
		},
		size() {
			return this.preview ? null : this.$store.getters['widgetInstances/size'](this.widgetInstanceId);
		},
		scale() {
			return this.preview ? null : this.$store.getters['storyDetail/scale'];
		},
		storyDimension() {
			return this.preview
				? null
				: (this.$store.getters['storyDetail/story'].storyType === 'visual-data-story'
					? {
						width: 1200,
						height: 600
					}
					: this.$store.getters['storyDetail/story'].layoutConfiguration.dimensions);
		},
		width() {
			return this.storyDimension.width * this.scale * this.size.width;
		},
		height() {
			return this.storyDimension.height * this.scale * this.size.height;
		},
		style() {
			return `mapbox://styles/mapbox/${this.$store.getters['storyDetail/story'].layoutConfiguration.theme.dark ? 'dark' : 'light'}-v10`;
		}
	},
	watch: {
		size(newSize, oldSize) {
			if (newSize.width !== oldSize.width || newSize.height !== oldSize.height) {
				this.resize();
			}
		},
		widgetInstanceId() {
			this.widJustChanged = true;
			this.position = null;
		},
		initialPosition(position, old) {
			if (!isEmpty(old) && position.center) {
				this.map.touchZoomRotate.disable();
				this.map.flyTo({...position});
			}
		},
		position(value) {
			const newPosition = {
				...(this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'mapOptions')),
				...value
			};
			this.$store.dispatch('widgetInstances/setOption', {
				widgetInstanceId: this.widgetInstanceId,
				optionName: 'mapOptions',
				value: newPosition
			});
			this.setZoomToDataConfiguration(value.zoom);
		}
	},
	mounted() {
		this.$watch((vm) => [
			vm.layer,
			vm.map,
			vm.data
		], () => {
			if (this.map && this.layer) {
				this.layer.setProps({data: this.data});
			}
		}, {
			immediate: true
		});
	},
	beforeUnmount() {
		if (this.map) {
			this.map.remove();
		}
	},
	methods: {
		createLayers: noop,
		updateDynamicFilter: noop,
		// eslint-disable-next-line max-lines-per-function
		chartInit(imports) {
			const appConfig = inject('appConfig');
			this.imports = imports;
			const {mapboxgl, polyfillContext} = imports;
			const positionOption = this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'mapOptions');
			if (isEmpty(positionOption) === false) {
				this.position = cloneDeep(positionOption);
			}
			const {center, zoom, pitch, bearing} = this.position ?? this.initialPosition;

			this.map = new mapboxgl.Map({
				container: this.$refs['deck-gl-container'].$refs.container,
				style: this.style,
				accessToken: appConfig.deckGl,
				antialias: true,
				center: center ?? [
					46,
					54
				],
				zoom: zoom ?? 0.3,
				pitch: pitch ?? 0,
				bearing: bearing ?? 0,
				interactive: !(this.readOnly && this.isVisualStory),
				preserveDrawingBuffer: true
			});

			polyfillContext(this.map.painter.context.gl);

			if (this.readOnly && this.isVisualStory) {
				this.map.dragPan.enable();
				this.map.dragRotate.enable();
				this.map.doubleClickZoom.enable();
			}

			const nav = new mapboxgl.NavigationControl();
			this.map.addControl(nav, 'top-right');

			this.map.on('moveend', ({originalEvent}) => {
				if (!originalEvent) {
					this.widJustChanged = false;
					this.map.touchZoomRotate.enable();
					return;
				}

				this.position = {
					center: this.map.getCenter(),
					zoom: this.map.getZoom(),
					pitch: this.map.getPitch(),
					bearing: this.map.getBearing()
				};

				this.updateDynamicFilter();
			});

			this.map.on('load', () => {
				this.createLayers();
			});

			// TODO Need find better solution
			this.map.on('idle', () => {
				this.map.resize();
				this.map.off('idle');
			});
		},
		resize() {
			if (this.timeoutId) {
				clearTimeout(this.timeoutId);

				this.timeoutId = null;
			}

			this.timeoutId = setTimeout(() => {
				this.timeoutId = null;
				this.map.resize();
			}, 150);
		},
		setZoomToDataConfiguration(zoom) {
			if (zoom) {
				const cloneConfiguration = cloneDeep(this.widgetConfiguration);
				cloneConfiguration.options.mapOptions.zoom = zoom;
				this.$store.dispatch('widgetInstances/setConfiguration', {
					widgetInstanceId: this.widgetInstanceId,
					configuration: cloneConfiguration
				});
			}
		}
	}
};

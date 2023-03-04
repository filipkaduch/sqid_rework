import {mapActions, mapGetters} from 'vuex';
import cloneDeep from 'lodash/cloneDeep';

const styleDependencies = [
	'WidgetControlThemePicker',
	'WidgetControlCombinedColorPicker'
];
import AppLoading from '@/components/design/AppLoading.vue';
import AppWidgetControlWrapper from '@/modules/story/components/editor/AppWidgetControlWrapper.vue';

export default {
	props: {},
	components: {
		AppLoading,
		AppWidgetControlWrapper
	},
	data() {
		return {
			initialized: false
		};
	},
	mounted() {
		styleDependencies.forEach((dependency) => {
			this.loadDependency(dependency);
		});

		this.initialized = true;
	},
	computed: {
		...mapGetters('widgetInstances', ['selectedWidgetInstanceId']),
		...mapGetters('storyDetail', ['story']),
		widgetType() {
			return this.$store.getters['widgetInstances/widgetType'](this.selectedWidgetInstanceId);
		},
		widgetTypeMetadata() {
			return this.$store.getters['widgetMetadata/widgetTypeMetadata'](this.widgetType);
		},
		controls() {
			return this.widgetTypeMetadata?.controls ?? [];
		},
		loadingStyleDependencies() {
			return !this.initialized || styleDependencies.some((dependency) => this.$store.getters['dependencies/loading'](dependency));
		},
		theme() {
			return this.story.layoutConfiguration.theme;
		}
	},
	methods: {
		...mapActions('dependencies', ['loadDependency']),
		...mapActions('storyDetail', ['updateStory']),
		...mapActions('widgetInstances', ['selectWidgetInstance']),
		updateTheme(theme) {
			const newLayout = cloneDeep(this.story.layoutConfiguration);
			newLayout.theme = theme;

			this.updateStory({layout: newLayout});
		},
		updateColor(color, index) {
			const newLayout = cloneDeep(this.story.layoutConfiguration);
			newLayout.theme.colors.graph[index] = color;
			newLayout.theme.name = 'Custom';

			this.updateStory({layout: newLayout});
		},
		updateBackground(color) {
			const newLayout = cloneDeep(this.story.layoutConfiguration);
			newLayout.theme.colors.background = color;
			newLayout.theme.name = 'Custom';

			this.updateStory({layout: newLayout});
		},
		updateLightState(dark) {
			const newLayout = cloneDeep(this.story.layoutConfiguration);

			newLayout.theme.dark = dark;
			newLayout.theme.colors.background = dark ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';

			this.updateStory({layout: newLayout});
		},
		showStoryModal() {
			this.$refs.storyModal.showModal();
		}
	}
};

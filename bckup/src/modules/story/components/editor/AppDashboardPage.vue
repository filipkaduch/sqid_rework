<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
	<div
		ref="story"
		class="w-100"
		:style="pageStyle">
		<template v-if="readOnly">
			<div
				class="w-100 h-100 position-relative">
				<widget-wrapper
					v-for="(widgetInstanceId, index) in widgetInstanceIds"
					:id="widgetInstanceId"
					:key="`${widgetInstanceId}-${index}-chart`"
					:variant="storyType"
					:widget-instance-id="widgetInstanceId" />
			</div>
		</template>
		<ds-btn
			v-if="isFilterOnPage(pageWidgetInstanceId)"
			variant="ghost"
			icon-only
			class="btn-filter-reset rounded-circle border-0"
			@click="resetWidgetPageFilters">
			<template #icon>
				<fa-layers fixed-width>
					<fa-icon :icon="['fas', 'filter']" transform="left-1" />
					<fa-icon :icon="['fas', 'times-circle']" transform="shrink-4 right-8 down-4" />
				</fa-layers>
			</template>
		</ds-btn>
	</div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import sectionStackingVariants from '@/util/consts/sectionStackingVariants';
import WidgetWrapper from '@/modules/story/components/editor/WidgetWrapper.vue';

export default {
	name: 'AppDashboardPage',
	components: {
		WidgetWrapper
	},
	props: {
		pageWidgetInstanceId: {
			type: String,
			required: true
		},
		readOnly: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			sectionStackingVariants,
			storyEditorWidth: 1754,
			storyEditorHeight: 1240
		};
	},
	computed: {
		...mapGetters('storyDetail', ['story']),
		...mapGetters('widgetInstances', ['isFilterOnPage']),
		widgetInstanceIds() {
			return this.$store.getters['widgetInstances/widgetInstanceIds'][this.pageWidgetInstanceId] ?? [];
		},
		selectedWidgetInstanceId() {
			return this.$store.getters['widgetInstances/selectedWidgetInstanceIds'][this.pageWidgetInstanceId] ?? (this.widgetInstanceIds[0] ?? null);
		},
		storyType() {
			return this.story?.storyType ?? null;
		},
		pageStyle() {
			return {
				zIndex: 1,
				height: '100%'
			};
		}
	},
	created() {
		this.sectionStackingVariants = sectionStackingVariants;
	},
	mounted() {
		window.addEventListener('resize', this.setDimensions);
		this.setDimensions();
		this.recomputeScale();
	},
	unmounted() {
		window.removeEventListener('resize', this.setDimensions);
	},
	methods: {
		...mapActions('storyDetail', ['setScale']),
		...mapActions('widgetInstances', [
			'selectWidgetInstance',
			'resetPageFilters'
		]),
		resetWidgetPageFilters() {
			this.resetPageFilters(this.pageWidgetInstanceId);
		},
		setDimensions() {
			this.storyEditorWidth = this.$refs.story?.clientWidth;
			this.storyEditorHeight = this.$refs.story?.clientHeight;
			this.recomputeScale();
		},
		recomputeScale() {
			this.$nextTick(() => {
				// Calc scale based on available size and size of dashboard(1754x1240)
				const scaleValue = Math.min(
					this.storyEditorWidth / 1754,
					this.storyEditorHeight / 1240
				);
				this.setScale(scaleValue);
			});
		}
	}
};
</script>

<style lang="scss" scoped>

</style>

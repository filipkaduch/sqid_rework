import {dimensionDefinition} from '@/util/queryBuilder';
import {mapDimensionAxes} from '@/util/widgetDataBinding';

export default {
	computed: {
		timeline() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'timeline') ?? {};
		},
		timelineConfiguration() {
			return {
				interval: this.timeline?.interval ?? 30000
			};
		},
		timelineColumn() {
			return this.$store.getters['widgetInstances/configuration'](this.widgetInstanceId)?.data?.configuration?.timeline ?? {};
		},
		timelineShow() {
			return typeof this.timelineColumn?.column !== 'undefined';
		},
		editorTimeline() {
			return this.timelineShow && !this.readOnly;
		},
		timelineDimension() {
			return this.timelineColumn.column && this.timelineColumn.bucketsDatetime && this.timelineColumn.function !== dimensionDefinition.NO_CHANGE
				? mapDimensionAxes(this.timelineColumn, 'Timeline')
				: null;
		},
		state() {
			return this.preview ? 0 : this.$store.getters['widgetTimeline/playState'](this.widgetInstanceId);
		}
	}
};

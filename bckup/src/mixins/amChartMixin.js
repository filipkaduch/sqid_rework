import {metricLabel} from '@/util/widgetData';
import widgetDataMixin from '@/mixins/widgetDataMixin';

export default {
	mixins: [widgetDataMixin],
	data: () => ({
		numColors: 4
	}),
	computed: {
		colors() {
			const temp = new Array(this.numColors);
			for (let i = 0; i < this.numColors; i++) {
				temp[i] = this.getColor(i);
			}
			return temp;
		}
	},
	methods: {
		getAlias(index) {
			const i = parseInt(index, 10);
			const name = `Metric${i === 0 ? i + 1 : i}`;

			return this.mapMapping?.metricAliases?.[name] || metricLabel(this.metric, i);
		}
	}
};

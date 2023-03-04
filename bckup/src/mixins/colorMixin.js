import {rgbLinearShade} from '@/util/colors/shade';
import {widgetOptionName} from '@/util/consts/widgetOptionsNames';
import {MAX_COLORS} from '@/util/consts/chartsConstants';
import cloneDeep from 'lodash/cloneDeep';

export default {
	computed: {
		coloring() {
			return this.$store.getters['widgetInstances/option'](this.widgetInstanceId, widgetOptionName.COLORING) ?? null;
		}
	},
	methods: {
		generateColors(number, persist = false) {
			const numberOfColors = Math.min(number, MAX_COLORS);
			let tempColoring = null;
			if (persist) {
				tempColoring = cloneDeep(this.coloring);
			}
			const defaultColors = new Array(numberOfColors);
			if (tempColoring !== null && persist) {
				tempColoring.forEach((colour, index) => {
					defaultColors[index] = colour;
				});
				for (let i = tempColoring.length; i < numberOfColors; i++) {
					defaultColors[i] = {
						index: i,
						color: this.getColor(i, true)
					};
				}
			} else {
				for (let i = 0; i < numberOfColors; i++) {
					defaultColors[i] = {
						index: i,
						color: this.getColor(i, true)
					};
				}
			}
			this.setOption(widgetOptionName.COLORING, defaultColors);
			return this.$store.dispatch('storyDetail/generateColors', numberOfColors);
		},
		getColorOpacity(index, selected = false) {
			const colorIndex = index % MAX_COLORS;
			let colorOpacity = null;

			if (this.coloring || selected || colorIndex >= this.coloring?.length) {
				colorOpacity = selected
					? rgbLinearShade(0.6, this.$store.getters['storyDetail/graphColor'](colorIndex))
					: this.$store.getters['storyDetail/graphColor'](colorIndex);
			} else {
				colorOpacity = selected
					? rgbLinearShade(0.6, this.coloring?.[colorIndex]?.color)
					: this.coloring?.[colorIndex]?.color;
			}
			return colorOpacity;
		},
		getColor(index, selected = false) {
			const colorIndex = index % MAX_COLORS;
			let color = null;

			if (this.coloring || selected || colorIndex >= this.coloring?.length) {
				color = this.$store.getters['storyDetail/graphColor'](colorIndex);
			} else {
				// eslint-disable-next-line prefer-destructuring
				color = this.coloring?.[colorIndex]?.color;
			}
			return color;
		}
	}
};


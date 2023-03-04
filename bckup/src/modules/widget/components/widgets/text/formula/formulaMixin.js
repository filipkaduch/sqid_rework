import {formatNumber} from '@/plugins/formatting';
import {$sanitizeHtml} from '@/util/sanitizeHtml';

export default {
	data() {
		return {
			windowWidth: window.innerWidth
		};
	},
	computed: {
		position() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'position');
		},
		widgetData() {
			return this.$store.getters['widgetData/data'](this.widgetInstanceId);
		},
		metrics() {
			return this.preview ? null : this.widgetData?.metrics;
		},
		format() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'format');
		},
		text() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'text');
		},
		filter() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'filter');
		},
		textSize() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'textSize');
		},
		textColor() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'textColor');
		},
		coloring() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'coloring');
		},
		hasMetric() {
			return this.metrics && this.metrics.length > 0 && this.metrics.every((el) => el && el.column && el.aggregation);
		},
		filterMap() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'filterMap');
		},
		filterDatasets() {
			return this.preview ? null : this.$store.getters['widgetInstances/option'](this.widgetInstanceId, 'filterDatasets');
		},
		selectedDataset() {
			return this.metrics?.[0]?.dataset;
		},
		fontColor() {
			return this.textColor === 'light' ? '#fff' : '#000';
		},
		widgetSize() {
			return this.preview ? null : this.$store.getters['widgetInstances/size'](this.widgetInstanceId);
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
		size() {
			return Math.min(
				this.storyDimension.width * this.widgetSize.width,
				this.storyDimension.height * this.widgetSize.height
			);
		},
		html() {
			const textInput = this.format === null ? this.text : this.format;
			let rawHtml = null;
			if (textInput) {
				rawHtml = textInput
					.replace(/<a href="(?<href>[^"]*)" rel="(?<rel>[^"]*)">/gu, (match, href, rel) => `<a href="${href}" target="_blank" rel="${rel}">`);

				rawHtml = rawHtml?.replace(/\$[\w-]+/gu, (text) => this.$store.getters['widgetFacts/value'](text.substring(1)) ?? '...');
				if (this.hasMetric) {
					rawHtml = rawHtml
						// eslint-disable-next-line prefer-named-capture-group
						?.replace(/\{\d+\}/gu, (placeholder) => {
							const value = this.getPlaceholderValue(placeholder);

							return isNaN(parseFloat(value)) ? value : formatNumber(value);
						}) ?? null;
				}
			}
			return rawHtml === null ? null : $sanitizeHtml(rawHtml);
		},
		textSizes() {
			const baseFont = this.resizeFormula();

			return {
				paragraph: {
					fontSize: `${baseFont * this.fontScale}px`,
					fontWeight: 500
				},
				h1: {
					fontSize: `${baseFont * this.fontScale}px`
				},
				h2: {
					fontSize: `${baseFont * this.fontScale}px`
				}
			};
		}
	},
	mounted() {
		window.addEventListener('resize', () => {
			this.windowWidth = window.innerWidth;
		});
	},
	methods: {
		getPlaceholderValue(placeholder) {
			if (!this.widgetData.data.columns) {
				return placeholder;
			}

			const index = placeholder.match(/\d+/gi);
			const dataIndex = this.widgetData.data.columns.map((column) => column.reference).indexOf(`Metric${index}`);
			const value = this.widgetData.data.rows[0][dataIndex];

			return dataIndex >= 0 ? value : placeholder;
		},
		resizeFormula() {
			switch (this.textSize) {
				case 'paragraph': {
					if ((this.windowWidth < 576)) {
						return 16;
					} else if (this.windowWidth < 798) {
						return 18;
					} else if (this.windowWidth < 992) {
						return 20;
					} else if (this.windowWidth < 1200) {
						return 22;
					}
					return 24;
				}
				case 'h1': {
					if ((this.windowWidth < 576)) {
						return 48;
					} else if (this.windowWidth < 798) {
						return 56;
					} else if (this.windowWidth < 992) {
						return 64;
					} else if (this.windowWidth < 1200) {
						return 72;
					} else if (this.windowWidth < 1500) {
						return 80;
					}
					return 120;
				}
				case 'h2': {
					if ((this.windowWidth < 576)) {
						return 24;
					} else if (this.windowWidth < 798) {
						return 30;
					} else if (this.windowWidth < 992) {
						return 40;
					} else if (this.windowWidth < 1200) {
						return 50;
					}
					return 60;
				}
				default: {
					return 24;
				}
			}
		}
	}
};

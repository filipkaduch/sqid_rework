<template>
	<ds-box padding-top="M">
		<ds-text v-if="gridText" variant="body" color="display-content">
			{{ $t(gridText) }}
		</ds-text>
		<ds-box padding-top="S" flex-type="row" align="space-between">
			<div class="flex-grow-1 pr-2">
				<ds-input
					v-model:value="valueLeft"
					:placeholder="`${$t('t_From')}`"
					debounce
					class="input-border-grid mx-0 mb-2 select" />
			</div>
			<div class="flex-grow-1">
				<ds-input
					v-model:value="valueRight"
					:placeholder="`${$t('t_To')}`"
					debounce
					class="input-border-grid mx-0 mb-2 select" />
			</div>
		</ds-box>
	</ds-box>
</template>

<script>
import widgetControlComponentMixin from '@/mixins/widgetControlComponentMixin';
import cloneDeep from 'lodash/cloneDeep';

export default {
	name: 'GridBorder',
	components: {},
	mixins: [widgetControlComponentMixin],
	props: {
		gridText: {
			type: String,
			default: ''
		},
		value: {
			type: Object,
			default: null
		},
		delimiter: {
			type: Boolean,
			default: false
		},
		leftValueName: {
			type: String,
			default: null
		},
		rightValueName: {
			type: String,
			default: null
		}
	},
	emits: ['update:value'],
	widgetControlTypes() {
		return ['widget_control_grid_border'];
	},
	computed: {
		gridBorder() {
			return this.value ?? {
				[this.rightValueName]: null,
				[this.leftValueName]: null
			};
		},
		valueRight: {
			get() {
				return this.gridBorder[this.rightValueName];
			},
			set(value) {
				this.$emit('update:value', this.cloneGrid(this.rightValueName, value), 'gridBorder');
			}
		},
		valueLeft: {
			get() {
				return this.gridBorder[this.leftValueName];
			},
			set(value) {
				this.$emit('update:value', this.cloneGrid(this.leftValueName, value), 'gridBorder');
			}
		}
	},
	methods: {
		updateOption(option, value) {
			this.$emit('update:value', this.cloneGrid(option, value), 'gridBorder');
		},
		cloneGrid(option, value) {
			const clonedGrid = cloneDeep(this.gridBorder);
			clonedGrid[option] = value === '' ? null : value;
			return clonedGrid;
		}
	}
};
</script>

<style lang="scss" scoped>
.input-border-grid {
	color: map-get($ds-colors, 'display-content-300') !important;
}
</style>

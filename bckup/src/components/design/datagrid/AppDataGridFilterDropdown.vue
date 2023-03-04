<template>
	<ds-dropdown
		:id="`filter-${field}`"
		variant="clean"
		lazy
		no-caret>
		<template #triggerContent>
			<button class="btn btn-clean">
				<fa-icon icon="filter" />
			</button>
		</template>

		<template #dropdownContent>
			<div style="width: 400px" class="p-3">
				<div class="form-group">
					Function
					<bootstrap-select
						v-model:value="fn"
						:options="filterOptions[getColumnFilterType(types[field])]"
						text-field="name"
						value-field="name" />
				</div>

				<div v-if="currentFunction && currentFunction.hasValue !== false" class="form-group">
					Value
					<ds-input v-model:value="value" type="text" />
				</div>
				<div class="form-group">
					Invert filter
					<ds-check-box :state="invert" :outline="true" @update:state="invert = $event" />
				</div>

				<button class="btn btn-success" @click="onFilter">Filter</button>
				<button class="btn btn-clear ml-2" @click="onClear">Clear</button>
			</div>
		</template>
	</ds-dropdown>
</template>

<script>
import {getType} from '@/util/dataGrid';
import BootstrapSelect from '@/components/temporary/BootstrapSelect.vue';

export default {
	name: 'AppDataGridFilterDropdown',
	components: {BootstrapSelect},
	props: {
		field: {
			type: String,
			required: true
		},
		types: {
			type: Object,
			default: () => ({})
		},
		filterOptions: {
			type: Object,
			default: () => ({})
		},
		filterFunctions: {
			type: Object,
			default: () => ({})
		},
		currentFilter: {
			type: Object,
			default: () => ({})
		},
		currentIndex: {
			type: Number,
			required: true
		}
	},
	emits: ['filter'],
	data: () => ({
		fn: 'contains',
		value: '',
		invert: false
	}),
	computed: {
		currentFunction() {
			return this.filterFunctions[this.fn];
		}
	},
	mounted() {
		if (this.currentFilter) {
			this.fn = this.currentFilter.fn;
			this.value = this.currentFilter.value;
			this.invert = this.currentFilter.invert;
		}
	},
	methods: {
		onFilter() {
			this.$emit('filter', {
				index: this.currentIndex,
				filter: {
					key: this.field,
					fn: this.fn,
					value: this.value,
					invert: this.invert
				}
			});
		},
		getColumnFilterType(type) {
			return getType(type);
		},
		onClear() {
			this.fn = '';
			this.value = '';
			this.invert = false;

			this.$refs.dropdown.hide(true);

			this.$emit('filter', {
				index: this.currentIndex,
				filter: null
			});
		}
	}
};
</script>

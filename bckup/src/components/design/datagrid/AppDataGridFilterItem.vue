<template>
	<ds-inline no-wrap align-y="center" gap="XS">
		<fa-icon icon="align-justify" class="handle-test" />

		<bootstrap-select v-model:value="op" size="sm" :options="['and','or']" />
		<div class="ml-4">
			<input id="exampleCheck1" type="checkbox" class="form-check-input">
			Not
		</div>
		<bootstrap-select v-model:value="key" size="sm" :options="columns" />

		<bootstrap-select
			v-model:value="fn"
			size="sm"
			text-field="name"
			value-field="name"
			:options="functions" />

		<ds-input v-model:value="value" sm />

		<button class="btn btn-clean btn-sm" @click="remove">
			<fa-icon icon="times" />
		</button>
	</ds-inline>
</template>

<script>
import BootstrapSelect from '@/components/temporary/BootstrapSelect.vue';

export default {
	name: 'AppDataGridFilterItem',
	components: {BootstrapSelect},
	props: {
		filter: {
			type: Object,
			required: true
		},
		columns: {
			type: Array,
			required: true
		},
		functions: {
			type: Array,
			required: true
		},
		type: {
			type: String,
			required: true
		}
	},
	emits: ['filter:remove', 'filter:update'],
	data: () => ({
		op: 'and',
		key: '',
		fn: '',
		value: null,
		invert: false
	}),
	computed: {
		currentFilter() {
			return {
				op: this.op,
				key: this.key,
				fn: this.fn,
				value: this.value,
				invert: this.invert
			};
		}
	},
	watch: {
		currentFilter(newVal) {
			this.updateFilter(newVal);
		}
	},
	beforeMount() {
		this.op = this.filter.op || 'and';
		this.key = this.filter.key;
		this.fn = this.filter.fn;
		this.value = this.filter.value;
		this.invert = this.filter.invert;
	},
	methods: {
		remove() {
			this.$emit('filter:remove');
		},
		updateFilter(filter) {
			this.$emit('filter:update', filter);
		}
	}
};
</script>

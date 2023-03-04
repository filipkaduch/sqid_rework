<template>
	<ds-box flex-type="row" no-grow>
		<ds-box padding="S" class="cursor-pointer" align-y="center" @click="pageDown">
			<ds-icon name="ds-icon-chevron-left" />
		</ds-box>
		<ds-box padding-left="S" flex-type="row" align-y="center">
			<input
				v-model="currentPage"
				class="pagination-input"
				type="number"
				:min="1"
				:max="totalRows"
				@input="checkLength">
			<ds-text class="ml-2">
				of {{ totalRows }}
			</ds-text>
		</ds-box>
		<ds-box padding="S" class="cursor-pointer" align-y="center" @click="pageUp">
			<ds-icon name="ds-icon-chevron-right" />
		</ds-box>
	</ds-box>
</template>

<script>
import {defineComponent, ref, watch} from 'vue';

// TODO Unify with Pagination
export default defineComponent({
	name: 'AppPagination',
	props: {
		totalRows: {
			type: Number,
			required: true
		},
		value: {
			type: Number,
			default: 1
		}
	},
	emits: ['change', 'updateValue'],
	setup(props, {emit}) {
		const currentPage = ref(props.value);

		watch(() => props.value, (value) => {
			currentPage.value = value;
		});

		const checkLength = () => {
			// Handle input from current page input field
			if (typeof currentPage.value === 'string') {
				currentPage.value = parseInt(currentPage.value, 10);
			}
			if (currentPage.value > props.totalRows) {
				currentPage.value = props.totalRows;
			}
		};

		const pageDown = () => {
			if (currentPage.value > 1) {
				emit('change', currentPage.value - 1);
			}
		};

		const pageUp = () => {
			if (currentPage.value < props.totalRows) {
				emit('change', currentPage.value + 1);
			}
		};

		return {
			currentPage,
			checkLength,
			pageDown,
			pageUp
		};
	}
});
</script>

<style lang="scss">
.pagination-input {
	width: 32px;
	height: 28px;
	gap: 10px;
	text-align: center;
}

/* Firefox */
input[type=number] {
	-moz-appearance: textfield;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}
</style>

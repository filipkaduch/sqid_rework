<template>
	<ds-box padding="M" flex-type="row" class="height" align="space-between">
		<ds-box flex-type="row">
			<ds-box class="cursor-pointer" @click="pageDown">
				<ds-icon
					:class="{'active-color': currentPage > 1}"
					name="icon-arrow-left" />
			</ds-box>
			<ds-box align-y="center" flex-type="row" padding-x="S" noGrow>
				<input
					v-model="currentPage"
					class="pagination-input"
					type="number"
					:min="1"
					:max="pageCount"
					@input="checkLength">
			</ds-box>
			<ds-box padding-right="XS" flex-type="row">
				<ds-text>of {{ pageCount }}</ds-text>
				<ds-box class="cursor-pointer" @click="pageUp">
					<ds-icon
						:class="{'active-color': currentPage < pageCount}"
						name="icon-arrow-right" />
				</ds-box>
			</ds-box>
		</ds-box>
		<ds-box>
			<ds-box flex-type="row">
				<ds-text variant="bodyMedium">{{ getItemsRangeText }}</ds-text>
				<ds-box padding-x="XS">
					<ds-text color="display-content-300">{{ $t('table.of') }}</ds-text>
				</ds-box>
				<ds-text>{{ totalRows }}</ds-text>
				<ds-box padding-left="XS">
					<ds-text color="display-content-300">{{ $t('table.items') }}</ds-text>
				</ds-box>
			</ds-box>
		</ds-box>
	</ds-box>
</template>

<script lang="ts">
import {computed, defineComponent, reactive, toRefs, watch} from 'vue';

export default defineComponent({
	props: {
		numberOfItemsPerPage: {
			type: Number,
			default: 10
		},

		totalRows: {
			type: Number,
			required: true
		}
	},
	emits: ['updateCurrentPage'],
	setup(props, {emit}) {
		const state = reactive({
			currentPage: 1,
			pageCount: Math.ceil(props.totalRows / props.numberOfItemsPerPage),
			numberOfRecords: props.totalRows
		});

		const pageDown = () => {
			if (state.currentPage > 1) {
				state.currentPage -= 1;
			}
		};

		const pageUp = () => {
			if (state.currentPage < state.pageCount) {
				state.currentPage += 1;
			}
		};

		const checkLength = () => {
			// Handle input from current page input field
			if (typeof state.currentPage === 'string') {
				state.currentPage = parseInt(state.currentPage, 10);
			}
			if (state.currentPage > state.pageCount) {
				state.currentPage = state.pageCount;
			}
		};

		watch(() => state.currentPage, (value) => {
			emit('updateCurrentPage', value);
		});

		watch(() => props.totalRows, (value) => {
			state.numberOfRecords = value;
			state.pageCount = Math.ceil(value / props.numberOfItemsPerPage);
		});

		const getItemsRangeText = computed(() => {
			const first = state.currentPage === 1 ? 1 : ((state.currentPage - 1) * props.numberOfItemsPerPage) + 1;
			const lastValOfPage = (state.currentPage * props.numberOfItemsPerPage);
			const last = lastValOfPage > props.totalRows ? props.totalRows : lastValOfPage;

			return `${first}-${last}`;
		});

		return {
			...toRefs(state),
			checkLength,
			getItemsRangeText,
			pageDown,
			pageUp
		};
	}
});
</script>

<style lang="scss" scoped>
.height {
	height: 52px;
}
.pagination-input {
	width: 32px;
	height: 28px;
	gap: 10px;
	text-align: center;
}

input:active{
	border:none;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

/* Firefox */
input[type=number] {
	-moz-appearance: textfield;
}

.active-color {
	fill: map-get($ds-colors , 'display-content');
}
</style>

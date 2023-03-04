<template>
	<div class="overflow-auto">
		<div ref="scrollDiv" @scroll="onScrollUnfiltered">
			<div class="table-responsive mb-0">
				<table :class="options.border ? 'table-bordered' : 'table-borderless'" class="table m-0">
					<thead v-if="options.header" class="thead-white">
						<tr>
							<th
								v-for="(header, index) in (tableHeaders ? tableHeaders : tableKeys)"
								:key="index"
								class="sticky-top active bg-white header-border">
								{{ header }}
								<button
									v-if="header === 'Created'"
									class="btn btn-gray rounded-pill switcher btn-icon">
									<fa-icon :icon="['fad', 'sort-down']" />
								</button>
								<button
									v-if="header === 'Modified'"
									class="btn btn-gray rounded-pill switcher btn-icon">
									<fa-icon :icon="['fad', 'sort-up']" />
								</button>
							</th>
							<th v-if="$slots.actionCell()" class="sticky-top" />
						</tr>
					</thead>
					<tbody>
						<tr v-for="(entry, index) in tableData" :key="index" @click.prevent="$emit('rowClick', entry)">
							<template v-if="entry.visibilityState !== columnVisibilityState.INTERNAL">
								<template v-for="key in tableKeys" :key="key + index">
									<slot
										v-if="options.wrapCells === false"
										name="cell"
										:entry="entry"
										:entryKey="key" />
									<td
										v-else
										class="align-middle"
										:class="{clickable: isCellClickable(key)}"
										@click="cellClick(key, entry)">
										<slot name="cell" :entry="entry" :entryKey="key">{{ entry[key] }}</slot>
									</td>
								</template>
								<td v-if="$slots.actionCell()" class="align-middle text-right">
									<slot name="actionCell" :entry="entry" />
								</td>
							</template>
						</tr>
					</tbody>
					<tfoot
						v-if="options.loadMore && !(options.automaticLoadMore && !loadMoreLoading)"
						:style="(!options.loadMore && !(options.automaticLoadMore && !loadMoreLoading)) ? 'display: block;' : 'display: none;'">
						<tr>
							<td :colSpan="tableKeys.length + ($slots.actionCell() ? 1 : 0)">
								<app-load-more-button
									v-if="!options.automaticLoadMore && !hideLoadMoreButton"
									:loadMoreEnabled="loadMoreEnabled"
									:loadMoreLoading="loadMoreLoading"
									@load-more="$emit('loadMore')" />
								<app-loading
									v-if="options.automaticLoadMore || hideLoadMoreButton"
									:loading="loadMoreLoading" />
							</td>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
	</div>
</template>

<script>
import AppLoadMoreButton from '@/components/design/AppLoadMoreButton.vue';
import AppLoading from '@/components/design/AppLoading.vue';
import {columnVisibilityState} from '@/util/queryBuilder';
import onScrollMixin from '@/mixins/onScrollMixin';
import tableMixin from '@/mixins/tableMixin';

export default {
	name: 'AppTable',
	components: {
		AppLoading,
		AppLoadMoreButton
	},
	mixins: [
		tableMixin,
		onScrollMixin
	],
	props: {
		tableKeys: {
			type: Array,
			required: true
		},
		clickableCells: {
			type: Array,
			default: () => []
		}
	},
	emits: ['rowClick', 'loadMore', 'cell-click'],
	data() {
		return {
			modified: false,
			columnVisibilityState
		};
	},
	watch: {
		tableData() {
			this.recomputeScroll();
		}
	},
	mounted() {
		window.addEventListener('resize', this.recomputeScroll);
		this.recomputeScroll();
	},
	unmounted() {
		window.removeEventListener('resize', this.recomputeHeights);
	},
	methods: {
		recomputeScroll() {
			this.onScrollUnfiltered({target: this.$refs.scrollDiv});
		},
		isCellClickable(key) {
			return this.clickableCells.some((cellKey) => cellKey === key);
		},
		cellClick(key, entry) {
			if (this.clickableCells.some((cellKey) => cellKey === key)) {
				this.$emit('cell-click', {
					key,
					entry
				});
			}
		}
	}
};
</script>

<style scoped>
	table tr > :first-child {
		padding-left: 1.5rem;
	}

	table tr > :last-child {
		padding-right: 1.5rem;
	}

	table tr:not(:first-child) {
		border-top: 1px solid #CFD8DD;
		border-bottom: 1px solid #CFD8DD;
	}

	table tr:first-child {
		border-bottom: 1px solid #CFD8DD;
	}

	/*noinspection CssUnusedSymbol*/
	table tr td.clickable {
		cursor: pointer;
	}

	table tr:hover {
		background-color: #F2F6FE;
	}

	.active {
		vertical-align: middle;
	}

	.switcher {
		height: 2rem;
		width: 2rem;
	}

	.header-border {
		border-bottom: 2px solid #CFD8DD !important;
	}
</style>

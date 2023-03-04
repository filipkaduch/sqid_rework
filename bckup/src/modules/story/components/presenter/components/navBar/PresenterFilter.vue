<template>
	<div
		v-if="story !== null"
		class="text-black d-flex align-items-center justify-content-end w-100">
		<button
			class="btn btn-secondary filterList bg-white m-0 rounded d-flex justify-content-between py-2"
			@click="collapseFilter = !collapseFilter">
			<ds-icon
				name="icon-filter"
				alt="icon" />
			{{ $t('presenterFilter.t_filters') }}
		</button>
		<ds-collapse id="filter-collapse" :is-open="collapseFilter" class="colapse-window">
			<ds-card footer-bg-variant="white" footer-class="d-flex justify-content-end">
				<div class="d-flex justify-content-between mb-2">
					<div class="filter-heading p-1">
						{{ $t('presenterFilter.t_filters') }}
					</div>
				</div>
				<ds-container class="container">
					<div
						v-for="(filter, index) in preparedFilters"
						:key="index"
						@click="handleFilterClick(index)">
						<div class="d-flex justify-content-center align-items-center w-100">
							<multi-filter-column-select
								class="mr-1 bg-white w-100 justify-content-center align-items-center d-flex p-1"
								:editable="false"
								:preview="true"
								:filter="cloneDeep(globalFilters[index])"
								:filterIndex="index"
								:filterValue="globalFilters[index].value"
								:dropDirection="index >= (preparedFilters.length / 2) ? 'top' : 'bottom'"
								:selected-operation="globalFilters[index].logic"
								@filter-reseted="resetFilters($event)"
								@filter-created="setFilterActive(currentIndex, $event)" />
						</div>
						<ds-collapse :id="`edit-collapse${index}`" :is-open="showEdit[index]">
							<ds-card :ref="`filterEdit-${index}`" class="mr-1 my-2 mobileEditCard">
								<multi-filter-column-select
									v-if="showEdit[index] === true"
									class="bg-white filterEditCard"
									:editable="true"
									:filter="cloneDeep(globalFilters[index])"
									:filterIndex="index"
									:filterValue="globalFilters[index].value"
									:selected-operation="globalFilters[index].logic"
									@filter-reseted="resetFilters($event)"
									@filter-created="setFilterActive(currentIndex, $event)"
									@click.stop />
							</ds-card>
						</ds-collapse>
					</div>
				</ds-container>
				<template #footer>
					<button class="btn btn-white" @click="resetAllFilters">
						{{ $t('presenterFilter.t_reset') }}
					</button>
				</template>
			</ds-card>
		</ds-collapse>
	</div>
</template>

<script>
import MultiFilterColumnSelect from '@/modules/widget/components/widget-controls/MultiFilterColumnSelect.vue';
import {mapGetters} from 'vuex';
import cloneDeep from 'lodash/cloneDeep';

export default {
	name: 'PresenterFilter',
	components: {
		MultiFilterColumnSelect
	},
	data() {
		return {
			showEdit: [],
			initialFilters: null,
			cloneDeep,
			collapseFilter: false
		};
	},
	computed: {
		...mapGetters('storyDetail', {story: 'story'}),
		...mapGetters('widgetInstances', ['widgetInstanceIds']),
		globalFilters() {
			return this.story?.configuration?.globalFilters ?? [];
		},
		preparedFilters() {
			const prepareFilters = [];
			if (this.globalFilters.length !== 0) {
				this.globalFilters.forEach((element) => {
					const tempFilter = [];
					Object.values(element.columnReference).forEach((col) => {
						col.forEach((val) => {
							tempFilter.push(val);
						});
					});

					prepareFilters.push(tempFilter);
				});
			}

			return prepareFilters;
		}
	},
	created() {
		this.initialFilters = cloneDeep(this.globalFilters);
	},
	methods: {
		resetFilters(index) {
			const newConfiguration = cloneDeep(this.story.configuration);
			newConfiguration.globalFilters[index] = cloneDeep(this.initialFilters[index]);
			this.$store.dispatch('storyDetail/updateStory', {configuration: newConfiguration}, {root: true}).then(() => {
				this.setFilterActive(index);
			});
		},
		resetAllFilters() {
			const newConfiguration = cloneDeep(this.story.configuration);
			newConfiguration.globalFilters = cloneDeep(this.initialFilters);
			this.$store.dispatch('storyDetail/updateStory', {configuration: newConfiguration}, {root: true}).then(() => {
				this.globalFilters.forEach((global, index) => {
					this.setFilterActive(index);
				});
			});
		},
		handleFilterClick(index) {
			const checkValue = this.showEdit[index];
			this.currentIndex = index;
			if (this.globalFilters.length >= this.showEdit.length) {
				this.showEdit = [];
				this.globalFilters.forEach(() => {
					this.showEdit.push(false);
				});
			}

			if (this.globalFilters[index]?.editable === true) {
				this.showEdit[index] = !checkValue;
				this.showEdit = cloneDeep(this.showEdit);
			}
			setTimeout(() => {
				this.$refs[`filterEdit-${index}`][0].scrollTop = this.$refs[`filterEdit-${index}`][0].scrollHeight;

				this.$refs[`filterEdit-${index}`][0].scrollIntoView({
					behavior: 'auto',
					block: 'center'
				});
			}, 500);
		},
		setFilterActive(index, event = null) {
			const newConfiguration = cloneDeep(this.story.configuration);
			if (event !== null && typeof event.filter !== 'undefined') {
				newConfiguration.globalFilters[index] = cloneDeep(event.filter);
			}

			this.showEdit[index] = false;
			this.showEdit = cloneDeep(this.showEdit);

			const filterDatasets = [];
			Object.keys(newConfiguration.globalFilters[index].columnReference).forEach((key) => {
				filterDatasets.push(key);
			});

			this.$store.dispatch('storyDetail/updateStory', {configuration: newConfiguration}, {root: true});

			Object.values(this.widgetInstanceIds).forEach((element) => {
				element.forEach((widget) => {
					if (this.$store.getters['widgetInstances/configuration'](widget).data !== null
						&& filterDatasets.includes(this.$store.getters['widgetInstances/configuration'](widget).data.datasetId)) {
						this.$store.dispatch('widgetData/loadData', {widgetInstanceId: widget}, {root: true});
					}
				});
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.filter-heading {
	color: map-get($ds-colors, 'display-content');
	font-size: 14px;
	font-weight: 500;
  line-height: 14px;
}
.container {
	max-height: 250px;
	max-width: 350px;
  overflow: auto;
  padding: 0;
}

.colapse-window {
	position: absolute;
	top: 40px;
}
</style>

<template>
	<ds-inline align-y="center">
		<ds-toggle-bar :items="filteredToggle" :default="null" @selected="storyType = $event" />
		<ds-box padding-left="L" flex-type="row" align="space-between" align-y="center">
			<ds-box flex-type="row" noGrow>
				<ds-box padding="GROUP" flex-type="row">
					<ds-box padding-right="XS">
						<ds-text variant="bodyMedium" color="icon-default">
							{{ `${$t('t_Filter')}:` }}
						</ds-text>
					</ds-box>
					<filter-select
						:items="shareFilters"
						:defaultValue="selectedShareFilter"
						@selected="updateShareFilter" />
				</ds-box>
				<ds-box padding="GROUP" flex-type="row">
					<ds-box padding-right="XS">
						<ds-text variant="bodyMedium" color="icon-default">
							{{ `${$t('t_SortBy')}:` }}
						</ds-text>
					</ds-box>
					<filter-select
						:items="sortFilter"
						:defaultValue="selectedSortFilter"
						multiple-options
						@update-multiple-selected="updateSortFilters" />
				</ds-box>
			</ds-box>
			<!-- <ds-box flex-type="row" noGrow>
				<ds-box padding-right="M">
					<ds-icon :src="require('@/assets/ds-icon-card-grid.svg')" fill="display-content-300" />
				</ds-box>
				<ds-box>
					<ds-icon :src="require('@/assets/ds-icon-bulleted-list.svg')" fill="display-content-300" />
				</ds-box>
			</ds-box> -->
		</ds-box>
	</ds-inline>
</template>

<script lang="ts">
import {computed, defineComponent, inject, reactive, ref, toRefs, watch} from 'vue';
import {storyFilters, sortFilters, orderFilters, storyToggleItems, storyType, storyFilterType, storySortFilterType, storyOrderType} from '@/modules/story/consts/storyType';
import FilterSelect from '@/modules/homepage/components/FilterSelect.vue';
import cloneDeep from 'lodash/cloneDeep';
import i18n from '@/plugins/i18n';
import {useStore} from 'vuex';
const {t} = i18n.global;
export default defineComponent({
	components: {
		FilterSelect
	},
	props: {
		search: {
			type: String,
			default: ''
		},
		scroll: {
			type: Boolean,
			default: false
		}
	},
	emits: ['updateScroll'],
	setup(props, {emit}) {
		const store = useStore();
		const appConfig = inject('appConfig');

		// @ts-ignore
		const filteredToggle = appConfig?.explorer ? storyToggleItems : storyToggleItems.filter((type) => type.value !== storyType.DATA_EXPLORE);
		// @ts-ignore
		const oneIntegration = appConfig?.oneIntegration;

		const searchState = reactive({
			storySearch: props.search,
			searchTimeout: null as any
		});

		const state = reactive({
			storyType: null,
			sortFilter: storySortFilterType.UPDATED_AT,
			storyFilter: oneIntegration ? storyFilterType.OWNED_OR_SHARED_GEN2 : storyFilterType.ONLY_OWNED,
			orderFilter: storyOrderType.DESC
		});

		const onlyFavorites = computed(() => state.storyFilter === storyFilterType.ONLY_FAVORITE);
		const orderByDir = computed(() => [storySortFilterType.IS_FAVORITE, storySortFilterType.UPDATED_AT].includes(state.sortFilter) ? 'DESC' : state.orderFilter);
		const dispatchLoadNextPage = (reset: boolean = true) => {
			store.dispatch('stories/loadNextPage', {
				searchTerm: searchState.storySearch,
				storyType: state.storyType,
				orderByColumn: state.sortFilter,
				orderByDir: orderByDir.value,
				storyFilter: onlyFavorites.value ? null : state.storyFilter,
				...(onlyFavorites.value ? {onlyFavorites: true} : {}),
				reset
			});
		};

		watch(() => props.scroll, (scroll) => {
			if (scroll) {
				dispatchLoadNextPage(false);
				emit('updateScroll');
			}
		});

		watch(() => props.search, (searchTerm) => {
			searchState.storySearch = searchTerm;
		});

		watch(() => cloneDeep(state), () => {
			dispatchLoadNextPage();
		});

		watch(() => searchState.storySearch, (searchTerm) => {
			clearTimeout(searchState.searchTimeout);
			searchState.searchTimeout = setTimeout(() => {
				dispatchLoadNextPage();
			}, 500);
		});

		const mappedSortFilters = computed(() => sortFilters.map((item) => ({
			label: item.label,
			value: item.value,
			group: t('t_SortBy')
		})));

		const mappedOrderFilters = computed(() => orderFilters.map((item) => ({
			label: item.label,
			value: item.value,
			group: t('t_order'),
			...(item.alias ? {alias: item.alias} : {}),
			...(item.hideAt ? {hideAt: item.hideAt} : {})
		})));

		const shareFilters = computed(() => {
			const mappedFilters = storyFilters.map((item) => ({
				label: item.label,
				value: item.value,
				properties: {
					hideBorder: true
				}
			}));

			if (oneIntegration) {
				return mappedFilters;
			}
			return mappedFilters.filter((item: any) => [storyFilterType.ONLY_FAVORITE, storyFilterType.ONLY_OWNED].includes(item.value));
		});

		const selectedSortFilter = ref([mappedSortFilters.value[0], mappedOrderFilters.value[0]] as any);
		const selectedShareFilter = ref([shareFilters.value.find((item) => item.value === state.storyFilter)] as any);

		const sortFilter = computed(() => mappedSortFilters.value.concat(mappedOrderFilters.value));

		const updateShareFilter = (filter: any) => {
			if (state.storyFilter !== filter.value) {
				state.storyFilter = filter.value;
			}
		};

		const updateSortFilters = (filters: any) => {
			for (const filter of filters) {
				if (filter.group === t('t_SortBy')) {
					if (state.sortFilter !== filter.value) {
						state.sortFilter = filter.value;
					}
				} else if (filter.group === t('t_order')) {
					if (state.orderFilter !== filter.value) {
						state.orderFilter = filter.value;
					}
				}
			}
		};

		return {
			...toRefs(state),
			filteredToggle,
			selectedShareFilter,
			selectedSortFilter,
			sortFilter,
			shareFilters,
			updateSortFilters,
			updateShareFilter
		};
	}
});
</script>


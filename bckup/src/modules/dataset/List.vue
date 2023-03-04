<template>
	<div class="w-100 overflow-auto vh-100">
		<ds-page-header>
			<template v-if="!oneIntegration" #banner>
				<data-stories-limits-alerts />
			</template>

			<ds-inline align="space-between" align-y="center">
				<ds-inline>
					<ds-text variant="headline1light" padding-right="M">
						{{ $t('t_YourDatasets') }}
					</ds-text>

					<data-stories-limits-badge-button v-if="!oneIntegration" />
				</ds-inline>

				<ds-inline gap="M">
					<ds-btn variant="secondary" :disabled="saasLimitsState.limitStatusDatasets.value === LimitStatus.ERROR" @click="$router.push({name: 'dataset-create'})">
						{{ $t('t_AddDataSet') }}
					</ds-btn>
				</ds-inline>
			</ds-inline>
		</ds-page-header>

		<ds-box ref="card" class="mw-100" padding-top="M" padding-x="XL">
			<ds-row class="my-4">
				<ds-col
					class="p-0"
					cols="9"
					lg="4"
					md="6"
					xl="3">
					<ds-box padding-x="M">
						<ds-search-input v-model:search="datasetSearch" />
					</ds-box>
				</ds-col>
			</ds-row>
			<!--<ds-row class="mb-4">
				<ds-col
					class="p-0"
					cols="9"
					md="6"
					lg="4"
					xl="3">
					<ds-box class="h-100" align="left" padding-x="M" flex-type="row">
						<filter-select :items="sourceFilters" :pill="true" class="pr-2" @selected="selectedFilter = $event" />
						<filter-select :items="fileFilters" :pill="true" class="pr-2" @selected="selectedFilter = $event" />
						<filter-select :items="stateFilters" :pill="true" @selected="selectedFilter = $event" />
					</ds-box>
				</ds-col>
			</ds-row>-->
			<!--<ds-row class="my-4 mx-1">
				<div class="d-inline-flex align-items-center">
					<app-input-bar
						class="rounded d-flex"
						style="color:#AAABAE;"
						placeholder="Search"
						:right-icon="['fal', 'search']"
						v-model:input="datasetSearch" />
				</div>
			</ds-row>-->
			<ds-row>
				<ds-col>
					<ds-card body-class="p-0 h-100" class="card border-0 mb-3">
						<ds-dataset-list
							ref="datasetList"
							v-model:selected-datasets="selectedDatasets"
							:actions="true"
							:search="datasetSearch"
							:sortable="true" />
					</ds-card>
				</ds-col>
			</ds-row>
		</ds-box>
	</div>
</template>

<script lang="ts">
import DsDatasetList from '@/modules/dataset/components/DataStoriesDatasetList.vue';
import {computed, defineComponent, inject, onMounted} from 'vue';
import {fileFilters, sourceFilters, stateFilters} from '@/modules/dataset/utils/dataset';
import {useSaasLimits} from '@/modules/limits/store/limits';
import DataStoriesLimitsAlerts from '@/modules/limits/components/DataStoriesLimitsAlerts.vue';
import DataStoriesLimitsBadgeButton from '@/modules/limits/components/DataStoriesLimitsBadgeButton.vue';
import {LimitStatus} from '@/modules/limits/consts/enums';

export default defineComponent({
	name: 'List',
	components: {
		DsDatasetList,
		DataStoriesLimitsAlerts,
		DataStoriesLimitsBadgeButton
	},
	setup() {
		const appConfig = inject('appConfig');
		const saasLimitsState = useSaasLimits();
		const oneIntegration = computed(() => appConfig?.oneIntegration);

		onMounted(() => {
			saasLimitsState.getActualStatistics();
		});

		return {
			datasetSearch: '',
			selectedDatasets: [],
			selectedFilter: null,
			sourceFilters,
			fileFilters,
			stateFilters,
			saasLimitsState,
			oneIntegration,
			LimitStatus
		};
	}
});
</script>

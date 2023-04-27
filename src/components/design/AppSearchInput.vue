<template>
  <app-inline id="dropdown-container">
    <app-inline-item class="position-relative">
      <app-inline>
        <app-inline-item>
          <app-input
              v-if="!doneSearch && placeholder === null"
              class="group-input-right clean-input"
              :disabled="selectedDataSource === null || doneSearch"
              v-model:value="input"
              :width="isMobile ? `${mobileWidth - 260}px` : '600px'"
              :lg="true"
              :debounce="debounce"
              :placeholder="'Search'">
          </app-input>
          <app-input
              v-else
              class="group-input-right clean-input"
              :lg="true"
              :disabled="true"
              :width="isMobile ? `${mobileWidth - 260}px` : '600px'"
              :placeholder="placeHolder"/>
        </app-inline-item>
        <app-inline-item>
          <app-btn variant="secondary" :disabled="!doneSearch" class="group-btn-left clean-input" icon-only @click="resetInputs">
            <template #icon>
              <app-icon v-if="!loading" :name="doneSearch ? 'app-icon-edit' : 'app-search'" fill="display-content-600" />
              <app-loader v-else />
            </template>
          </app-btn>
        </app-inline-item>
      </app-inline>
      <app-box v-if="(mappedEntities.length > 0 || mappedMalwares.length > 0 || mappedCves.length > 0) && isOpen" border="separate-dark" border-radius="basic" class="search-results app-bg-white">
          <app-dropdown-menu :items="getSearchedEntities" @selected="selectEntity" />
      </app-box>
    </app-inline-item>
    <app-inline-item class="pl-1">
      <app-dropdown class="w-100" placement="bottom-end">
        <template #triggerContent>
          <app-tooltip :class="{'pulsating-circle': selectedDataSource === null}">
            <template #icon>
              <app-btn variant="ghost" icon-only class="rounded-circle" z-index>
                <template #icon>
                  <app-icon
                      :name="selectedDataSource === null ? 'app-chevron' : selectedDataSource.icon"
                      class="px-0 w-100 h-100"
                      fill="display-content-600"
                      style="z-index: 99 !important;" />
                </template>
              </app-btn>
            </template>
            <template #tooltip>
              {{ selectedDataSource === null ? $t('t_selectDatasource') : $t(selectedDataSource.label) }}
            </template>
          </app-tooltip>
        </template>
        <template #dropdownContent>
          <app-dropdown-menu :items="dataSources" @selected="setDataSource($event)" />
        </template>
      </app-dropdown>
    </app-inline-item>
  </app-inline>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, reactive, toRefs, watch} from 'vue';
import {DATA_SOURCES, dataSources} from "@/util/consts/dataSources";
import {searchEntities} from "@/api/wikidata/wikidata";
import AppDropdown from "../main/dropdown/AppDropdown.vue";
import AppDropdownMenu from "../main/dropdown/AppDropdownMenu.vue";
import AppLoader from "../main/loader/AppLoader.vue";
import {notify} from '@kyvg/vue3-notification';
import cloneDeep from 'lodash/cloneDeep';
import {i18n} from "../../plugins/all";
import {objectCaseMapper, objectCaseStyles} from "@/util/objectCaseMapper";
import {defaultEntityState, useEntityStore} from "@/modules/entities/store/entityStore";
import {DataSourceType, useQueriesStore} from "@/modules/queries/store/queriesStore";
import {getName, searchForEntities} from "@/api/malwares/sparql";
import {extractId} from "@/api/malwares/malwares";
import {defaultMalware, useMalwaresStore} from "@/modules/malwares/store/malwaresStore";
import {searchForEntitiesCVE} from "@/api/cve/sparql";
import {SearchedCveObject} from "@/api/cve/types";
import {extractCVEId} from "@/api/cve/cve";
import {defaultCve, useCVEStore} from "@/modules/cves/store/cveStore";
import {useMobileStore} from "@/store/util/mobile";

const {t} = i18n.global;

export default defineComponent({
	name: 'AppSearchInput',
  computed: {
    DATA_SOURCES() {
      return DATA_SOURCES
    }
  },
  components: {AppLoader, AppDropdownMenu, AppDropdown},
	props: {
		search: {
			type: String,
			required: true
		},
    queryId: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: null
    },
    dataSourceObject: {
      type: Object,
      default: null
    },
		debounce: {
			type: Boolean,
			default: false
		}
	},
	emits: ['update:search', 'selected', 'close'],
	setup(props, {emit}) {
		const state = reactive({
			inputValue: '',
      isOpen: false,
      doneSearch: false,
      placeHolder: '',
      entities: [] as any | [] | null,
      selectedDataSource: null as any,
      timeout: null as any | null,
      loading: false,
			input: props.search
		});

    const mappedEntities = computed(() => state.selectedDataSource?.value === DataSourceType.WIKIDATA ? state.entities?.map((toMap: any) => ({
      entity: toMap,
      label: toMap.label,
      properties: {subText: objectCaseMapper(toMap.description, objectCaseStyles.SENTENCE_CASE)},
      value: toMap.id
    })) : [] ?? []);

    const mappedMalwares = computed(() => state.selectedDataSource?.value === DataSourceType.SECURITY_DOMAIN ? state.entities?.map((toMap: any) => ({
      entity: toMap,
      label: objectCaseMapper(extractId(toMap.value), objectCaseStyles.SENTENCE_CASE),
      properties: {subText: extractId(toMap.entity)},
      value: extractId(toMap.entity)
    })) : [] ?? []);

    const mappedCves = computed(() => state.selectedDataSource?.value === DataSourceType.CVE_DOMAIN ? state.entities?.map((toMap: SearchedCveObject) => ({
      entity: toMap,
      value: extractCVEId(extractId(toMap.entity, '/')),
      properties: {subText: objectCaseMapper(extractId(toMap.value), objectCaseStyles.SENTENCE_CASE)},
      label: extractId(toMap.entity, '/')
    })) : [] ?? []);

    const getSearchedEntities = computed(() => {
       if (state.selectedDataSource?.value === DataSourceType.CVE_DOMAIN) {
           return mappedCves.value;
       } else if (state.selectedDataSource?.value === DataSourceType.SECURITY_DOMAIN) {
           return mappedMalwares.value;
       } else if (state.selectedDataSource?.value === DataSourceType.WIKIDATA) {
           return mappedEntities.value;
       }
       return [];
    });

		watch(() => props.search, (value) => {
			state.input = value;
		});
    watch(() => props.placeholder, (value) => {
      state.placeHolder = value;
    });
    watch(() => props.dataSourceObject, (value) => {
      state.selectedDataSource = cloneDeep(value);
    }, {immediate: true});

    const resetInputs = () => {
      state.doneSearch = false;
      state.placeHolder = '';
      emit('close');
    };

    const setDataSource = (dataSource: DataSourceType) => {
      state.selectedDataSource = dataSource;
      useQueriesStore().setQueryDataSource(props.queryId, dataSource);
      resetInputs();
    };

    const searchEntitites = async(search: string) => {
      if (state.selectedDataSource?.value === DataSourceType.WIKIDATA) {
        try {
          const response = await searchEntities(search, { limit: 10 })
          state.entities = []
          for (const [key, entity] of Object.entries(response)) {
            state.entities.push(entity)
          }

          if (search.match(/^P\d+$/)) {
            const properties = await searchEntities(search, { limit: 10,
              kind: 'property',
            })

            for (const [key, entity] of Object.entries(properties)) {
              state.entities.push(entity)
            }
          }

        } catch (err) {
          notify({
            type: 'danger',
            text: t('erros.t_errorFetching'),
            duration: 5000
          });
          console.error(err);
        }
      } else if (state.selectedDataSource?.value === DataSourceType.SECURITY_DOMAIN) {
        try {
          // const response = await getTechniquesRelationsQuery();
          // const response = await getById('T1027.004');
          const response = await searchForEntities(search);
          console.log(response);
          state.entities = []
          for (const [key, entity] of Object.entries(response)) {
            state.entities.push(entity);
          }
        } catch (err) {
          notify({
            type: 'danger',
            text: t('erros.t_errorFetching'),
            duration: 5000
          });
          console.error(err);
        }
      } else if (state.selectedDataSource?.value === DataSourceType.CVE_DOMAIN) {
        try {
          const response = await searchForEntitiesCVE(search);
          state.entities = []
          for (const [key, entity] of Object.entries(response)) {
            state.entities.push(entity);
          }
        } catch (err) {
          notify({
            type: 'danger',
            text: t('erros.t_errorFetching'),
            duration: 5000
          });
          console.error(err);
        }
      }
    };

    const selectEntity = async(event: any) => {
      if (state.selectedDataSource.value === DataSourceType.WIKIDATA) {
        useEntityStore().entities[event.value] = cloneDeep(defaultEntityState);
        useEntityStore().entities[event.value].id = event.value;
        if (useQueriesStore().queries.find((query) => query.id === props.queryId)) {
          // @ts-ignore
          useQueriesStore().queries.find((query) => query.id === props.queryId).entityId = event.value;
        }

      } else if (state.selectedDataSource.value === DataSourceType.SECURITY_DOMAIN) {
        useMalwaresStore().malwares[event.value] = cloneDeep(defaultMalware);
        if (useQueriesStore().queries.find((query) => query.id === props.queryId)) {
          // @ts-ignore
          useQueriesStore().queries.find((query) => query.id === props.queryId).entityId = event.value;
          const toSliceName = await getName(event.value);
          // @ts-ignore
          useQueriesStore().queries.find((query) => query.id === props.queryId).name = toSliceName.slice(1, -1);
        }
      } else if (state.selectedDataSource?.value === DataSourceType.CVE_DOMAIN) {
        useCVEStore().cves[event.value] = cloneDeep(defaultCve);
        if (useQueriesStore().queries.find((query) => query.id === props.queryId)) {
            // @ts-ignore
            useQueriesStore().queries.find((query) => query.id === props.queryId).entityId = event.value;
            // @ts-ignore
            useQueriesStore().queries.find((query) => query.id === props.queryId).name = event.value;
        }
      }
      state.isOpen = false;
      state.doneSearch = true;
      state.placeHolder = event.label;
      emit('selected', event.value);
    };

		watch(() => state.input, (value) => {
      state.isOpen = true;
      if (state.timeout) {
        clearTimeout(state.timeout);
      }
      state.timeout = setTimeout(async() => {
        state.loading = true
        await searchEntitites(value);
        state.inputValue = value;
      }, 500);
		});

		watch(() => state.inputValue, (value) => {
			emit('update:search', value);
      state.loading = false;
		});

    const isMobile = computed(() => useMobileStore().isMobile);
    const mobileWidth = computed(() => useMobileStore().getScreenSize);

    onMounted(() => {
       if (state.placeHolder !== '' || props.placeholder !== null) {
         state.doneSearch = true;
       }
    });

		return {
			...toRefs(state),
      dataSources,
      isMobile,
      mobileWidth,
      mappedEntities,
      selectEntity,
      resetInputs,
      setDataSource,
      mappedMalwares,
      mappedCves,
      getSearchedEntities
		};
	}
});
</script>

<style lang="scss">
.search-results {
  position: absolute;
  top: 38px;
  width: 100%;
  z-index: 1000;
  // 207px is 3 slots for results
  max-height: 207px;
  overflow-y: auto;
}

.search-results::-webkit-scrollbar {
  width: 16px;
}

.search-results::-webkit-scrollbar-thumb {
  background-color: map-get($app-colors, 'display-content-600');
  border: 5px solid #fff;
  border-radius: 10rem;
}

.v-popper--theme-dropdown .v-popper__arrow-container {
  display: none !important;
}
.v-popper--theme-dropdown .v-popper__popper--shown {
  width: 100% !important;
}
.v-popper--theme-dropdown .v-popper__inner {
  border: 1px solid map-get($app-colors, 'separate-content-400') !important;
  border-radius: 0.25rem !important;
}
.search-input-width {
  width: 295px;
}
.app-select-item {
  border-radius: 0;
  border: 0;
}
li {
  list-style: none;
}
</style>

<template>
  <app-box flex-type="column" class="app-carousel-item" @click="selectQuery(currentQuery.id)">
    <div :class="{'smoke': fullscreen}"></div>
    <app-box flex-type="row" class="w-100 app-bg-separate-content-0 custom-navbar my-2 query-search-height" align="space-between" align-y="center">
      <app-box flex-type="row" align-y="center">
        <app-search-input search="" :data-source-object="currentQuery.dataSource" :placeholder="currentQuery.name" @selected="collapse = true" @close="collapse = false" :query-id="currentQuery.id"/>
      </app-box>
      <app-inline gap="S">
        <app-tooltip>
          <template #icon>
            <app-btn variant="ghost" icon-only @click="triggerQuery" :disabled="!currentQuery.entityId">
              <template #icon>
                <app-icon :name="collapse ? 'app-chevron-top-pull' : 'app-chevron-down-pull'" fill="display-content-600" />
              </template>
            </app-btn>
          </template>
          <template #tooltip>
            {{ !collapse ? $t('t_openQuery') : $t('t_closeQuery') }}
          </template>
        </app-tooltip>
        <app-tooltip>
          <template #icon>
            <app-btn variant="ghost" icon-only :disabled="queries.length === 1" @click="showWarningModal = true">
              <template #icon>
                <app-icon name="app-icon-bin" fill="display-content-600" />
              </template>
            </app-btn>
          </template>
          <template #tooltip>
            {{ $t('t_deleteQuery') }}
          </template>
        </app-tooltip>
      </app-inline>
    </app-box>
    <app-collapse :is-open="collapse || currentQuery.opened">
      <app-box
          class="custom-navbar app-bg-separate-content-0 height-animation w-100 resize-query"
          :class="{'fullscreen-modal': fullscreen && !isMobile, 'fullscreen-mobile': fullscreen && isMobile}"
          :align="isLoading ? 'center' : 'left'" flex-type="row">
        <entity v-if="currentQuery.dataSource?.value === DataSourceType.WIKIDATA" :entity-id="currentQuery.entityId" />
        <malware
            v-else-if="currentQuery.dataSource?.value === DataSourceType.SECURITY_DOMAIN"
            :class="{'content': fullscreen}"
            :malware-id="currentQuery.entityId"
            :query-id="currentQuery.id"
            @fullscreen="fullscreen = !fullscreen"
            @new-query="closingEffect"/>
        <cve v-else-if="currentQuery.dataSource?.value === DataSourceType.CVE_DOMAIN"
           :class="{'content': fullscreen}"
           :cve-id="currentQuery.entityId"
           :query-id="currentQuery.id"
           @fullscreen="fullscreen = !fullscreen"
           @new-query="closingEffect" />
      </app-box>
    </app-collapse>
    <app-modal
      :show="showWarningModal"
      confirm-text="modals.t_yes"
      header-text="t_deleteQuery"
      @ok="deleteQuery(currentQuery.id)"
      @cancel="showWarningModal = false">
      <template #modal-text>
        <app-text variant="body">
          {{ $t('modals.t_deleteQuery') }}
        </app-text>
      </template>
    </app-modal>
  </app-box>
</template>

<script lang="ts">
import {computed, defineComponent, PropType, reactive, toRef, toRefs} from 'vue';
import {DataSourceType, Query, useQueriesStore} from "./store/queriesStore";
import useQueries from "./composables/useQueries";
import Entity from "../entities/Entity.vue";
import AppLoader from "@/components/main/loader/AppLoader.vue";
import {useEntityStore} from "../entities/store/entityStore";
import useEntities from "@/modules/entities/composables/useEntities";
import Malware from "@/modules/malwares/Malware.vue";
import {mappedDataSources} from "@/util/consts/dataSources";
import Cve from "@/modules/cves/Cve.vue";
import {useMobileStore} from "@/store/util/mobile";


export default defineComponent({
  name: 'Query',
  computed: {
    mappedDataSources() {
      return mappedDataSources
    }
  },
  components: {Cve, Malware, Entity, AppLoader},
  props: {
    currentQuery: {
      type: Object as PropType<Query>,
      default: false
    }
  },
  emits: ['scrollTo'],
  setup(props, {emit}) {
    const queriesStore = useQueriesStore();
    const entitiesStore = useEntityStore();

    const {queries, selectQuery} = useQueries();
    const {isLoading, entity} = useEntities();
    const state = reactive({
      collapse: false,
      showWarningModal: false,
      fullscreen: false
    });

    const closingEffect = () => {
      state.fullscreen = false;
      emit('scrollTo');
    };
    const triggerQuery = () => {
      state.collapse = !state.collapse;
      // @ts-ignore
      queriesStore.queries.find((query) => query.id === props.currentQuery.id).opened = state.collapse;
    };
    const deleteQuery = (id: string) => {
      state.showWarningModal = false;
      queriesStore.deleteQuery(id);
      emit('scrollTo');
    };

    const isMobile = computed(() => useMobileStore().isMobile);

    return {
      ...toRefs(state),
        isMobile,
      queries,
      entity,
      deleteQuery,
      selectQuery,
      triggerQuery,
      closingEffect,
      isLoading,
      entitiesStore,
      DataSourceType
    };
  }

});
</script>
<style lang="scss">
.app-carousel-item {
  height: calc(100vh - 220px);
  scroll-snap-align: center;
  margin-bottom: 150px;
}
</style>
<style scoped lang="scss">
.custom-navbar {
  border-radius: 8px;
  padding: 16px 32px;
  box-shadow: 0 3px 6px 0 rgb(0 0 0 / 5%);
  border: 1px solid map-get($app-colors, 'separate-content-400');
}
.height-animation {
  transition: height 1s ease-out;
}
.resize-query {
  // position: absolute;
  z-index: 100;
  overflow-y: auto;
  overscroll-behavior: contain;
  height: calc(100vh - 280px);
  // top: 88px;
}
.resize-query::-webkit-scrollbar {
  width: 16px;
}

.resize-query::-webkit-scrollbar-thumb {
  background-color: map-get($app-colors, 'display-content-600');
  border: 5px solid #fff;
  border-radius: 10rem;
}
.query-search-height {
  max-height: 70px;
}
.fullscreen-modal {
  padding-top: 0 !important;
  position: absolute;
  width: 1200px !important;
  top: 50px;
  left: calc(50% - 600px);
  z-index: 9000;
  height: calc(100% - 120px);
}

.fullscreen-mobile {
  position: absolute;
  width: 100%;
  z-index: 9000;
  top: 0;
  height: 100%;
}

.smoke {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  z-index: 1200;
}
.content {
  position: relative;
  z-index: 2;
}
</style>

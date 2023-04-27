<template>
  <app-box>
    <app-box :padding-bottom="items.length > NUMBER_OF_ITEMS ? 'S' : ''">
      <app-box v-for="item in cleanedItems" padding-y="S">
        <app-text :class="item.id ? 'entity-link' : ''" variant="app-paragraphLarge" @click="queryFromSearch(item.id, item.source)">
          {{ `${item.name}${item?.id ? `: ${item.id}` : ''}` }}
        </app-text>
        <app-text v-if="item.description" variant="dataCaption">
          {{ item.description }}
        </app-text>
      </app-box>
    </app-box>
    <app-box :border-top="items.length > NUMBER_OF_ITEMS ? 'box' : ''">
      <app-paginator
          v-if="items.length > NUMBER_OF_ITEMS"
          :total-rows="items.length"
          :value="NUMBER_OF_ITEMS"
          @updateCurrentPage="updateCurrentPage" />
    </app-box>
  </app-box>
</template>


<script lang="ts">
import {computed, defineComponent, PropType, reactive, toRefs} from "vue";
import useQueries from "@/modules/queries/composables/useQueries";
import {MappedInfo} from "@/modules/malwares/store/malwaresStore";
import AppPaginator from "@/components/design/AppPaginator.vue";

export default defineComponent({
  name: 'AppScrollTable',
  components: {AppPaginator},
  props: {
    items: {
      type: Array as PropType<MappedInfo[]>,
      default: null
    }
  },
  emits: ['newQuery'],
  setup(props, {emit}) {
    const state = reactive({
      currentPage: 1
    });
    const NUMBER_OF_ITEMS = 10;
    const {createQuery} = useQueries();

    const updateCurrentPage = (value: number) => {
      state.currentPage = value;
    };

    const queryFromSearch = async(id: string, source: string) => {
      await createQuery(id, source);
      emit('newQuery');
    };

    const cleanedItems = computed(() => {
      const from = (state.currentPage - 1) * NUMBER_OF_ITEMS;
      const to = from + NUMBER_OF_ITEMS;
      return props.items?.slice(from, to);
    });

    return {
      ...toRefs(state),
      updateCurrentPage,
      cleanedItems,
      createQuery,
      queryFromSearch,
      NUMBER_OF_ITEMS
    };
  }
});

</script>

<style lang="scss">
.entity-link:hover {
  color: map-get($app-colors, 'separate-content-700') !important;
  text-decoration: underline;
  cursor: pointer;
}
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
  fill: map-get($app-colors , 'display-content');
}
</style>


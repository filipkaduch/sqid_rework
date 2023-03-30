<template>
  <app-box padding="M" flex-type="row" class="height" align="space-between">
    <app-box flex-type="row">
      <app-box class="cursor-pointer" @click="pageDown">
        <app-icon
            :class="{'active-color': currentPage > 1}"
            name="app-icon-chevron-left" />
      </app-box>
      <app-box align-y="center" flex-type="row" padding-x="S" noGrow>
        <input
            v-model="currentPage"
            class="pagination-input"
            type="number"
            :min="1"
            :max="pageCount"
            @input="checkLength">
      </app-box>
      <app-box padding-right="XS" flex-type="row">
        <app-text>of {{ pageCount }}</app-text>
        <app-box class="cursor-pointer" @click="pageUp">
          <app-icon
              :class="{'active-color': currentPage < pageCount}"
              name="app-icon-chevron-right" />
        </app-box>
      </app-box>
    </app-box>
    <app-box>
      <app-box flex-type="row">
        <app-text variant="bodyMedium">{{ getItemsRangeText }}</app-text>
        <app-box padding-x="XS">
          <app-text color="display-content-300">{{ $t('table.of') }}</app-text>
        </app-box>
        <app-text>{{ totalRows }}</app-text>
        <app-box padding-left="XS">
          <app-text color="display-content-300">{{ $t('table.items') }}</app-text>
        </app-box>
      </app-box>
    </app-box>
  </app-box>
</template>


<script lang="ts">
import {computed, defineComponent, PropType, reactive, ref, toRefs, watch} from "vue";
import {MappedInfo} from "@/modules/malwares/store/malwaresStore";

export default defineComponent({
  name: 'AppPaginator',
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
  emits: ['change', 'updateCurrentPage'],
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
      /* if (typeof state.currentPage === 'string') {
        state.currentPage = parseInt(state.currentPage, 10);
      } */
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

<style lang="scss">
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


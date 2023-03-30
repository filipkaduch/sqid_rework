<template>
  <app-box flex-type="row">
    <app-box class="left-navigator my-2 mr-2 custom-navbar app-bg-separate-content-0" border="">
      <app-box padding-bottom="M" class="app-bg-separate-content-0">
        <app-text variant="app-headline3">{{ `${$t('t_Queries')} (${queries.length}):` }}</app-text>
      </app-box>
      <ul class="pl-0 query-navigation">
        <li v-for="(query, index) in queries" :key="`query-text-${index}`">
          <app-box padding-y="XS" @click="scrollToSec(query.order)">
            <app-text class="nav-item-link" :variant="currentIndex === query.order ? 'app-headline3' : 'app-paragraphLarge'">
              {{ `${index + 1}. ${query.name ? query.name : query.entityId ? query.entityId : $t('t_newQuery')}` }}
            </app-text>
          </app-box>
        </li>
      </ul>
    </app-box>
    <div class="scroll-container" ref="scrollContainer">
      <div>
        <query v-for="(query, index) in queries" :key="`query-${index}`" :current-query="query" :id="`query${index}`" @scroll-to="scrollToSec(queries.length - 1)"/>
      </div>
      <app-box class="nav-controls" flex-type="row" align="center">
        <app-tooltip>
          <template #icon>
            <app-btn variant="ghost" icon-only :disabled="currentIndex === queries.length - 1" @click="scrollToSec(currentIndex + 1)">
              <template #icon>
                <app-icon name="app-chevron-down-pull" fill="display-content-600" />
              </template>
            </app-btn>
          </template>
          <template #tooltip>
            {{ $t('t_scrollDown') }}
          </template>
        </app-tooltip>
        <app-tooltip>
          <template #icon>
            <app-btn variant="ghost" icon-only @click="addNewQuery">
              <template #icon>
                <app-icon name="app-icon-plus-sign" fill="display-content-600" />
              </template>
            </app-btn>
          </template>
          <template #tooltip>
            {{ $t('t_addQuery') }}
          </template>
        </app-tooltip>
        <app-tooltip>
          <template #icon>
            <app-btn variant="ghost" icon-only :disabled="currentIndex === 0" @click="scrollToSec(currentIndex - 1)">
              <template #icon>
                <app-icon name="app-chevron-top-pull" fill="display-content-600" />
              </template>
            </app-btn>
          </template>
          <template #tooltip>
            {{ $t('t_scrollUp') }}
          </template>
        </app-tooltip>
      </app-box>
    </div>
  </app-box>
</template>

<script lang="ts">
import Query from "../queries/Query.vue";
import {defineComponent, nextTick, onMounted, reactive, ref, toRefs} from 'vue';
import {useQueriesStore} from "../queries/store/queriesStore";
import useQueries from "../queries/composables/useQueries";
import {getName} from "@/api/malwares/sparql";
import {loadLabel} from "@/api/malwares/malwares";
import {debounce} from "lodash";
import {previewCveDatabases} from "@/api/cve/sparql";


export default defineComponent({
  name: 'Homepage',
  methods: {loadLabel, getName},
  components: {Query},
  props: {
    logged: {
      type: Boolean,
      default: false
    }
  },
  setup(props, {emit}) {
    const queriesStore = useQueriesStore();
    const {queries} = useQueries();
    const refs = ref([]);
    const state = reactive({
      currentIndex: 0,
      inMove: false
    });
    const addNewQuery = () => {
      const selectedQueryId = queriesStore.addQuery();
      // state.currentIndex += 1;
      scrollToBottom();
      // scrollToSec();
      queriesStore.selectQuery(selectedQueryId);
    };

    const scrollToSec = (toIndex: number) => {
      const query = document.getElementById(`query${toIndex}`);
      if (query) {
        query.scrollIntoView({ behavior: 'smooth' });
        state.currentIndex = toIndex;
      }
    };

    const debouncedHandler = ref(null);
    debouncedHandler.value = debounce(async (event) => {
      if (event.wheelDelta < 0 && !state.inMove) {
        await scrollToSec(state.currentIndex + 1);
      } else if (event.wheelDelta > 0 && !state.inMove) {
        await scrollToSec(state.currentIndex - 1);
      }
    }, 50);
    const handleMouseWheel = async(event: any) => {
      const isTouchPad = event.wheelDeltaY ? Math.abs(event.wheelDeltaY) <= 100 : event.deltaMode === 0;
      if (isTouchPad) {
        debouncedHandler.value(event);
      } else if (event.wheelDelta < 30 && !state.inMove) {
        await scrollToSec(state.currentIndex + 1);
      } else if (event.wheelDelta > 30 && !state.inMove) {
        await scrollToSec(state.currentIndex - 1);
      }
      event.preventDefault();
      return false;
    };

    const scrollContainer = ref(null);
    //@ts-ignore
    const easeInOutQuad = (t, b, c, d) => {
      t /= d/2;
      if (t < 1) return c/2*t*t + b;
      t--;
      return -c/2 * (t*(t-2) - 1) + b;
    };
    const scrollToBottom = (duration= 1000) => {
      if (scrollContainer.value) {
        state.currentIndex = queries.value.length;
        // @ts-ignore
        const start = scrollContainer.value.scrollTop;
        // @ts-ignore
        const change = scrollContainer.value.scrollHeight - start;
        const increment = 20;
        let currentTime = 0;

        const animateScroll = (() => {

          currentTime += increment;

          const val = easeInOutQuad(currentTime, start, change, duration);
          // @ts-ignore
          scrollContainer.scrollTop = val;

          if (currentTime < duration) {
            setTimeout(animateScroll, increment);
          }
        });

        animateScroll();
      }
    };

    onMounted(async() => {
      await previewCveDatabases();
      if (queries.value.length === 0) {
        addNewQuery();
      }
    });

    return {
      queries,
      scrollContainer,
      scrollToBottom,
      addNewQuery,
      scrollToSec,
      refs,
      handleMouseWheel,
      ...toRefs(state)
    };
  }

});
</script>

<style lang="scss" scoped>
.scroll-container {
  height: calc(100vh - 150px);
  overflow-y: hidden;
  width: 100%;
}
.query-navigation::-webkit-scrollbar, .scroll-container::-webkit-scrollbar {
  width: 16px;
}

.query-navigation::-webkit-scrollbar, .scroll-container::-webkit-scrollbar-thumb {
  background-color: map-get($app-colors, 'display-content-600');
  border: 5px solid #fff;
  height: 75%;
  border-radius: 10rem;
}
.nav-controls {
  z-index: 1000;
  position: absolute;
  bottom: 32px;
  left: calc(50% - 71px );
  padding: 8px 16px;
  background-color: map-get($app-colors, 'separate-content-0');
  border-radius: 16px;
  border: 1px solid map-get($app-colors, 'separate-content-400');
}
.left-navigator {
  width: calc(100% / 4);
  height: calc(100% - 150px);
}
.nav-item-link:hover {
  font-weight: bold;
  text-decoration: underline;
  cursor: pointer;
}
.custom-navbar {
  border-radius: 8px;
  padding: 16px 16px;
  box-shadow: 0 3px 6px 0 rgb(0 0 0 / 5%);
  border: 1px solid map-get($app-colors, 'separate-content-400');
}
.query-navigation {
  height: calc(100vh - 300px);
  overflow-y: auto;
}
</style>

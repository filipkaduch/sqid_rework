<template>
  <span>
    <app-icon name="app-chevron" v-if="reverse" />
    <app-snak-value :snak="snak" :class="{ deprecated }" :short="short" />
  </span>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from 'vue';
import {Rank, Snak} from "@/api/wikidata/types";
import AppSnakValue from "@/components/design/AppSnakValue.vue";

export default defineComponent({
  name: 'AppSnak',
  components: {AppSnakValue},
  props: {
    snak: {
      type: Object as PropType<Snak>,
      default: null
    },
    rank: {
      type: String as PropType<Rank>,
      default: 'normal'
    },
    reverse: {
      type: Boolean,
      default: false
    },
    short: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
  const deprecated = computed(() => props.rank === 'deprecated');
  const preferred = computed(() => props.rank === 'preferred');
    return {
      deprecated,
      preferred
    };
  }
});
</script>

<style lang="scss" scoped>
svg {
  margin-left: 1em;
  margin-right: 1em;
}
</style>

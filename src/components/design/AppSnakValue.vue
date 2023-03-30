<template>
  <span>
    <template v-if="snakType === 'value'">
      <app-data-value :value="snak.datavalue"
                  :propertyId="snak.property"
                  :short="short" />
    </template>
    <template v-else-if="snakType === 'somevalue'">{{ $t('entity.someValue') }}</template>
    <template v-else-if="snakType === 'novalue'">{{ $t('entity.noValue') }}</template>
    <template v-else>unknown snaktype</template>
  </span>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from 'vue';
import {Snak} from "@/api/wikidata/types";
import AppDataValue from "@/components/design/AppDataValue.vue";

export default defineComponent({
  name: 'AppSnakValue',
  components: {AppDataValue},
  props: {
    snak: {
      type: Object as PropType<Snak>,
      default: null
    },
    short: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const snakType = computed(() => props.snak.snaktype);
    return {
      snakType
    };
  }
});
</script>

<style lang="scss" scoped>
span.deprecated {
  text-decoration: line-through;
}
</style>

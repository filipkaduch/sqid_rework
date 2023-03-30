<template>
  <a class="cursor-pointer" target="_blank" @click="openNewQuery">
    {{ label }}
  </a>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, reactive, toRefs} from "vue";
import {useTermsStore} from "@/modules/entities/store/terms/termsStore";
import {i18n} from "@/plugins/all";
import {loadLabel} from "@/api/malwares/malwares";
import useQueries from "@/modules/queries/composables/useQueries";
import { DATA_SOURCES } from "@/util/consts/dataSources";

export default defineComponent({
  name: 'AppLink',
  components: {},
  props: {
    entityId: {
      type: String,
      default: null
    },
    malwareId: {
      type: String,
      default: null
    },
    queryEntityId: {
      type: String,
      default: null
    }
  },
  emits: ['newQuery'],
  setup(props, {emit}) {
    const state = reactive({
      label: ''
    });
    const {createQuery} = useQueries();
   const updateLabel = async() => {
     console.log(props.entityId);
     if (props.malwareId) {
      state.label = await loadLabel(props.malwareId);
     } else {
       state.label = await useTermsStore().getLabel({
         entityId: props.entityId,
         lang: i18n.global.locale,
       }, props.queryEntityId);
     }
    }
    const openNewQuery = async() => {
     if (props.malwareId !== null) {
       await createQuery(props.malwareId, DATA_SOURCES.SECURITY_DOMAIN);
       emit('newQuery');
     }
    };
    onMounted(async() => {
      await updateLabel();
    });
    return {
      ...toRefs(state),
      openNewQuery
    }
  }
});
</script>

<style scoped lang="scss">
a:hover {
  color: map-get($app-colors, 'display-content-700');
}
a {
  color: map-get($app-colors, 'separate-content-500');
}
</style>

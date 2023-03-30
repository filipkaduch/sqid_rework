<template>
  <a :href="descriptionUrl" target="_blank">
    <img :src="thumbUrl" />
  </a>
</template>

<script lang="ts">
import {getImageData} from '@/api/wikidata/commons';
import {ImageInfo} from '@/api/wikidata/types';
import {computed, defineComponent, onMounted, reactive, toRefs} from "vue";

export default defineComponent({
  name: 'AppImage',
  components: {},
  props: {
    file: {
      type: String,
      default: null
    },
    width: {
      type: Number,
      default: 300
    }
  },
  setup(props) {
    const state = reactive({
      imageInfo: null as ImageInfo | null
    });

    const descriptionUrl = computed(() => {
      if (state.imageInfo !== null) {
        return state.imageInfo.descriptionurl;
      }
      return undefined;
    });

    const thumbUrl = computed(() => {
      if (state.imageInfo !== null) {
        if (state.imageInfo.thumburl !== undefined) {
          return state.imageInfo.thumburl;
        }
        return state.imageInfo.url;
      }
      return undefined;
    });

    onMounted(() => {
      console.log(props.file);
      getImageData(props.file, props.width).then((info) => state.imageInfo = info);
    });
    return {
      ...toRefs(state),
      descriptionUrl,
      thumbUrl
    }
  }
});
</script>

<style scoped lang="scss">
img {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>

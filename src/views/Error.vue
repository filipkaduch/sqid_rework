<template>
    <app-box flex-type="row">
        {{ msg }}
    </app-box>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, toRefs} from 'vue';


export default defineComponent({
    name: 'Error',
    props: {
      msg: {
          type: String,
          default: 'Error'
      }
    },
    setup() {
        const state = reactive({
            currentIndex: 0,
            inMove: false
        });

        onMounted(async() => {
        });

        return {
            ...toRefs(state)
        };
    }

});
</script>

<style lang="scss" scoped>

</style>

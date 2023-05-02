<template>
    <app-box flex-type="row" class="w-100 h-100" align="center" align-y="center">
        <app-box flex-type="column" align="center" padding-top="XXL">
            <app-text variant="app-paragraphLarge">{{ msg }}</app-text>
            <img src="@/assets/images/frown.png" alt="Error">
        </app-box>
    </app-box>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, toRefs} from 'vue';


export default defineComponent({
    name: 'Error',
    props: {
      msg: {
          type: String,
          default: 'Sorry, something failed'
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

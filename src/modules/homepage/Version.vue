<template>
    <app-box flex-type="row">
        Version INFO
    </app-box>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, toRefs} from 'vue';


export default defineComponent({
    name: 'Version',
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

<template>
    <app-box flex-type="row" class="w-100 h-100">
        <app-box class="my-2 mr-2 custom-navbar app-bg-separate-content-0 w-100 h-100" :style="isMobile ? 'max-height: 100% !important;' : ''">
            <app-box border-bottom="boxHover" padding-y="S">
                <app-text variant="app-headline3">{{ $t('version.about') }}</app-text>
            </app-box>
            <app-box padding-top="L">
                <app-text variant="app-paragraphLarge">{{ $t('version.aboutInfo') }}</app-text>
            </app-box>
            <app-box padding-y="L" border-bottom="boxHover">
                <app-text variant="app-paragraphLarge"><b>{{ $t('version.author') }}</b> Filip Kadúch</app-text>
                <app-text variant="app-paragraphLarge"><b>{{ $t('version.version') }}</b> 1.0.0</app-text>
                <app-text variant="app-paragraphLarge"><b>{{ $t('version.repository') }}</b> <a href="https://github.com/filipkaduch/sqid_rework" target="_blank">https://github.com/filipkaduch/sqid_rework</a></app-text>
            </app-box>
            <app-box border-bottom="boxHover" padding-y="S">
                <app-text variant="app-headline3">{{ $t('version.documentation') }}</app-text>
            </app-box>
            <app-box padding-y="L">
                <app-text class="pl-3" variant="subheadline">{{ $t('version.docs1question') }}</app-text>
                <ol>
                    <li class="d-flex align-items-center"><app-text variant="app-paragraphLarge">{{ $t('version.docs1.1') }}<app-icon class="mx-2" name="app-chevron" fill="display-content-600" />{{ $t('version.docs1.icon') }}</app-text></li>
                    <li class="d-flex align-items-center"><app-text variant="app-paragraphLarge">{{ $t('version.docs1.2') }}<app-icon class="mx-2" name="app-search" fill="display-content-600" />{{ $t('version.docs1.3') }}</app-text></li>
                    <li class="d-block align-items-center"><app-text variant="app-paragraphLarge">{{ $t('version.docs1.4') }}</app-text>
                        <img src="@/assets/images/docs1.png" :style="isMobile ? 'width: 60vw !important;' : ''" alt="Documentation" title="Documentation 1">
                    </li>
                    <li class="d-flex align-items-center"><app-text variant="app-paragraphLarge">{{ $t('version.docs1.5') }}</app-text></li>
                </ol>
                <app-text class="pl-3" variant="subheadline">{{ $t('version.docs2question') }}</app-text>
                <ol>
                    <li class="d-flex align-items-center"><app-text variant="app-paragraphLarge">1. {{ $t('version.docs2.click') }}<app-icon class="mx-2" name="app-icon-bin" fill="display-content-600" />{{ $t('version.docs2.1') }}</app-text></li>
                    <li class="d-flex align-items-center"><app-text variant="app-paragraphLarge">2. {{ $t('version.docs2.click') }}<app-icon class="mx-2" name="app-chevron-down-pull" fill="display-content-600" />{{ $t('version.docs2.2') }}</app-text></li>
                    <li class="d-flex align-items-center"><app-text variant="app-paragraphLarge">3. {{ $t('version.docs2.3') }} <app-icon class="mx-2" name="app-icon-edit" fill="display-content-600" />{{ $t('version.docs2.4') }}</app-text></li>
                </ol>
                <app-text class="pl-3" variant="subheadline">{{ $t('version.docs3question') }}</app-text>
                <ol>
                    <li class="d-flex align-items-center"><app-text variant="app-paragraphLarge">{{ $t('version.docs3.1') }}</app-text></li>
                    <li class="d-block align-items-center"><app-text variant="app-paragraphLarge">{{ $t('version.docs3.2') }}</app-text>
                        <img src="@/assets/images/docs2.png" alt="Documentation" title="Documentation 2">
                    </li>
                    <li class="d-flex align-items-center"><app-text variant="app-paragraphLarge">3. {{ $t('version.docs2.3') }}<app-icon class="mx-2" name="app-icon-plus-sign" fill="display-content-600" />{{ $t('version.docs3.3') }}</app-text></li>
                </ol>
            </app-box>
        </app-box>
    </app-box>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, reactive, toRefs} from 'vue';
import {useMobileStore} from "@/store/util/mobile";


export default defineComponent({
    name: 'Version',
    setup() {
        const state = reactive({
            loading: false
        });

        const isMobile = computed(() => useMobileStore().isMobile);

        return {
            ...toRefs(state),
            isMobile
        };
    }

});
</script>

<style lang="scss" scoped>
.custom-navbar {
    max-height: 90vh;
    overflow-y: auto;
    border-radius: 8px;
    padding: 16px 16px;
    box-shadow: 0 3px 6px 0 rgb(0 0 0 / 5%);
    border: 1px solid map-get($app-colors, 'separate-content-400');
}
</style>

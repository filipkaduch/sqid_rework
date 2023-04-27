<template>
  <app-box flex-type="row" :class="isMobile ? 'mb-1' : 'mb-4'" class="w-auto app-bg-separate-content-0 custom-navbar d-block d-lg-flex"
     align="space-between" align-y="center">
    <app-box flex-type="row" align-y="center">
      <app-box class="h-100" v-if="!isMobile">
        <app-icon name="app-module" fill="display-content-600" />
      </app-box>
      <app-text :variant="!isMobile ? 'app-headline3' : 'app-paragraphLarge'" color="display-content-600" class="pl-2 cursor-pointer" @click="$router.push({name: 'homepage'})">
        {{ $t('t_title') }}
      </app-text>
    </app-box>
    <app-inline align-y="center">
      <app-inline-item>
        <app-btn variant="ghost" @click="$router.push({name: 'version'})">
          {{ $t('t_about') }}
        </app-btn>
      </app-inline-item>
      <app-inline-item>
        <app-dropdown class="w-100" placement="bottom-end">
          <template #triggerContent>
            <app-tooltip>
              <template #icon>
                <app-btn variant="ghost" icon-only>
                  <template #icon>
                    <app-icon name="app-language" fill="display-content-600" />
                  </template>
                </app-btn>
              </template>
              <template #tooltip>
                {{ $t('t_changeLanguage') }}
              </template>
            </app-tooltip>
          </template>
          <template #dropdownContent>
            <app-dropdown-menu :items="locales" @selected="setLocale($event.value)" />
          </template>
        </app-dropdown>
      </app-inline-item>
    </app-inline>
  </app-box>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue';
import useQueries from "../../modules/queries/composables/useQueries";
import {i18n} from "@/plugins/all";
import AppDropdown from "@/components/main/dropdown/AppDropdown.vue";
import AppDropdownMenu from "@/components/main/dropdown/AppDropdownMenu.vue";
import {useMobileStore} from "@/store/util/mobile";
const {t} = i18n.global;

export default defineComponent({
  name: 'AppNavbar',
  components: {AppDropdownMenu, AppDropdown},
  props: {
    logged: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const {queries} = useQueries();
    const locales = computed(() => [{label: 'English', value: 'en'},{label: 'Slovak', value: 'sk'}]);
    const setLocale = (locale: string) => {
      i18n.global.locale = locale;
    };
    const isMobile = computed(() => useMobileStore().isMobile);
    return {
      isMobile,
      queries,
      locales,
      setLocale
    };
  }

});
</script>

<style scoped lang="scss">
.custom-navbar {
  border-radius: 8px;
  border-top-right-radius: 0 !important;
  border-top-left-radius: 0 !important;
  padding: 16px 32px;
  box-shadow: 0 3px 6px 0 rgb(0 0 0 / 5%);
  border: 1px solid map-get($app-colors, 'separate-content-400');
  border-top: 0 !important;
  position: sticky;
  top: 0;
  z-index: 1000;
}
</style>

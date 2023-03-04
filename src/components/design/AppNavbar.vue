<template>
  <app-box flex-type="row" class="w-auto app-bg-separate-content-0 custom-navbar" align="space-between" align-y="center">
    <app-box>
      <app-text variant="app-headline2" color="display-content-600" class="cursor-pointer">
        Title
      </app-text>
    </app-box>
    <app-inline align-y="center">
      <app-inline-item>
        <app-search-input search="" />
      </app-inline-item>
      <app-inline-item>
        <app-text variant="paragraphMedium" color="display-content-600" class="cursor-pointer">
          About
        </app-text>
      </app-inline-item>
    </app-inline>
  </app-box>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'AppNavbar',
  props: {
    logged: {
      type: Boolean,
      default: false
    }
  },
  setup(props, {emit}) {
    return {};
  }

});
</script>

<style scoped lang="scss">
.custom-navbar {
  border-radius: 16px;
  padding: 8px 32px;
  box-shadow: 0 3px 6px 0 rgb(0 0 0 / 5%);
  border: 1px solid map-get($app-colors, 'display-content-200');
}
</style>

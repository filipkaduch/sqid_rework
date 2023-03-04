<template>
  <div class="app">
    <app-navbar />
  </div>
</template>
<script setup lang="ts">
import AppNavbar from "@/components/design/AppNavbar.vue";
</script>

<style scoped>
header {
  line-height: 1.5;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }
}
</style>

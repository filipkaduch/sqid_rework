<template>
  <div class="app">
    <app-navbar />
    <homepage />
    <app-notification />
  </div>
</template>
<script setup lang="ts">
import AppNavbar from "./components/design/AppNavbar.vue";
import AppNotification from "./components/main/notification/AppNotification.vue";
import Homepage from "./modules/homepage/Homepage.vue";
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

<script lang="ts" setup>
import SiteHeader from './components/SiteHeader.vue'
</script>

<template>
  <main class="shell">
    <SiteHeader />
    <router-view v-slot="{ Component, route }">
      <component :is="Component" :key="route.path" />
    </router-view>
  </main>
</template>

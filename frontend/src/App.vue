<template>
  <div id="app">
    <Toaster position="top-right" richColors closeButton expand />
    <router-view />
  </div>
</template>

<script>
import { Toaster } from 'vue-sonner';

export default {
  name: 'App',
  components: {
    Toaster,
  },
};
</script>

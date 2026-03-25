<template>
  <div id="app">
    <Toaster
  position="top-right"
  richColors
  closeButton
  expand
/>
    <nav>
      <ul>
        <li><router-link to="/">List</router-link></li>
        <li><router-link to="/new">new cocktail</router-link></li>
      </ul>
    </nav>
    <router-view />
  </div>
</template>

<script>
import { Toaster } from 'vue-sonner';

export default {
  name: 'App',
  components:{
    Toaster
  }
};
</script>


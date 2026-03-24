import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/main.css';
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';

const queryClient = new QueryClient();

const app = createApp(App);


app.use(router);
app.use(VueQueryPlugin, { queryClient });

app.mount('#app');

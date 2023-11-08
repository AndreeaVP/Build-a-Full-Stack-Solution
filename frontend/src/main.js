import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

axios.defaults.baseURL = 'http://localhost:3000';

library.add(fas);

const app = createApp(App);

app
  .use(store)
  .use(router)
  .component('font-awesome-icon', FontAwesomeIcon);

const token = localStorage.getItem('token');
const userData = localStorage.getItem('user');

if (token) {
  store.commit('setToken', token);
}
if (userData) {
  store.commit('setUser', JSON.parse(userData));
}

app.mount('#app');
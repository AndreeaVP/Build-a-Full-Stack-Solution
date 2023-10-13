import { createRouter, createWebHashHistory } from 'vue-router';
import AuthenticationPage from '../views/authentication-page.vue';
import HomePage from '../views/home-page.vue';

const routes = [
  {
    path: '/',
    name: 'login',
    component: AuthenticationPage,
  },

  {
    path: '/home',
    name: 'home', 
    component: HomePage,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

import { createRouter, createWebHashHistory } from 'vue-router';
import AuthenticationPage from '../views/authentication-page.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: AuthenticationPage,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

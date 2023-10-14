import { createRouter, createWebHashHistory } from 'vue-router';
import AuthenticationPage from '../views/authentication-page.vue';
import HomePage from '../views/home-page.vue';
import SearchPage from '../views/search-page.vue';
import NotificationPage from '../views/notification-page.vue';
import UserProfilePage from '../views/userprofile-page.vue';

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
  {
    path: '/search',
    name: 'search',
    component: SearchPage, 
  },
  {
    path: '/notification',
    name: 'notification',
    component: NotificationPage, 
  },
  {
    path: '/userprofile',
    name: 'userprofile',
    component: UserProfilePage, 
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

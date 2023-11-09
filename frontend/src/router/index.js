import { createRouter, createWebHashHistory } from 'vue-router';
import AuthenticationPage from '../views/authentication-page.vue';
import HomePage from '../views/home-page.vue';
import SearchPage from '../views/search-page.vue';
import NotificationPage from '../views/notification-page.vue';
import UserProfilePage from '../views/userprofile-page.vue';
import UsersPage from '../views/users-page.vue';

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
    path: '/userspage/:user_id',
    name: 'userspage',
    component: UsersPage, 
  },
  {
    path: '/myprofile',
    name: 'myprofile',
    component: UserProfilePage,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

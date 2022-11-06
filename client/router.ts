import Vue from 'vue';
import VueRouter from 'vue-router';
import FreetsPage from './components/Freet/FreetsPage.vue';
import SearchPage from './components/Search/SearchPage.vue';
import BookmarkPage from './components/Bookmark/BookmarkPage.vue';
import ProfilePage from './components/Profile/ProfilePage.vue';
import SettingsPage from './components/Settings/SettingsPage.vue';
import LoginPage from './components/Login/LoginPage.vue';
import NotFound from './NotFound.vue';

Vue.use(VueRouter);

const routes = [
  {path: '/', name: 'Home', component: FreetsPage},
  {path: '/search', name: 'Search', component: SearchPage},
  {path: '/bookmark', name: 'Bookmark', component: BookmarkPage},
  {path: '/profile', name: 'Profile', component: ProfilePage},
  {path: '/settings', name: 'Settings', component: SettingsPage},
  {path: '/login', name: 'Login', component: LoginPage},
  {path: '*', name: 'Not Found', component: NotFound}
];

const router = new VueRouter({routes});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  if (router.app.$store) {
    if (to.name === 'Login' && router.app.$store.state.username) {
      next({name: 'Account'}); // Go to Account page if user navigates to Login and are signed in
      return;
    }

    if (to.name === 'Account' && !router.app.$store.state.username) {
      next({name: 'Login'}); // Go to Login page if user navigates to Account and are not signed in
      return;
    }
  }

  next();
});

export default router;

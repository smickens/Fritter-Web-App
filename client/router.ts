import Vue from 'vue';
import VueRouter from 'vue-router';
import FreetsPage from './components/Freet/FreetsPage.vue';
import SearchPage from './components/Search/SearchPage.vue';
import BookmarkPage from './components/Bookmark/BookmarkPage.vue';
import ProfilePage from './components/Profile/ProfilePage.vue';
import SettingsPage from './components/Settings/SettingsPage.vue';
import LoginForm from './components/Login/LoginForm.vue';
import RegisterForm from './components/Login/RegisterForm.vue';
import FollowsPage from './components/Profile/FollowsPage.vue';
import NotFound from './NotFound.vue';

Vue.use(VueRouter);

const routes = [
  {path: '/', name: 'Home', component: FreetsPage},
  {path: '/browse', name: 'Browse', component: SearchPage},
  {path: '/saved', name: 'Saved', component: BookmarkPage},
  {path: '/profile', name: 'Profile', component: ProfilePage},
  {path: '/follows', name: 'Follows', component: FollowsPage},
  {path: '/settings', name: 'Settings', component: SettingsPage},
  {path: '/login', name: 'Login', component: LoginForm},
  {path: '/register', name: 'Register', component: RegisterForm},
  {path: '*', name: 'Not Found', component: NotFound}
];

const router = new VueRouter({routes});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);

  if (router.app.$store) {
    if (to.name === 'Login' && router.app.$store.state.username) {
      next({name: 'Profile'}); // Go to Account page if user navigates to Login and are signed in
      return;
    }

    if (to.name === 'Register' && router.app.$store.state.username) {
      next({name: 'Profile'}); // Go to Account page if user navigates to Register and are signed in
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

<template>
  <div class="sidebar">
    <div class="top">
      <img src="../../public/logo.svg">
      <h1 class="title">
        Fritter
      </h1>
    </div>
    <div class="middle">
      <router-link 
        to="/"
        :class="{ 'selected':(isOnHome) }"
      >
        <img :src="getHomeIcon()" class="icon">
        Home
      </router-link>
      <router-link
        to="/browse"
        :class="{ 'selected':(isOnBrowse) }"
      >
        <img :src="getSearchIcon()" class="icon">
        Browse
      </router-link>
      <router-link
        v-if="$store.state.username"
        to="/saved"
        :class="{ 'selected':(isOnSaved) }"
      >
        <img :src="getBookmarkIcon()" class="icon">
        Saved
      </router-link>
      <router-link
        v-if="$store.state.username"
        to="/profile"
        :class="{ 'selected':(isOnProfile) }"
      >
        <img :src="getUserIcon()" class="icon">
        Profile
      </router-link>
      <router-link
        v-else
        to="/login"
        :class="{ 'selected':(isOnLogin) }"
      >
        <img :src="getLoginIcon()" class="icon">
        Login
      </router-link>
    </div>

    <section class="alerts">
      <article
        v-for="(status, alert, index) in $store.state.alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </div>
</template>

<script>
export default {
  name: 'SideBar',
  methods: {
    getHomeIcon() {
      return this.isOnHome ? './assets/home_filled.png' : './assets/home_outline.png';
    },
    getSearchIcon() {
      return this.isOnBrowse ? './assets/search_bold.png' : './assets/search.png';
    },
    getBookmarkIcon() {
      return this.isOnSaved ? './assets/bookmark_filled_dark.png' : './assets/bookmark_outline_dark.png';
    },
    getUserIcon() {
      return this.isOnProfile ? './assets/user_filled.png' : './assets/user_outline.png';
    },
    getLoginIcon() {
      return this.isOnLogin ? './assets/login_filled.png' : './assets/login_outline.png';
    }
  },
  computed: {
    isOnHome() {
      return this.$route.path === '/';
    },
    isOnBrowse() {
      return this.$route.path === '/browse';
    },
    isOnSaved() {
      return this.$route.path === '/saved';
    },
    isOnProfile() {
      return this.$route.path === '/profile' || this.$route.path === '/follows' || this.$route.path === '/settings';
    },
    isOnLogin() {
      return this.$route.path === '/login' || this.$route.path === '/register';
    }
  }
}
</script>

<style scoped>
.sidebar {
  height: 100%;
  width: 280px;
  position: fixed;
  left: 50;
  top: 0;
  padding-top: 50px;
  padding-left: 50px;
  background-color: #DAF0EE;
}

.sidebar div {
  padding: 8px;
}

.title {
  font-size: 32px;
  margin: 0 5px;
  font-weight: 600;
  letter-spacing: 1px;
  color: #3B413C;
}

.top {
  margin-bottom: 60px;
}

img {
  height: 32px;
  filter: invert(20%) sepia(13%) saturate(286%) hue-rotate(78deg) brightness(102%) contrast(88%);
}

.middle {
	display: flex;
  flex-direction: column;
  margin-bottom: 30px;
}

.middle a {
  font-size: 24px;
  margin-bottom: 15px;
  text-decoration: none;
  color: #3B413C;
}

.selected {
  font-weight: 500;
}

.icon {
  margin-bottom: -7px;
  padding-right: 10px;
  scale: 0.9;
}

.alerts {
  width: 25%;
}
</style>

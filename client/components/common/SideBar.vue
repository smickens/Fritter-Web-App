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
        :class="{ 'selected':($route.path=== '/') }"
      >
        <img :src="getHomeIcon()" class="icon">
        Home
      </router-link>
      <router-link
        to="/search"
        :class="{ 'selected':($route.path === '/search') }"
      >
        <img :src="getSearchIcon()" class="icon">
        Search
      </router-link>
      <router-link
        v-if="$store.state.username"
        to="/bookmark"
        :class="{ 'selected':($route.path === '/bookmark') }"
      >
        <img :src="getBookmarkIcon()" class="icon">
        Bookmarks
      </router-link>
      <router-link
        v-if="$store.state.username"
        to="/profile"
        :class="{ 'selected':($route.path === '/profile') }"
      >
        <img :src="getUserIcon()" class="icon">
        Profile
      </router-link>
      <router-link
        v-else
        to="/login"
        :class="{ 'selected':($route.path === '/login') }"
      >
        <img :src="getLoginIcon()" class="icon">
        Login
      </router-link>
    </div>

    <!-- <div v-if="$store.state.username">
      <p>Signed in as @{{$store.state.username}}</p>
    </div> -->

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
      if (this.$route.path === '/') {
        return './assets/home_filled.png';
      }
      return './assets/home_outline.png';
    },
    getSearchIcon() {
      if (this.$route.path === '/search') {
        return './assets/search_bold.png';
      }
      return './assets/search.png';
    },
    getBookmarkIcon() {
      if (this.$route.path === '/bookmark') {
        return './assets/bookmark_filled.png';
      }
      return './assets/bookmark_outline.png';
    },
    getUserIcon() {
      if (this.$route.path === '/profile') {
        return './assets/user_filled.png';
      }
      return './assets/user_outline.png';
    },
    getLoginIcon() {
      if (this.$route.path === '/login') {
        return './assets/login_filled.png';
      }
      return './assets/login_outline.png';
    }
  }
}
</script>

<style scoped>
.sidebar {
  height: 100%;
  width: 250px;
  position: fixed;
  left: 50;
  top: 0;
  padding-top: 40px;
  border-right: solid #3B413C;
  padding-left: 30px;
}

.sidebar div {
  padding: 8px;
}

.title {
  font-size: 32px;
  margin: 0 5px;
  font-weight: 600;
  letter-spacing: 1px;
}

.top {
  margin-bottom: 60px;
}

img {
  height: 32px;
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
  color: #9DB5B2;
}

.selected {
  font-weight: 600;
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

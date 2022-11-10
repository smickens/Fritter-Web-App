import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various components.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    bookmarkFilter: null, // Tag to filter shown bookmarks by (null = show all)
    freets: [], // All freets created in the app
    username: null, // Username of the logged in user
    user: null,
    personas: [],
    bookmarks: [],
    followers: [],
    following: [],
    alerts: {} // global success/error messages encountered during submissions to non-visible forms
  },
  getters: {
    bookmarkFreetIds(state) {
      if (!state.bookmarks) {
        return [];
      }
      const filteredBookmarks = state.bookmarks.filter(bookmark => {
        return bookmark.freetId;
      });
      return filteredBookmarks.map(bookmark => {
        return bookmark.freetId._id
      })
    },
    bookmarkFreets(state) {
      return state.bookmarks.map(bookmark => {
        return bookmark.freetId 
      });
    },
    activePersonas(state) {
      if (!state.personas) {
        return [];
      }
      return state.personas.filter(persona => {
        return persona.isActive
      })
    },
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUser(state, user) {
      /**
       * Update the stored user to the specified one.
       * @param user - new object to set
       */
      state.user = user;
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? `/api/users/${state.filter}/freets` : '/api/freets';
      const res = await fetch(url).then(async r => r.json());
      state.freets = res;
    },
    updateBookmarkFilter(state, filter) {
      /**
       * Update the stored bookmarks filter to the specified one.
       * @param filter - Tag to filter tags by
       */
      state.bookmarkFilter = filter;
    },
    async refreshBookmarks(state) {
      /**
       * Request the server for the current user's bookmarks.
       */
      const url = state.bookmarkFilter ? `/api/bookmarks?tag=${state.bookmarkFilter}` : '/api/bookmarks';
      const res = await fetch(url).then(async r => r.json());
      state.bookmarks = res;
    },
    updateBookmarks(state, bookmarks) {
      /**
       * Update the stored bookmarks to the provided bookmarks.
       * @param bookmarks - Bookmarks to store
       */
      state.bookmarks = bookmarks;
    },
    async refreshFollows(state) {
      /**
       * Request the server for the current user's bookmarks.
       */
      const res = await fetch('/api/follows').then(async r => r.json());
      state.following = res;
    },
    async refreshFollowers(state) {
      /**
       * Request the server for the current user's bookmarks.
       */
      const res = await fetch('/api/follows/followers').then(async r => r.json());
      state.followers = res;
    },
    async refreshPersonas(state) {
      /**
       * Request the server for the current user's bookmarks.
       */
      const res = await fetch('/api/personas').then(async r => r.json());
      state.personas = res;
    },
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;

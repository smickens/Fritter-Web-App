<!-- Page for account sign-in and registration -->
<!-- User should be NOT authenticated in order to see this page -->

<template>
  <section>
    <header>
      <h3>Search {{titleText}}</h3>
    </header>
    <div class="flex-container">
        <input
          class="search-bar"
          :value="searchText"
          type="search"
          :placeholder="placeholderText"
          @input="searchText = $event.target.value"
          autocomplete="off"
        >
      <button class="search-btn" @click="submit()"><img src="../../public/assets/search_white_icon.png" alt=""></button>
    </div>
  </section>
</template>

<script>

export default {
  name: 'SearchBar',
  data() {
    return {
      searchText: ''
    };
  },
  props: {
    titleText: {
      type: String,
      default: 'Search'
    },
    placeholderText: {
      type: String,
      default: 'Type something...'
    }
  },
  methods: {
    async submit() {
      this.$store.state.filter = this.searchText

      const url = this.searchText ? `/api/freets?author=${this.searchText}` : '/api/freets';
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.$store.commit('updateFilter', this.searchText);
        this.$store.commit('updateFreets', res);
      } catch (e) {
        if (this.searchText === this.$store.state.filter) {
          // This section triggers if you filter to a user but they
          // change their username when you refresh
          this.$store.commit('updateFilter', null);
          this.searchText = ''; // Clear filter to show all users' freets
          this.$store.commit('refreshFreets');
        } else {
          // Otherwise reset to previous fitler
          this.searchText = this.$store.state.filter;
        }

        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
.flex-container {
  display: flex;
  margin-bottom: 20px;
}

.search-bar {
  flex: 1;
  border: none;
  border-radius: 20px;
  background-color: #F0F0F0;
  padding: 10px 20px;
}

.search-btn img {
  scale: 0.8;
}

.search-btn {
  margin-left: 10px;
  background-color: #9DB5B2;
  border: none;
  border-radius: 20px;
}

.search-btn:hover {
  opacity: 0.8;
}

.search-btn:active {
  opacity: 0.6;
}

</style>
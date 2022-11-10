<!-- Page for account sign-in and registration -->
<!-- User should be NOT authenticated in order to see this page -->

<template>
  <main>
    <header>
      <SearchBar 
        @searched="handleSearch" 
        placeholderText="Search by author..."
      />
      <section
        v-if="Object.keys(alerts).length"
      >
        <article
          class="search-alerts"
          v-for="(status, alert, index) in alerts"
          :key="index"
          :class="status"
        >
          <p>{{ alert }}</p>
        </article>
      </section>
      <article
        v-else
        class="placeholder"
      >
        <!-- keeps spacing when there's no alert to display -->
        <p>placeholder</p>
      </article>
    </header>
    <section
      v-if="$store.state.freets.length"
    >
      <FreetComponent
        v-for="freet in $store.state.freets"
        :key="freet.id"
        :freet="freet"
      />
    </section>
    <article
      v-else
    >
      <h3 v-if="searchAuthor != ''">
        No freets found from author <span>{{ searchAuthor }}</span>
      </h3>
      <h3 v-else-if="!searching"> 
        No freets found
      </h3>
    </article>
  </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import GetFreetsForm from '@/components/Freet/GetFreetsForm.vue';
import SearchBar from '@/components/common/SearchBar.vue';

export default {
  name: 'SearchPage',
  components: {
    FreetComponent,
    SearchBar,
    GetFreetsForm
  },
  data() {
    return {
      searching: false,
      searchAuthor: '',
      alerts: {}
    };
  },
  methods: {
    async handleSearch(value) {
      // clear old alerts
      this.alerts = {};
      this.searching = true;

      // if (value.trim().length === 0) {
      //   // cannot search for empty string
      //   const e = ('status', 'empty_text_alert', 'Search text for author name cannot be empty');
      //   this.$set(this.alerts, e, 'error');
      //   setTimeout(() => this.$delete(this.alerts, e), 3000);
      //   return;
      // }

      this.searchAuthor = value;

      this.$store.state.filter = this.searchAuthor;

      const url = this.searchAuthor ? `/api/freets?author=${this.searchAuthor}` : '/api/freets';
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.searching = false;

        this.$store.commit('updateFilter', this.searchAuthor);
        this.$store.commit('updateFreets', res);
      } catch (e) {
        this.searching = false;

        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  },
  mounted() {
    this.$store.state.filter = '';
    this.$store.commit('refreshFreets');
    this.$store.commit('refreshBookmarks');
    this.$store.commit('refreshFollows');
  }
};
</script>

<style scoped>
.search-alerts {
  color: red;
  font-size: small;
}

.search-alerts p {
  margin: 8px 0px 10px 20px; /* top, right, bottom, left */
}

.placeholder p {
  opacity: 0;
  font-size: small;
  margin: 8px 0px 10px 20px; /* top, right, bottom, left */
}

h3 {
  text-align: center;
}

h3 span {
  color: #9DB5B2;
  font-weight: 500;
}
</style>
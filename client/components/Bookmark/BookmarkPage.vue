<!-- Page for account sign-in and registration -->
<!-- User should be NOT authenticated in order to see this page -->

<template>
  <main>
    <SearchBar 
      titleText="Bookmarks"
      placeholderText="Search by tag..."
    />
    <section>
      <FreetComponent
        v-for="freet in bookmarkFreets"
        :key="freet.id"
        :freet="freet"
      />
    </section>
  </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import SearchBar from '@/components/common/SearchBar.vue';

export default {
  name: 'SearchPage',
  components: {
    FreetComponent,
    SearchBar
  },
  computed: {
    bookmarkFreets() {
      return this.$store.state.bookmarks.map(bookmark => { return bookmark.freetId });
    }
  },
  mounted() {
    this.$store.state.filter = '';
    this.$store.commit('refreshBookmarks');
  }
};
</script>

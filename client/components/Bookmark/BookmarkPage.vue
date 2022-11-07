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
  name: 'BookmarkPage',
  components: {
    FreetComponent,
    SearchBar
  },
  computed: {
    // TODO: should this not be computed, does a weird two load thing where first time populate hasn't seem to have ran and then it comes in very shortly after 
    bookmarkFreets() {
      var userBookmarks = this.$store.state.bookmarks.map(bookmark => { return bookmark.freetId });      
      userBookmarks.forEach(bookmark => {
        bookmark.author = bookmark.authorId ? bookmark.authorId.username : 'Error';
        bookmark.authorId = bookmark.authorId ? bookmark.authorId._id : 'Error';
        bookmark.likedBy = bookmark.likedBy ? bookmark.likedBy.map(like => { return like.userId ? like.userId.username : like }) : [];
      });
      return userBookmarks;
    }
  },
  mounted() {
    this.$store.state.filter = '';
    this.$store.commit('refreshBookmarks');
  }
};
</script>

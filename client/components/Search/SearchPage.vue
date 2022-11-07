<!-- Page for account sign-in and registration -->
<!-- User should be NOT authenticated in order to see this page -->

<template>
  <main>
    <header>
      <SearchBar 
        titleText="Freets"
        placeholderText="Search by author..."
      />
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
      <h3>No freets found.</h3>
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
  mounted() {
    this.$store.state.filter = '';
    this.$store.commit('refreshFreets');
  }
};
</script>

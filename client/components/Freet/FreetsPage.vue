<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username" class="create-freet">
      <header>
        <h2>Welcome @{{ $store.state.username }}</h2>
      </header>
      <CreateFreetForm />
    </section>
    <section v-else>
      <header>
        <h2>Welcome to Fritter!</h2>
      </header>
      <article>
        <h4>
          <router-link to="/login">Sign in</router-link>
          to create your own and save freets.
        </h4>
      </article>
    </section>
    <section>
      <header class="freet-header">
        <h3>{{ $store.state.username ? 'Freet Feed' : 'All Freets' }}</h3>
        <h5 v-if="$store.state.username && $store.getters.activePersonas.length">Active Personas - {{ activePersonasNames.join(', ') }}</h5>
      </header>
      <section
        v-if="userFeed.length"
      >
        <FreetComponent
          v-for="freet in userFeed"
          :key="freet.id"
          :freet="freet"
        />
      </section>
      <article
        v-else
      >
        <p>{{ noFreetsInFeedErroMessage }}</p>
      </article>
    </section>
  </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import CreateFreetForm from '@/components/Freet/CreateFreetForm.vue';

export default {
  name: 'FreetPage',
  components: {FreetComponent, CreateFreetForm},
  mounted() {
    this.$store.state.filter = '';
    this.$store.commit('refreshFreets');
    if (this.$store.state.username) { //user is logged in
      this.$store.commit('refreshBookmarks');
      this.$store.commit('refreshFollows');
      this.$store.commit('refreshPersonas');
    }
  },
  computed: {
    activePersonasNames() {
      var active = [];
      this.$store.state.personas.map(persona => {
        if (persona.isActive) {
          active.push(persona.name);
        }
      })
      return active
    },
    userFeed() {
      // If user isn't signed in, then return all freets
      if (!this.$store.state.username) {
        return this.$store.state.freets;
      }

      // If no personas selected, then all accounts followed by this user and their own posts should come up
      var feedFollows = this.$store.state.following;
      const activePersonasIds = this.$store.getters.activePersonas.map(persona => { return persona.id });

      if (feedFollows.length > 0 && activePersonasIds.length > 0) {
        const filteredFollows = this.$store.state.following.filter(follow => {
          const validPersonaId = follow.personaId ? follow.personaId.id : null;
          if (validPersonaId && activePersonasIds.includes(validPersonaId)) {
            return follow;
          }
        })
        feedFollows = filteredFollows;
      }

      const acceptableUsernames = feedFollows.map(follow => {
        return follow.friendUsername;
      })

      if (activePersonasIds.length == 0) {
        // no persona(s) selected, then also include self username
        acceptableUsernames.push(this.$store.state.username);
      }

      return this.$store.state.freets.filter(freet => {
        return acceptableUsernames.includes(freet.author);
      }) 
    },
    noFreetsInFeedErroMessage() {
      return this.$store.state.following.length == 0 ? 'No freets found since you are not following any other users. Go to the browse page to explore freets and find other users to follow.' : (this.$store.getters.activePersonas.length > 0 ? 'No freets found under the current persona(s): ' + this.activePersonasNames.join(', ') + '. Go to your profile and view who you are following to edit what persona their posts show up under.' : 'No freets found');
    }
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

header, header > * {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header h2 {
  font-weight: 400;
}

header h3, h5 {
  margin-bottom: 10px;
}

button {
  margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}

.freet-header {
  display: flex;
  align-items: center;
}

article p {
  font-size: smaller;
}
</style>

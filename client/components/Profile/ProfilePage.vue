<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2 class="title">@{{ $store.state.username }}</h2>
        <router-link to="/settings" custom v-slot="{ navigate }">
          <button @click="navigate" role="link">Settings</button>
        </router-link>
      </header>
      <div class="follows-text">
        <p>{{ $store.state.followers.length }} Followers</p>
        <p>{{ $store.state.following.length }} Following</p>
        <button @click="toggleShowingFollows()">{{ viewingFollows ? 'Hide' : 'View' }}</button>
      </div>
    </section>
    <div v-if="viewingFollows">
      <FollowsPage />
    </div>
    <div v-else>
      <section>
      <h3>My Personas</h3>
      <!-- <section
        v-if="$store.state.personas.length"
      >
        <FreetComponent
          v-for="persona in $store.state.personas"
          :key="persona.id"
          :freet="freet"
        />
      </section>
      <section
        v-else
      >
        You haven't created any personas yet. Type below to create your first one!
      </section> -->
    </section>
    <section>
      <h3>My Freets</h3>
      <section
        v-if="ownFreets.length"
      >
        <FreetComponent
          v-for="freet in ownFreets"
          :key="freet.id"
          :freet="freet"
        />
      </section>
      <section
        v-else
      >
        You haven't posted any freets yet. Go to the home page to post your first freet!
      </section>
    </section>
    </div>
  </main>
</template>

<script>
import ChangeUsernameForm from '@/components/Settings/ChangeUsernameForm.vue';
import ChangePasswordForm from '@/components/Settings/ChangePasswordForm.vue';
import DeleteAccountForm from '@/components/Settings/DeleteAccountForm.vue';
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import FollowsPage from '@/components/Profile/FollowsPage.vue';

export default {
  name: 'ProfilePage',
  components: {
    ChangeUsernameForm,
    ChangePasswordForm,
    DeleteAccountForm,
    FreetComponent,
    FollowsPage
  },
  data() {
    return {
      viewingFollows: false, // Whether or not this freet is in edit mode
      alerts: {}, // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    toggleShowingFollows() {
      this.viewingFollows = !this.viewingFollows;
    }
  },
  computed: {
    ownFreets() {
      return this.$store.state.freets.filter(freet => { 
        return freet.author === this.$store.state.username
      });
    }
  },
  mounted() {
    this.$store.commit('refreshFollows');
    this.$store.commit('refreshFollowers');
  }
};
</script>

<style scoped>
.title {
  font-weight: 400;
  margin: 0px;
}

header {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

header img {
  width: 30px;
  height: 30px;
}

.follows-text {
  display: flex;
  margin: 20px 0px;
}

.follows-text p {
  font-size: medium;
  padding-right: 10px;
  margin: 0px;
}
</style>
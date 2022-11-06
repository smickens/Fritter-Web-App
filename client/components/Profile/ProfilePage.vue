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
        <p>10 Followers</p>
        <p>16 Following</p>
      </div>
    </section>
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
  </main>
</template>

<script>
import ChangeUsernameForm from '@/components/Settings/ChangeUsernameForm.vue';
import ChangePasswordForm from '@/components/Settings/ChangePasswordForm.vue';
import DeleteAccountForm from '@/components/Settings/DeleteAccountForm.vue';
import FreetComponent from '@/components/Freet/FreetComponent.vue';

export default {
  name: 'ProfilePage',
  components: {
    ChangeUsernameForm,
    ChangePasswordForm,
    DeleteAccountForm,
    FreetComponent
  },
  computed: {
    ownFreets() {
      return this.$store.state.freets.filter(freet => { 
        return freet.author === this.$store.state.username
      });
    }
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
}

.follows-text p {
  font-size: medium;
  padding-right: 10px;
}
</style>
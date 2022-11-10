<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2 class="title">@{{ $store.state.username }}</h2>
      </header>
      <div class="follows-text">
        <p>{{ $store.state.followers.length }} Followers</p>
        <p>{{ $store.state.following.length }} Following</p>
        <router-link to="/profile" custom v-slot="{ navigate }">
          <button @click="navigate" role="link">Hide</button>
        </router-link>
      </div>
    </section>
    <div>
      <section>
        <div class="two-column">
          <section class="column">
            <h3>Followers</h3>
            <div
              v-for="follow in $store.state.followers"
              :key="follow.id"
            >
              <p>@{{follow.username}}</p>
            </div>
          </section>
          <section class="column">
            <h3>Following</h3>
            <FollowComponent
              v-for="follow in $store.state.following"
              :key="follow.id"
              :follow="follow"
              :isFollower=false
            />
          </section>
        </div>
      </section>
    </div>
  </main>
</template>

<script>
import FollowComponent from '@/components/Profile/FollowComponent.vue';

export default {
  name: 'FollowsPage',
  components: {
    FollowComponent
  },
  data() {
    return {
      editingPersona: false,
      alerts: {}, // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    startEditingPersona() {
      this.editingPersona = true;
    },
    stopEditingPersona() {
      this.editingPersona = false;
    },
    editPersona(follow, personaName) {
      console.log("update follow's persona id")
      // follow.personaId =   

      const params = {
        method: 'PATCH',
        message: 'Successfully edited follow\'s persona!',
        body: JSON.stringify({name: personaName}),
        callback: () => {
          stopEditingPersona();
          this.$store.commit('refreshFollows');

          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(`follows/${follow.friendId}`, params);

    },
    removeFollow(follow) {
      /**
       * Remove follow
       */
      const params = {
        method: 'DELETE',
        message: 'Successfully unfollowed!',
        callback: () => {
          this.$store.commit('refreshFollows');

          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(`follows/${follow.friendId}`, params);
    },
    async request(path, params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/${path}`, options);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
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

.follows-text {
  display: flex;
  margin: 20px 0px;
}

.follows-text p {
  font-size: medium;
  padding-right: 10px;
  margin: 0px;
}

.two-column {
  display: flex;
  justify-content: space-evenly;
  text-align: left;
}

.column {
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  flex: 1;
}

.column div {
  display: flex;
  justify-content: space-between;
  background-color: #F0F0F0;
  margin-bottom: 10px;
  padding: 5px 10px;
  border-radius: 10px ;
  margin-right: 20px;
  align-items: center;
}

.column div p {
  margin: 5px 0px;
  padding-right: 15px;
}
</style>

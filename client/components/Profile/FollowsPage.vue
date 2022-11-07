<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <div class="two-column">
    <section class="column">
      <h3>Followers</h3>
      <div
        v-for="follow in $store.state.followers"
        :key="follow.id"
        :freet="follow"
      >
        <p>@{{follow.username}}</p>
      </div>
    </section>
    <section class="column">
      <h3>Following</h3>
      <div
        v-for="follow in $store.state.following"
        :key="follow.id"
        :freet="follow"
      >
        <p>@{{follow.friendUsername}}</p>
        <button @click="removeFollow(follow)">x</button>
      </div>
    </section>
  </div>
</template>

<script>

export default {
  name: 'FollowsPage',
  data() {
    return {
      alerts: {}, // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
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

.column p {
  margin: 0px;
  padding-right: 15px;
}

.column div {
  display: flex;
  justify-content: space-between;
  background-color: #F0F0F0;
  margin-bottom: 10px;
  padding: 5px 10px;
  border-radius: 10px ;
  margin-right: 20px;
}
</style>

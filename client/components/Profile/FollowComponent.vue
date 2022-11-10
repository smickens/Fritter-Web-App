<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <div class="follow">
    <p>@{{follow.friendUsername}}</p>

    <div>
      <span v-if="!editingPersona">{{ followPersonaName }}</span>
      <div v-if="editingPersona">
        <select @change="selectedPersona = $event.target.value">
          <option 
            value="None"
            :selected="'None' == followPersonaName"
          >
            None
          </option>
          <option 
            v-for="option in $store.state.personas" 
            :key="option.id"
            :value="option.name"
            :selected="option.name == followPersonaName"
          >
            {{option.name}}
          </option>
        </select>
        <button @click="editPersona()">&#x2713;</button>
        <button @click="stopEditingPersona()">&#x2715;</button>
      </div>
      <button v-else @click="startEditingPersona">&#x270E;</button>

      <button v-if="!editingPersona" @click="removeFollow(follow)">&#128465;</button>
    </div>
  </div>
</template>
<script>

export default {
  name: 'FollowComponent',
  props: {
    // Data from the stored freet
    follow: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editingPersona: false,
      selectedPersona: '',
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
    editPersona() {
      if (this.selectedPersona == "None") {
        // Remove persona for this follow
        const params = {
          method: 'DELETE',
          message: 'Successfully removed follow\'s persona!',
          callback: () => {
            this.stopEditingPersona();
            this.$store.commit('refreshFollows');

            this.$set(this.alerts, params.message, 'success');
            setTimeout(() => this.$delete(this.alerts, params.message), 3000);
          }
        };
        this.request(`follows/${this.follow.friendId}/persona`, params);
      } else {
        // Update persona for this follow
        const params = {
          method: 'PATCH',
          message: 'Successfully edited follow\'s persona!',
          body: JSON.stringify({name: this.selectedPersona}),
          callback: () => {
            this.stopEditingPersona();
            this.$store.commit('refreshFollows');

            this.$set(this.alerts, params.message, 'success');
            setTimeout(() => this.$delete(this.alerts, params.message), 3000);
          }
        };
        this.request(`follows/${this.follow.friendId}`, params);
      }
    },
    removeFollow() {
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
      this.request(`follows/${this.follow.friendId}`, params);
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
  },
  computed: {
    followPersonaName() {
      return this.follow.personaId ? this.follow.personaId.name : 'None';
    }
  }
};
</script>

<style scoped>
.follow {
  display: flex;
  justify-content: space-between;
  background-color: #F0F0F0;
  margin-bottom: 10px;
  padding: 5px 10px;
  border-radius: 10px ;
  margin-right: 20px;
  align-items: center;
}

.follow p {
  margin: 5px 0px;
  padding-right: 15px;
}

.follow div div {
  margin: 0px;
}

.follow button {
  margin-left: 10px;
}

.follow span {
  font-size: medium;
}
</style>

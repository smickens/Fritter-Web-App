<!-- Page for account sign-in and registration -->
<!-- User should be NOT authenticated in order to see this page -->

<template>
  <section class="personas">
    <div v-if="$store.state.personas.length">
      <div
        class="persona"
        v-for="persona in $store.state.personas"
        :key="persona.id"
      >
        <div>
          <input 
            type="checkbox"
            :id="persona.id"
            :name="persona.name"
            :value="persona.name"
            :checked="persona.isActive"
            @change="onChange(persona, $event.target.checked)"
          >
          <label :for="persona.id">{{persona.name}}</label>
        </div>
        <button @click="removePersona(persona)">x</button>
      </div>
    </div>
    <div
      v-else
    >
      <p>You haven't created any personas yet. Click below to create your first one!</p>
    </div>
    <div v-if="addingPersona">
      <input type="text" 
            :value="newPersona"
            @input="newPersona = $event.target.value"
      >
      <button @click="addPersona()">Save</button>
      <button @click="stopAddingPersona()">Cancel</button>
    </div>
    <button v-else @click="startAddingPersona">+ Add</button>
  </section>
</template>

<script>
export default {
  name: 'PersonasComponent',
  data() {
    return {
      addingPersona: false,
      newPersona: '',
      alerts: {}, // Displays success/error messages encountered during freet modification
    }
  },
  methods: {
    onChange(persona, checked) {
      this.updatePersonaActiveState(persona.id, checked)
    },
    updatePersonaActiveState(personaId, isActive) {
      const params = {
        method: 'PATCH',
        message: 'Successfully updated persona!',
        body: JSON.stringify({isActive: isActive}),
        callback: () => {
          this.$store.commit('refreshPersonas');

          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(`personas/${personaId}`, params);
    },
    startAddingPersona() {
      this.addingPersona = true;
    },
    stopAddingPersona() {
      this.newPersona = '';
      this.addingPersona = false;
    },
    addPersona() {
      /**
       * Add tag to bookmark
       */
      const params = {
        method: 'POST',
        message: 'Successfully added persona!',
        body: JSON.stringify({name: this.newPersona}),
        callback: () => {
          this.stopAddingPersona()

          this.$store.commit('refreshPersonas');

          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(`personas/`, params);
    },
    removePersona(persona) {
      /**
       * Remove tag from bookmark
       */
      if (confirm("Are you sure you want to remove persona, " + persona.name + "?")) {
        const params = {
          method: 'DELETE',
          message: 'Successfully removed persona!',
          callback: () => {
            this.$store.commit('refreshPersonas');

            this.$set(this.alerts, params.message, 'success');
            setTimeout(() => this.$delete(this.alerts, params.message), 3000);
          }
        };
        this.request(`personas/${persona.name}`, params);
      }
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
.personas {
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  flex: 1;
  max-width: 250px;
}

.persona {
  display: flex;
  justify-content: space-between;
  background-color: #F0F0F0;
  margin-bottom: 10px;
  padding: 5px 10px;
  border-radius: 10px ;
}

.persona label {
  padding-left: 5px;
}

.persona span {
  display: none;
}

.persona:hover span {
  display: inline-block;
}

p {
  font-size: smaller;
  margin-top: 0px;
}
</style>
<!-- Form for registering an account (block style) -->

<!-- Form for signing in (block style) -->

<template>
  <div class="create-account">
    <form @submit.prevent="submit">
      <h3>CREATE ACCOUNT</h3>
      <article>
        <div>
          <input
            type="text"
            name="username"
            :value="username"
            @input="username = $event.target.value"
            placeholder="Username"
          >
        </div>
        <div>
          <input
            type="password"
            name="password"
            :value="password"
            @input="password = $event.target.value"
            placeholder="Password"
          >
        </div>
      </article>
      <button class="enter-btn">ENTER</button>
    </form>
    <router-link to="/login">Have an account? Sign In</router-link>
    <section class="create-account-alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </div>
</template>

<script>

export default {
  name: 'RegisterForm',
  data() {
    return {
      username: '',
      password: '',
      alerts: {}, // Displays success/error messages encountered during form submission
    };
  },
  methods: {
    submit() {
      const params = {
        method: 'POST',
        message: 'Successfully created account!',
        body: JSON.stringify({username: this.username, password: this.password})
      };
      this.request(`users/`, params);
    },
    async request(path, params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, 
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin' // Sends express-session credentials with request
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/${path}`, options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        const text = await r.text();
        const res = text ? JSON.parse(text) : {user: null};
        this.$store.commit('setUsername', res.user ? res.user.username : null);

        this.$router.push({name: 'Home'});

        // this.$store.commit('alert', {
        //   message: 'New account created!', status: 'success'
        // });
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  }
};
</script>

<style scoped>
.create-account {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
}

form {
  width: 400px;
  text-align: center;
  background-color: #F0F0F0;
  padding: 30px 0px;
  border-radius: 30px;
}

article {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-bottom: 20px;
}

input {
  font-size: large;
  width: 70%;
  border: none;
  background-color: transparent;
  border-bottom: 1px solid #3B413C;
  margin: 12px 0px;
}

input:focus {
  outline: none;
}

.enter-btn {
  padding: 10px 50px;
  font-size: large;
  font-weight: 400;
  color: white;
  background-color: #94D1BE;
  border: none;
  border-radius: 30px;
}

.enter-btn:hover {
  opacity: 0.8;
}

.enter-btn:active {
  opacity: 0.6;
}

a {
  margin: 20px 0px;
  text-decoration: none;
  color: #9DB5B2;
}

.create-account-alerts {
  color: red;
  text-align: center;
  font-size: medium;
}
</style>

<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2 class="title">@{{ $store.state.username }}</h2>
        <router-link to="/profile" custom v-slot="{ navigate }">
          <button @click="navigate" role="link">Return to Profile</button>
        </router-link>
      </header>
    </section>
    <section>
      <h3>Account Settings</h3>
      <div class="account-settings">
        <ChangeUsernameForm />
        <ChangePasswordForm />
        <LogoutForm />
        <DeleteAccountForm />
      </div>
    </section>
  </main>
</template>

<script>
import ChangeUsernameForm from '@/components/Settings/ChangeUsernameForm.vue';
import ChangePasswordForm from '@/components/Settings/ChangePasswordForm.vue';
import DeleteAccountForm from '@/components/Settings/DeleteAccountForm.vue';
import LogoutForm from '@/components/Settings/LogoutForm.vue';

export default {
  name: 'SettingsPage',
  components: {
    ChangeUsernameForm,
    ChangePasswordForm,
    DeleteAccountForm,
    LogoutForm
  }
};
</script>

<style scoped>
.account-settings {
  max-width: 400px;
}

header {
  display: flex;
  justify-content: space-between;
  margin: 20px 0px;
}

header h2 {
  margin: 0px;
}

.title {
  font-weight: 400;
  margin: 0px;
}
</style>

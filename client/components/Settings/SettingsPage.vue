<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2 class="title">@{{ $store.state.username }}</h2>
      </header>
      <header>
        <h3>Account Settings</h3>
      </header>
      <div class="account-settings">
        <ChangeUsernameForm />
        <ChangePasswordForm />
      </div>
    </section>
    <section>
      <header>
        <h3>Account Management</h3>
      </header>
      <LogoutForm />
      <DeleteAccountForm />
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
  display: flex;
}

.account-settings > * {
  flex-basis: 100%;
  padding-right: 10px;
}
</style>

<!-- Form for changing password (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'ChangePasswordForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/users',
      method: 'PATCH',
      hasBody: true,
      fields: [
        {id: 'password', label: '', value: '', placeholder: 'Enter new password'}
      ],
      title: 'Change password',
      buttonText: 'Update',
      callback: () => {
        const message = 'Successfully changed password!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>

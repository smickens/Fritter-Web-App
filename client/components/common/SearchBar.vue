<!-- Page for account sign-in and registration -->
<!-- User should be NOT authenticated in order to see this page -->

<template>
  <section>
    <div class="flex-container">
        <input
          class="search-bar"
          :value="searchText"
          type="search"
          :placeholder="placeholderText"
          @input="updateSearchText"
          autocomplete="off"
          v-on:keyup.enter="submit"
        >
      <button class="search-btn" @click="submit()"><img src="../../public/assets/search_white_icon.png" alt=""></button>
    </div>
  </section>
</template>

<script>

export default {
  name: 'SearchBar',
  data() {
    return {
      searchText: ''
    };
  },
  props: {
    placeholderText: {
      type: String,
      default: 'Type something...'
    }
  },
  methods: {
    updateSearchText(event) {
      this.searchText = event.target.value;
      if (this.searchText == '') {
        this.$emit('searched', '');
      }
    },
    async submit() {
      this.$emit('searched', this.searchText);
    }
  }
};
</script>

<style scoped>
.flex-container {
  display: flex;
  margin-top: 40px;
}

.search-bar {
  flex: 1;
  border: none;
  border-radius: 20px;
  background-color: #F0F0F0;
  padding: 10px 20px;
}

.search-btn img {
  scale: 0.8;
}

.search-btn {
  margin-left: 10px;
  background-color: #94D1BE;
  border: none;
  border-radius: 20px;
}

.search-btn:hover {
  opacity: 0.8;
}

.search-btn:active {
  opacity: 0.6;
}
</style>
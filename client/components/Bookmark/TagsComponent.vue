<!-- Page for account sign-in and registration -->
<!-- User should be NOT authenticated in order to see this page -->

<template>
  <section>
    <div class="tags">
      <button
        class="tag"
        v-for="tag in bookmark.tags"
        :key="tag.id"
        :tag="tag"
        @click="removeTag(tag)"
      >
        {{tag}} <span>x</span>
      </button>
      <div v-if="addingTag">
        <input type="text" 
              :value="newTag"
              @input="newTag = $event.target.value"
        >
        <button @click="addTag()">&#x2713;</button>
        <button @click="stopAddingTag()">&#x2715;</button>
      </div>
      <button v-else @click="startAddingTag">+ tag</button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TagsComponent',
  props: {
    // Data from the stored freet
    bookmark: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      addingTag: false,
      newTag: '',
      alerts: {}, // Displays success/error messages encountered during freet modification
    }
  },
  methods: {
    startAddingTag() {
      this.addingTag = true;
    },
    stopAddingTag() {
      this.newTag = '';
      this.addingTag = false;
    },
    addTag() {
      /**
       * Add tag to bookmark
       */
      const params = {
        method: 'POST',
        message: 'Successfully added tag!',
        body: JSON.stringify({tag: this.newTag}),
        callback: () => {
          this.stopAddingTag()

          this.$store.commit('refreshBookmarks');

          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(`bookmarks/${this.bookmark.freetId._id}/tags`, params);
    },
    removeTag(tag) {
      /**
       * Remove tag from bookmark
       */
      const params = {
        method: 'DELETE',
        message: 'Successfully removed tag!',
        callback: () => {
          this.$store.commit('refreshBookmarks');

          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(`bookmarks/${this.bookmark.freetId._id}/tags/${tag}`, params);
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
.tags {
  display: flex;
}

.tag {
  background-color: transparent;
  border: solid black 1px;
  border-radius: 10px;
  margin-right: 10px;
}

.tag span {
  display: none;
}

.tag:hover span {
  display: inline-block;
}
</style>
<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="freet"
  >
    <header>
      <div class="freet-header">
        <div class="freet-header-left">
          <h3 class="author">
            @{{ freet.author }}
          </h3>
          <div v-if="$store.state.username">
            <button
              v-if="isFollowed"
              @click="removeFollow"
            >
              - Unfollow
            </button>
            <button
              v-else
              @click="addFollow"
            >
              + Follow
            </button>
          </div>
        </div>
        <div v-if="$store.state.username">
          <button
            v-if="isBookmarked"
            @click="removeBookmark"
            class="icon-btn"
          >
            <img src="../../public/assets/bookmark_filled.png" alt="">
          </button>
          <button
            v-else
            @click="addBookmark"
            class="icon-btn"
          >
            <img src="../../public/assets/bookmark_outline.png" alt="">
          </button>
        </div>
      </div>
    </header>
    <textarea
      v-if="editing"
      class="content"
      :value="draft"
      @input="draft = $event.target.value"
    />
    <p
      v-else
      class="content"
    >
      {{ freet.content }}
    </p>
    <div class="likes">
      <div
        v-if="$store.state.username"
        class="actions"
      >
        <button
          v-if="isLiked"
          @click="unlikeFreet"
          class="icon-btn"
        >
          <img src="../../public/assets/heart_filled.png" alt="">
        </button>
        <button
          v-else
          @click="likeFreet"
          class="icon-btn"
        >
          <img src="../../public/assets/heart_outline.png" alt="">
        </button>
        <p>
          {{ freet.likedBy.length }} {{ freet.likedBy.length == 1 ? 'Like' : 'Likes' }} by ({{ freet.likedBy.join(', ') }})
        </p>
      </div>
      <div
        v-if="$store.state.username === freet.author"
        class="actions"
      >
        <button
          v-if="editing"
          @click="submitEdit"
        >
          ✅ Save changes
        </button>
        <button
          v-if="editing"
          @click="stopEditing"
        >
          🚫 Discard changes
        </button>
        <button
          v-if="!editing"
          @click="startEditing"
        >
          ✏️ Edit
        </button>
        <button @click="deleteFreet">
          🗑️ Delete
        </button>
      </div>
    </div>
    <div>
      <p class="info">
        Posted at {{ freet.dateModified }}
        <i v-if="freet.edited">(edited)</i>
      </p>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
export default {
  name: 'FreetComponent',
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      alerts: {}, // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.freet.content;
    },
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted freet!', status: 'success'
          });
        }
      };
      this.request(`freets/${this.freet._id}`, params);
    },
    likeFreet() {
      /**
       * Likes this freet.
       */
      const params = {
        method: 'POST',
        message: 'Successfully liked freet!',
        body: JSON.stringify({freetId: this.freet._id}),
        callback: () => {
          this.$store.commit('refreshFreets');

          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(`likes/`, params);
    },
    unlikeFreet() {
      /**
       * Unlikes this freet.
       */
      const params = {
        method: 'DELETE',
        message: 'Successfully unliked freet!',
        callback: () => {
          this.$store.commit('refreshFreets');

          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(`likes/${this.freet._id}`, params);
    },
    // TODO - fix these
    addFollow() {
      /**
       * Add follow
       */
      console.log("add follow to friend w/ id " + this.freet.authorId);
      // const params = {
      //   method: 'POST',
      //   message: 'Successfully followed!',
      //   body: JSON.stringify({friendId: this.freet.authorId}),
      //   callback: () => {
      //     this.$set(this.alerts, params.message, 'success');
      //     setTimeout(() => this.$delete(this.alerts, params.message), 3000);
      //   }
      // };
      // this.request(`follows/`, params);
    },
    removeFollow() {
      console.log("remove follow to friend w/ id " + this.freet.authorId);
      /**
       * Remove follow
       */
      // const params = {
      //   method: 'DELETE',
      //   message: 'Successfully unfollowed!',
      //   callback: () => {
      //     this.$set(this.alerts, params.message, 'success');
      //     setTimeout(() => this.$delete(this.alerts, params.message), 3000);
      //   }
      // };
      // this.request(`follows/${this.freet.authorId}`, params);
    },
    addBookmark() {
      /**
       * Bookmarks this freet.
       */
      const params = {
        method: 'POST',
        message: 'Successfully bookmarked freet!',
        body: JSON.stringify({freetId: this.freet._id}),
        callback: () => {
          this.$store.commit('refreshBookmarks');

          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(`bookmarks/`, params);
    },
    removeBookmark() {
      /**
       * Remove bookmark
       */
      const params = {
        method: 'DELETE',
        message: 'Successfully removed bookmark!',
        callback: () => {
          this.$store.commit('refreshBookmarks');

          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(`bookmarks/${this.freet._id}`, params);
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft) {
        const error = 'Error: Edited freet content should be different than current freet content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited freet!',
        body: JSON.stringify({content: this.draft}),
        callback: () => {
          this.editing = false;
          this.$store.commit('refreshFreets');

          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(`freets/${this.freet._id}`, params);
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
    isLiked() {
      return this.freet.likedBy.includes(this.$store.state.username);
    },
    isFollowed() {
      // TODO: make this right
      return this.freet.likedBy.includes(this.$store.state.username);
    },
    isBookmarked() {
      return this.$store.getters.bookmarkFreetIds.includes(this.freet._id);
    }
  }
};
</script>

<style scoped>
.freet {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
    margin: 10px 0px;
    border-radius: 15px;
}

.author {
  margin: 0px;
  padding-right: 15px;
}

.freet-header {
  display: flex;
  justify-content: space-between;
}

.freet-header-left {
  display: flex;
  
}

.icon-btn {
  border: none;
  background-color: transparent;
}

.info {
  font-size: small;
  margin-bottom: 0px;
  color: #3B413C;
}

.likes {
  display: flex;
  justify-content: space-between;
}

.likes p {
  margin: 0px;
  font-size: medium;
}

.actions {
  display: flex;
  align-items: center;
}
</style>

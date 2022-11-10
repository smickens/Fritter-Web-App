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
            @{{ freetAuthorUsername }}
          </h3>
          <div v-if="$store.state.username && freetAuthorUsername !== $store.state.username">
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
          {{ freetLikedBy.length }} {{ freetLikedBy.length == 1 ? 'Like' : 'Likes' }}
          {{ freetLikedBy.length == 0 ? '' : 'by (' + freetLikedBy.join(', ') + ')' }} 
        </p>
      </div>
      <div
        v-if="$store.state.username === freetAuthorUsername"
        class="actions"
      >
        <button
          v-if="editing"
          @click="submitEdit"
        >
          ✅ Save
        </button>
        <button
          v-if="editing"
          @click="stopEditing"
        >
          🚫 Discard
        </button>
        <button
          v-if="!editing"
          @click="startEditing"
        >
          ✏️ Edit
        </button>
        <button v-if="!editing" @click="deleteFreet">
          🗑️ Delete
        </button>
      </div>
    </div>
    <div v-if="$store.state.username && isBookmarked && bookmarkForFreetId(freet._id)">
      <TagsComponent 
        :bookmark="bookmarkForFreetId(freet._id)"
      />
    </div>
    <div>
      <p class="info">
        {{ freet.dateModified != freet.dateCreated ? 'Modifed' : 'Posted' }} at {{ freetDate }}
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
import TagsComponent from '@/components/Bookmark/TagsComponent.vue';
import { stringify } from 'uuid';

export default {
  name: 'FreetComponent',
  components: {
    TagsComponent
  },
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    },
    isSavedFreet: {
      default: false,
      type: Boolean
    },
    savedDate: {
      default: null,
      type: String
    }
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      liking: false,
      bookmarking: false,
      following: false,
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
          this.$store.commit('refreshFreets');
          
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
          this.liking = false;
          this.$store.commit('refreshFreets');
        }
      };

      // If already liking/unliking ignore, once that has finished then accept new requests to like/unlike
      if (!this.liking) {
        this.request(`likes/`, params);
        this.liking = true;
      }
    },
    unlikeFreet() {
      /**
       * Unlikes this freet.
       */
      const params = {
        method: 'DELETE',
        message: 'Successfully unliked freet!',
        callback: () => {
          this.liking = false;
          this.$store.commit('refreshFreets');
        }
      };

      // If already liking/unliking ignore, once that has finished then accept new requests to like/unlike
      if (!this.liking) {
        this.request(`likes/${this.freet._id}`, params);
        this.liking = true;
      }
    },
    addFollow() {
      /**
       * Add follow
       */
      const params = {
        method: 'POST',
        message: 'Successfully followed!',
        body: JSON.stringify({friendId: this.freet.authorId}),
        callback: () => {
          this.following = false;
          this.$store.commit('refreshFollows');

          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };

      // If already following/unfollowing ignore, once that has finished then accept new requests follow/unfollow
      if (!this.following) {
        this.request(`follows/`, params);
        this.following = true;
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
          this.following = false;
          this.$store.commit('refreshFollows');

          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      
      // If already following/unfollowing ignore, once that has finished then accept new requests follow/unfollow
      if (!this.following) {
        this.request(`follows/${this.freet.authorId}`, params);
        this.following = true;
      }
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
          this.bookmarking = false;
          this.$store.commit('refreshBookmarks');

          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      
      // If already bookmarking/unbookmarking ignore, once that has finished then accept new requests bookmark/unbookmark
      if (!this.bookmarking) {
        this.request(`bookmarks/`, params);
        this.bookmarking = true;
      }
    },
    removeBookmark() {
      /**
       * Remove bookmark
       */
      const params = {
        method: 'DELETE',
        message: 'Successfully removed bookmark!',
        callback: () => {
          this.bookmarking = false;
          this.$store.commit('refreshBookmarks');

          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      
      // If already bookmarking/unbookmarking ignore, once that has finished then accept new requests bookmark/unbookmark
      if (!this.bookmarking) {
        this.request(`bookmarks/${this.freet._id}`, params);
        this.bookmarking = true;
      }
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
        this.liking = false;
        this.following = false;
        this.bookmarking = false;
        
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    bookmarkForFreetId(freetId) {
      return this.$store.state.bookmarks.find(bookmark => bookmark.freetId._id === freetId)
    },
    convertDate(date) {
      var d = new Date(date);
      return d.toLocaleString();
    }
  },
  computed: {
    isLiked() {
      return this.freetLikedBy.includes(this.$store.state.username);
    },
    isFollowed() {
      const friendNames = this.$store.state.following.map(follow => { return follow.friendUsername });
      return friendNames.includes(this.freetAuthorUsername);
    },
    isBookmarked() {
      return this.$store.getters.bookmarkFreetIds.includes(this.freet._id);
    },
    freetAuthorUsername() {
      return this.isSavedFreet ? this.freet.authorId.username : this.freet.author;
    },
    freetLikedBy() {
      if (this.isSavedFreet) {
        const filteredLikes = this.freet.likedBy.filter(like => {
          return like.userId;
        });
        return filteredLikes.map(like => {
          return like.userId ? like.userId.username : ''
        })
      }
      return this.freet.likedBy;
    },
    freetDate() {
      if (!this.isSavedFreet) {
        return this.freet.dateModified;
      }
      return this.convertDate(this.freet.dateModified);
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

.icon-btn img {
  height: 24px;
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

.actions p {
  margin-bottom: 3px;
}

.content {
  width: 100%;
  resize: vertical;
}
</style>

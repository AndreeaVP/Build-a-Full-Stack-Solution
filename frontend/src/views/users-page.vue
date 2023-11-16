<template>
    <div>
      <app-header></app-header>

      <div v-if="loading" class="spinner-container">
        <div class="spinner">
          <font-awesome-icon icon="spinner" class="fa-spin fa-3x" />
        </div>
      </div>

      <div v-else>
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  
        <div class="user-profile">
          <div class="account-image">
            <font-awesome-icon :icon="['fas', 'user']" class="user-icon" />
          </div>
  
          <div class="profile-info">
            <p>{{ user.firstname }} {{ user.lastname }}</p>
            <p class="email">{{ user.email }}</p>
          </div>
        </div>

      <!-- User's Posts -->
        <div v-if="userPosts.length > 0">

          <div v-for="post in userPosts" :key="post.post_id" class="post-container">
            <div class="user-section">
              <font-awesome-icon :icon="['fas', 'user']" class="user-icon" />
              <div class="user-details">
                <div class="user-name">{{ user.firstname }} {{ user.lastname }}</div>
                <div class="post-date">{{ formatDate(post.created_at) }}</div>
              </div>
            </div>

            <div class="post-text">
              {{ post.textual_post }}
            </div>

            <img v-if="post.image_url" crossorigin="anonymous" :src="post.image_url" alt="Posted Image" class="post-image" />
      
            <!-- Like and Comment Section -->
            <div class="like-comment-section">
              <div class="like-section">
                <div @click="handleLikeAction(post)" class="like-icon" :class="{ 'liked': post.userLiked }">
                  <font-awesome-icon :icon="['fas', 'thumbs-up']" class="icon" />
                  <span class="like-count">{{ post.totalLikes }}</span>
                  <span v-if="post.userLiked" class="like-text">Liked</span>
                </div>
              </div>

              <div class="comment-section">
                <div @click="toggleCommentInput(post)" class="comment-icon">
                  <font-awesome-icon :icon="['fas', 'comment']" class="icon" />
                  <span class="comment-count">{{ post.totalComments }}</span>
                </div>
              </div>
            </div>   

            <!-- Comment Input -->
            <div class="comment-input" v-if="post.showCommentInput">
              <input type="text" class="comment-input-text" v-model="post.newComment" @keyup.enter="addComment(post)" placeholder="  Add a comment" />
              <font-awesome-icon @click="addComment(post)" :icon="['fas', 'paper-plane']" class="icon" />
            </div>

            <!-- Comments Section -->
            <div class="post-comments-section">
              <div class="comment" v-for="comment in post.comments" :key="comment.comment_id">
                <div class="comment-details-container">
                  <font-awesome-icon :icon="['fas', 'user']" class="comment-user-icon" />
                  <div class="comment-details">
                    <span class="comment-user-name">{{ comment.firstname }} {{ comment.lastname }}</span>
                    <p class="comment-posted-date">Posted on {{ formatDate(comment.created_at) }}</p>
                  </div>
                </div>

                <div class="comment-actions">
                  <font-awesome-icon v-if="userData && userData.user_id === comment.user_id && !comment.showOptions" icon="ellipsis-h" class="ellipsis-icon" @click="toggleOptionsComment(comment)" />
                  <div class="comment-actions-container" v-if="comment.showOptions">
                    <font-awesome-icon v-if="userData && userData.user_id === comment.user_id" :icon="['fas', 'pencil-alt']" class="comment-edit-icon" @click="editComment(comment)" />
                    <font-awesome-icon v-if="userData && userData.user_id === comment.user_id" :icon="['fas', 'trash']" class="comment-delete-icon" @click="confirmDeleteComment(comment)" />
                  </div>
                </div>

                <div v-if="editingCommentId === comment.comment_id">
                  <input type="text" class="edit-comment-input" v-model="editedComment" />
                  <font-awesome-icon class="save-edit-comment" @click="saveEditedComment(comment)" :icon="['fas', 'check']"/>
                </div>

                <div class="comment-text">{{ comment.comment }}</div>
              </div>
            </div>
          </div>
        </div>

      <div v-else>
       <p>No posts available for this user.</p>
      </div> 
      </div>
    </div>
</template>

<script>
import AppHeader from '@/components/app-header.vue';
import axios from 'axios';
import * as postUtils from "@/utils/postUtils";

export default {
  components: {
    AppHeader,
  },

  computed: {
    userData() {
    const userDataFromVuex = this.$store.state.user;
    if (userDataFromVuex) {
      return userDataFromVuex;
    }

    const userDataFromLocalStorage = JSON.parse(localStorage.getItem('user'));
    if (userDataFromLocalStorage !== null) {
      return userDataFromLocalStorage;
    }
    return null;
  },
 },

  data() {
    return {
      user: {
        image_url: null,
      },
      loading: true,
      userPosts: [],
      comments: [],
      successMessage: '',
      errorMessage: '',
      editingCommentId: null,
      editedComment: "",
    };
  },
  methods: {
    editComment(comment) {
      this.editingCommentId = comment.comment_id;
      this.editedComment = comment.comment;     
    },

    toggleOptionsComment(comment) {
      comment.showOptions = !comment.showOptions;
    },

    async fetchUserDetails(userId) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`/api/user/${userId}`, config);
        console.log('User Details Response:', response);
        this.user = response.data.user;
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    },

    formatDate(dateTimeString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateTimeString).toLocaleDateString(undefined, options);
    },

    async fetchUserPosts(userId) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`/api/posts/${userId}`, config);

        console.log('Response from server:', response);

        if (response.status === 200) {
          if (response.data.posts.length > 0) {
        this.userPosts = response.data.posts.map(post => ({
          ...post,
          comments: [], 
          likes: 0,  
        }));

        await Promise.all(this.userPosts.map(async post => {
          await this.fetchComments(post);
          await this.fetchLikes(post);
        }));
      } else if (response.status === 404) {
        this.userPosts = [];
        this.errorMessage = 'No posts available for this user.';
      }
        } else {
            console.error('Failed to fetch user posts. Please try again.');
            this.errorMessage = 'Failed to fetch user posts. Please try again.';
        }
      } catch (error) {
          console.error('Error fetching user posts:', error);
          this.errorMessage = 'Error fetching user posts. Please try again.';
      }
    },

    async addComment(post) {
      await postUtils.addComment.call(this, post);
    },

    async toggleCommentInput(post) {
      await postUtils.toggleCommentInput.call(this, post);
    },

    async fetchComments(post) {
      await postUtils.fetchComments.call(this, post);
    },
    
    async saveEditedComment(comment) {
      await postUtils.saveEditedComment.call(this, comment);
    },

    async handleLikeAction(post, action) {
      await postUtils.handleLikeAction.call(this, post, action);
    },

    async fetchLikes(post) {
      await postUtils.fetchLikes.call(this, post);
    },

    async deleteUserComment(comment) {
      const confirmed = window.confirm("Are you sure you want to delete this comment?");

  if (!confirmed) {
    return;
  }
    try {
      const token = this.$store.state.token || localStorage.getItem('token');
      const userId = this.userData.user_id;
      const commentId = comment.comment_id;

      const response = await axios.delete(`/api/comments/${commentId}`, {
        data: {
          userId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const postContainingComment = this.userPosts.find(post =>
          post.comments && post.comments.some(c => c.comment_id === comment.comment_id)
        );

        if (postContainingComment) {
          postContainingComment.comments = postContainingComment.comments.filter(
            c => c.comment_id !== comment.comment_id
          );
        } else {
          console.error('Post containing comment not found:', comment);
        }
        this.successMessage = 'Comment deleted successfully';
        this.errorMessage = '';
        await this.fetchComments(postContainingComment);
        setTimeout(() => {
          this.successMessage = '';
        }, 1500);
      } else {
          console.error('Error deleting comment:', response);
          this.errorMessage = 'Failed to delete comment. Please try again.';
      }
    } catch (error) {
        console.error('Error deleting comment:', error);
        this.errorMessage = 'An error occurred while deleting the comment. Please try again.';
    }
  },

  },

  async created() {
  const user_id = this.$route.params.user_id;
  if (user_id) {
    try {
      this.loading = true;
      await this.fetchUserDetails(user_id);
      await this.fetchUserPosts(user_id);
    } finally {
      setTimeout(() => {
        this.loading = false;
      }, 1300);
    }
  }
},
};
</script>

<style scoped>
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.spinner {
  animation: spin 1.3s linear infinite, changeColor 5s infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes changeColor {
  0% {
    color: blue;
  }

  50% {
    color: red;
  }
  75% {
    color: #8B008B;
  }
}

.user-profile {
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  max-width: 50%;
  margin: 110px auto 30px auto;
  background: linear-gradient(120deg,  #ffc4cf,#c6fbcb);
  color: #000;
}

.account-image {
margin-left: 40px;
}

.user-icon {
  color: #333;  
  font-size: 40px;
  padding: 10px;
  border-radius: 50%;
  margin-right: 30px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3); 
}

.profile-info {
  display: flex;
  flex-direction: column;
  margin-right: 20px;
}

.email {
  margin-top: 10px;
}

.post-container {
  position: relative;
  display: flex;
  flex-direction: column; 
  justify-content: center; 
  padding: 20px 30px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  max-width: 50%; 
  margin: 30px auto; 
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

.user-section {
  display: flex;
  align-items: center;
}

.user-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: bold;
}

.post-date {
  color: #777;
  margin-top: 5px;
}

.post-text {
  margin: 15px 0;
  display: flex;
}

.post-image {
  max-width: 100%;
  height: 500px;
  object-fit: cover;
}

.like-comment-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;
}

.like-section {
  display: flex;
  align-items: center;
  padding: 10px;
  gap: 30px;
}

.like-icon {
  cursor: pointer;
  color: green;
}

.liked {
  color: blue;
}

.like-text {
  margin-left: 5px;
  font-size: 15px;
}

.comment-section {
  display: flex;
  align-items: center;
  padding: 10px;
}

.comment-icon {
  cursor: pointer;
  color: #333;
}

.comment-input {
  padding: 10px;
  margin-bottom: 10px;
}

.comment-input-text {
  height: 30px;
  width: 50%;
  margin-right: 10px;
  border-radius: 10px;
  border: 1px solid rgb(217, 216, 216);
}

.comment-details-container {
  display: flex;
  margin: 0 0 10px 0;
}

.comment-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.comment {
  display: flex;
  position: relative;
  flex-direction: column;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 5px;
  margin-bottom: 5px;
}

.comment-text {
  display: flex;
  align-items: flex-start;
}

.comment-user-icon {
  color: #333;  
  font-size: 22px;
  padding: 10px;
  border-radius: 50%;
  margin-right: 30px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3); 
}

.comment-user-name {
  font-weight: bold;
}

.comment-posted-date {
  margin-top: 7px;
  margin-bottom: 0;
}

.comment-actions {
  position: absolute;
  display: flex;
  top:25px;
  right: 15px;
}

.comment-actions-container {
  display: flex;
  gap: 20px;
}

.comment-edit-icon,
.comment-delete-icon {
  cursor: pointer;
  font-size: 14px;
}

.edit-comment-input {
  height: 30px;
  width: 50%;
  border-radius: 10px;
  margin-right: 10px;
  border: 1px solid rgb(217, 216, 216);
}

.save-edit-comment {
  color: green;
}

.success-message {
  color: white;
  background-color: #55eb5a;
  padding: 8px;
  border-radius: 5px; 
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  z-index: 1;
}

.error-message {
  color: white;
  background-color: red;
  padding: 8px;
  border-radius: 5px; 
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  z-index: 1;
}

</style>
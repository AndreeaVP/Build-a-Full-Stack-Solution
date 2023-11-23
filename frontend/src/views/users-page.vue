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
  
        <div class="users-profile">
          <div class="account-image">
            <img v-if="user.image_url" crossorigin="anonymous" :src="user.image_url" alt="User Profile Image" class="user-profile-image" />
            <font-awesome-icon v-else :icon="['fas', 'user']" class="user-icon"/>
          </div>
  
          <div class="profile-info">
            <p class="user-first-last-name">{{ user.firstname }} {{ user.lastname }}</p>
            <p class="email-user">{{ user.email }}</p>
          </div>
        </div>

      <!-- User's Posts -->
        <div v-if="userPosts.length > 0">

          <div v-for="post in userPosts" :key="post.post_id" class="post-container">
            <div class="post-container-border">
              <div class="user-section">
                <img v-if="post.user_image" crossorigin="anonymous" :src="post.user_image" alt="User Profile Image" class="profile-image-display-post" />
                <font-awesome-icon v-else :icon="['fas', 'user']" class="user-icon-posts"/>
                <div class="user-details">
                  <div class="user-name">{{ user.firstname }} {{ user.lastname }}</div>
                  <div class="post-date">{{ formatDate(post.created_at) }}</div>
                </div>
              </div>

              <div class="post-text">
                {{ post.textual_post }}
             </div>

              <img v-if="post.image_url" crossorigin="anonymous" :src="post.image_url" alt="Posted Image" class="post-image" />
            </div>
      
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
                <font-awesome-icon @click="addComment(post)" :icon="['fas', 'paper-plane']" class="save-comment" />
              </div>

              <!-- Comments Section -->
              <div class="post-comments-section">
                <div class="comment" v-for="comment in post.comments" :key="comment.comment_id">
                  <div class="comment-details-container">
                    <img v-if="comment.user && comment.user.image_url" crossorigin="anonymous" :src="comment.user.image_url" alt="User Profile Image" class="comment-user-image" />
                    <font-awesome-icon v-else :icon="['fas', 'user']" class="comment-user-icon" />                    <div class="comment-details">
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

        if (response.status === 200) {
          if (response.data.posts.length > 0) {
            this.userPosts = response.data.posts.map(post => ({
            ...post,
            comments: [], 
            likes: 0,  
            user_image: post.user_image,
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
        await Promise.all([
        this.fetchUserDetails(user_id),
        this.fetchUserPosts(user_id),
        ]);
        } finally {
          setTimeout(() => {
          this.loading = false;
          }, 1300);
      }
    }
  }
};
</script>

<style lang="scss">
@import '@/styles/main';

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

.users-profile {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  max-width: 60%;
  margin: 110px auto 20px auto;
  background: linear-gradient(90deg, #f0f0f0, #e0e0e0);
  color: #000;
}

.user-first-last-name {
  color: black;
  font-weight: bold;
  margin-bottom: 10px;
}

.email-user {
  color: black;
  margin-top: 10px;
}

@media (max-width: 1200px) and (min-width: 1001px) {
  .users-profile {
    max-width: 80%;
    margin-top: 100px;
  }
} 

@media (max-width: 1000px) and (min-width: 769px) {
  .users-profile {
    max-width: 85%;
    margin-top: 100px;
  }
}

@media (max-width: 768px) {
  .users-profile {
    margin-top: 80px;
    max-width: 100%;
    margin-bottom: 5px;
  }

  .user-first-last-name {
    margin-top: 10px;
  }

  .email-user {
    margin: 0;
  }
}    
</style>
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

      <div class="user-myprofile">
        <div class="account-image">
          <img v-if="user.image_url" crossorigin="anonymous" :src="user.image_url" alt="User Profile Image" class="user-profile-image" />
          <font-awesome-icon v-else :icon="['fas', 'user']" class="user-icon"/>
        </div>

        <div class="profile-info">
          <p class="user-first-last-name">{{ user.firstname }} {{ user.lastname }}</p>
          <p class="email-user">{{ user.email }}</p>
        </div>

        <font-awesome-icon @click="toggleSettings" :icon="['fas', 'sliders']" class="icon-settings" v-if="!showSettings" />

        <!-- Settings options -->
        <div v-if="showSettings" class="settings-container">
          <div class="close-button-container">
            <font-awesome-icon :icon="['fas', 'times']" class="icon-close" @click="closeSettings" />
          </div>

          <!-- Navigation Menu -->
          <div class="settings-navigation">
            <div @click="showSection('profile')" class="menu-item" :class="{ active: activeSection === 'profile' }">Profile Details</div>
            <div @click="showSection('password')" class="menu-item" :class="{ active: activeSection === 'password' }">Change Password</div>
            <div @click="showSection('delete')" class="menu-item" :class="{ active: activeSection === 'delete' }">Delete Account</div>
          </div>

          <hr class="separator">

          <!-- Profile Details Section -->
          <div v-if="activeSection === 'profile'" class="profile-details-section">
            <div class="profile-image-section">
              <h3 class="update-image-header">{{ user.image_url ? 'Update Image' : 'Upload an Image' }}</h3>
              <div class="image-container" v-if="user.image_url || selectedImage">
                <img v-if="user.image_url" crossorigin="anonymous" :src="user.image_url" alt="Profile Image" class="update-profile-image"/>
                <span v-if="selectedImage" class="remove-image-settings-container" @click="removeImage">
                <font-awesome-icon :icon="['fas', 'times']" class="icon-remove-image" />
                </span>
              </div>              
              <div v-else class="default-profile-icon">
                <font-awesome-icon :icon="['fas', 'user']" class="user-icon-settings-update"/>
              </div>  


              <div class="image-upload-container-settings">
                <label for="profileImage" class="label-profile-image-settings">Select Image 
                  <font-awesome-icon :icon="['fas', 'camera']" class="icon-profile-upload-settings" />
                </label>
                <input ref="fileInput" type="file" id="profileImage" name="image_url" class="file-input-profile-image-settings" @change="handleFileChange"/>
              </div>

              <div class="change-image-button">
                <button @click="saveProfileChanges">Save Changes</button>
              </div>

              <hr class="image-name-separator">

              <div class="update-profile-details">
                <h3 class="update-name-header">Change Name</h3>
                <div class="update-firstname">
                  <label class="settings-label" for="firstName">First Name:</label>
                  <input class="settings-input" type="text" id="firstName" v-model="user.firstName">
                </div>
                <div class="update-lastname">
                  <label class="settings-label" for="lastName">Last Name:</label>
                  <input class="settings-input" type="text" id="lastName" v-model="user.lastName">
                </div>
                <button class="settings-button" @click="updateName">Update Name</button>
              </div>
            </div>
          </div>

          <!-- Change Password Section -->
          <div v-if="activeSection === 'password'" class="change-password-section">
            <div class="change-password-section">
              <h3 class="change-password-header">Change Password</h3>
              <div class="new-password-container">
                <label class="settings-label" for="newPassword">Your New Password</label>
                <input class="settings-input" type="password" id="newPassword" v-model="newPassword">
              </div>
              <div class="submit-button-container">
                <button class="settings-button" @click="changePassword">Submit</button>
              </div>
            </div>  
          </div>          

          <!-- Delete Account Section -->
          <div v-if="activeSection === 'delete'" class="delete-account-section">
            <div class="delete-account-section">
              <h3 class="delete-account-header">Delete Account</h3>
              <div class="delete-button-container">
                <button class="settings-button" @click="deleteAccount">Delete Account</button>
              </div>
            </div>
          </div>

          <hr class="separator">

        </div>
      </div>  

      <!-- User's Posts -->
      <div v-if="userPosts.length > 0">

        <div v-for="post in userPosts" :key="post.post_id" class="post-container">
          <div class="post-container-border">
            <div class="user-section">
              <img v-if="post.user && post.user.image_url" crossorigin="anonymous" :src="post.user.image_url" alt="User Profile Image" class="profile-image-display-post" />
              <font-awesome-icon v-else :icon="['fas', 'user']" class="user-icon-posts"/>
              <div class="user-details">
                <div class="user-name">{{ user.firstname }} {{ user.lastname }}</div>
                <div class="post-date">{{ formatDate(post.created_at) }}</div>
              </div>
            </div>

            <div class="post-options">
              <div v-if="post.showOptions" class="edit-option" @click="toggleEditMode(post)">
                <div class="update-post-content">
                  <font-awesome-icon :icon="['fas', 'pencil-alt']" class="update-post-icon" />
                  <span class="edit-post-text">Edit</span>
                </div>
              </div>

              <div v-if="post.showOptions" class="delete-option" @click="confirmDeletePost(post)">
                <div class="delete-post-content">
                  <font-awesome-icon :icon="['fas', 'trash']" class="delete-post-icon" />
                  <span class="delete-post-text">Delete</span>
                </div>
              </div>

              <font-awesome-icon icon="ellipsis-h" class="ellipsis-icon" @click="toggleOptions(post)"/>
            </div>
            <div>
              <font-awesome-icon v-if="editingPostId === post.post_id" :icon="['fas', 'check']" class="save-post-icon" @click="updatePostText(post)" />
            </div>

            <div class="post-text" v-if="editingPostId !== post.post_id">
              {{ post.textual_post }}
            </div>

            <textarea v-else v-model="newTextualPost" class="update-post-input"></textarea>

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
                  <font-awesome-icon v-else :icon="['fas', 'user']" class="comment-user-icon" />                  <div class="comment-details">
                    <span class="comment-user-name">{{ comment.firstname }} {{ comment.lastname }}</span>
                    <p class="comment-posted-date">Posted on {{ formatDate(comment.created_at) }}</p>
                  </div>
                </div>

                <div class="comment-actions">
                  <font-awesome-icon v-if="this.user && this.user.user_id === comment.user_id && !comment.showOptions" icon="ellipsis-h" class="ellipsis-icon" @click="toggleOptionsComment(comment)" />
                  <div class="comment-actions-container" v-if="comment.showOptions">
                    <font-awesome-icon v-if="this.user && this.user.user_id === comment.user_id" :icon="['fas', 'pencil-alt']" class="comment-edit-icon" @click="editComment(comment)" />
                    <font-awesome-icon v-if="this.user && this.user.user_id === comment.user_id" :icon="['fas', 'trash']" class="comment-delete-icon" @click="confirmDeleteComment(comment)" />
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
import AppHeader from "@/components/app-header.vue";
import axios from "axios";
import * as postUtils from "@/utils/postUtils";

export default {
  components: {
    AppHeader,
  },
  data() {
    return {
      user: {
        image_url: null,
      },
      selectedImage: null,
      loading: true,
      userPosts: [],
      comments: [],
      oldPassword: "",
      newPassword: "",
      showSettings: false,
      successMessage: '',
      errorMessage: '',
      editingPostId: null,
      editingCommentId: null,
      editedComment: "",
      activeSection: 'profile',
    };
  },
  methods: {
    toggleSettings() {
      this.showSettings = !this.showSettings;
    },

    closeSettings() {
      this.showSettings = false;
    },

    showSection(section) {
    this.activeSection = section;
    },

    changeProfileImage() {
      // change the profile image
    },

    toggleEditMode(post) {
      this.editingPostId = post.post_id;
      this.newTextualPost = post.textual_post;
    },

    toggleOptions(post) {
      post.showOptions = !post.showOptions;
    },

    editComment(comment) {
      this.editingCommentId = comment.comment_id;
      this.editedComment = comment.comment;     
    },

    toggleOptionsComment(comment) {
      comment.showOptions = !comment.showOptions;
    },

    formatDate(dateTimeString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateTimeString).toLocaleDateString(undefined, options);
    },

    handleFileChange(event) {
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      this.selectedImage = file;
      this.user.image_url = imageUrl;
    } else {
      this.selectedImage = null;
      this.user.image_url = null;
    }
  },

  removeImage() {
    this.selectedImage = null;
    const input = this.$refs.fileInput;
    input.value = '';
    this.user.image_url = null;
  },

    async fetchUserData() {
      const token = localStorage.getItem('token');
      const userId = this.$store.state.user.user_id;

      try {
        const response = await axios.get(`/api/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {   
          this.user = response.data.user;
        }
      } catch (error) {
          console.error('Error fetching user data:', error);
      }
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
              user: { image_url: post.user_image,}, 
            }));

            await Promise.all(this.userPosts.map(async post => {
              await this.fetchComments(post);
              await this.fetchLikes(post);
            }));
            this.userPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
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

    async updateName() {
      const token = localStorage.getItem('token');
      const userId = this.$store.state.user.user_id;
    
      try {
        const response = await axios.put(`/api/user/${userId}`,{
          firstName: this.user.firstName,
          lastName: this.user.lastName,},
          {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        await this.fetchUserData();
        this.successMessage = 'Name updated successfully.';
        this.errorMessage = '';
        this.user.firstName = '';
        this.user.lastName = '';
        this.closeSettings();
        setTimeout(() => {
            this.successMessage = '';
          }, 1500);
      }
      } catch (error) {
        console.error('Error updating name:', error);
        this.errorMessage = 'Failed to update name. Please try again.';
      }
    },

    async changePassword() {
      const token = localStorage.getItem('token');

      try {
        const userId = this.$store.state.user.user_id;
        const newPassword = this.newPassword;

        const response = await axios.put(`/api/user/${userId}`, { password: newPassword }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          this.successMessage = 'Password changed successfully.';
          this.errorMessage = '';
          this.newPassword = '';
          this.closeSettings();
          setTimeout(() => {
            this.successMessage = '';
          }, 1500);
        }
      } catch (error) {
        console.error('Error changing password:', error);
        this.errorMessage = 'Failed to change password. Please try again.';
      }
    },

    async deleteAccount() {
      const token = localStorage.getItem('token');
      const confirmed = confirm("Are you sure you want to delete your account? This action cannot be undone.");
        if (!confirmed) {
      return;
      }

      try {
        const userId = this.$store.state.user.user_id;
        const response = await axios.delete(`/api/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          this.successMessage = response.data.message;
          this.errorMessage = '';
          this.closeSettings();
          setTimeout(() => {
            this.successMessage = '';
            this.$router.push({ name: 'login' });
          }, 1500);
        } else {
          this.errorMessage = 'Error deleting user account. Please try again later.';
        }
      } catch (error) {
        console.error('Error deleting user account:', error);
      }
    },

    async confirmDeleteComment(comment) {
      const confirmed = window.confirm("Are you sure you want to delete this comment?");

      if (!confirmed) {
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const userId = this.$store.state.user.user_id;
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

    async updatePostText(post) {
      try {
        const postId = post.post_id;
        const updatedText = this.newTextualPost;

        if (!updatedText.trim()) {
          this.errorMessage = 'Post text cannot be empty.';
          return;
        }

        const token = localStorage.getItem('token');

        const response = await axios.put(`/api/posts/${postId}`, {
          textual_post: updatedText,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          post.showOptions = false;
          this.successMessage = 'Post updated successfully';
          this.errorMessage = '';
          this.editingPostId = null;
          await this.fetchUserPosts(this.$store.state.user.user_id);
          setTimeout(() => {
            this.successMessage = '';
          }, 1500);
        } else {
          this.successMessage = '';
          this.errorMessage = 'Failed to update the post';
        }
      } catch (error) {
        console.error('Error updating post:', error);
        this.successMessage = '';
        this.errorMessage = 'Error updating the post';
      }
    },
  
    async confirmDeletePost(post) {
      try {
        const confirmation = confirm('Are you sure you want to delete this post?');
  
      if (confirmation) {
        await this.deletePost(post);
      }
      } catch (error) {
        console.error('Error confirming delete:', error);
      }
    },
  
    async deletePost(post) {
      try {
        const token = this.$store.state.token || localStorage.getItem('token');
        const headers = {
          Authorization: `Bearer ${token}`,
        };
  
        const response = await axios.delete(`/api/posts/${post.post_id}`, { headers });
  
        if (response.status === 200) {
          this.successMessage = 'Post deleted successfully';
          this.errorMessage = '';
          this.userPosts = this.userPosts.filter(userPost => userPost.post_id !== post.post_id);
          setTimeout(() => {
            this.successMessage = '';
          }, 1500);
        } else {
          this.errorMessage = 'Failed to delete the post';
        }
      } catch (error) {
        console.error('Error deleting the post:', error);
        this.errorMessage = 'Error deleting the post.';
      }
    },

    async saveProfileChanges() {
    const token = localStorage.getItem('token');
    const userId = this.$store.state.user.user_id;

    if (!this.selectedImage) {
      this.errorMessage = 'Please select an image before saving changes.';
      setTimeout(() => {
        this.errorMessage = '';
      }, 1500);
    return;
  }

    try {
      const formData = new FormData();
      formData.append('image_url', this.selectedImage);

      const response = await axios.put(`/api/user/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        this.successMessage = 'Profile image updated successfully.';
        this.errorMessage = '';
        this.closeSettings();

        const updatedUserData = {
        user_id: this.$store.state.user.user_id,
        firstname: this.$store.state.user.firstname,
        lastname: this.$store.state.user.lastname,
        image_url: response.data.image_url,
        };

        await this.$store.commit('setUser', updatedUserData);
        await this.fetchUserData();
        await this.fetchUserPosts(userId);
        setTimeout(() => {
            this.successMessage = '';
        }, 1500);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      this.errorMessage = 'Failed to update profile. Please try again.';
    }
  },
  },

  async created() {
    this.loading = true;
    let userId = this.$route.query.user_id || this.$store.state.user.userId;
      if (!userId) {
        userId = this.$store.state.user.user_id;
      }

    const token = localStorage.getItem('token');
      if (!token) {
        console.error("Token is not defined in local storage.");
      return;
    }

    try {
      const response = await axios.get(`/api/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
        this.user = response.data.user;
        await this.fetchUserPosts(userId);
        await this.fetchUserData();
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
    setTimeout(() => {
      this.loading = false;
    }, 1300);
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
.user-myprofile {
  position: relative;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  max-width: 60%;
  margin: 110px auto 10px auto;
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

.icon-settings {
  margin-left: auto;
  cursor: pointer;
  margin-right: 30px;
}

.settings-container {
  position: absolute;
  top: 0px;
  right: 20px;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  max-width: 50%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.close-button-container {
  color: black;
  margin-bottom: 10px;
}

.update-image-header, .update-name-header {
  margin:10px 0;
}

.user-icon-settings-update {
  font-size: 25px;
  padding: 7px;
  background-color: black;
  color: white;
}

.file-input-profile-image-settings {
    display: none;
}

.image-upload-container-settings {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  padding: 7px 0;
  cursor: pointer;
}

.label-profile-image-settings {
  cursor: pointer;
}

.icon-profile-upload-settings{
  cursor: pointer;
  color: green;
}

.image-container {
  position: relative;
  display: inline-block;
}

.remove-image-settings-container {
  color: red;
  position: absolute;
  top: -4px;
  right: -10px;
  padding: 5px;
  cursor: pointer;
}

.image-name-separator {
  width: 70%;
  border: 1px solid rgb(243, 25, 243);
}

.profile-image-section {
  text-align: center;
}

.update-profile-image {
  width: 150px;
  max-height: 120px;
  margin: 10px 0 0;
  object-fit: cover;
}

.settings-container button {
  margin: 10px 0;
  padding: 7px 15px;
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.change-image-button {
  margin-top: 10px;
  cursor: pointer;
}

.update-profile-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}

.change-password-header,
.delete-account-header {
  font-size: 18px;
  margin-bottom: 10px;
}

.update-firstname, .update-lastname {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
}

.settings-label {
  font-size: 14px;
  margin-right: 4px;
}

.settings-input {
  width: 200px;
  padding: 5px;
}

.settings-button {
  background-color: #4caf50;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.settings-button:hover {
  background-color: #45a049;
}


.change-password-section {
  margin-top: 20px;
}

.new-password-container {
  margin-bottom: 10px;
}

#newPassword {
  margin-left: 10px;
  height: 20px;
}

.submit-button-container {
  text-align: center;
  margin-top: 10px;
  cursor: pointer;
}

.delete-account-section {
  margin-top: 20px;
}

.separator {
  width: 90%;
  border: 1px solid #eb0db3;
}

.settings-navigation {
  display: flex;
  justify-content: space-around;
  background-color: #f0f0f0;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.menu-item {
  cursor: pointer;
  padding: 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.menu-item:hover {
  background-color: #ddd;
}

.menu-item.active {
  background-color: #4CAF50;
  color: white;
}

@media (max-width: 1200px) and (min-width: 1001px) {
  .user-myprofile {
     max-width: 80%;
     margin-top: 100px;
  }
} 

@media (max-width: 1000px) and (min-width: 769px) {
  .user-myprofile {
    max-width: 85%;
    margin-top: 100px;
  }
}

@media (max-width: 768px) {
  .user-myprofile {
    max-width: 100%;
    margin-top: 80px;
    margin-bottom: 5px;
  }

  .user-icon {
  font-size: 25px!important;
  }

  .icon-settings {
    margin-right: 10px;
  }

  .user-first-last-name {
    margin-top: 10px;
  }

  .email-user {
    margin: 0;
  }
}
</style>


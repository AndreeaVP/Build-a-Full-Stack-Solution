<template>
  <div>
    <app-header></app-header>

    <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

    <div class="create-post">
      <div class="user-profile">
        <font-awesome-icon :icon="['fas', 'user']" class="user-icon" />
        <textarea class="post-input" placeholder="What's on your mind?" v-model="postContent"></textarea>
      </div>

      <div class="uploaded-image-container">
        <img class="uploaded-image" :src="previewUrl" alt="Uploaded Image" v-if="previewUrl" />
        <button class="delete-button" @click="clearSelectedFile" v-if="previewUrl">x</button>
      </div>

      <div class="post-actions">       
        <label for="file-upload" class="file-label"> Upload File
          <font-awesome-icon :icon="['fas', 'upload']" class="icon-post"/>
        </label>
        <input type="file" id="file-upload" name="image_url" class="file-input" @change="onFileChange" />
        <button class="post-button" @click="createPost">Post
          <font-awesome-icon :icon="['fas', 'paper-plane']" class="icon-post"/>
        </button>
      </div>
    </div>

    <div class="post-container" v-for="post in posts" :key="post.post_id">
      <div class="user-section">
        <font-awesome-icon :icon="['fas', 'user']" class="user-icon" />
        <div class="user-details">
          <div class="user-name">{{ post.firstname }} {{ post.lastname }}</div>
          <div class="post-date">{{ formatDate(post.created_at) }}</div>
        </div>
      </div>

      <div class="post-options">
        <font-awesome-icon :icon="['fas', 'edit']" class="edit-post-icon" @click="toggleEditMode(post)" />
        <font-awesome-icon :icon="['fas', 'trash']" class="delete-post-icon" @click="deletePost(post)" />
      </div>

      <div>
        <font-awesome-icon v-if="editingPostId === post.post_id" :icon="['fas', 'check']" class="save-post-icon" @click="updatePostText(post)" />
      </div>

      <div class="post-text" v-if="editingPostId !== post.post_id">
        {{ post.textual_post }}
      </div>

      <textarea v-else v-model="newTextualPost" class="update-post-input"></textarea>

      <img crossorigin='anonymous' :src="post.image_url" alt="Posted Image" class="post-image" />

      <!-- Like and Dislike Section -->
      <div class="like-comment-section">
        <div class="like-dislike-section">
          <div @click="likePost(post)" class="like-icon">
            <font-awesome-icon :icon="['fas', 'thumbs-up']" class="icon" />
          </div>
          <div @click="dislikePost(post)" class="dislike-icon">
            <font-awesome-icon :icon="['fas', 'thumbs-down']" class="icon" />
          </div>
        </div>

      <!-- Comment Section -->
        <div class="comment-section">
          <div @click="toggleCommentInput(post)" class="comment-icon">
            <font-awesome-icon :icon="['fas', 'comment']" class="icon" />
          </div>
        </div>
      </div>   

        <div class="comments" v-if="post.showCommentInput">
          <input type="text" v-model="post.newComment" @keyup.enter="addComment(post)" placeholder="Add a comment" />
          <font-awesome-icon @click="addComment(post)" :icon="['fas', 'paper-plane']" class="icon" />
        </div>

        <div class="comments">
          <div class="comment" v-for="comment in post.comments" :key="comment.comment_id">
            {{ comment.comment }}
          </div>
        </div>


    </div>

  </div>
</template>


<script>  
import AppHeader from "@/components/app-header.vue";
import axios from "axios";

export default {
  components: {
  AppHeader,
},
  data() {
    return {
      postContent: '',
      selectedFile: null, 
      previewUrl: null,
      successMessage: '',
      errorMessage: '',
      posts: [],
      editingPostId: null,
    };
  },
  methods: {
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
      this.previewUrl = URL.createObjectURL(this.selectedFile);
    },
    
    clearSelectedFile() {
      this.selectedFile = null;
      this.previewUrl = null;
    },

    formatDate(dateTimeString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateTimeString).toLocaleDateString(undefined, options);
    },

    toggleEditMode(post) {
      this.editingPostId = post.post_id;
      this.newTextualPost = post.textual_post;
    },

    toggleCommentInput(post) {
      post.showCommentInput = !post.showCommentInput;
      if (post.showCommentInput) {
        this.fetchComments(post);
      }
    },

    async createPost() {
        const user_id = this.$store.state.user.user_id;
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append("user_id", user_id);
        formData.append('textual_post', this.postContent);
        formData.append('image_url', this.selectedFile);

        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
          },
        };

    try {

      const response = await axios.post("/api/posts", formData, config);

      if (response.status === 201) {
        this.successMessage = response.data.message;
        this.postContent = '';
        this.errorMessage = "";
        this.selectedFile = null;
        this.previewUrl = null;

        await this.fetchPosts();
        setTimeout(() => {
        this.successMessage = '';
      }, 1500);
      } else {
      this.errorMessage = "Failed to create the post";
    }

      } catch (error) {
        this.errorMessage = 'Error creating the post.';
      }
    },

    async fetchPosts() {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          Authorization: `Bearer ${token}`,
      };

      const response = await axios.get('/api/posts', { headers });
      this.posts = response.data.posts; 
      } catch (error) {
      console.error('Error fetching posts:', error);
      }
    },

    async updatePostText(post) {
      try {
        const postId = post.post_id;
        const updatedText = this.newTextualPost;
        const token = localStorage.getItem('token');

        const response = await axios.put(`/api/posts/${postId}`, {
          textual_post: updatedText,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          this.successMessage = 'Post updated successfully';
          this.errorMessage = '';
          this.editingPostId = null;

          await this.fetchPosts();
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

    async addComment(post) {
      try {
        const postId = post.post_id;
        const commentText = post.newComment;

        const token = localStorage.getItem('token');

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.post(`/api/comments/${postId}`, {
          postId: postId,
          userId: this.user.user_id,
          comment: commentText,
        }, { headers });

        if (response.status === 201) {
          post.comments.push(response.data);
          post.newComment = '';
          this.toggleCommentInput(post);
          this.successMessage = 'Comment added successfully';
          this.errorMessage = '';
          setTimeout(() => {
            this.successMessage = '';
          }, 1500);

        } else {
          this.errorMessage = 'Failed to add the comment. Please try again.';     
        }
      } catch (error) {
        console.error('Error adding comment:', error);
        this.errorMessage = 'An error occurred while adding the comment. Please try again later.';
      }
    },

    async loadPostsAndComments() {
      await this.fetchPosts();
      for (const post of this.posts) {
      await this.fetchComments(post);
      }
    },

    async fetchComments(post) {
      try {
        const postId = post.post_id;
        const token = localStorage.getItem('token');

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(`/api/comments/${postId}`, { headers });

        if (response.status === 200) {
          post.comments = response.data.comments;
        } else {
          console.error('Error fetching comments:', response.status);
          this.errorMessage = 'Failed to fetch comments. Please try again.';
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
        this.errorMessage = 'An error occurred while fetching comments. Please try again.';
      }
    },
  },

  created() {
    this.fetchPosts();
    this.loadPostsAndComments();
  },
};
</script>

<style scoped>
.create-post {
  display: flex;
  flex-direction: column; 
  justify-content: center; 
  align-items: center; 
  padding: 20px 30px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  max-width: 50%; 
  margin: 30px auto; 
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

.user-profile {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
}

.profile-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 30px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

.user-icon {
  color: #333;  
  font-size: 30px;
  padding: 10px;
  border-radius: 50%;
  margin-right: 30px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3); 
}

.post-input {
  flex: 1;
  width: 100%;
  padding: 10px;
  height: 50px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
}

.post-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 10px;
}

.file-input {
  width: 50%;
}

.file-label {
  cursor: pointer;  
  margin-right: 50px;
  color: rgb(5, 5, 153);
}

.file-input {
  display: none;
}

.post-button {
  cursor: pointer;
  margin-left: 50px;
  color: rgb(70, 70, 72);
  background-color: white;
  border: none;
  color: rgb(5, 5, 153);
  font-family: Georgia, "Times New Roman", Times, serif, Helvetica, Arial, sans-serif;
  font-size: 16px;
}

.icon-post {
  color: rgb(59, 4, 137);
  font-size: 13px;
}

.uploaded-image-container {
  position: relative;
}

.uploaded-image {
  max-width: 100%;
  max-height: 250px;
  margin: 10px 0;
}

.delete-button {
  position: absolute;
  top: -2px;
  right: -10px;
  background: transparent;
  border: none;
  font-size: 20px;
  font-weight: bold;
  color: red;
  cursor: pointer;
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

.post-options {
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 30px;
  right: 35px;
}

.edit-post-icon {
  font-size: 17px;
  cursor: pointer;
  margin-bottom: 15px;
  color: green;
}

.delete-post-icon {
  font-size: 17px;
  cursor: pointer;
  color: red;
}

.update-post-input {
  max-width: 100%;
  margin: 20px 0;
  height: 50px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 10px;
}

.save-post-icon {
  font-size: 24px; 
  color: rgb(5, 160, 5);
  cursor: pointer; 
  padding: 10px;
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

.post-text {
  margin: 15px 0;
  display: flex;
}

.post-image {
  max-width: 100%;
  height: auto;
}

.like-comment-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.like-dislike-section {
  display: flex;
  align-items: center;
  padding: 10px;
  gap: 30px;
}

.like-icon {
  cursor: pointer;
  color: green;
}

.dislike-icon {
  cursor: pointer;
  color: red;
}

.comment-icon {
  cursor: pointer;
  color: #333;
}
  
.comment-section {
  display: flex;
  align-items: center;
  padding: 10px;
}

.comments {
  flex-direction: column;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 5px;
}

.success-message {
  color: white;
  background-color: #55eb5a;
  padding: 8px;
  border-radius: 5px; 
}

.error-message {
  color: white;
  background-color: red;
  padding: 8px;
  border-radius: 5px; 
}

@media (max-width: 768px) {
.create-post {
  padding: 10px;
  max-width: 100%;
}

.profile-image {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}

.user-icon {
  font-size: 25px;
}

.post-input {
  padding: 5px;
  height: 30px;
}

.post-container {
  padding: 10px;
  max-width: 100%;
}

.user-name {
  font-size: 15px;
}

.post-date {
  font-size: 13px;
}
}

</style>

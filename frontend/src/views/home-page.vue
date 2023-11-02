<template>
  <div>
    <app-header></app-header>

    <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

    <div class="create-post">
      <div class="user-profile">
        <img class="profile-image" src="@/assets/logo-white.png" alt="User Profile Image" />
        <input type="text" class="post-input" placeholder="What's on your mind?" v-model="postContent" />
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

    <div class="post-container create-post" v-for="post in posts" :key="post.post_id">
      <div class="user-section">
        <img :src="post.user_image" alt="User Profile" class="user-image" />
        <div class="user-details">
          <div class="user-name">{{ post.firstname }} {{ post.lastname }}</div>
          <div class="post-date">{{ formatDate(post.created_at) }}</div>
        </div>
      </div>

      <div class="post-text">
        {{ post.textual_post }}
      </div>

      <img crossorigin='anonymous' :src="post.image_url" alt="Posted Image" class="post-image" />
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
  },

  created() {
    this.fetchPosts();
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
  color: rgb(70, 70, 72);
}

.file-input {
  display: none;
}

.post-button {
  width: 70px;
  height: 25px;
  margin-left: 50px;
  color: rgb(70, 70, 72);
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
  border: 1px solid #ccc;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  margin: 10px 0;
  padding: 10px;
  display: flex;
  flex-direction: column;
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
}

.post-text {
  margin: 10px 0;
}

.post-image {
  max-width: 100%;
  height: auto;
}

.post-container {
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

.post-input {
  padding: 5px;
  height: 30px;
}
}

</style>

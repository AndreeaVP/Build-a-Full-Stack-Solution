<template>
  <div>
    <app-header></app-header>

    <div class="create-post">
      <div class="user-profile">
        <img class="profile-image" src="@/assets/dfg.jpg" alt="User Profile Image" />
        <input type="text" class="post-input" placeholder="What's on your mind?" v-model="postContent" />
      </div>

      <div class="uploaded-image-container">
        <img class="uploaded-image" :src="selectedFile" alt="Uploaded Image" v-if="selectedFile" />
        <button class="delete-button" @click="clearSelectedFile" v-if="selectedFile">x</button>
      </div>

      <div class="post-actions">       
        <label for="file-upload" class="file-label"> Upload File
          <font-awesome-icon :icon="['fas', 'upload']" class="icon-post"/>
        </label>
        <input type="file" id="file-upload" name="image_url" class="file-input" @change="onFileChange" />
        <button class="post-button" @click="createPost"> Post
          <font-awesome-icon :icon="['fas', 'paper-plane']" class="icon-post"/>
        </button>
      </div>
    </div>

    <div class="post-container create-post" v-for="post in posts" :key="post.post_id">
      <div class="user-section">
        <img :src="post.user_image" alt="User Profile" class="user-image" />
        <div class="user-details">
          <div class="user-name">{{ post.user_name }}</div>
          <div class="post-date">{{ post.created_at }}</div>
        </div>
      </div>

      <div class="post-text">
        {{ post.textual_post }}
      </div>

      <img :src="post.image_url" alt="Posted Image" class="post-image" />
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
      postContent: "",
      selectedFile: null,
      posts: [],
    };
  },

  mounted() {
    this.fetchPosts();
  },

  methods: {
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = URL.createObjectURL(file);
      }
      },
    clearSelectedFile() {
      this.selectedFile = null;
    },

    async fetchPosts() {

  if (this.$store.state.token) {
    try {
      const response = await axios.get("/api/posts", {
        headers: {
          Authorization: `Bearer ${this.$store.state.token}`,
        },
      });

      if (response.status === 200) {
        this.posts = response.data;
      } else {
        console.error("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts", error);
    }
  } else {
    console.error("User is not authenticated. Please log in.");
  }
},

      async createPost() {
        console.log('createPost function called');

        console.log('User ID in Vuex Store:', this.$store.state.user.userId);

    try {
    const formData = new FormData();
    formData.append("user_id", this.$store.state.user.userId);
    formData.append("textual_post", this.postContent);

    if (this.selectedFile) {
      formData.append("file", this.selectedFile);
    }

    console.log('User Data in Vuex Store:', this.$store.state.user);

    const config = {
  headers: {
    "Content-Type": "multipart/form-data",
    "Authorization": `Bearer ${this.$store.state.token}`,
  }
};

const response = await axios.post("/api/posts", formData, config);


    console.log('Response:', response);

    if (response.status === 201) {
      this.successMessage = "Post created successfully";
      this.errorMessage = "";
      this.postContent = "";
      this.selectedFile = "";
    } else {
      this.errorMessage = "Failed to create the post";
    }
  } catch (error) {
    console.error("Error creating the post:", error);
    this.errorMessage = "Failed to create the post";
  }
},

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
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}

.user-profile {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
}

.profile-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 30px;
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
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
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
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
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

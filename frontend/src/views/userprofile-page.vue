<template>
  <div>
    <app-header></app-header>

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

      <font-awesome-icon @click="toggleSettings" :icon="['fas', 'sliders']" class="icon-settings" v-if="!showSettings" />

      <!-- Settings options -->
      <div v-if="showSettings" class="settings-container">
        <div class="close-button-container">
          <font-awesome-icon :icon="['fas', 'times']" class="icon-close" @click="closeSettings" />
        </div>

        <div class="profile-image-section">
          <h3>{{ user.image_url ? 'Update Image' : 'Upload an Image' }}</h3>
          <img :src="user.image_url" alt="Profile Image">
          <div class="change-image-button">
            <button>{{ user.image_url ? 'Change Your Image' : 'Upload an Image' }}</button>
          </div>
        </div>


        <hr class="separator">
        
        <div class="change-password-section">
          <h3>Change Password</h3>
          <div class="new-password-container">
            <label for="newPassword">Your New Password</label>
            <input type="password" id="newPassword" v-model="newPassword">
          </div>
          <div class="submit-button-container">
            <button @click="changePassword">Submit</button>
          </div>
        </div>

        <hr class="separator">

        <div class="delete-account-section">
          <h3>Delete Account</h3>
          <div class="delete-button-container">
            <button @click="deleteAccount">Delete Account</button>
          </div>
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
      user: {
        image_url: null,
      },
      oldPassword: "",
      newPassword: "",
      showSettings: false,
      successMessage: '',
      errorMessage: '',
    };
  },
  computed: {

  },
  methods: {
    toggleSettings() {
      this.showSettings = !this.showSettings;
    },

    closeSettings() {
      this.showSettings = false;
    },

    changeProfileImage() {
      // change the profile image
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
  },

  async created() {
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
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
};
</script>

<style scoped>
.user-profile {
  position: relative;
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  max-width: 50%;
  margin: 110px auto 30px auto;
  background: linear-gradient(180deg,  rgb(169, 181, 251),#fbedc6);
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

.icon-settings {
  margin-left: auto;
}

.settings-container {
  position: absolute;
  top: 0px;
  right: 20px;
  background: linear-gradient(30deg, #a3f5f7, #e0e0e0); 
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
}

.profile-image-section {
  text-align: center;
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
  margin: 20px 0;
  border: 1px solid #eb0db3;
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

@media (max-width: 768px) {
  .user-profile {
    margin-top: 80px;
  }

  .user-icon {
  font-size: 25px;
}
}

</style>


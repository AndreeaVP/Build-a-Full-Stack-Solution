<template>
  <div>
    <app-header></app-header>

    <div class="user-profile">
      <div class="account-image">
        <img :src="user.image_url" alt="Profile Image">
      </div>

      <div class="profile-info">
        <p>Name: {{ user.firstname }} {{ user.lastname }}</p>
        <p class="email">Email: {{ user.email }}</p>
      </div>

      <font-awesome-icon @click="toggleSettings" :icon="['fas', 'sliders']" class="icon-settings" v-if="!showSettings" />

      <!-- Settings options -->
      <div v-if="showSettings" class="settings-container">
        <div class="close-button-container">
          <font-awesome-icon :icon="['fas', 'times']" class="icon-close" @click="closeSettings" />
        </div>

        <div class="profile-image-section">
          <h3>Image Update</h3>
          <img src="your-profile-image-url.jpg" alt="Profile Image">
          <div class="change-image-button">
            <button>Change Your Image</button>
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

export default {
  components: {
    AppHeader,
  },
  data() {
    return {
      user: {},
      oldPassword: "",
      newPassword: "",
      showSettings: false,
    };
  },
  methods: {


    toggleSettings() {
      this.showSettings = !this.showSettings; 
    },

    closeSettings() {
    this.showSettings = false;
    },

    changeProfileImage() {

    },

    changePassword() {

    },

    deleteAccount() {

    },
  },
  created() {

  },
};
</script>

<style scoped>
.user-profile {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  max-width: 50%;
  margin: 30px auto;
  background: linear-gradient(45deg, #f7a2e2, #F0F0F0);
  color: #000;
}

.account-image {
  width: 60px;
  height: 60px;
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
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  max-width: 50%;
  margin: 30px auto;
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

</style>


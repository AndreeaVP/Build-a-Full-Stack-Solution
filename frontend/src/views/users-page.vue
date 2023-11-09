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

      </div>
    </div>
  </template>

<script>
import AppHeader from '@/components/app-header.vue';
import axios from 'axios';

export default {
  components: {
    AppHeader,
  },
  data() {
    return {
      user: {
        image_url: null,
      },
      successMessage: '',
      errorMessage: '',
    };
  },
  created() {
  const user_id = this.$route.params.user_id;
  if (user_id) {
    this.fetchUserDetails(user_id);
  }
},
  methods: {
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
  },
};
</script>

<style scoped>
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

</style>
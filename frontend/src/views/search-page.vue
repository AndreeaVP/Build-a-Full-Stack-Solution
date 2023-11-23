<template>
  <div>
    <app-header></app-header>

    <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

    <section id="search" class="search">
      <h1 class="page-title">Search</h1>
      <form @submit.prevent="search" class="search-form">
        <label for="search" class="visually-hidden">Search:</label>
        <div class="input-container" :class="{ 'no-results': filteredSearchResults.length === 0 && query.length >= 3 }">
          <font-awesome-icon :icon="['fas', 'circle-info']" class="info-icon" title="Enter at least 3 characters to start the search" />
          <input v-model="query" @input="search" type="text"  id="search" placeholder="Search..." class="search-input">
          <font-awesome-icon :icon="['fas', 'search']" class="icon-search" @click="search" />
        </div>
      </form>
    </section>

    <section id="search-results">
      <div class="user-container">
        <div v-for="user in filteredSearchResults" :key="user.user_id" class="user-card" @click="navigateToUsersPage(user.user_id)">
          <div class="user-image-container">
            <img v-if="user.image_url" crossorigin="anonymous" :src="user.image_url" alt="User Profile" class="user-image-search" />
            <font-awesome-icon v-else :icon="['fas', 'user']" class="user-icon-search-page" />
          </div>
          <span class="user-name-search">{{ user.firstname }} {{ user.lastname }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import AppHeader from "@/components/app-header.vue";
import axios from "axios";
import debounce from 'lodash/debounce';

export default {
  components: {
    AppHeader,
  },
  data() {
    return {
      query: "",
      searchResults: [],
      successMessage: '',
      errorMessage: '',
    };
  },
  computed: {
    filteredSearchResults() {
      return this.searchResults.filter(user => {
        const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
        return fullName.includes(this.query.toLowerCase());
      });
    },
  },
  methods: {
    async performSearch() {
      const token = localStorage.getItem('token');

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get('/api/user', {
          params: { query: this.query },
          ...config,
        });

        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        const loggedInUserId = loggedInUser ? loggedInUser.user_id : null;
        this.searchResults = response.data.filter(user => user.user_id !== loggedInUserId);

      } catch (error) {
        console.error('Error searching users:', error);
      }
    },

    navigateToUsersPage(user_id) {
      try {
        this.showSuccessMessage('Redirecting to user page...');
        setTimeout(() => {
          if (Math.random() > 1.5) {
            throw new Error('An error occurred during redirection.');
          }
          this.$router.push({ name: 'userspage', params: { user_id } });
          this.clearMessages();
        }, 1000);
      } catch (error) {
        this.showErrorMessage('Error during redirection: ' + error.message);
        this.clearMessages();
      }
    },

    showSuccessMessage(message) {
      this.successMessage = message;
    },

    showErrorMessage(message) {
      this.errorMessage = message;
    },

    clearMessages() {
      this.successMessage = '';
      this.errorMessage = '';
    },

    search: debounce(function() {
      if (this.query.length >= 3) {
        this.performSearch();
      } else {
        this.searchResults = [];
        if (this.query === "") {
          this.loadInitialData();
        }
      }     
    }, 300),

    async loadInitialData() {
      const token = localStorage.getItem('token');

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get('/api/user', config);
        const loggedInUserId = JSON.parse(localStorage.getItem('user')).user_id;
        this.searchResults = response.data.filter(user => user.user_id !== loggedInUserId);

      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    },
  },
  created() {
    this.loadInitialData();
  },
};
</script>

<style scoped>
.search {
  margin-top: 110px;
}
.search-form {
  display: flex;
  justify-content: center;
  align-items: center;
}

.input-container {
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0 10px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1); 
}

.search-input {
  flex: 1;
  padding: 10px;
  font-size: 16px;
  border: none; 
  outline: none; 
}

.icon-search {
  cursor: pointer;
  margin-left: 10px;
  font-size: 24px;
  padding: 6px 5px;
  color: blue;
}

.info-icon {
  cursor: pointer;
}

.user-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 50px 50px;
}

.user-card {
  display: flex;
  width: calc(30% - 10px);
  margin: 0 5px 20px;
  cursor: pointer;
  align-items: center;
  border: 1px solid rgba(0, 0, 0, 0);
  justify-content: flex-start;;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  transition: box-shadow 0.3s ease-in-out, border 0.3s ease-in-out;
}

.user-card:hover {
  box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.user-image-container {
  display: flex;
}

.user-icon-search-page {
  color: white;  
  background-color: rgb(121, 120, 120);
  font-size: 30px;
  padding: 10px 12px;
  border-radius: 50%;
  margin-left: 20px;
}

.user-image-search {
  width: 50px;
  object-fit: cover;
  margin-left: 20px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

.user-name-search {
  margin-left: 30px;
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

.no-results {
  border: 2px solid red;
  border-radius: 5px;
}

.visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }

@media (max-width: 1100px) and (min-width: 769px) {
  .user-card {
    width: calc(40% - 10px);
    margin-left: 5px; 
    margin-right: 5px; 
    height: 30px;
  }

  .user-image-search {
    width: 40px;
    margin-left: 0;
    height: 40px;
  }

  .user-name-search {
    margin-left: 10px;
  }
}

@media (max-width: 768px) {
.search {
  margin-top: 80px;
}

.page-title {
  font-size: 20px;
}

.icon-search {
  font-size: 20px;
}

.user-container {
  margin: 40px 20px;
}

.user-card {
  width: 100%;
  margin-left: 5px;
  margin-right: 5px;
}

.user-icon-search-page {
  font-size: 25px;
}

.user-image-search {
  width: 40px;
  height: 40px;
}
}
</style>

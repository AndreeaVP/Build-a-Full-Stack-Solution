<template>
  <div>
    <app-header></app-header>

    <section id="search">
      <h1 class="page-title">Search</h1>
      <form @submit.prevent="search" class="search-form">
        <input v-model="query" type="text" placeholder="Search..." class="search-input">
        <button type="submit" class="search-button">
          <font-awesome-icon :icon="['fas', 'search']" class="icon-search" />
        </button>
      </form>
    </section>

    <section id="search-results">
      <div class="user-container">
        <div v-for="user in searchResults" :key="user.user_id" class="user-card">
          <img :src="user.image_url" alt="User Image" class="user-image">
          <span class="user-name">{{ user.firstname }} {{ user.lastname }}</span>
        </div>
      </div>
    </section>
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
      query: "",
      searchResults: [],
    };
  },
  methods: {
    async fetchAllUsers() {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${this.$store.state.token}`,
      },
    };
    const response = await axios.get('/api/user', config);
    this.searchResults = response.data.users;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}
  },
  created() {
    this.fetchAllUsers();
  },
};
</script>


<style scoped>
.search-form {
  display: flex;
  justify-content: center;
  align-items: center;
}

.search-input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}

.search-button {
  background: #007BFF;
  border: none;
  margin-left: 10px;
  border-radius: 5px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}

.icon-search {
  padding: 6px 5px;
  font-size: 24px;
  color: white;
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
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

.user-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

.user-name {
  margin-top: 10px;
}

@media (max-width: 1100px) {
  .user-card {
    width: calc(25% - 10px);
    margin-left: 5px; 
    margin-right: 5px; 
    height: 30px;
  }

  .user-image {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 768px) {
.page-title {
  font-size: 20px;
}

.icon-search {
  font-size: 20px;
  padding: 8px 5px;
}

.user-container {
  margin: 40px 20px;
}

.user-card {
  width: 100%;
  margin-left: 5px;
  margin-right: 5px;
}
}

</style>

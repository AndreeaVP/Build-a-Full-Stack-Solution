<template>
  <div>
    <app-header></app-header>

    <section id="search">
      <h1 class="page-title">Search</h1>
      <form @submit.prevent="search" class="search-form">
        <div class="input-container">
          <input v-model="query" @input="search" type="text" placeholder="Search..." class="search-input">
          <font-awesome-icon :icon="['fas', 'search']" class="icon-search" @click="search" />
        </div>
      </form>
    </section>

    <section id="search-results">
      <div class="user-container">
        <div v-for="user in filteredSearchResults" :key="user.user_id" class="user-card" @click="navigateToUserProfile(user.user_id)">
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
import debounce from 'lodash/debounce';

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
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
          },
        };
        const response = await axios.get('/api/user', {
          params: { query: this.query },
          ...config,
        });
        this.searchResults = response.data;
      } catch (error) {
        console.error('Error searching users:', error);
      }
    },

    navigateToUserProfile(user_id) {
      if (user_id === this.$store.state.user.user_id) {
        this.$router.push({ name: 'userprofile', query: { user_id } });
      } else {
        this.$router.push({ name: 'userprofile', query: { id: user_id } });
      }
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
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
          },
        };
        const response = await axios.get('/api/user', config);
        this.searchResults = response.data;
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
  justify-content: flex-start;;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

.user-image {
  width: 50px;
  margin-left: 20px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

.user-name {
  margin-left: 30px;
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
    margin-left: 0;
    height: 40px;
  }

  .user-name {
    margin-left: 10px;
  }
}

@media (max-width: 768px) {
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
}

</style>

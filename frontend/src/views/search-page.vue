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
      <h2 class="search-results-title">Search Results</h2>
      <ul>
        <li v-for="result in searchResults" :key="result.id" class="search-result-item">
          <a :href="result.link">{{ result.title }}</a>
          <p>{{ result.description }}</p>
        </li>
      </ul>
    </section>
    
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
      query: "",
      searchResults: [],
    };
  },
  methods: {
    
  }
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

@media (max-width: 768px) {
.page-title {
  font-size: 20px;
}

.icon-search {
  font-size: 20px;
  padding: 8px 5px;
}

.search-results-title {
  font-size: 20px;
}
}

</style>

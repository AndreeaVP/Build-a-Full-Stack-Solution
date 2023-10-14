<template>
  <header class="app-header">
    <div class="logo-container">
      <img src="@/assets/logo-white.png" alt="Logo" class="logo" />
    </div>
  
    <div class="navbar">
      <ul class="nav-list">
        <li><router-link to="/home">Home</router-link></li>
        <li><router-link to="/search">Search</router-link></li>
        <li><router-link to="/notification">Notification</router-link></li>
        <li><router-link to="/userprofile">User Profile</router-link></li>
      </ul>

      <button @click="logout" class="logout-button">
        <font-awesome-icon class="icon" :icon="['fas', 'power-off']" />
      </button>

    </div>
      
  </header>
</template>
  
  
<script>
export default {
  methods: {
    async logout() {
      try {
      this.$store.dispatch('logout');
      this.$router.push('/');
    } catch (error) {
      console.error(error);
    }
   },
  },
};
</script>
  
<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 50px;
  height: 10vh;
  background-color: #222;
}

.logo {
  width: 180px;
  height: auto;
}

.navbar {
  display: flex;
  align-items: center;
  gap: 30px;
}

.nav-list {
  list-style: none;
  display: flex;
  gap: 30px;
}

.nav-list a {
  text-decoration: none;
  color: white;
}

.logout-button {
  background-color: red; 
  color: white;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.icon {
  font-size: 15px;
}

</style>
  
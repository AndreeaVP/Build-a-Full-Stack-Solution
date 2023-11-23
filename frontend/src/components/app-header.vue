<template>
  <header class="app-header">
    <div class="logo-container">
      <img src="@/assets/logo-white.png" alt="Logo" class="logo" />
    </div>

    <div class="navbar">
      <ul class="nav-list">
        <li role="menuitem">
          <router-link to="/home">
            <span v-if="isLargeScreen" class="nav-item-text">Home</span>
            <font-awesome-icon v-if="isSmallScreen" class="icon" :icon="['fas', 'home']" aria-label="Home"/>
          </router-link>
        </li>
        <li role="menuitem">
          <router-link to="/search">
            <span v-if="isLargeScreen" class="nav-item-text">Search</span>
            <font-awesome-icon v-if="isSmallScreen" class="icon" :icon="['fas', 'search']" aria-label="Search"/>
          </router-link>
        </li>
        <li role="menuitem">
          <router-link to="/notification">
            <span v-if="isLargeScreen" class="nav-item-text">Notification</span>
            <font-awesome-icon v-if="isSmallScreen" class="icon" :icon="['fas', 'bell']" aria-label="Notification" />
          </router-link>
        </li>
        <li role="menuitem">
          <router-link to="/myprofile">
            <span v-if="isLargeScreen" class="nav-item-text">User Profile</span>
            <font-awesome-icon v-if="isSmallScreen" class="icon" :icon="['fas', 'user']" aria-label="User Profile"/>
          </router-link>
        </li>
      </ul>

      <button @click="logout" class="logout-button">
        <span class="visually-hidden">Log out</span>
        <font-awesome-icon class="icon" :icon="['fas', 'power-off']" />
      </button>
    </div>
  </header>
</template>

<script>
import { computed, ref, watch, onMounted } from 'vue';

export default {
  setup() {
    const screenWidth = ref(window.innerWidth);
    const isSmallScreen = computed(() => screenWidth.value < 768);
    const isLargeScreen = computed(() => screenWidth.value >= 768);

    const updateScreenWidth = () => {
      screenWidth.value = window.innerWidth;
    };

    watch(screenWidth, () => {
    });

    onMounted(() => {
      window.addEventListener('resize', updateScreenWidth);
    });

    return {
      isSmallScreen,
      isLargeScreen,
    };
  },
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
  padding: 10px 20px;
  height: 10vh;
  background-color: #222;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
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
  display: flex;
  align-items: center;
}

.logout-button {
  background-color: darkred;
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

@media (max-width: 1000px) and (min-width: 769px) {
  .app-header {
    height: 6vh;
  }
}

@media screen and (max-width: 768px) {
  .app-header {
    height: 5vh;
  }

  .logo {
    width: 110px;
    height: auto;
  }

  .navbar {
    gap: 20px;
  }

  .nav-list {
    gap: 20px;
  }

  .nav-list a {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .nav-item-text {
    display: none;
  }

  .logout-button {
  padding: 4px 5px;
  }

  .icon {
  font-size: 13px;
  }
}

</style>

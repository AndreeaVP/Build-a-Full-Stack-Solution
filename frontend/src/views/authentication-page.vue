<template>
  <div class="authentication">
    <div class="auth-container">
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      
      <div class="auth-form">

        <div class="welcome-section">
          <img src="@/assets/logo-above.png" alt="Company logo" class="small-logo">
          <h2>Welcome to the Collaborative Hub!</h2>
        </div>

        <!-- Login form -->
        <div v-if="isLogin" class="login-form">
          <h3 class="page-title">Log in</h3>

          <div class="form-field">
            <font-awesome-icon class="icon" icon="envelope" />
          <input class="input-field" type="email" id="email" v-model="loginData.email" placeholder="E-mail: example@yahoo.com" @focus="clearPlaceholder('email')" required/>
          </div>

          <div class="form-field">
            <font-awesome-icon class="icon" icon="lock" />
          <input class="input-field" type="password" id="password" v-model="loginData.password" placeholder="Password" @focus="clearPlaceholder('password')" required/>
          </div>

          <button @click="login" class="submit-button">Login</button>

          <p>Create a new account? <a class="toggle-link" @click="toggleForm('signup')">Sign up</a></p>
        </div>

        <!-- Signup form -->
        <div v-if="!isLogin" class="signup-form">
          <h3 class="page-title">Sign up</h3>
          <form @submit.prevent="signup">

          <div class="form-field">
            <font-awesome-icon class="icon" icon="user-circle" />
          <input class="input-field" type="text" id="firstName" v-model="signupData.firstName" placeholder="First Name" @focus="clearPlaceholder('firstName')" required pattern="[A-Za-z -']+"/>
          </div>

          <div class="form-field">
            <font-awesome-icon class="icon" icon="user-circle" />
          <input class="input-field" type="text" id="lastName" v-model="signupData.lastName" placeholder="Last Name" @focus="clearPlaceholder('lastName')" required pattern="[A-Za-z -']+"/>
          </div>

          <div class="form-field">
            <font-awesome-icon class="icon" icon="envelope" />
          <input class="input-field" type="email" id="email" v-model="signupData.email" placeholder="E-mail: example@yahoo.com" @focus="clearPlaceholder('email')" required/>
          </div>

          <div class="form-field">
            <font-awesome-icon class="icon" icon="lock" />
          <input class="input-field" type="password" id="password" v-model="signupData.password" placeholder="Password (8 characters long)" @focus="clearPlaceholder('password')" required/>
          </div>

          <div class="form-field">
            <font-awesome-icon class="icon" icon="lock" />
          <input class="input-field" type="password" id="confirmPassword" v-model="signupData.confirmPassword" placeholder="Confirm Password" @focus="clearPlaceholder('confirmPassword')" required/>
          </div>

          <button @click="signup" class="submit-button">Create Your Account</button>
        </form>

          <p>Already have an account? <a class="toggle-link" @click="toggleForm('login')">Log in</a></p>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUserCircle, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

library.add(faUserCircle, faEnvelope, faLock);

export default {
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
      isLogin: true,
      loginData: {
        email: '',
        password: '',
      },

      signupData: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      },

      errorMessage: '',
      successMessage: '',
    };
  },
  methods: {
    toggleForm(formType) {
      this.errorMessage = ''; 
      this.successMessage = '';

    if (formType === 'login') {
      this.isLogin = true;
    } else if (formType === 'signup') {
      this.isLogin = false;
    }
    },
    clearPlaceholder(field) {
      this.loginData[field] = '';
    },
    isValidName(name) {
      const namePattern = /^[A-Za-z]+$/;
      return namePattern.test(name);
    },
    isValidEmailFormat(email) {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      return emailPattern.test(email);
    },

    async signup() {
      if (!this.signupData.firstName || !this.signupData.lastName || !this.signupData.email || !this.signupData.password || !this.signupData.confirmPassword) {
        this.errorMessage = 'Please fill in all required fields';
        return;
      }

      if (!this.isValidName(this.signupData.firstName) || !this.isValidName(this.signupData.lastName)) {
        this.errorMessage = 'Please enter a valid first name and last name (letters only)';
        return;
      }

      if (!this.isValidEmailFormat(this.signupData.email)) {
        this.errorMessage = 'Please enter a valid email address';
        return;
      }

      if (this.signupData.password !== this.signupData.confirmPassword) {
        this.errorMessage = 'Passwords do not match';
        return;
      }

      if (this.signupData.password.length < 8) {
       this.errorMessage = 'Password must be at least 8 characters long';
       return;
      }

      try {
        const response = await axios.post('/api/auth/signup', this.signupData);

      if (response.status === 201) {
        this.successMessage = response.data.message;
        this.errorMessage = '';
        this.email = this.signupData.email;

        this.signupData = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        };

      this.isLogin = true;

      setTimeout(() => {
        this.successMessage = '';
      }, 1500);
      } else if (response.status === 400) {
        this.errorMessage = response.data.error;
      } else {
        this.errorMessage = 'Error: ' + response.statusText;
      }
      } catch (error) {
      if (error.response && error.response.status === 500) {
        this.errorMessage = error.response.data.error;
      } else if (error.response) {
        this.errorMessage = 'Error: ' + error.response.statusText;
      } else {
        this.errorMessage = 'Network Error: Unable to connect to the server';
      }
    } 
},

    async login() {
      if (!this.loginData.email || !this.loginData.password) {
        this.errorMessage = 'Please fill in both email and password fields.';
        return;
      }
      try {
        const response = await axios.post('/api/auth/login', this.loginData);

      if (response.status === 200) {
        this.$store.commit('setToken', response.data.token);
        console.log('Authentication Token:', response.data.token);
        this.$store.commit('setUser', response.data.user);
        this.successMessage = response.data.message;
        this.errorMessage = '';
        setTimeout(() => {
        this.successMessage = '';
        this.navigateToHomePage();
      }, 1200);
      } else {
      this.errorMessage = 'Invalid email or password. Please try again.';
      }
    } catch (error) {
      if (error.response.status === 401) {
        this.errorMessage = 'Invalid email or password. Please try again.';
      } else {
        this.errorMessage = 'Error: ' + error.message;
      }
    }
  },
    showSuccessMessage(message) {
      this.successMessage = message;
    },

    navigateToHomePage() {
      this.$router.push({ name: 'home' });
    },
  }
};
</script>

<style scoped>
.authentication {
  width: 100%;
  height: 100vh;
  background: linear-gradient(to bottom, #343434, #040404);
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 768px) {
  .auth-container {
    margin: 0 20px;
  }
}

.auth-container {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.auth-form {
  text-align: center;
}

.welcome-section {
  margin-bottom: 10px;
}

.small-logo {
  width: 120px;
  height: auto; 
}

h2 {
    margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  align-items: center; 
  text-align: center; 
}

.page-title { 
font-size: 23px;
}

.form-field {
  margin-bottom: 20px;
  position: relative;
}

.input-field{
  padding-left: 30px;
  height: 30px;
  width: 250px; 
  border-radius: 5px;
  border: 1px solid rgb(229, 230, 230);
  box-shadow: 0 7px 15px rgba(49, 48, 48, 0.2);
}

.icon {
  position: absolute;
  top: 50%;
  font-size: 14px;
  padding-left: 10px;
  padding-right: 10px;
  transform: translateY(-50%);
  z-index: 2;
  color: rgb(29, 2, 103);
}

.input-field:focus::placeholder {
  color: transparent;
}

.submit-button {
  background-color: rgb(193, 32, 158); 
  color: white;
  padding: 7px 30px; 
  border: none;
  border-radius: 5px; 
  cursor: pointer;
  box-shadow: 1px 3px 5px rgba(29, 28, 28, 0.2);
}

.submit-button:hover {
  background-color: rgb(172, 28, 114); 
}

.toggle-link {
  text-decoration: underline;
  color: #0077b6;
  cursor: pointer; 
}

.toggle-link:hover {
  color: #036194; 
}

.success-message {
  color: white;
  background-color: #55eb5a;
  padding: 8px;
  border-radius: 5px; 
}

.error-message {
  color: white;
  background-color: red;
  padding: 8px;
  border-radius: 5px; 
}

</style>
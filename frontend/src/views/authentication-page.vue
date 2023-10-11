<template>
  <div class="authentication">
    <div class="auth-container">
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
          <input class="input-field"
            type="email"
            id="email"
            v-model="loginData.email"
            placeholder="E-mail: example@yahoo.com"
            @focus="clearPlaceholder('email')"
          />
          </div>

          <div class="form-field">
            <font-awesome-icon class="icon" icon="lock" />
          <input class="input-field"
            type="password"
            id="password"
            v-model="loginData.password"
            placeholder="Password"
            @focus="clearPlaceholder('password')"
          />
          </div>

          <button @click="login" class="submit-button">Login</button>

          <p>Create a new account? <a class="toggle-link" @click="toggleForm('signup')">Sign up</a></p>
        </div>

        <!-- Signup form -->
        <div v-if="!isLogin" class="signup-form">
          <h3 class="page-title">Sign up</h3>
          <div class="form-field">
            <font-awesome-icon class="icon" icon="user-circle" />
          <input class="input-field"
            type="text"
            id="firstName"
            v-model="signupData.firstName"
            placeholder="First Name"
            @focus="clearPlaceholder('firstName')"
          />
          </div>

          <div class="form-field">
            <font-awesome-icon class="icon" icon="user-circle" />
          <input class="input-field"
            type="text"
            id="lastName"
            v-model="signupData.lastName"
            placeholder="Last Name"
            @focus="clearPlaceholder('lastName')"
          />
          </div>

          <div class="form-field">
            <font-awesome-icon class="icon" icon="envelope" />
          <input class="input-field"
            type="email"
            id="email"
            v-model="signupData.email"
            placeholder="E-mail: example@yahoo.com"
            @focus="clearPlaceholder('email')"
          />
          </div>

          <div class="form-field">
            <font-awesome-icon class="icon" icon="lock" />
          <input class="input-field"
            type="password"
            id="password"
            v-model="signupData.password"
            placeholder="Password"
            @focus="clearPlaceholder('password')"
          />
          </div>

          <div class="form-field">
            <font-awesome-icon class="icon" icon="lock" />
          <input class="input-field"
            type="password"
            id="confirmPassword"
            v-model="signupData.confirmPassword"
            placeholder="Confirm Password"
            @focus="clearPlaceholder('confirmPassword')"
          />
          </div>

          <button @click="signup" class="submit-button">Create Your Account</button>

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
    };
  },
  methods: {
    toggleForm(formType) {
      this.isLogin = formType === 'login';
    },
    clearPlaceholder(field) {
      this.loginData[field] = '';
    },
  },
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
  border-style: double;
  border-color: rgb(229, 230, 230);
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

</style>

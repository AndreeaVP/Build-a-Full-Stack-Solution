<template>
  <div class="authentication">
    <div class="auth-container">
      <div class="auth-form">

        <!-- Welcome section -->
        <div class="welcome-section">
          <div v-if="successMessage" class="success-message-authentication">{{ successMessage }}</div>
          <div v-if="errorMessage" class="error-message-authentication">{{ errorMessage }}</div>
          <img src="@/assets/logo-above.png" alt="Company logo" class="small-logo">
          <h2>Welcome to the Collaborative Hub!</h2>
        </div>

        <!-- Login form -->
        <div v-if="isLogin" class="login-form">
          <h3 class="page-title">Log in</h3>

          <div class="form-field">
            <font-awesome-icon class="icon" icon="envelope" />
            <label for="email" class="visually-hidden"> Email</label>
            <input class="input-field" type="email" id="email" v-model="loginData.email" placeholder="E-mail: example@yahoo.com" @focus="clearPlaceholder('email')" required/>
          </div>

          <div class="form-field">
            <font-awesome-icon class="icon" icon="lock" />
            <label for="password" class="visually-hidden">Password</label>
            <input class="input-field" type="password" id="password" v-model="loginData.password" placeholder="Password" @focus="clearPlaceholder('password')" required/>
          </div>

          <button @click="login" class="submit-button">Login</button>

          <p>Create a new account? <a class="toggle-link" @click="toggleForm('signup')">Sign up</a></p>
        </div>

        <!-- Signup form -->
        <div v-if="!isLogin" class="signup-form">
          <h3 class="page-title">Sign up</h3>

          <div class="form-field">
            <font-awesome-icon class="icon" icon="user-circle" />
            <label for="firstName" class="visually-hidden">First name</label>
            <input class="input-field" type="text" id="firstName" v-model="signupData.firstName" placeholder="First Name" @focus="clearPlaceholder('firstName')"/>
            <span class="required-field">*</span>
          </div>

          <div class="form-field">
            <font-awesome-icon class="icon" icon="user-circle" />
            <label for="lastName" class="visually-hidden">Last name</label>
            <input class="input-field" type="text" id="lastName" v-model="signupData.lastName" placeholder="Last Name" @focus="clearPlaceholder('lastName')"/>
            <span class="required-field">*</span>
          </div>

          <div class="form-field">
            <font-awesome-icon class="icon" icon="envelope" />
            <label for="email" class="visually-hidden">Email</label>
            <input class="input-field" type="email" id="email" v-model="signupData.email" placeholder="E-mail: example@yahoo.com" @focus="clearPlaceholder('email')" required/>
            <span class="required-field">*</span>
          </div>

          <div class="form-field">
            <font-awesome-icon class="icon" icon="lock" />
            <label for="password" class="visually-hidden">Password</label>
            <input class="input-field" type="password" id="password" v-model="signupData.password" placeholder="Password (8 characters long)" @focus="clearPlaceholder('password')" required/>
            <span class="required-field">*</span>
          </div>

          <div class="form-field">
            <font-awesome-icon class="icon" icon="lock" />
            <label for="confirmPassword" class="visually-hidden">Confirm Password</label>
            <input class="input-field" type="password" id="confirmPassword" v-model="signupData.confirmPassword" placeholder="Confirm Password" @focus="clearPlaceholder('confirmPassword')" required/>         
            <span class="required-field">*</span>
          </div>

          <div class="form-legend">
            <p>Fields marked with <span class="form-legend-asterisk">*</span> are required.</p>
          </div>

          <hr class="authentication-separator">

          <div class="form-field">
            <div class="profile-image-container">
              <div class="image-upload-container">
                <label for="profileImage" class="label-profile-image">Upload Profile Image? 
                  <font-awesome-icon :icon="['fas', 'camera']" class="icon-profile-upload" />
                </label>
                <input ref="fileInput" type="file" id="profileImage" name="image_url" class="file-input-profile-image" @change="handleFileChange"/>
              </div>
              <div class="profile-image-preview">
                <img v-if="selectedImage" :src="selectedImage" alt="Preview" class="image-preview" />
                <button v-if="selectedImage" class="remove-image-button" @click="removeImage">
                  <font-awesome-icon :icon="['fas', 'times']" class="icon-remove-image" />
                </button>
              </div>
            </div>
          </div>  

          <button @click="signup" class="submit-button">Create Your Account</button>

          <p>Already have an account? <a class="toggle-link" @click="toggleForm('login')">Log in</a></p>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
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
        profileImage: null,
        
      },

      errorMessage: '',
      successMessage: '',
      selectedImage: null,
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

    handleFileChange(event) {
      const fileInput = event.target;
      const file = fileInput.files[0];

      if (file) {
        this.selectedImage = URL.createObjectURL(file);
        this.signupData.profileImage = file;
      } else {
        this.selectedImage = null;
        this.signupData.profileImage = null;
      }
    },

    removeImage() {
      this.selectedImage = null;
      const input = this.$refs.fileInput;
      input.value = '';
      this.signupData.profileImage = null;
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
      const formData = new FormData();
      if (this.signupData.profileImage) {
        formData.append('profileImage', this.signupData.profileImage);
      }      
      formData.append('firstName', this.signupData.firstName);
      formData.append('lastName', this.signupData.lastName);
      formData.append('email', this.signupData.email);
      formData.append('password', this.signupData.password);
      formData.append('confirmPassword', this.signupData.confirmPassword);
      
      const response = await this.$store.dispatch('signup', formData);

      if (response.status === 201) {
        this.successMessage = response.data.message;
        this.errorMessage = ''; 
        this.selectedImage = '';
        
        const signupEmail = this.signupData.email;

        this.signupData = {
            firstName: '',
            lastName: '',
            email: signupEmail,
            password: '',
            confirmPassword: '',
        };

        setTimeout(() => {
            this.successMessage = '';
            this.isLogin = true;
            this.loginData.email = signupEmail;
            this.signupData.email = '';
        }, 1200);
      } else {
        if (response.status === 400) {
            this.errorMessage = response.data.error;
        } else {
            this.errorMessage = 'Error: ' + response.statusText;
        }
    }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 500) {
            this.errorMessage = 'Server error: Unable to complete the registration process.';
        } else {
            this.errorMessage = 'Error: ' + error.response.statusText;
        }
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
        const response = await this.$store.dispatch('login', this.loginData);

      if (response.status === 200) {       
        this.successMessage = response.data.message;
        this.errorMessage = '';
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
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
  overflow: hidden;
}

.auth-container {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
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

.signup-form {
  max-height: 70vh; 
  overflow-y: auto; 
}

.page-title { 
font-size: 23px;
}

.form-field {
  margin-bottom: 20px;
  position: relative;
}

.input-field {
  position: relative;
  padding-left: 30px;
  height: 30px;
  width: 250px; 
  border-radius: 5px;
  border: 1px solid rgb(229, 230, 230);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

.required-field {
  color: red;
  position: absolute;
  top: 50%;
  right: 20%;
  transform: translateY(-50%);
}

.form-legend-asterisk {
  color: red;
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

.submit-button {
  background-color: rgb(193, 32, 158); 
  color: white;
  padding: 7px 30px; 
  border: none;
  border-radius: 5px; 
  cursor: pointer;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
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

.success-message-authentication {
  color: white;
  background-color: #55eb5a;
  padding: 8px;
  border-radius: 5px; 
}

.error-message-authentication {
  color: white;
  background-color: red;
  padding: 8px;
  border-radius: 5px; 
}

.authentication-separator {
  width: 90%;
  margin-bottom: 20px;
}

.profile-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: 5px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  margin: 0 40px;
}

.label-profile-image { 
  color: blue;
  padding: 7px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.file-input-profile-image {
  width: 50%;
  display: none;
}

.icon-profile-upload {
  display: flex;
  padding: 5px 7px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  color: blue;
  align-items: flex-start;
  margin-left: 10px;
  cursor: pointer;
}

.image-preview {
  max-width: 100%;
  max-height: 150px;
  margin: 10px 0 15px 0;
}

.remove-image-button {
  position: absolute;
  top: -10px;
  right: 30px;
  background: transparent;
  border: none;
  padding: 5px;
  cursor: pointer;
}

.icon-remove-image {
  color: red;
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

@media (max-width: 768px) {
  .auth-container {
    margin: 0 20px;
  }

  .required-field {
    right: 13%
}
}
</style>
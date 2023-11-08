import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    token: null, 
    user: null,
  },

  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    setUser(state, user) {
      state.user = user;
    },
    clearToken(state) {
      state.token = null;
    },
    clearUser(state) {
      state.user = null;
    },
  },

  actions: {
    async signup({ commit }, signupData) {
      try {
        const response = await axios.post('/api/auth/signup', signupData);
  
        if (response.status === 201) {
          commit('setToken', response.data.token);
          commit('setUser', response.data.user);
          return response;
        } else {
          return Promise.reject('Invalid response');
        }
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async login({ commit }, loginData) {
      try {
        const response = await axios.post('/api/auth/login', loginData);

        if (response.status === 200) {
          commit('setToken', response.data.token);
          commit('setUser', response.data.user);
          console.log('User data in login action:', response.data.user);
          return response;
        } else {
          return Promise.reject(response);
        }
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async logout({ commit }) {
      commit('clearToken');
      commit('clearUser');
    },
  },
  
  getters: {
    getToken: (state) => state.token,
    getUser: (state) => state.user,
  }  
});

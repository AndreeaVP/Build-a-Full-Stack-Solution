import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    token: null, 
    user: {
      userId: null,
    },
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
    async signup({ commit }, userData) {
      try {
        const response = await axios.post('/api/auth/signup', userData);
  
        if (response.data.token) {
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

    async login({ commit }, credentials) {
  try {
    const response = await axios.post('/api/auth/login', credentials);

    if (response.data.token) {
      const token = response.data.token;
      const user = response.data.user;
      user.userId = user.id;
      commit('setToken', token);
      commit('setUser', user);
      return response;
    } else {
      return Promise.reject('Invalid response');
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

/* eslint-disable linebreak-style */
import API_ENDPOINT from '../globals/api-endpoint';

const AuthService = {
  async login(credentials) {
    const response = await fetch(API_ENDPOINT.AUTH.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const responseJson = await response.json();
    if (!response.ok) {
      throw new Error(responseJson.message);
    }

    // Save token and user data
    localStorage.setItem('token', responseJson.token);
    localStorage.setItem('user', JSON.stringify(responseJson.data.user));
    return responseJson;
  },

  async register(userData) {
    const response = await fetch(API_ENDPOINT.AUTH.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const responseJson = await response.json();
    if (!response.ok) {
      throw new Error(responseJson.message);
    }
    return responseJson;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.hash = '#/';
  }
};

export default AuthService;
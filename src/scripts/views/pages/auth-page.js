/* eslint-disable linebreak-style */
// src/scripts/views/pages/auth-page.js
import API_ENDPOINT from '../../globals/api-endpoint';

const Auth = {
  async render() {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.hash = '#/';
      return '';
    }

    return `
     <div class="pt-24 min-h-screen bg-gradient-to-br from-primary-500 to-primary-700">
       <div class="container mx-auto px-4 py-8">
         <div class="max-w-md mx-auto">
           <div class="flex mb-6 bg-white rounded-lg shadow-md overflow-hidden">
             <button id="loginTab" class="flex-1 py-3 text-center font-semibold transition-all">Masuk</button>
             <button id="registerTab" class="flex-1 py-3 text-center font-semibold transition-all">Daftar</button>
           </div>
           
           <div id="loginForm" class="auth-card rounded-lg shadow-xl p-8 bg-white">
             ${this._loginForm()}
           </div>
           
           <div id="registerForm" class="auth-card rounded-lg shadow-xl p-8 bg-white hidden">
             ${this._registerForm()}
           </div>
         </div>
       </div>
     </div>
   `;
  },

  _loginForm() {
    return `
     <form class="space-y-4">
       <div>
         <label class="block text-gray-700 mb-2">Email</label>
         <input type="email" name="email" required
           class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500">
       </div>
       <div>
         <label class="block text-gray-700 mb-2">Password</label>
         <input type="password" name="password" required
           class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500">
       </div>
       <button type="submit" 
         class="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-all">
         Masuk
       </button>
     </form>
   `;
  },

  _registerForm() {
    return `
     <form class="space-y-4">
       <div>
         <label class="block text-gray-700 mb-2">Nama Lengkap</label>
         <input type="text" name="name" required
           class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500">
       </div>
       <div>
         <label class="block text-gray-700 mb-2">Username</label>
         <input type="text" name="username" required
           class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500">
       </div>
       <div>
         <label class="block text-gray-700 mb-2">Email</label>
         <input type="email" name="email" required
           class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500">
       </div>
       <div>
         <label class="block text-gray-700 mb-2">Password</label>
         <input type="password" name="password" required
           class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500">
       </div>
       <button type="submit"
         class="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-all">
         Daftar
       </button>
     </form>
   `;
  },

  async _handleLogin(e) {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const loginData = {
        email: formData.get('email'),
        password: formData.get('password'),
      };

      const response = await fetch(API_ENDPOINT.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.message);
      }

      localStorage.setItem('token', responseJson.token);
      localStorage.setItem('user', JSON.stringify(responseJson.data.user));

      window.location.hash = '#/';
      window.location.reload();
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message || 'Login gagal. Silakan coba lagi.');
    }
  },

  async _handleRegister(e) {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const registerData = {
        name: formData.get('name'),
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
      };

      const response = await fetch(API_ENDPOINT.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.message);
      }

      // Auto login setelah register
      const loginResponse = await fetch(API_ENDPOINT.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: registerData.email,
          password: registerData.password,
        }),
      });

      const loginJson = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginJson.message);
      }

      localStorage.setItem('token', loginJson.token);
      localStorage.setItem('user', JSON.stringify(loginJson.data.user));

      localStorage.setItem('showWelcomeMessage', 'true');
      console.log('Setting welcome message flag'); // Debug

      // Redirect ke edit profile
      window.location.hash = '#/edit-profile';
      window.location.reload();
    } catch (error) {
      console.error('Register error:', error);
      alert(error.message || 'Registrasi gagal. Silakan coba lagi.');
    }
  },

  async afterRender() {
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Tab switching
    loginTab.addEventListener('click', () => {
      loginTab.classList.add('bg-primary-600', 'text-white');
      registerTab.classList.remove('bg-primary-600', 'text-white');
      loginForm.classList.remove('hidden');
      registerForm.classList.add('hidden');
    });

    registerTab.addEventListener('click', () => {
      registerTab.classList.add('bg-primary-600', 'text-white');
      loginTab.classList.remove('bg-primary-600', 'text-white');
      registerForm.classList.remove('hidden');
      loginForm.classList.add('hidden');
    });

    // Set initial active tab
    loginTab.click();

    // Handle form submissions
    loginForm.querySelector('form').addEventListener('submit', this._handleLogin);
    registerForm.querySelector('form').addEventListener('submit', this._handleRegister);
  }
};

export default Auth;
/* eslint-disable linebreak-style */
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
    <form class="space-y-4" novalidate>
      <div>
        <label class="block text-gray-700 mb-2">Email</label>
        <input type="email" name="email" required
          class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500">
        <span class="text-red-500 text-sm hidden" data-error="email"></span>
      </div>
      <div>
        <label class="block text-gray-700 mb-2">Password</label>
        <input type="password" name="password" required minlength="8"
          class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500">
        <span class="text-red-500 text-sm hidden" data-error="password"></span>
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
    <form class="space-y-4" novalidate>
      <div>
        <label class="block text-gray-700 mb-2">Nama Lengkap</label>
        <input type="text" name="name" required minlength="3"
          class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500">
        <span class="text-red-500 text-sm hidden" data-error="name"></span>
      </div>
      <div>
        <label class="block text-gray-700 mb-2">Email</label>
        <input type="email" name="email" required
          class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500">
        <span class="text-red-500 text-sm hidden" data-error="email"></span>
      </div>
      <div>
        <label class="block text-gray-700 mb-2">Password</label>
        <input type="password" name="password" required minlength="8"
          class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500">
        <span class="text-red-500 text-sm hidden" data-error="password"></span>
        <p class="text-gray-500 text-sm mt-1">Minimal 8 karakter</p>
      </div>
      <button type="submit"
        class="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-all">
        Daftar
      </button>
    </form>
  `;
  },

  _initializeRealTimeValidation(form) {
    const inputs = form.querySelectorAll('input');
    inputs.forEach((input) => {
      input.addEventListener('input', () => {
        this._validateField(input, form);
      });

      input.addEventListener('blur', () => {
        this._validateField(input, form);
      });
    });
  },

  _validateField(input, form) {
    const errorSpan = form.querySelector(`[data-error="${input.name}"]`);
    let errorMessage = '';

    // Reset styling
    input.classList.remove('border-red-500');
    errorSpan?.classList.add('hidden');

    // Validasi berdasarkan tipe input
    if (input.value.trim() === '') {
      errorMessage = 'Field ini wajib diisi';
    } else {
      switch (input.name) {
      case 'email':
        if (!this._validateEmail(input.value)) {
          errorMessage = 'Email tidak valid';
        }
        break;
      case 'password':
        if (input.value.length < 8) {
          errorMessage = 'Password minimal 8 karakter';
        }
        break;
      case 'name':
        if (input.value.length < 3) {
          errorMessage = 'Nama minimal 3 karakter';
        }
        break;
      }
    }

    // Tampilkan error jika ada
    if (errorMessage) {
      input.classList.add('border-red-500');
      errorSpan.textContent = errorMessage;
      errorSpan.classList.remove('hidden');
      return false;
    }

    return true;
  },

  _validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  async _handleLogin(e) {
    e.preventDefault();
    const form = e.target;

    // Validasi semua field dulu
    const inputs = form.querySelectorAll('input');
    let hasError = false;
    inputs.forEach((input) => {
      if (!this._validateField(input, form)) {
        hasError = true;
      }
    });

    if (hasError) return;

    try {
      const formData = new FormData(form);
      const loginData = {
        email: formData.get('email'),
        password: formData.get('password'),
      };

      const button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Loading...';

      const response = await fetch(API_ENDPOINT.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.message || 'Login gagal');
      }

      localStorage.setItem('token', responseJson.token);
      localStorage.setItem('user', JSON.stringify(responseJson.data.user));

      window.location.hash = '#/';
      window.location.reload();
    } catch (error) {
      console.error('Login error:', error);
      this._showAlert(error.message, 'error');

      const button = form.querySelector('button[type="submit"]');
      button.disabled = false;
      button.textContent = 'Masuk';
    }
  },

  async _handleRegister(e) {
    e.preventDefault();
    const form = e.target;

    // Validasi form
    const inputs = form.querySelectorAll('input');
    let hasError = false;
    inputs.forEach((input) => {
      if (!this._validateField(input, form)) {
        hasError = true;
      }
    });

    if (hasError) return;

    try {
      const button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Loading...';

      const formData = new FormData(form);
      const registerData = {
        name: formData.get('name'),
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

      // Check status response
      if (!response.ok) {
        // Tambahkan error handling khusus untuk email duplikat
        if (response.status === 400 && responseJson.message.includes('Email sudah terdaftar')) {
          // Tampilkan error di field email
          const emailInput = form.querySelector('[name="email"]');
          const emailError = form.querySelector('[data-error="email"]');
          emailInput.classList.add('border-red-500');
          emailError.textContent = 'Email sudah terdaftar';
          emailError.classList.remove('hidden');
          throw new Error('Email sudah terdaftar');
        }
        throw new Error(responseJson.message || 'Registrasi gagal');
      }

      // Tampilkan pesan sukses
      this._showAlert('Registrasi berhasil, sedang login...', 'success');

      // Auto login
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
        throw new Error(loginJson.message || 'Login otomatis gagal');
      }

      localStorage.setItem('token', loginJson.token);
      localStorage.setItem('user', JSON.stringify(loginJson.data.user));
      localStorage.setItem('showWelcomeMessage', 'true');

      // Delay redirect
      setTimeout(() => {
        window.location.hash = '#/edit-profile';
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error('Register error:', error);

      // Tampilkan error dengan _showAlert jika bukan error email duplikat
      if (!error.message.includes('Email sudah terdaftar')) {
        this._showAlert(error.message, 'error');
      }

    } finally {
      // Reset button state
      const button = form.querySelector('button[type="submit"]');
      button.disabled = false;
      button.textContent = 'Daftar';
    }
  },

  _showFieldError(form, fieldName, message) {
    const input = form.querySelector(`[name="${fieldName}"]`);
    const errorSpan = form.querySelector(`[data-error="${fieldName}"]`);
    if (input && errorSpan) {
      input.classList.add('border-red-500');
      errorSpan.textContent = message;
      errorSpan.classList.remove('hidden');
    }
  },

  _showAlert(message, type = 'error') {
    // Remove existing alerts first
    const existingAlerts = document.querySelectorAll('.alert-message');
    existingAlerts.forEach((alert) => alert.remove());

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert-message fixed top-4 left-1/2 transform -translate-x-1/2 
     px-6 py-3 rounded-lg text-white ${type === 'error' ? 'bg-red-500' : 'bg-green-500'}
     transition-all duration-300 ease-in-out opacity-0`;
    alertDiv.textContent = message;

    document.body.appendChild(alertDiv);

    // Trigger animation
    setTimeout(() => alertDiv.classList.add('opacity-100'), 100);

    setTimeout(() => {
      alertDiv.classList.remove('opacity-100');
      setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
  },

  async afterRender() {
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

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

    loginTab.click();

    // Initialize form validation
    const loginFormElement = loginForm.querySelector('form');
    const registerFormElement = registerForm.querySelector('form');

    this._initializeRealTimeValidation(loginFormElement);
    this._initializeRealTimeValidation(registerFormElement);

    loginFormElement.addEventListener('submit', (e) => this._handleLogin.call(this, e));
    registerFormElement.addEventListener('submit', (e) => this._handleRegister.call(this, e));
  }
};

export default Auth;
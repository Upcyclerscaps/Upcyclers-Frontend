/* eslint-disable linebreak-style */
import API_ENDPOINT from '../../globals/api-endpoint';

const Auth = {
  async render() {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.hash = '#/';
      return '';
    }

    // Prefetch edit-profile route saat halaman auth dimuat
    if ('IntersectionObserver' in window) {
      import('../pages/edit-profile-page');
    }

    return `
      <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
          <div class="text-center">
            <h2 class="text-3xl font-extrabold text-gray-900">
              Selamat datang di Upcyclers
            </h2>
            <p class="mt-2 text-sm text-gray-600">
              Platform jual beli barang bekas terpercaya
            </p>
          </div>
        </div>
  
        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div class="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
            <!-- Tab Buttons -->
            <div class="flex bg-gray-100 p-1 rounded-lg mb-6">
              <button id="loginTab" 
                class="flex-1 py-2 text-center font-medium rounded-md transition-all">
                Masuk
              </button>
              <button id="registerTab"
                class="flex-1 py-2 text-center font-medium rounded-md transition-all">
                Daftar
              </button>
            </div>
            
            <!-- Login Form -->
            <div id="loginForm" class="auth-card">
              ${this._loginForm()}
            </div>
            
            <!-- Register Form -->
            <div id="registerForm" class="auth-card hidden">
              ${this._registerForm()}
            </div>
          </div>
  
          <!-- Footer -->
          <div class="mt-6 text-center text-sm">
            <p class="text-gray-600">
              Dengan mendaftar, Anda menyetujui syarat dan ketentuan kami
            </p>
          </div>
        </div>
      </div>
    `;
  },

  _loginForm() {
    return `
      <form class="space-y-6" novalidate>
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <div class="mt-1 relative">
            <input type="email" name="email" required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md 
              focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
            <span class="text-red-500 text-xs mt-1 hidden" data-error="email"></span>
          </div>
        </div>
  
        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <div class="mt-1 relative">
            <input type="password" name="password" required minlength="8"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md
              focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
            <span class="text-red-500 text-xs mt-1 hidden" data-error="password"></span>
          </div>
        </div>
  
        <button type="submit" 
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
          shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
          disabled:opacity-50 disabled:cursor-not-allowed transition-all">
          Masuk
        </button>
      </form>
    `;
  },

  _registerForm() {
    return `
      <form class="space-y-6" novalidate>
        <div>
          <label class="block text-sm font-medium text-gray-700">Nama Lengkap</label>
          <div class="mt-1 relative">
            <input type="text" name="name" required minlength="3"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md
              focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
            <span class="text-red-500 text-xs mt-1 hidden" data-error="name"></span>
          </div>
        </div>
  
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <div class="mt-1 relative">
            <input type="email" name="email" required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md
              focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
            <span class="text-red-500 text-xs mt-1 hidden" data-error="email"></span>
          </div>
        </div>
  
        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <div class="mt-1 relative">
            <input type="password" name="password" required minlength="8"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md
              focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
            <span class="text-red-500 text-xs mt-1 hidden" data-error="password"></span>
            <p class="mt-1 text-xs text-gray-500">Minimal 8 karakter</p>
          </div>
        </div>
  
        <button type="submit"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md
          shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
          disabled:opacity-50 disabled:cursor-not-allowed transition-all">
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
        // Handle email not registered
        if (response.status === 404 || responseJson.message.toLowerCase().includes('tidak ditemukan')) {
          // Clear all previous errors
          form.querySelectorAll('[data-error]').forEach((span) => {
            span.textContent = '';
            span.classList.add('hidden');
          });
          form.querySelectorAll('input').forEach((input) => {
            input.classList.remove('border-red-500');
          });

          // Show error for email field
          const emailInput = form.querySelector('[name="email"]');
          const emailError = form.querySelector('[data-error="email"]');
          emailInput.classList.add('border-red-500');
          emailError.classList.remove('hidden');

          // Create error message with register button
          emailError.innerHTML = `
            <div class="flex items-center gap-1">
              <span>Email belum terdaftar.</span>
              <button type="button" 
                class="text-primary-600 hover:text-primary-700 underline font-medium"
                id="registerNowBtn">
                Daftar sekarang
              </button>
            </div>
          `;

          // Add click handler for register button
          document.getElementById('registerNowBtn').addEventListener('click', () => {
            // Switch to register tab
            document.getElementById('registerTab').click();

            // Auto fill email in register form
            const registerForm = document.querySelector('#registerForm form');
            const registerEmail = registerForm.querySelector('[name="email"]');
            if (registerEmail) {
              registerEmail.value = loginData.email;
              // Validate the email field in register form
              this._validateField(registerEmail, registerForm);
            }
          });

          throw new Error('Email belum terdaftar');
        }

        // Handle wrong password
        if (response.status === 401) {
          this._showFieldError(form, 'password', 'Password salah. Silakan coba lagi');
          throw new Error('Password salah');
        }

        throw new Error(responseJson.message || 'Login gagal');
      }

      // Show success message
      this._showAlert('Login berhasil!', 'success');

      // Wait for animation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      localStorage.setItem('token', responseJson.token);
      localStorage.setItem('user', JSON.stringify(responseJson.data.user));

      window.location.hash = '#/';
      window.location.reload();
    } catch (error) {
      console.error('Login error:', error);
      if (!error.message.includes('Password salah') &&
          !error.message.includes('Email belum terdaftar')) {
        this._showAlert(error.message, 'error');
      }
    } finally {
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

      // Pre-load edit-profile sebelum redirect
      await import('../pages/edit-profile-page');

      // Show success message with proper timing and position
      this._showAlert('Registrasi berhasil, sedang login...', 'success');

      // Add delay before auto login
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Proceed with auto login
      try {
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

        // Tambahkan loading state sebelum redirect
        const mainContent = document.querySelector('#mainContent');
        mainContent.innerHTML = `
          <div class="flex justify-center items-center min-h-screen">
            <div class="text-center">
              <i class="fas fa-spinner fa-spin text-4xl text-primary-600"></i>
              <p class="mt-2 text-gray-600">Menyiapkan profil Anda...</p>
            </div>
          </div>
        `;

        // Add delay before redirect
        await new Promise((resolve) => setTimeout(resolve, 1000));

        window.location.hash = '#/edit-profile';
        window.location.reload();

      } catch (error) {
        console.error('Auto login error:', error);
        this._showAlert('Registrasi berhasil, silakan login manual', 'success');
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
    alertDiv.className = `alert-message fixed top-20 left-1/2 transform -translate-x-1/2  
      px-6 py-3 rounded-lg text-white ${type === 'error' ? 'bg-red-500' : 'bg-green-500'}
      transition-all duration-300 ease-in-out opacity-0 z-50`; // Tambahkan z-50

    alertDiv.innerHTML = `
      <div class="flex items-center space-x-2">
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
        <span>${message}</span>
        <button class="ml-4 hover:text-${type === 'error' ? 'red' : 'green'}-200">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

    document.body.appendChild(alertDiv);

    // Add close handler
    alertDiv.querySelector('button').addEventListener('click', () => {
      alertDiv.classList.remove('opacity-100');
      setTimeout(() => alertDiv.remove(), 300);
    });

    // Trigger animation
    requestAnimationFrame(() => {
      alertDiv.classList.add('opacity-100');
    });

    // Auto remove after 3 seconds
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
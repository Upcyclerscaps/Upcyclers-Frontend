/* eslint-disable linebreak-style */
const AuthPage = {
  async render() {
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
        <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Masuk ke Akun Anda</h2>
        <form>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Email</label>
            <input type="email" class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500" required>
          </div>
          
          <div class="mb-6">
            <label class="block text-gray-700 mb-2">Password</label>
            <input type="password" class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500" required>
          </div>
          
          <div class="flex items-center justify-between mb-6">
            <label class="flex items-center">
              <input type="checkbox" class="mr-2">
              <span class="text-sm text-gray-600">Ingat saya</span>
            </label>
            <a href="#" class="text-sm text-primary-600 hover:text-primary-700">Lupa password?</a>
          </div>
          
          <button type="submit" class="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-all">
            Masuk
          </button>
          
          <div class="mt-6 relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Atau masuk dengan</span>
            </div>
          </div>
          
          <div class="mt-6 grid grid-cols-2 gap-3">
            <button type="button" class="flex justify-center items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
              <i class="fab fa-google mr-2"></i> Google
            </button>
            <button type="button" class="flex justify-center items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
              <i class="fab fa-facebook-f mr-2"></i> Facebook
            </button>
          </div>
        </form>
      `;
  },

  _registerForm() {
    return `
        <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Daftar Akun Baru</h2>
        <form>
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-gray-700 mb-2">Nama Depan</label>
              <input type="text" class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500" required>
            </div>
            <div>
              <label class="block text-gray-700 mb-2">Nama Belakang</label>
              <input type="text" class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500" required>
            </div>
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Email</label>
            <input type="email" class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500" required>
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Nomor Telepon</label>
            <input type="tel" class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500" required>
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Password</label>
            <input type="password" class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500" required>
          </div>
          
          <div class="mb-6">
            <label class="block text-gray-700 mb-2">Konfirmasi Password</label>
            <input type="password" class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500" required>
          </div>
          
          <div class="flex items-center mb-6">
            <input type="checkbox" class="mr-2" required>
            <span class="text-sm text-gray-600">
              Saya setuju dengan <a href="#" class="text-primary-600 hover:text-primary-700">Syarat dan Ketentuan</a>
            </span>
          </div>
          
          <button type="submit" class="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-all">
            Daftar
          </button>
        </form>
      `;
  },

  async afterRender() {
    this._initializeAuth();
  },

  _initializeAuth() {
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    const setActiveTab = (activeTab, inactiveTab, showForm, hideForm) => {
      activeTab.classList.add('bg-primary-600', 'text-white');
      inactiveTab.classList.remove('bg-primary-600', 'text-white');
      showForm.classList.remove('hidden');
      hideForm.classList.add('hidden');
    };

    loginTab.addEventListener('click', () => {
      setActiveTab(loginTab, registerTab, loginForm, registerForm);
    });

    registerTab.addEventListener('click', () => {
      setActiveTab(registerTab, loginTab, registerForm, loginForm);
    });

    // Set initial active tab
    setActiveTab(loginTab, registerTab, loginForm, registerForm);
  }
};

export default AuthPage;
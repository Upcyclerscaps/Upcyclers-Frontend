/* eslint-disable linebreak-style */
import AuthService from '../../../services/auth.service';

class CustomHeader extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const isAuthenticated = AuthService.isAuthenticated();
    const user = isAuthenticated ? JSON.parse(localStorage.getItem('user')) : null;

    this.innerHTML = `
      <header class="bg-white fixed w-full top-0 z-50 shadow-md">
        <div class="container mx-auto px-4">
          <div class="flex justify-between items-center py-4">
            <a href="#/" class="text-xl font-bold">Upcyclers</a>
            
            <nav id="navigationDrawer" class="hidden md:flex space-x-6">
              <a href="#/" class="hover:text-primary-200 transition-all">Beranda</a>
              ${isAuthenticated ? `
                <a href="#/jual-beli" class="hover:text-primary-200 transition-all">Jual Beli</a>
                <a href="#/find-collector" class="hover:text-primary-200 transition-all">
                  <i class="fas fa-map-marker-alt mr-1"></i>Temukan Pengepul
                </a>
                <a href="#/buy-offers" class="hover:text-primary-200 transition-all">
                  <i class="fas fa-list-alt mr-1"></i>Penawaran Beli
                </a>
              ` : ''}
              <a href="#/about" class="hover:text-primary-200 transition-all">Tentang Kami</a>
            </nav>

            <div class="flex items-center space-x-4">
              ${isAuthenticated ? `
                <span class="text-gray-600">Halo, ${user.name}</span>
                <div class="relative dropdown">
                  <button class="flex items-center space-x-2">
                    <img src="${user.profileImage || 'https://via.placeholder.com/32'}" 
                         alt="Profile" 
                         class="w-8 h-8 rounded-full object-cover">
                    <i class="fas fa-chevron-down"></i>
                  </button>
                  <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden dropdown-menu">
                    <a href="#/profile" class="block px-4 py-2 hover:bg-gray-100">Profile</a>
                    <button id="logoutButton" class="w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
                  </div>
                </div>
              ` : `
                <button onclick="window.location.hash = '#/auth'"
                        class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                  <i class="fas fa-user mr-2"></i>Login
                </button>
              `}
            </div>
          </div>
        </div>
      </header>
    `;

    this._initializeDropdown();
    this._initializeLogout();
  }

  _initializeDropdown() {
    const dropdown = this.querySelector('.dropdown');
    if (dropdown) {
      dropdown.addEventListener('click', () => {
        dropdown.querySelector('.dropdown-menu').classList.toggle('hidden');
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
          dropdown.querySelector('.dropdown-menu').classList.add('hidden');
        }
      });
    }
  }

  _initializeLogout() {
    const logoutButton = this.querySelector('#logoutButton');
    if (logoutButton) {
      logoutButton.addEventListener('click', () => {
        AuthService.logout();
        window.location.reload();
      });
    }
  }
}

customElements.define('header-element', CustomHeader);
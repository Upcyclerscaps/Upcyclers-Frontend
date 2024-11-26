/* eslint-disable linebreak-style */
class CustomHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
          <header class="bg-white fixed w-full top-0 z-50 shadow-md">
              <div class="container mx-auto px-4">
                  <div class="flex justify-between items-center py-4">
                      <div class="flex items-center">
                          <h1 class="text-xl font-bold">Upcyclers</h1>
                      </div>
                      <nav id="navigationDrawer" class="hidden md:flex space-x-6">
                          <a href="#/" class="hover:text-primary-200 transition-all">Beranda</a>
                          <a href="#/jual-beli" class="hover:text-primary-200 transition-all">Jual Beli</a>
                          <a href="#/find-collector" class="hover:text-primary-200 transition-all">
                              <i class="fas fa-map-marker-alt mr-1"></i>Temukan Pengepul
                          </a>
                          <a href="#/about" class="hover:text-primary-200 transition-all">Tentang Kami</a>
                      </nav>
                      <div class="flex items-center">
                          <button 
                              id="authButton" 
                              class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center"
                              onclick="window.location.hash = '#/auth'"
                          >
                              <i class="fas fa-user mr-2"></i>
                              <span>Akun Saya</span>
                          </button>
                      </div>
                      <button id="hamburgerButton" class="md:hidden">
                          <i class="fas fa-bars"></i>
                      </button>
                  </div>
              </div>
          </header>
      `;
  }
}

customElements.define('header-element', CustomHeader);
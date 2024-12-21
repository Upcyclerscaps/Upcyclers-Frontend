/* eslint-disable linebreak-style */
import UrlParser from '../routes/url-parser';
import routes from '../routes/routes';
import AuthService from '../services/auth.service';

class App {
  constructor({ content }) {
    this._content = content;
    this._header = document.querySelector('header');
    this._initialAppShell();
  }

  _initialAppShell() {
    // Add padding to content for mobile bottom nav
    if (window.innerWidth < 768) {
      this._content.style.paddingBottom = '4rem';
    }

    // Update active state in bottom nav
    this._updateActiveNav();
  }

  _updateActiveNav() {
    const currentHash = window.location.hash || '#/';
    const bottomNavLinks = document.querySelectorAll('.bottom-nav a');

    bottomNavLinks.forEach((link) => {
      if (link.getAttribute('href') === currentHash) {
        link.classList.add('text-primary-600');
      } else {
        link.classList.remove('text-primary-600');
      }
    });
  }

  async renderPage() {
    try {
      // Redirect to home if no hash
      if (window.location.pathname === '/' && !window.location.hash) {
        window.location.hash = '#/';
        return;
      }

      const url = UrlParser.parseActiveUrlWithCombiner();

      // Check if trying to access auth page while logged in
      if (url === '/auth' && AuthService.isAuthenticated()) {
        window.location.hash = '#/';
        return;
      }

      // Protected routes check
      const protectedRoutes = ['/jual-beli', '/find-collector', '/product', '/buy-offers'];
      if (protectedRoutes.includes(url) && !AuthService.isAuthenticated()) {
        window.location.hash = '#/auth';
        return;
      }

      // Show loading state
      this._content.innerHTML = this._getLoadingIndicator();

      // Get page module
      let pageModule;
      try {
        pageModule = await routes[url]?.() || await routes['/404']();
      } catch (error) {
        console.error('Error loading page module:', error);
        pageModule = await routes['/404']();
      }

      const page = pageModule.default;
      document.title = this._getPageTitle(url);

      // Handle product detail page
      if (url === '/product') {
        const urlParams = UrlParser.parseActiveUrlWithoutCombiner();
        const productId = urlParams.id;

        if (!productId) {
          this._content.innerHTML = await routes['/404']().then((m) => m.default.render());
        } else {
          this._content.innerHTML = await page.render(productId);
        }
      } else {
        this._content.innerHTML = await page.render();
      }

      // Execute afterRender if exists
      if (page.afterRender) {
        await page.afterRender();
      }

      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      console.error('Error rendering page:', error);
      const notFoundModule = await routes['/404']();
      this._content.innerHTML = await notFoundModule.default.render();
    }
  }

  _getPageTitle(url) {
    const titles = {
      '/': 'Upcyclers - Platform Jual Beli Barang Rongsok',
      '/jual-beli': 'Jual Beli - Upcyclers',
      '/find-collector': 'Temukan Pengepul - Upcyclers',
      '/about': 'Tentang Kami - Upcyclers',
      '/auth': 'Masuk/Daftar - Upcyclers',
      '/profile': 'Profil - Upcyclers',
      '/edit-profile': 'Edit Profil - Upcyclers',
      '/product': 'Detail Produk - Upcyclers',
      '/buy-offers': 'Penawaran - Upcyclers',
      '/admin': 'Admin Dashboard - Upcyclers',
      '/admin/users': 'Kelola Users - Upcyclers',
      '/admin/products': 'Kelola Produk - Upcyclers',
      '/admin/buy-offers': 'Kelola Penawaran - Upcyclers',
      '/404': 'Halaman Tidak Ditemukan - Upcyclers',
    };

    return titles[url] || titles['/404'];
  }

  _getLoadingIndicator() {
    return `
     <div class="min-h-screen flex items-center justify-center">
       <div class="text-center">
         <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
         <p class="text-gray-600">Memuat...</p>
       </div>
     </div>
   `;
  }
}

export default App;
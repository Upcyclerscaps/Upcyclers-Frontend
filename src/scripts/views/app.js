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
    // Handle scroll for header
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        this._header?.classList.add('bg-white', 'shadow-md');
      } else {
        this._header?.classList.remove('bg-white', 'shadow-md');
      }
    });
  }

  async renderPage() {
    try {
      const url = UrlParser.parseActiveUrlWithCombiner();

      // Protected routes check
      const protectedRoutes = ['/jual-beli', '/find-collector'];
      if (protectedRoutes.includes(url) && !AuthService.isAuthenticated()) {
        window.location.hash = '#/auth';
        return;
      }

      // Show loading state
      this._content.innerHTML = this._getLoadingIndicator();

      let content = '';
      const page = routes[url] || routes['/404'];

      // Update page title
      document.title = this._getPageTitle(url);

      // Handle product detail page
      if (url === '/product') {
        const urlParams = UrlParser.parseActiveUrlWithoutCombiner();
        const productId = urlParams.id;

        if (!productId) {
          content = await routes['/404'].render();
        } else {
          content = await page.render(productId);
        }
      } else {
        content = await page.render();
      }

      // Render content with fade-in effect
      this._content.innerHTML = content;
      this._content.classList.add('fade-in');

      // Execute afterRender if exists
      if (page.afterRender) {
        await page.afterRender();
      }

      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      console.error('Error rendering page:', error);
      const errorContent = await routes['/404'].render();
      this._content.innerHTML = errorContent;
    }
  }

  _getPageTitle(url) {
    const titles = {
      '/': 'Upcyclers - Platform Jual Beli Barang Rongsok',
      '/jual-beli': 'Jual Beli - Upcyclers',
      '/find-collector': 'Temukan Pengepul - Upcyclers',
      '/about': 'Tentang Kami - Upcyclers',
      '/auth': 'Masuk/Daftar - Upcyclers',
      '/product': 'Detail Produk - Upcyclers',
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
/* eslint-disable linebreak-style */
const loadPolyfill = () => import('regenerator-runtime');
import '../styles/style.css';
import '../styles/responsive.css';
const loadApp = () => import('./views/app');
const loadTemplates = () => import('./views/templates/templates');

// Function untuk menginisialisasi aplikasi
const initializeApp = async () => {
  try {
    // eslint-disable-next-line no-unused-vars
    const [app, _] = await Promise.all([
      loadApp(),
      loadTemplates(),
      loadPolyfill()
    ]);

    // Inisialisasi App
    const App = app.default;
    const mainApp = new App({
      content: document.querySelector('#mainContent'),
    });

    // Event listeners
    window.addEventListener('hashchange', () => {
      mainApp.renderPage();
    });

    window.addEventListener('load', () => {
      mainApp.renderPage();
    });

  } catch (error) {
    console.error('Failed to initialize app:', error);
  }
};

// Inisialisasi app dengan loading state
document.addEventListener('DOMContentLoaded', () => {
  // Show loading state
  const mainContent = document.querySelector('#mainContent');
  if (mainContent) {
    mainContent.innerHTML = `
     <div class="flex justify-center items-center min-h-screen">
       <div class="text-center">
         <i class="fas fa-spinner fa-spin text-4xl text-primary-600"></i>
         <p class="mt-2 text-gray-600">Loading app...</p>
       </div>
     </div>
   `;
  }

  // Initialize app
  initializeApp();
});

// Prefetch routes yang sering diakses
if ('IntersectionObserver' in window) {
  const prefetchRoutes = [
    () => import('./views/pages/home'),
    () => import('./views/pages/auth-page'),
    () => import('./views/pages/edit-profile-page')
  ];

  // Trigger prefetch setelah load utama selesai
  window.addEventListener('load', () => {
    requestIdleCallback(() => {
      prefetchRoutes.forEach((route) => {
        route();
      });
    });
  });
}
/* eslint-disable linebreak-style */

/* eslint-disable linebreak-style */
import 'regenerator-runtime';
import '../styles/style.css';
import '../styles/responsive.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import App from './views/app';
import './utils/utils';

const app = new App({
  content: document.querySelector('#mainContent'),
  menu: document.querySelector('#navigationDrawer'),
  drawer: document.querySelector('#hamburgerButton'),
});

window.addEventListener('hashchange', () => {
  app.renderPage();
});

window.addEventListener('load', () => {
  app.renderPage();
<<<<<<< HEAD
});
=======
});
>>>>>>> origin/main

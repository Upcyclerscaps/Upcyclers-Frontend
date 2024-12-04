/* eslint-disable linebreak-style */
import 'regenerator-runtime';
import '../styles/style.css';
import '../styles/responsive.css';
import App from './views/app';
import './views/templates/templates';

const app = new App({
  content: document.querySelector('#mainContent'),
  drawer: document.querySelector('#hamburgerButton'),
  menu: document.querySelector('#navigationDrawer'),
});

window.addEventListener('hashchange', () => {
  app.renderPage();
});

window.addEventListener('load', () => {
  app.renderPage();
});
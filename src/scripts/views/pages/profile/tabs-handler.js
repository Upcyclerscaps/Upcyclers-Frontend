/* eslint-disable linebreak-style */
import API_ENDPOINT from '../../../globals/api-endpoint';
import TemplateCreator from './template-creator';

const TabsHandler = {
  initialize() {
    const tabs = document.querySelectorAll('[data-tab]');
    const tabContent = document.getElementById('tabContent');

    // Langsung load tab selling saat inisialisasi
    this.loadTabContent('selling', tabContent);

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        // Update active tab UI
        tabs.forEach((t) => {
          t.classList.remove('border-b-2', 'border-primary-600');
        });
        tab.classList.add('border-b-2', 'border-primary-600');

        // Load content untuk tab yang dipilih
        this.loadTabContent(tab.dataset.tab, tabContent);
      });
    });
  },

  async loadTabContent(tabName, container) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }

      let endpoint;
      switch (tabName) {
      case 'selling':
        endpoint = API_ENDPOINT.USER_PRODUCTS;
        break;
      case 'buying':
        endpoint = API_ENDPOINT.USER_BUY_OFFERS;
        break;
      default:
        container.innerHTML = TemplateCreator.createEmptyTemplate();
        return;
      }

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      container.innerHTML = TemplateCreator.createTabContent(tabName, data.data);

    } catch (error) {
      console.error(`Error loading ${tabName}:`, error);
      container.innerHTML = TemplateCreator.createErrorTemplate();
    }
  }
};

export default TabsHandler;
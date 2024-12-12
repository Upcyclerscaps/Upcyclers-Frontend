/* eslint-disable linebreak-style */
import DataHandler from './data-handler';
import TabsHandler from './tabs-handler';
import TemplateCreator from './template-creator';

const ProfilePage = {
  _getUserData() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      window.location.hash = '#/auth';
      return null;
    }
    return user;
  },

  async render() {
    const user = this._getUserData();
    if (!user) return '';

    return TemplateCreator.createProfilePage(user);
  },

  async afterRender() {
    // Load data user dulu baru inisialisasi tab
    await DataHandler.loadUserData();
    TabsHandler.initialize();
    this._initializeEventListeners();
  },

  _initializeEventListeners() {
    document.addEventListener('click', async (e) => {
      if (e.target.matches('[data-delete-id]') || e.target.closest('[data-delete-id]')) {
        const button = e.target.matches('[data-delete-id]') ?
          e.target : e.target.closest('[data-delete-id]');
        const id = button.dataset.deleteId;
        const type = button.dataset.type;

        if (confirm(`Hapus ${type === 'selling' ? 'barang' : 'penawaran'} ini?`)) {
          await DataHandler.deleteItem(id, type);
          const tabContent = document.getElementById('tabContent');
          await TabsHandler.loadTabContent(type, tabContent);
        }
      }
    });
  }
};

export default ProfilePage;
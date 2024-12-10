/* eslint-disable linebreak-style */

import API_ENDPOINT from '../../globals/api-endpoint';

const Profile = {
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

    return `
      <div class="container mx-auto px-4 pt-24">
        <div class="max-w-4xl mx-auto">
          <!-- Profile Header -->
          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex items-center space-x-6">
              <img src="${user?.profileImage || 'https://via.placeholder.com/128'}" 
                   alt="Profile picture" 
                   class="w-32 h-32 rounded-full bg-gray-200">
              
              <div class="flex-1">
                <h1 class="text-2xl font-bold">${user?.name || 'User'}</h1>
                <p class="text-gray-600 mb-4">Bergabung sejak ${user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : 'Invalid Date'}</p>
                
                <div class="flex flex-wrap gap-2">
                  <button onclick="window.location.hash = '#/edit-profile'"
                          class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all">
                    <i class="fas fa-edit mr-2"></i> Edit Profile
                  </button>
                  <button onclick="window.location.hash = '#/sell-item'"
                          class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all">
                    <i class="fas fa-plus mr-2"></i> Jual Barang
                  </button>
                  <button onclick="window.location.hash = '#/buy-item'"
                          class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all">
                    <i class="fas fa-shopping-cart mr-2"></i> Buat Penawaran
                  </button>
                </div>
              </div>
            </div>
          </div>
 
          <!-- Stats -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="bg-white rounded-lg shadow-md p-6">
              <p class="text-gray-600">Rongsokan Sedang Dijual</p>
              <p class="text-2xl font-bold" id="productsCount">-</p>
            </div>
            <div class="bg-white rounded-lg shadow-md p-6">
              <p class="text-gray-600">Rongsokan Yang Dicari</p>
              <p class="text-2xl font-bold" id="buyOffersCount">-</p>
            </div>
          </div>
 
          <!-- Tabs Section -->
          <div class="bg-white rounded-lg shadow-md">
            <div class="flex border-b">
              <button 
                class="text-gray-600 px-6 py-4 border-b-2 border-primary-600" 
                data-tab="selling"
              >
                Sedang Dijual
              </button>
              <button 
                class="text-gray-600 px-6 py-4" 
                data-tab="buying"
              >
                Sedang Dicari
              </button>
            </div>
 
            <div class="p-6">
              <div id="tabContent">
                <div class="text-center py-8 text-gray-500">
                  <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
                  <p class="mt-2">Memuat data...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async afterRender() {
    this._initializeTabs();
    await this._loadUserData();
    this._initializeEventListeners();
  },

  _initializeEventListeners() {
    // Delegasi event untuk tombol delete
    document.addEventListener('click', async (e) => {
      if (e.target.matches('[data-delete-id]') || e.target.closest('[data-delete-id]')) {
        const button = e.target.matches('[data-delete-id]') ?
          e.target : e.target.closest('[data-delete-id]');
        const id = button.dataset.deleteId;
        const type = button.dataset.type;

        if (confirm(`Hapus ${type === 'selling' ? 'barang' : 'penawaran'} ini?`)) {
          await this._deleteItem(id, type);
        }
      }
    });
  },

  _initializeTabs() {
    const tabs = document.querySelectorAll('[data-tab]');
    const tabContent = document.getElementById('tabContent');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => {
          t.classList.remove('border-b-2', 'border-primary-600');
        });

        tab.classList.add('border-b-2', 'border-primary-600');
        this._loadTabContent(tab.dataset.tab, tabContent);
      });
    });
  },

  async _loadUserData() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.hash = '#/auth';
        return;
      }

      try {
        const productsResponse = await fetch(API_ENDPOINT.USER_PRODUCTS, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const productsData = await productsResponse.json();
        document.getElementById('productsCount').textContent = productsData.data?.length || 0;
      } catch (error) {
        console.error('Error fetching products:', error);
        document.getElementById('productsCount').textContent = '-';
      }

      try {
        const buyOffersResponse = await fetch(API_ENDPOINT.USER_BUY_OFFERS, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const buyOffersData = await buyOffersResponse.json();
        document.getElementById('buyOffersCount').textContent = buyOffersData.data?.length || 0;
      } catch (error) {
        console.error('Error fetching buy offers:', error);
        document.getElementById('buyOffersCount').textContent = '-';
      }

      await this._loadTabContent('selling', document.getElementById('tabContent'));

    } catch (error) {
      console.error('Error loading user data:', error);
    }
  },

  async _loadTabContent(tabName, container) {
    try {
      container.innerHTML = '<div class="text-center py-4"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';

      const token = localStorage.getItem('token');
      let endpoint;

      switch (tabName) {
      case 'selling':
        endpoint = API_ENDPOINT.USER_PRODUCTS;
        break;
      case 'buying':
        endpoint = API_ENDPOINT.USER_BUY_OFFERS;
        break;
      default:
        container.innerHTML = '<div class="text-center py-8 text-gray-500">Belum ada data</div>';
        return;
      }

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      this._renderTabContent(tabName, data.data, container);

    } catch (error) {
      console.error(`Error loading ${tabName}:`, error);
      container.innerHTML = '<div class="text-center py-8 text-red-500">Gagal memuat data</div>';
    }
  },

  _renderTabContent(tabName, items, container) {
    if (!items || items.length === 0) {
      container.innerHTML = `
        <div class="text-center py-8 text-gray-500">
          <p>Belum ada ${tabName === 'selling' ? 'barang yang dijual' : 'penawaran pembelian'}</p>
          <button 
            onclick="window.location.hash='#/${tabName === 'selling' ? 'sell' : 'buy'}-item'"
            class="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
            ${tabName === 'selling' ? 'Jual Barang' : 'Buat Penawaran'}
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${items.map((item) => this._createItemCard(item, tabName)).join('')}
      </div>
    `;
  },

  _createItemCard(item, type) {
    return `
      <div class="border rounded-lg p-4">
        <div class="flex items-start space-x-4">
          ${type === 'selling' ? `
            <img src="${item.images[0]?.url || 'https://via.placeholder.com/80'}" 
                 alt="${item.name}"
                 class="w-20 h-20 object-cover rounded-lg">
          ` : ''}
          <div class="flex-1">
            <h3 class="font-medium">${type === 'selling' ? item.name : item.category}</h3>
            <p class="text-gray-600">Rp ${item.price.amount.toLocaleString()}</p>
            ${type === 'selling' ?
    `<p class="text-sm text-gray-500">${item.status}</p>` :
    `<p class="text-sm text-gray-500">${item.amount.value} ${item.amount.unit}</p>`
}
          </div>
          <div class="flex space-x-2">
            <button onclick="window.location.hash='#/${type === 'selling' ? 'sell' : 'buy'}-item/edit/${item._id}'"
                    class="text-primary-600 hover:text-primary-700">
              <i class="fas fa-edit"></i>
            </button>
            <button onclick="this._deleteItem('${item._id}', '${type}')"
                    class="text-red-600 hover:text-red-700">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  },

  async _deleteItem(itemId, type) {
    try {
      // Konfirmasi sebelum delete
      if (!confirm('Apakah Anda yakin ingin menghapus item ini?')) {
        return;
      }

      let endpoint = '';
      if (type === 'selling') {
        endpoint = `${API_ENDPOINT.DELETE_PRODUCT(itemId)}`;
      } else {
        endpoint = `${API_ENDPOINT.BUY_OFFERS}/${itemId}`;
      }

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus item');
      }

      // Refresh content setelah delete berhasil
      const tabContent = document.getElementById('tabContent');
      await this._loadTabContent(type, tabContent);

    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Gagal menghapus item. Silakan coba lagi.');
    }
  }
};

export default Profile;
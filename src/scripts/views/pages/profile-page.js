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
      <div class="container mx-auto px-4 pt-24 pb-24">
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
    // Hapus event listener lama untuk mencegah duplikasi
    const contentContainer = document.getElementById('tabContent');
    contentContainer.addEventListener('click', async (e) => {
      const deleteBtn = e.target.closest('[data-delete-id]');
      if (deleteBtn) {
        e.preventDefault();
        e.stopPropagation();

        const id = deleteBtn.dataset.deleteId;
        const type = deleteBtn.dataset.type;
        const itemName = deleteBtn.closest('.border').querySelector('h3').textContent;

        // Show custom confirmation dialog
        const confirmed = await this._showConfirmDialog({
          title: `Hapus ${type === 'selling' ? 'Barang' : 'Penawaran'}`,
          message: `Apakah Anda yakin ingin menghapus ${type === 'selling' ? 'barang' : 'penawaran'} "${itemName}"?`,
          confirmText: 'Hapus',
          cancelText: 'Batal'
        });

        if (confirmed) {
          await this._deleteItem(id, type);
        }
      }
    });
  },

  _showConfirmDialog({ title, message, confirmText = 'Ya', cancelText = 'Batal' }) {
    return new Promise((resolve) => {
      // Create modal backdrop
      const backdrop = document.createElement('div');
      backdrop.className =
        'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';

      // Create modal content
      const modal = document.createElement('div');
      modal.className =
        'bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all';
      modal.innerHTML = `
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-2">${title}</h3>
          <p class="text-gray-600 mb-6">${message}</p>
          <div class="flex justify-end space-x-3">
            <button id="cancelBtn" 
              class="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors">
              ${cancelText}
            </button>
            <button id="confirmBtn" 
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              ${confirmText}
            </button>
          </div>
        </div>
      `;

      backdrop.appendChild(modal);
      document.body.appendChild(backdrop);

      // Add button handlers
      modal.querySelector('#confirmBtn').addEventListener('click', () => {
        backdrop.remove();
        resolve(true);
      });

      modal.querySelector('#cancelBtn').addEventListener('click', () => {
        backdrop.remove();
        resolve(false);
      });

      // Close on backdrop click
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          backdrop.remove();
          resolve(false);
        }
      });

      // Add animation
      requestAnimationFrame(() => {
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.95)';
        requestAnimationFrame(() => {
          modal.style.opacity = '1';
          modal.style.transform = 'scale(1)';
        });
      });
    });
  },

  async _deleteItem(itemId, type) {
    try {
      const button = document.querySelector(`[data-delete-id="${itemId}"]`);
      if (button) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      }

      const endpoint = type === 'selling'
        ? API_ENDPOINT.DELETE_PRODUCT(itemId)
        : `${API_ENDPOINT.BUY_OFFERS}/${itemId}`;

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

      // Show success message
      this._showToast('Item berhasil dihapus', 'success');

      // Refresh data
      await this._loadUserData();
      const tabContent = document.getElementById('tabContent');
      await this._loadTabContent(type, tabContent);

    } catch (error) {
      console.error('Error deleting item:', error);
      this._showToast('Gagal menghapus item', 'error');
    }
  },

  _showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `
      fixed bottom-4 right-4 px-6 py-3 rounded-lg text-white
      transform transition-all duration-300 translate-y-full
      ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}
    `;

    toast.innerHTML = `
      <div class="flex items-center space-x-2">
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
      toast.style.transform = 'translateY(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
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
            <button data-delete-id="${item._id}" data-type="${type}" class="text-red-600 hover:text-red-700">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  },

};

export default Profile;
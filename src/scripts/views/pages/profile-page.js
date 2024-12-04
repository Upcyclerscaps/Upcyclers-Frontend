/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
import API_ENDPOINT from '../../globals/api-endpoint';

const Profile = {
  async render() {
    const user = this._getUserData();
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
                  <button onclick="window.location.hash = '#/find-collector'"
                          class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all">
                    <i class="fas fa-shopping-cart mr-2"></i> Beli Barang
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div class="bg-white rounded-lg shadow-md p-6">
              <p class="text-gray-600">Total Transaksi</p>
              <p class="text-2xl font-bold">${user?.totalTransactions || '-'}</p>
            </div>
            <div class="bg-white rounded-lg shadow-md p-6">
              <p class="text-gray-600">Barang Terjual</p>
              <p class="text-2xl font-bold">${user?.totalSold || '-'}</p>
            </div>
            <div class="bg-white rounded-lg shadow-md p-6">
              <p class="text-gray-600">Barang Dibeli</p>
              <p class="text-2xl font-bold">${user?.totalBought || '-'}</p>
            </div>
            <div class="bg-white rounded-lg shadow-md p-6">
              <p class="text-gray-600">Rating</p>
              <p class="text-2xl font-bold flex items-center">
                ${user?.rating || '-'} <i class="fas fa-star text-yellow-400 ml-2"></i>
              </p>
            </div>
          </div>

          <!-- Tabs -->
          <div class="bg-white rounded-lg shadow-md">
            <div class="flex border-b">
              <button 
                class="text-gray-600 px-6 py-4 border-b-2 border-primary-600" 
                data-tab="transactions"
              >
                Riwayat Transaksi
              </button>
              <button 
                class="text-gray-600 px-6 py-4" 
                data-tab="products"
              >
                Barang Dijual
              </button>
              <button 
                class="text-gray-600 px-6 py-4" 
                data-tab="reviews"
              >
                Ulasan
              </button>
            </div>

            <div class="p-6">
              <!-- Content akan diisi oleh _loadTabContent -->
              <div id="tabContent">
                <div class="text-center py-8 text-gray-500">
                  <p>Belum ada data</p>
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
  },

  _getUserData() {
    return JSON.parse(localStorage.getItem('user')) || {};
  },

  _initializeTabs() {
    const tabs = document.querySelectorAll('[data-tab]');
    const tabContent = document.getElementById('tabContent');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        // Remove active class from all tabs
        tabs.forEach((t) => {
          t.classList.remove('border-b-2', 'border-primary-600');
        });

        // Add active class to clicked tab
        tab.classList.add('border-b-2', 'border-primary-600');

        // Load content for selected tab
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

      const response = await fetch(API_ENDPOINT.USER_PROFILE, {  // Gunakan endpoint yang sudah diupdate
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load user data');
      }

      // Update local storage with latest user data
      localStorage.setItem('user', JSON.stringify(data.data.user));  // Sesuaikan dengan struktur response

      // Update UI based on new data
      this._updateProfileUI(data.data.user);  // Sesuaikan dengan struktur response
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  },

  _updateProfileUI(userData) {
    // Update profile stats if needed
    // This will be called after successful data load
  },

  async _loadTabContent(tabName, container) {
    try {
      container.innerHTML = '<div class="text-center py-4"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';

      const token = localStorage.getItem('token');
      let endpoint;

      switch (tabName) {
      case 'transactions':
        endpoint = API_ENDPOINT.USER_TRANSACTIONS;
        break;
      case 'products':
        endpoint = API_ENDPOINT.USER_PRODUCTS;
        break;
      case 'reviews':
        endpoint = API_ENDPOINT.USER_REVIEWS;
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

      if (!response.ok) {
        throw new Error(data.message);
      }

      this._renderTabContent(tabName, data.data, container);
    } catch (error) {
      console.error(`Error loading ${tabName}:`, error);
      container.innerHTML = '<div class="text-center py-8 text-red-500">Gagal memuat data</div>';
    }
  },

  _renderTabContent(tabName, data, container) {
    if (!data || data.length === 0) {
      container.innerHTML = '<div class="text-center py-8 text-gray-500">Belum ada data</div>';
      return;
    }

    // Render content based on tab type
    switch (tabName) {
    case 'transactions':
      container.innerHTML = this._renderTransactions(data);
      break;
    case 'products':
      container.innerHTML = this._renderProducts(data);
      break;
    case 'reviews':
      container.innerHTML = this._renderReviews(data);
      break;
    }
  },

  _renderTransactions(transactions) {
    return transactions.map((transaction) => `
      <div class="border-b border-gray-100 pb-4 mb-4">
        <div class="flex justify-between items-start">
          <div>
            <div class="flex items-center space-x-2">
              <span class="font-medium">${transaction.product.name}</span>
              <span class="bg-${transaction.type === 'sell' ? 'primary' : 'red'}-100 
                         text-${transaction.type === 'sell' ? 'primary' : 'red'}-600 
                         text-sm px-2 py-1 rounded">
                ${transaction.type === 'sell' ? 'Terjual' : 'Dibeli'}
              </span>
            </div>
            <div class="text-gray-600 text-sm mt-1">
              ${new Date(transaction.createdAt).toLocaleDateString('id-ID')}
            </div>
          </div>
          <div class="text-right">
            <div class="font-medium">Rp ${transaction.amount.toLocaleString()}</div>
            <div class="text-sm text-gray-600">${transaction.quantity}</div>
          </div>
        </div>
      </div>
    `).join('');
  },

  _renderProducts(products) {
    return `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${products.map((product) => `
          <div class="border rounded-lg p-4">
            <div class="flex items-start space-x-4">
              <img src="${product.image}" alt="${product.name}" 
                   class="w-20 h-20 object-cover rounded-lg">
              <div>
                <h3 class="font-medium">${product.name}</h3>
                <p class="text-gray-600">Rp ${product.price.toLocaleString()}</p>
                <p class="text-sm text-gray-500">${product.status}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  _renderReviews(reviews) {
    return reviews.map((review) => `
      <div class="border-b border-gray-100 pb-4 mb-4">
        <div class="flex items-start space-x-4">
          <div class="flex-1">
            <div class="flex items-center mb-2">
              <span class="text-yellow-400 mr-1">★</span>
              <span class="font-medium">${review.rating}</span>
            </div>
            <p class="text-gray-700">${review.comment}</p>
            <p class="text-sm text-gray-500 mt-1">
              ${new Date(review.createdAt).toLocaleDateString('id-ID')}
            </p>
          </div>
        </div>
      </div>
    `).join('');
  }
};

export default Profile;
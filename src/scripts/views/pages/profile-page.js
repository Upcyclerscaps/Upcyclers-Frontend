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
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="bg-white rounded-lg shadow-md p-6">
              <p class="text-gray-600">Total Produk Dijual</p>
              <p class="text-2xl font-bold">${user?.totalProducts || '-'}</p>
            </div>
            <div class="bg-white rounded-lg shadow-md p-6">
              <p class="text-gray-600">Total Dilihat</p>
              <p class="text-2xl font-bold">${user?.totalViews || '-'}</p>
            </div>
          </div>

          <!-- Products Section -->
          <div class="bg-white rounded-lg shadow-md">
            <div class="p-6">
              <h2 class="text-xl font-bold mb-4">Produk Saya</h2>
              <div id="userProducts" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Products will be rendered here -->
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async afterRender() {
    await this._loadUserData();
    await this._loadUserProducts();
  },

  _getUserData() {
    return JSON.parse(localStorage.getItem('user')) || {};
  },

  async _loadUserData() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.hash = '#/auth';
        return;
      }

      const response = await fetch(API_ENDPOINT.USER_PROFILE, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      localStorage.setItem('user', JSON.stringify(data.data.user));
      this._updateProfileUI(data.data.user);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  },

  async _loadUserProducts() {
    const container = document.getElementById('userProducts');

    // Tampilkan pesan "Fitur dalam pengembangan"
    container.innerHTML = `
      <div class="col-span-full text-center py-8">
        <div class="bg-yellow-50 p-4 rounded-lg">
          <p class="text-yellow-800">
            <i class="fas fa-tools mr-2"></i>
            Fitur menampilkan produk sedang dalam pengembangan
          </p>
        </div>
      </div>
    `;

    // Kode asli di-comment untuk sementara
    /*
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINT.USER_PRODUCTS, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      this._renderProducts(data.data);
    } catch (error) {
      console.error('Error loading products:', error);
      container.innerHTML = `
        <div class="col-span-full text-center py-8 text-gray-500">
          <p>Gagal memuat produk</p>
        </div>
      `;
    }
    */
  },

  _renderProducts(products) {
    const container = document.getElementById('userProducts');

    if (!products || products.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-8 text-gray-500">
          <p>Anda belum memiliki produk</p>
          <button onclick="window.location.hash = '#/sell-item'"
                  class="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
            <i class="fas fa-plus mr-2"></i>Tambah Produk
          </button>
        </div>
      `;
      return;
    }

    // Render products jika ada
    container.innerHTML = products.map((product) => `
      <div class="border rounded-lg p-4">
        <div class="flex items-start space-x-4">
          <img src="${product.images[0]?.url || 'https://via.placeholder.com/80'}" 
               alt="${product.name}" 
               class="w-20 h-20 object-cover rounded-lg">
          <div class="flex-1">
            <h3 class="font-medium">${product.name}</h3>
            <p class="text-gray-600">Rp ${product.price.amount.toLocaleString()}</p>
            <p class="text-sm text-gray-500">${product.status}</p>
          </div>
          <div class="flex space-x-2">
            <button onclick="window.location.hash = '#/product/${product._id}'"
                    class="text-primary-600 hover:text-primary-700">
              <i class="fas fa-edit"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  },

  _updateProfileUI(userData) {
    // Update any dynamic UI elements if needed
  }
};

export default Profile;
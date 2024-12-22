/* eslint-disable linebreak-style */
// src/scripts/views/pages/admin/dashboard.js
import AdminLayout from './components/admin-layout';
import API_ENDPOINT from '../../../globals/api-endpoint';

const AdminDashboard = {
  async render() {
    return AdminLayout.render(`
      <div class="p-4 md:p-6 space-y-6 transition-all duration-300 w-full">
        <!-- Stats Overview -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto max-w-full">
          <!-- Total Users -->
          <div class="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-all w-full">
            <div class="flex items-center">
              <div class="flex-shrink-0 p-3 rounded-full bg-blue-100">
                <i class="fas fa-users text-xl text-blue-600"></i>
              </div>
              <div class="ml-4 flex-grow">
                <p class="text-sm text-gray-500">Total Users</p>
                <h3 class="text-xl md:text-2xl font-bold" id="totalUsers">0</h3>
              </div>
            </div>
          </div>

          <!-- Active Products -->
          <div class="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-all w-full">
            <div class="flex items-center">
              <div class="flex-shrink-0 p-3 rounded-full bg-green-100">
                <i class="fas fa-boxes text-xl text-green-600"></i>
              </div>
              <div class="ml-4 flex-grow">
                <p class="text-sm text-gray-500">Active Products</p>
                <h3 class="text-xl md:text-2xl font-bold" id="totalProducts">0</h3>
              </div>
            </div>
          </div>

          <!-- Active Buy Offers -->
          <div class="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-all w-full">
            <div class="flex items-center">
              <div class="flex-shrink-0 p-3 rounded-full bg-purple-100">
                <i class="fas fa-shopping-cart text-xl text-purple-600"></i>
              </div>
              <div class="ml-4 flex-grow">
                <p class="text-sm text-gray-500">Active Buy Offers</p>
                <h3 class="text-xl md:text-2xl font-bold" id="totalBuyOffers">0</h3>
              </div>
            </div>
          </div>
        </div>

        <!-- Latest Activities Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mx-auto max-w-full">
          <!-- Latest Products -->
          <div class="bg-white rounded-lg shadow-md w-full">
            <div class="flex justify-between items-center p-4 md:p-6 border-b">
              <h2 class="text-lg font-semibold">Latest Products</h2>
              <a href="#/admin/products" class="text-primary-600 hover:text-primary-700 text-sm">View all</a>
            </div>
            <div class="p-4 md:p-6 w-full">
              <div id="latestProducts" class="space-y-4">
                <!-- Products will be loaded here -->
              </div>
            </div>
          </div>

          <!-- Latest Buy Offers -->
          <div class="bg-white rounded-lg shadow-md w-full">
            <div class="flex justify-between items-center p-4 md:p-6 border-b">
              <h2 class="text-lg font-semibold">Latest Buy Offers</h2>
              <a href="#/admin/buy-offers" class="text-primary-600 hover:text-primary-700 text-sm">View all</a>
            </div>
            <div class="p-4 md:p-6 w-full">
              <div id="latestBuyOffers" class="space-y-4">
                <!-- Buy offers will be loaded here -->
              </div>
            </div>
          </div>
        </div>
      </div>
    `);
  },

  async afterRender() {
    try {
      const response = await fetch(API_ENDPOINT.ADMIN.DASHBOARD_STATS, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch dashboard data');

      const { data } = await response.json();

      // Update stats
      this._updateStats(data.stats);

      // Update latest data sections
      if (data.latestProducts) {
        this._renderLatestProducts(data.latestProducts);
      } else {
        document.getElementById('latestProducts').innerHTML = '<div class="text-center text-gray-500 py-4">No products found</div>';
      }

      // Check if latestBuyOffers exists
      if (data.latestBuyOffers) {
        this._renderLatestBuyOffers(data.latestBuyOffers);
      } else {
        document.getElementById('latestBuyOffers').innerHTML = '<div class="text-center text-gray-500 py-4">No buy offers found</div>';
      }

    } catch (error) {
      console.error('Error loading dashboard:', error);
      this._showError('Failed to load dashboard data');
    }
  },

  _updateStats(stats = {}) {

    const totalUsersElement = document.getElementById('totalUsers');
    const totalProductsElement = document.getElementById('totalProducts');
    const totalBuyOffersElement = document.getElementById('totalBuyOffers');

    if (totalUsersElement) {
      totalUsersElement.textContent = stats.usersCount?.toLocaleString() || 0;
    }
    if (totalProductsElement) {
      totalProductsElement.textContent = stats.productsCount?.toLocaleString() || 0;
    }
    if (totalBuyOffersElement) {
      totalBuyOffersElement.textContent = stats.buyOffersCount?.toLocaleString() || 0;
    }
  },

  _renderLatestProducts(products = []) {
    const container = document.getElementById('latestProducts');

    if (!products.length) {
      container.innerHTML = '<div class="text-center text-gray-500 py-4">No products found</div>';
      return;
    }

    container.innerHTML = products.map((product) => `
     <div class="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
       <div class="flex items-center space-x-4">
         <img src="${product.images?.[0]?.url || 'https://via.placeholder.com/40'}"
              alt="${product.name}"
              class="w-12 h-12 rounded object-cover">
         <div>
           <h3 class="text-sm font-medium text-gray-900">${product.name}</h3>
           <p class="text-sm text-gray-500">Rp ${product.price.amount.toLocaleString()}</p>
         </div>
       </div>
       <span class="px-2 py-1 text-xs font-medium rounded-full ${
  product.status === 'available'
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800'
}">
         ${product.status}
       </span>
     </div>
   `).join('');
  },

  _renderLatestBuyOffers(offers = []) {
    const container = document.getElementById('latestBuyOffers');

    if (!offers.length) {
      container.innerHTML = '<div class="text-center text-gray-500 py-4">No buy offers found</div>';
      return;
    }

    container.innerHTML = offers.map((offer) => `
     <div class="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
       <div class="flex items-center space-x-4">
         <img src="${offer.buyer?.profileImage || 'https://via.placeholder.com/40'}"
              alt="${offer.buyer?.name}"
              class="w-12 h-12 rounded-full object-cover">
         <div>
           <h3 class="text-sm font-medium text-gray-900">${offer.category}</h3>
           <p class="text-sm text-gray-500">${offer.amount.value} ${offer.amount.unit}</p>
         </div>
       </div>
       <span class="px-2 py-1 text-xs font-medium rounded-full ${
  offer.status === 'active'
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800'
}">
         ${offer.status}
       </span>
     </div>
   `).join('');
  },

  _showError(message) {
    const mainContent = document.querySelector('.container');
    mainContent.innerHTML = `
     <div class="bg-white rounded-lg shadow-md p-6 text-center">
       <div class="text-red-500 mb-4">
         <i class="fas fa-exclamation-circle text-4xl"></i>
       </div>
       <p class="text-gray-600">${message}</p>
       <button onclick="window.location.reload()"
               class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
         Try Again
       </button>
     </div>
   `;
  }
};

export default AdminDashboard;
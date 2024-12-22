/* eslint-disable linebreak-style */

import API_ENDPOINT from '../../globals/api-endpoint';

const DetailProductPage = {
  async render() {
    if (!localStorage.getItem('token')) {
      window.location.hash = '#/auth';
      return '';
    }

    const url = window.location.hash;
    // eslint-disable-next-line no-unused-vars
    const id = url.substring(url.lastIndexOf('/') + 1);

    return `
      <section class="pt-24 pb-12">
        <div class="container mx-auto px-4">
          <!-- Loading state -->
          <div id="loadingState" class="text-center py-8">
            <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p class="text-gray-600">Memuat...</p>
          </div>

          <!-- Content container -->
          <div id="productContent" class="hidden">
            <!-- Content will be rendered here -->
          </div>
        </div>
      </section>
    `;
  },

  async afterRender() {
    try {
      const url = window.location.hash;
      const id = url.split('/')[2];  // Ambil ID dari format baru

      if (!id) {
        throw new Error('Product ID not found');
      }

      const response = await fetch(`${API_ENDPOINT.GET_PRODUCT_DETAIL(id)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }

      const { data: product } = await response.json();
      this._renderProduct(product);

    } catch (error) {
      console.error('Error:', error);
      this._renderError(error.message);
    }
  },

  _renderProduct(product) {
    const content = document.getElementById('productContent');
    content.classList.remove('hidden');
    document.getElementById('loadingState').classList.add('hidden');

    content.innerHTML = `
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Single Image Section -->
          <div>
            <img 
              src="${product.images[0]?.url || 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Default-avatar.jpg?20160314221008'}" 
              alt="${product.name}"
              class="w-full rounded-lg shadow-md h-96 object-cover"
            >
          </div>

          <!-- Product Info -->
          <div class="space-y-6">
            <div>
              <div class="flex justify-between items-start">
                <h1 class="text-3xl font-bold text-gray-900">${product.name}</h1>
                <span class="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm">
                  ${product.category}
                </span>
              </div>
              <p class="text-2xl font-bold text-primary-600 mt-2">
                Rp ${product.price.amount.toLocaleString()}/${product.stock.unit}
              </p>
            </div>

            <div class="space-y-4">
              <div class="flex items-center">
                <i class="fas fa-box-open text-gray-600 w-6"></i>
                <span class="text-gray-600 ml-2">
                  ${product.stock.amount} ${product.stock.unit} tersedia
                </span>
              </div>
              <div class="flex items-center">
                <i class="fas fa-map-marker-alt text-gray-600 w-6"></i>
                <span class="text-gray-600 ml-2">${product.location.address}</span>
              </div>
              <div class="flex items-center">
                <i class="fas fa-clock text-gray-600 w-6"></i>
                <span class="text-gray-600 ml-2">
                  Diposting ${this._formatDate(product.createdAt)}
                </span>
              </div>
            </div>

            <div class="border-t border-gray-200 pt-6">
              <h2 class="text-xl font-bold mb-4">Deskripsi Produk</h2>
              <p class="text-gray-700 whitespace-pre-line">${product.description}</p>
            </div>

            <!-- Seller Info -->
            <div class="border-t border-gray-200 pt-6">
              <h2 class="text-xl font-bold mb-4">Informasi Penjual</h2>
              <div class="flex items-center space-x-4">
                <img 
                  src="${product.seller.profileImage || 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Default-avatar.jpg?20160314221008'}"
                  alt="${product.seller.name}"
                  class="w-16 h-16 rounded-full object-cover"
                >
                <div>
                  <h3 class="font-bold">${product.seller.name}</h3>
                </div>
              </div>
              <div class="flex space-x-4 mt-4">
                <a 
                  href="https://wa.me/${product.seller.phone?.replace(/\D/g, '')}"
                  target="_blank"
                  class="flex-1 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-all flex items-center justify-center"
                >
                  <i class="fab fa-whatsapp mr-2"></i> WhatsApp
                </a>
                <a 
                  href="tel:${product.seller.phone}"
                  class="flex-1 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-all flex items-center justify-center"
                >
                  <i class="fas fa-phone mr-2"></i> Telepon
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },


  _renderError(message) {
    const content = document.getElementById('productContent');
    content.classList.remove('hidden');
    document.getElementById('loadingState').classList.add('hidden');

    content.innerHTML = `
      <div class="text-center py-8">
        <div class="text-red-500 mb-4">
          <i class="fas fa-exclamation-circle text-4xl"></i>
        </div>
        <p class="text-gray-600">${message}</p>
        <button 
          onclick="window.location.hash = '#/jual-beli'"
          class="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
        >
          Kembali ke Jual Beli
        </button>
      </div>
    `;
  },

  _formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },
};

export default DetailProductPage;
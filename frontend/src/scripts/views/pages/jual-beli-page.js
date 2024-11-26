/* eslint-disable linebreak-style */
import ITEMS from '../../data/sample-items.js';

const JualBeliPage = {
  async render() {
    return `
      <section class="pt-24 pb-8">
        <div class="container mx-auto px-4">
          ${this._renderFilters()}
          ${await this._renderProducts()}
        </div>
      </section>
    `;
  },

  _renderFilters() {
    // Get unique locations from items
    const locations = [...new Set(ITEMS.map((item) => item.location.split(',')[0]))];
    // Get unique categories from items
    const categories = [...new Set(ITEMS.map((item) => item.category))];

    return `
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <form id="filterForm" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Cari Produk</label>
              <input
                type="text"
                placeholder="Cari barang rongsok..."
                class="w-full p-2 border rounded-lg"
                id="searchInput"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select id="categoryFilter" class="w-full p-2 border rounded-lg">
                <option value="">Semua Kategori</option>
                ${categories.map((category) => `
                  <option value="${category}">${category}</option>
                `).join('')}
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
              <select id="locationFilter" class="w-full p-2 border rounded-lg">
                <option value="">Semua Lokasi</option>
                ${locations.map((location) => `
                  <option value="${location}">${location}</option>
                `).join('')}
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex space-x-4">
              <div class="w-1/2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Harga Minimum</label>
                <input
                  type="number"
                  placeholder="Harga Min"
                  class="w-full p-2 border rounded-lg"
                  id="priceMin"
                >
              </div>
              <div class="w-1/2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Harga Maksimum</label>
                <input
                  type="number"
                  placeholder="Harga Max"
                  class="w-full p-2 border rounded-lg"
                  id="priceMax"
                >
              </div>
            </div>
            <div class="flex items-end">
              <button type="submit" class="w-full bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-all">
                <i class="fas fa-search mr-2"></i>Cari
              </button>
            </div>
          </div>
        </form>
      </div>
    `;
  },

  async _renderProducts(filteredItems = ITEMS) {
    const container = document.createElement('div');
    container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';

    if (filteredItems.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-8">
          <p class="text-gray-500 text-lg">Tidak ada produk yang ditemukan</p>
        </div>
      `;
      return container.outerHTML;
    }

    container.innerHTML = filteredItems.map((item) => this._renderProductCard(item)).join('');
    return container.outerHTML;
  },

  _renderProductCard(item) {
    return `
      <div class="bg-white rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer"
           onclick="window.location.hash = '#/product?id=${item.id}'">
        <img 
          src="${item.image}" 
          alt="${item.name}"
          class="w-full h-48 object-cover rounded-t-lg"
        >
        <div class="p-4">
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-bold text-lg">${item.name}</h3>
            <span class="bg-primary-100 text-primary-600 px-2 py-1 rounded-full text-sm">
              ${item.category}
            </span>
          </div>
          <p class="text-gray-600 mb-2">${item.quantity} tersedia</p>
          <p class="text-gray-600 mb-3">${item.location}</p>
          <div class="flex justify-between items-center">
            <span class="text-lg font-bold text-primary-600">Rp ${item.price}${item.category === 'Elektronik' ? '/unit' : '/kg'}</span>
            <button class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-all">
              Detail
            </button>
          </div>
        </div>
      </div>
    `;
  },

  _filterItems() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedCategory = document.getElementById('categoryFilter').value;
    const selectedLocation = document.getElementById('locationFilter').value;
    const minPrice = parseFloat(document.getElementById('priceMin').value) || 0;
    const maxPrice = parseFloat(document.getElementById('priceMax').value) || Infinity;

    return ITEMS.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm);
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      const matchesLocation = !selectedLocation || item.location.includes(selectedLocation);
      const price = parseFloat(item.price.replace(/[^0-9]/g, ''));
      const matchesPrice = price >= minPrice && price <= maxPrice;

      return matchesSearch && matchesCategory && matchesLocation && matchesPrice;
    });
  },

  _handleFilter(e) {
    e.preventDefault();
    const filteredItems = this._filterItems();
    const productsContainer = document.querySelector('.grid');
    productsContainer.outerHTML = this._renderProducts(filteredItems);
  },

  async afterRender() {
    // Check for category filter in URL
    const hash = window.location.hash;
    if (hash.includes('#category=')) {
      const category = hash.split('=')[1];
      document.getElementById('categoryFilter').value = decodeURIComponent(category);
      this._handleFilter(new Event('submit'));
    }

    // Add event listeners
    const filterForm = document.getElementById('filterForm');
    filterForm.addEventListener('submit', (e) => this._handleFilter(e));

    // Add event listeners for real-time filtering
    const inputs = ['searchInput', 'categoryFilter', 'locationFilter', 'priceMin', 'priceMax'];
    inputs.forEach((id) => {
      document.getElementById(id).addEventListener('input', () => {
        filterForm.dispatchEvent(new Event('submit'));
      });
    });
  }
};

export default JualBeliPage;
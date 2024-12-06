/* eslint-disable linebreak-style */
// src/scripts/views/pages/jual-beli/template-creator.js
const TemplateCreator = {
  createFilters() {
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
                    <option value="Logam">Logam</option>
                    <option value="Plastik">Plastik</option>
                    <option value="Kertas">Kertas</option>
                    <option value="Elektronik">Elektronik</option>
                  </select>
                </div>
    
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                  <select id="locationFilter" class="w-full p-2 border rounded-lg">
                    <option value="">Semua Lokasi</option>
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

  createProductCard(product) {
    return `
        <div class="bg-white rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer"
             onclick="window.location.hash = '#/product?id=${product._id}'">
          <img 
            src="${this._getProductImage(product)}" 
            alt="${product.name}"
            class="w-full h-48 object-cover rounded-t-lg"
            onerror="this.src='https://via.placeholder.com/300x300'"
          >
          <div class="p-4">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-bold text-lg">${product.name}</h3>
              <span class="bg-primary-100 text-primary-600 px-2 py-1 rounded-full text-sm">
                ${product.category}
              </span>
            </div>
            <p class="text-gray-600 mb-2">${this._formatQuantity(product)}</p>
            <p class="text-gray-600 mb-3">${this._getAddress(product)}</p>
            <div class="flex justify-between items-center">
              <span class="text-lg font-bold text-primary-600">
                ${this._formatPrice(product)}
              </span>
              <button class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                Detail
              </button>
            </div>
          </div>
        </div>
      `;
  },

  _getProductImage(product) {
    console.log('Product images:', product.images);

    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      const mainImage = product.images.find((img) => img.is_primary) || product.images[0];
      console.log('Selected image:', mainImage);
      return mainImage.url;
    }

    return 'https://via.placeholder.com/300x300';
  },

  _formatQuantity(product) {
    if (product.stock && product.stock.amount !== undefined) {
      return `${product.stock.amount} ${product.stock.unit || 'kg'} tersedia`;
    } else if (product.quantity) {
      return `${product.quantity} tersedia`;
    }
    return 'Stok tidak tersedia';
  },

  _getAddress(product) {
    if (product.location && product.location.address) {
      return product.location.address;
    }
    return 'Alamat tidak tersedia';
  },

  _formatPrice(product) {
    let price;
    if (product.price && product.price.amount !== undefined) {
      price = product.price.amount;
    } else if (typeof product.price === 'number') {
      price = product.price;
    } else {
      price = 0;
    }
    return `Rp ${price.toLocaleString()}/kg`;
  },

  createNoProductsFound() {
    return `
        <div class="col-span-full text-center py-8">
          <p class="text-gray-500 text-lg">Tidak ada produk yang ditemukan</p>
        </div>
      `;
  }
};

export default TemplateCreator;
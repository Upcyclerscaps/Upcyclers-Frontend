/* eslint-disable linebreak-style */
const ResultsHandler = {
  initialize(mapHandler) {
    this.mapHandler = mapHandler;
  },

  displayResults(results) {
    const container = document.getElementById('searchResults');

    // Validasi results
    if (!results || (typeof results !== 'object')) {
      console.log('No valid results object');
      container.innerHTML = this._createEmptyResultTemplate();
      return;
    }

    const sellers = Array.isArray(results.sellers) ? results.sellers : [];
    const buyers = Array.isArray(results.buyers) ? results.buyers : [];

    if (sellers.length === 0 && buyers.length === 0) {
      container.innerHTML = this._createEmptyResultTemplate();
      return;
    }

    let html = '';

    // Render sellers section if exists
    if (sellers.length > 0) {
      html += this._createResultsSection('Barang yang Dijual di Sekitar', sellers, 'seller');
    }

    // Render buyers section if exists
    if (buyers.length > 0) {
      html += this._createResultsSection('Penawaran Beli di Sekitar', buyers, 'buyer');
    }
    container.innerHTML = html || this._createEmptyResultTemplate();
  },

  _createResultsSection(title, items, type) {
    if (!items || items.length === 0) return '';

    return `
      <div class="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 class="text-2xl font-bold mb-6">${title}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${items.map((item) => this._createResultItemTemplate(item, type)).join('')}
        </div>
      </div>
    `;
  },

  _createResultItemTemplate(result, type) {
    // Template untuk buyer
    if (type === 'buyer') {
      return `
    <div class="bg-white border rounded-lg p-6 hover:shadow-md transition-all">
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-xl font-bold">${result.category}</h3>
        <div class="flex space-x-2">
          <span class="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm">
            ${result.amount.value} ${result.amount.unit}
          </span>
        </div>
      </div>
      
      <p class="text-gray-600 mb-4">${result.description}</p>
      
      <div class="border-t pt-4">
        <p class="text-lg font-bold text-primary-600 mb-2">
          Rp ${result.price.amount.toLocaleString()}/${result.amount.unit}
          ${result.price.negotiable ? ' (Nego)' : ''}
        </p>

        <div class="space-y-2 text-sm text-gray-600">
          <p><i class="fas fa-user mr-2"></i>${result.buyer?.name || 'Tidak ada nama'}</p>
          <p><i class="fas fa-map-marker-alt mr-2"></i>${result.location?.address || 'Alamat tidak tersedia'}</p>
          <p><i class="fas fa-clock mr-2"></i>Posted: ${new Date(result.createdAt).toLocaleDateString()}</p>
        </div>

        <div class="flex space-x-2 mt-4">
          ${result.buyer?.phone ? `
            <button onclick="window.open('https://wa.me/${result.buyer.phone?.replace(/\D/g, '')}')"
                    class="flex-1 bg-green-500 text-white text-center py-2 rounded-lg hover:bg-green-600">
              <i class="fab fa-whatsapp mr-2"></i>WhatsApp
            </button>
            <button onclick="window.open('tel:${result.buyer.phone}')"
                    class="flex-1 bg-primary-600 text-white text-center py-2 rounded-lg hover:bg-primary-700">
              <i class="fas fa-phone mr-2"></i>Telepon
            </button>
          ` : ''}
          ${result.location?.coordinates ? `
            <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${result.location.coordinates[1]},${result.location.coordinates[0]}')"
                    class="flex-1 bg-blue-500 text-white text-center py-2 rounded-lg hover:bg-blue-600">
              <i class="fas fa-map-marker-alt mr-2"></i>Rute
            </button>
          ` : ''}
        </div>
      </div>
    </div>
  `;
    }

    // Template untuk seller
    return `
  <div class="bg-white border rounded-lg p-6 hover:shadow-md transition-all">
    <div class="flex justify-between items-start mb-4">
      <h3 class="text-xl font-bold">${result.name}</h3>
      <div class="flex space-x-2">
        <span class="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm">
          ${result.stock?.amount} ${result.stock?.unit}
        </span>
        <span class="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm">
          ${result.category}
        </span>
      </div>
    </div>

    <p class="text-gray-600 mb-4">${result.description}</p>

    <div class="border-t pt-4">
      <p class="text-lg font-bold text-primary-600 mb-2">
        Rp ${result.price.amount.toLocaleString()}/${result.stock?.unit}
        ${result.price.negotiable ? ' (Nego)' : ''}
      </p>

      <div class="space-y-2 text-sm text-gray-600">
        <p><i class="fas fa-user mr-2"></i>${result.seller?.name || 'Tidak ada nama'}</p>
        <p><i class="fas fa-map-marker-alt mr-2"></i>${result.location?.address || 'Alamat tidak tersedia'}</p>
        <p><i class="fas fa-clock mr-2"></i>Posted: ${new Date(result.createdAt).toLocaleDateString()}</p>
      </div>

      <div class="flex space-x-2 mt-4">
        ${result.seller?.phone ? `
          <button onclick="window.open('tel:${result.seller.phone}')"
                  class="flex-1 bg-primary-600 text-white text-center py-2 rounded-lg hover:bg-primary-700">
            <i class="fas fa-phone mr-2"></i>Telepon
          </button>
        ` : ''}
        ${result.location?.coordinates ? `
          <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${result.location.coordinates[1]},${result.location.coordinates[0]}')"
                  class="flex-1 bg-blue-500 text-white text-center py-2 rounded-lg hover:bg-blue-600">
            <i class="fas fa-map-marker-alt mr-2"></i>Rute
          </button>
        ` : ''}
        <button onclick="window.location.hash='#/product/${result._id}'"
                class="flex-1 bg-primary-600 text-white text-center py-2 rounded-lg hover:bg-primary-700">
          Detail
        </button>
      </div>
    </div>
  </div>
`;
  },

  _createEmptyResultTemplate() {
    return `
      <div class="bg-white rounded-lg shadow-md p-8 text-center">
        <p class="text-gray-600 text-lg">Tidak ada hasil yang ditemukan di sekitar lokasi Anda</p>
      </div>
    `;
  }
};

export default ResultsHandler;
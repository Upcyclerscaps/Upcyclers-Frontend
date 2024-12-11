/* eslint-disable linebreak-style */
const ResultsHandler = {
  initialize(mapHandler) {
    this.mapHandler = mapHandler;
  },

  displayResults(results) {
    const container = document.getElementById('searchResults');

    const sellers = results?.sellers || [];
    const buyers = results?.buyers || [];

    if (sellers.length === 0 && buyers.length === 0) {
      container.innerHTML = this._createEmptyResultTemplate();
      return;
    }

    let html = '';

    if (sellers.length > 0) {
      html += this._createResultsSection('Barang yang Dijual di Sekitar', sellers, 'seller');
    }

    if (buyers.length > 0) {
      html += this._createResultsSection('Penawaran Beli di Sekitar', buyers, 'buyer');
    }

    container.innerHTML = html;
  },

  _createResultsSection(title, items, type) {
    if (!items || items.length === 0) return '';

    return `
      <div class="mb-8">
        <h2 class="text-xl font-bold mb-4">${title}</h2>
        <div class="space-y-4">
          ${items.map((item) => this._createResultItemTemplate(item, type)).join('')}
        </div>
      </div>
    `;
  },

  _createEmptyResultTemplate() {
    return `
      <div class="bg-white p-4 rounded-lg shadow-md text-center">
        <p class="text-gray-600">Tidak ada hasil yang ditemukan di sekitar lokasi Anda</p>
      </div>
    `;
  },

  _createResultItemTemplate(result, type) {
    if (type === 'seller') {
      // Template untuk penjual (barang)
      return `
        <div class="bg-white p-6 rounded-lg shadow-md mb-4">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-bold text-lg">${result.name}</h3>
              <p class="text-gray-600">
                <span class="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm">
                  ${result.stock?.amount || 0} ${result.stock?.unit || 'kg'}
                </span>
                <span class="ml-2">Rp ${result.price?.amount?.toLocaleString() || 0}/${result.stock?.unit || 'kg'}</span>
              </p>
              <p class="text-gray-600 mt-2">${result.category || '-'}</p>
              <p class="text-gray-600">${result.description || '-'}</p>
              <p class="text-gray-600 mt-2">
                <i class="fas fa-map-marker-alt mr-2"></i>${result.location?.address || 'Alamat tidak tersedia'}
              </p>
            </div>
          </div>
          <div class="mt-4 flex space-x-4">
            <button onclick="window.location.hash='#/product/${result._id}'"
                    class="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
              Detail
            </button>
          </div>
        </div>
      `;
    } else {
      // Template untuk pembeli (penawaran beli)
      return `
        <div class="bg-white p-6 rounded-lg shadow-md mb-4">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-bold text-lg">Dicari: ${result.category}</h3>
              <p class="text-gray-600">
                <span class="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm">
                  ${result.amount?.value || 0} ${result.amount?.unit || 'kg'}
                </span>
                <span class="ml-2">Rp ${result.price?.amount?.toLocaleString() || 0}/${result.amount?.unit || 'kg'}</span>
              </p>
              <p class="text-gray-600 mt-2">${result.description || '-'}</p>
              <p class="text-gray-600 mt-2">
                <i class="fas fa-map-marker-alt mr-2"></i>${result.location?.address || 'Alamat tidak tersedia'}
              </p>
            </div>
          </div>
          <div class="mt-4 flex space-x-4">
            <button onclick="window.open('https://wa.me/${result.buyer?.phone?.replace(/\D/g, '')}')"
                    class="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">
              <i class="fab fa-whatsapp mr-2"></i>WhatsApp
            </button>
            <button onclick="window.open('tel:${result.buyer?.phone}')"
                    class="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
              <i class="fas fa-phone mr-2"></i>Telepon
            </button>
          </div>
        </div>
      `;
    }
  }
};

export default ResultsHandler;
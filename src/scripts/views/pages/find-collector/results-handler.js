/* eslint-disable linebreak-style */
const ResultsHandler = {
  initialize(mapHandler) {
    this.mapHandler = mapHandler;
  },

  displayResults(results) {
    const container = document.getElementById('searchResults');

    if (!results.sellers.length && !results.buyers.length) {
      container.innerHTML = this._createEmptyResultTemplate();
      return;
    }

    container.innerHTML = `
      ${this._createResultsSection('Barang yang Dijual di Sekitar', results.sellers, 'seller')}
      ${this._createResultsSection('Penawaran Beli di Sekitar', results.buyers, 'buyer')}
    `;
  },

  _createEmptyResultTemplate(type) {
    return `
      <div class="bg-white p-4 rounded-lg shadow-md text-center">
        <p>Tidak ada ${type === 'seller' ? 'penjual' : 'penawaran beli'} yang ditemukan di sekitar lokasi Anda</p>
      </div>
    `;
  },

  _createResultItemTemplate(result, type) {
    if (type === 'seller') {
      return `
      <div class="bg-white p-4 rounded-lg shadow-md mb-4">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-bold text-lg">${result.name || 'Tidak ada nama'}</h3>
            <p class="text-gray-600">
              <span class="bg-primary-100 text-primary-600 px-2 py-1 rounded-full text-sm">
                ${result.stock?.amount || 0} ${result.stock?.unit || 'kg'}
              </span>
              <span class="ml-2">Rp ${result.price?.amount?.toLocaleString() || 0}/${result.stock?.unit || 'kg'}</span>
            </p>
            <p class="text-gray-600 mt-2">${result.category || 'Tidak ada kategori'}</p>
            <p class="text-gray-600">${result.description || 'Tidak ada deskripsi'}</p>
            <p class="text-gray-600 mt-2">
              <i class="fas fa-map-marker-alt mr-1"></i>
              ${result.location?.address || 'Alamat tidak tersedia'}
            </p>
          </div>
        </div>
        <div class="mt-4 flex justify-between items-center">
          ${result.location?.coordinates ? `
            <button onclick="window.open('https://maps.google.com?q=${result.location.coordinates[1]},${result.location.coordinates[0]}', '_blank')"
                    class="text-primary-600 hover:text-primary-700">
              <i class="fas fa-map-marker-alt mr-1"></i>Lihat di Maps
            </button>
          ` : ''}
          ${result.phone ? `
            <button onclick="window.open('tel:${result.phone}')"
                    class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
              <i class="fas fa-phone mr-1"></i>Hubungi
            </button>
          ` : ''}
        </div>
      </div>
    `;
    } else {
      return `
      <div class="bg-white p-4 rounded-lg shadow-md mb-4">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-bold text-lg">Dicari: ${result.category || 'Tidak ada kategori'}</h3>
            <p class="text-gray-600">
              ${result.amount ? `
                <span class="bg-primary-100 text-primary-600 px-2 py-1 rounded-full text-sm">
                  ${result.amount.value || 0} ${result.amount.unit || 'kg'}
                </span>
              ` : ''}
              ${result.price ? `
                <span class="ml-2">Rp ${result.price.amount?.toLocaleString() || 0}/${result.amount?.unit || 'kg'}</span>
              ` : ''}
            </p>
            <p class="text-gray-600 mt-2">${result.description || 'Tidak ada deskripsi'}</p>
            <p class="text-gray-600 mt-2">
              <i class="fas fa-map-marker-alt mr-1"></i>
              ${result.location?.address || 'Alamat tidak tersedia'}
            </p>
          </div>
        </div>
        <div class="mt-4 flex justify-between items-center">
          ${result.location?.coordinates ? `
            <button onclick="window.open('https://maps.google.com?q=${result.location.coordinates[1]},${result.location.coordinates[0]}', '_blank')"
                    class="text-primary-600 hover:text-primary-700">
              <i class="fas fa-map-marker-alt mr-1"></i>Lihat di Maps
            </button>
          ` : ''}
          ${result.buyer?.phone ? `
            <div class="space-x-2">
              <button onclick="window.open('https://wa.me/${result.buyer.phone}', '_blank')"
                      class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                <i class="fab fa-whatsapp mr-1"></i>WhatsApp
              </button>
              <button onclick="window.open('tel:${result.buyer.phone}')"
                      class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                <i class="fas fa-phone mr-1"></i>Telepon
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
    }
  }
};

export default ResultsHandler;
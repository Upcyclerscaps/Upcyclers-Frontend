/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */

const ResultsHandler = {
  initialize(mapHandler) {
    this.mapHandler = mapHandler;
  },

  displayResults(results, filters) {
    const container = document.getElementById('searchResults');

    if (!results || results.length === 0) {
      container.innerHTML = this._createEmptyResultTemplate();
      return;
    }

    container.innerHTML = results
      .map((result) => this._createResultItemTemplate(result, filters.type))
      .join('');
  },

  updateMapMarkers(results) {
    this.mapHandler.clearMarkers();

    results.forEach((result) => {
      const marker = this.mapHandler.addMarker(
        result.location.coordinates,
        this._createMarkerPopup(result)
      );
    });

    this.mapHandler.fitMapToMarkers();
  },

  _createEmptyResultTemplate() {
    return `
        <div class="bg-white p-4 rounded-lg shadow-md text-center">
          <p>Tidak ada hasil yang ditemukan</p>
        </div>
      `;
  },

  _createResultItemTemplate(result, type) {
    const isSeller = type === 'seller';
    return `
        <div class="bg-white p-4 rounded-lg shadow-md">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-bold text-lg">${result.name}</h3>
              <p class="text-gray-600">Jarak: ${this._calculateDistance(result.location)} km</p>
              <p class="text-gray-600">Kategori: ${this._getCategories(result, isSeller)}</p>
              <p class="text-gray-600">${result.location.address}</p>
            </div>
            <div class="flex items-center">
              <span class="text-primary-600 mr-1">${result.rating.toFixed(1)}</span>
              <i class="fas fa-star text-yellow-400"></i>
            </div>
          </div>
          <div class="mt-4 flex justify-between items-center">
            <button onclick="window.open('https://maps.google.com?q=${result.location.coordinates[1]},${result.location.coordinates[0]}', '_blank')"
                    class="text-primary-600 hover:text-primary-700">
              <i class="fas fa-map-marker-alt mr-1"></i>Lihat di Maps
            </button>
            <button onclick="window.open('tel:${result.phone}')"
                    class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
              <i class="fas fa-phone mr-1"></i>Hubungi
            </button>
          </div>
        </div>
      `;
  },

  _createMarkerPopup(result) {
    return `
        <div class="text-center">
          <h3 class="font-bold">${result.name}</h3>
          <p class="text-sm">${result.location.address}</p>
          <p class="text-sm mb-2">
            <span class="text-yellow-400">★</span> 
            ${result.rating.toFixed(1)}
          </p>
          <div class="flex space-x-2 justify-center">
            <button 
              onclick="window.open('https://maps.google.com?q=${result.location.coordinates[1]},${result.location.coordinates[0]}', '_blank')"
              class="bg-primary-600 text-white px-2 py-1 rounded text-sm">
              <i class="fas fa-map-marker-alt mr-1"></i>Maps
            </button>
            <button 
              onclick="window.open('tel:${result.phone}')"
              class="bg-primary-600 text-white px-2 py-1 rounded text-sm">
              <i class="fas fa-phone mr-1"></i>Hubungi
            </button>
          </div>
        </div>
      `;
  },

  _calculateDistance(location) {
    // Implement distance calculation
    return ((Math.random() * 5) + 0.1).toFixed(1); // Temporary random distance
  },

  _getCategories(result, isSeller) {
    const items = isSeller ? result.sellItems : result.buyItems;
    return items.map((item) => item.category).join(', ');
  }
};

export default ResultsHandler;
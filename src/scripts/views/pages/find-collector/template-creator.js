/* eslint-disable linebreak-style */
const TemplateCreator = {
  createResultItem(item, searchType) {
    const isSeller = searchType === 'seller';
    return `
        <div class="bg-white p-4 rounded-lg shadow-md">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-bold text-lg">${item.name}</h3>
              <p class="text-gray-600">Jarak: ${this._formatDistance(item.distance)} km</p>
              ${this._createItemDetails(item, isSeller)}
              <p class="text-gray-600">${item.location.address}</p>
            </div>
            ${this._createRatingBadge(item.rating)}
          </div>
          ${this._createActionButtons(item)}
        </div>
      `;
  },

  createMarkerPopup(item) {
    return `
        <div class="text-center">
          <h3 class="font-bold">${item.name}</h3>
          <p class="text-sm">${item.location.address}</p>
          <p class="text-sm mb-2">
            <span class="text-yellow-400">★</span> 
            ${item.rating.toFixed(1)}
          </p>
          ${this._createPopupButtons(item)}
        </div>
      `;
  },

  createEmptyResult() {
    return `
        <div class="bg-white p-4 rounded-lg shadow-md text-center">
          <p class="text-gray-500">Tidak ada hasil yang ditemukan</p>
        </div>
      `;
  },

  _createItemDetails(item, isSeller) {
    const items = isSeller ? item.sellItems : item.buyItems;
    const categories = items.map((i) => i.category).join(', ');
    const details = isSeller ?
      `${items[0]?.stock.amount} ${items[0]?.stock.unit}` :
      `Max: ${items[0]?.maxAmount.amount} ${items[0]?.maxAmount.unit}`;

    return `
        <p class="text-gray-600">Kategori: ${categories}</p>
        <p class="text-gray-600">Jumlah: ${details}</p>
      `;
  },

  _createRatingBadge(rating) {
    return `
        <div class="flex items-center">
          <span class="text-primary-600 mr-1">${rating.toFixed(1)}</span>
          <i class="fas fa-star text-yellow-400"></i>
        </div>
      `;
  },

  _createActionButtons(item) {
    return `
        <div class="mt-4 flex justify-between items-center">
          <button class="text-primary-600 hover:text-primary-700" 
                  onclick="window.open('https://maps.google.com?q=${item.location.coordinates[1]},${item.location.coordinates[0]}', '_blank')">
            <i class="fas fa-map-marker-alt mr-1"></i>Lihat di Maps
          </button>
          <button class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                  onclick="window.open('tel:${item.phone}')">
            <i class="fas fa-phone mr-1"></i>Hubungi
          </button>
        </div>
      `;
  },

  _createPopupButtons(item) {
    return `
        <div class="flex space-x-2 justify-center">
          <button 
            onclick="window.open('https://maps.google.com?q=${item.location.coordinates[1]},${item.location.coordinates[0]}', '_blank')"
            class="bg-primary-600 text-white px-2 py-1 rounded text-sm">
            <i class="fas fa-map-marker-alt mr-1"></i>Maps
          </button>
          <button 
            onclick="window.open('tel:${item.phone}')"
            class="bg-primary-600 text-white px-2 py-1 rounded text-sm">
            <i class="fas fa-phone mr-1"></i>Hubungi
          </button>
        </div>
      `;
  },

  _formatDistance(distance) {
    return typeof distance === 'number' ? distance.toFixed(1) : '?';
  }
};

export default TemplateCreator;
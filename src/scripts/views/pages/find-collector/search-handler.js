/* eslint-disable linebreak-style */
import ItemService from '../../../services/item.service';

const SearchHandler = {
  initialize(mapHandler, resultsHandler) {
    this.mapHandler = mapHandler;
    this.resultsHandler = resultsHandler;
    this._initializeSearchForm();
    this._initializeTypeSelection();
  },

  _initializeSearchForm() {
    const form = document.getElementById('searchForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this._handleSearch();
    });
  },

  _initializeTypeSelection() {
    const searchTypes = document.querySelectorAll('[data-type]');
    const categoryLabel = document.querySelector('label[for="categoryFilter"]');
    const priceRangeDiv = document.getElementById('priceRangeDiv');

    searchTypes.forEach((type) => {
      type.addEventListener('click', () => {
        // Update UI for selected type
        searchTypes.forEach((t) => t.classList.remove('active', 'border-primary-500', 'bg-primary-50'));
        type.classList.add('active', 'border-primary-500', 'bg-primary-50');

        // Update form based on type
        const isSellerSearch = type.dataset.type === 'seller';
        categoryLabel.textContent = isSellerSearch ? 'Kategori Barang yang Ingin Dijual' : 'Kategori Barang yang Dicari';
        priceRangeDiv.classList.toggle('hidden', !isSellerSearch);

        // Update radio button
        const radio = type.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      });
    });
  },

  async _handleSearch() {
    try {
      const formData = this._getFormData();
      const searchType = this._getSearchType();

      if (!formData.location) {
        alert('Silakan pilih lokasi terlebih dahulu');
        return;
      }

      // Get nearby users based on search type
      const results = await this._fetchResults(searchType, formData);

      // Update UI with results
      this.resultsHandler.displayResults(results);
      this.mapHandler.updateMarkers(results);

    } catch (error) {
      console.error('Search error:', error);
      alert('Gagal melakukan pencarian. Silakan coba lagi.');
    }
  },

  _getFormData() {
    const form = document.getElementById('searchForm');
    const formData = new FormData(form);

    return {
      location: formData.get('location'),
      category: formData.get('category'),
      radius: parseFloat(formData.get('radius')),
      priceMin: parseFloat(formData.get('priceMin')) || 0,
      priceMax: parseFloat(formData.get('priceMax')) || Infinity
    };
  },

  _getSearchType() {
    return document.querySelector('input[name="searchType"]:checked')?.id || 'collector';
  },

  async _fetchResults(searchType, formData) {
    const [lat, lng] = formData.location.split(',').map((coord) => parseFloat(coord.trim()));
    const coordinates = [lng, lat];

    if (searchType === 'seller') {
      return await ItemService.findNearbySellers(
        coordinates,
        formData.category,
        formData.radius,
        {
          priceMin: formData.priceMin,
          priceMax: formData.priceMax
        }
      );
    } else {
      return await ItemService.findNearbyBuyers(
        coordinates,
        formData.category,
        formData.radius
      );
    }
  }
};

export default SearchHandler;
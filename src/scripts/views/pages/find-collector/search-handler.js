/* eslint-disable linebreak-style */
// eslint-disable-next-line no-unused-vars
import ItemService from '../../../services/item.service';
import API_ENDPOINT from '../../../globals/api-endpoint';

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

    // Get location button handler
    document.querySelector('#getCurrentLocation')?.addEventListener('click', async () => {
      const locationInput = document.querySelector('#location');
      const radiusSelect = document.getElementById('radiusFilter');

      try {
        const position = await this._getCurrentPosition();
        const { latitude, longitude } = position.coords;

        // Set coordinates
        const locationString = `${latitude},${longitude}`;
        locationInput.value = locationString;

        // Update map with user location
        if (this.mapHandler) {
          this.mapHandler.updateMapLocation(locationString);

          // Update radius circle if the method exists
          if (typeof this.mapHandler.updateRadiusCircle === 'function') {
            const radius = parseInt(radiusSelect?.value || 5);
            this.mapHandler.updateRadiusCircle([latitude, longitude], radius);
          }
        }

        // Get address
        const address = await this._getAddress(latitude, longitude);
        if (address) {
          locationInput.value = address;
          // Store coordinates as data attribute
          locationInput.dataset.coordinates = locationString;
        }

      } catch (error) {
        console.error('Error:', error);
        alert('Gagal mendapatkan lokasi. Pastikan GPS aktif.');
      }
    });

    // Handle radius change
    const radiusSelect = document.getElementById('radiusFilter');
    radiusSelect?.addEventListener('change', (e) => {
      const locationInput = document.querySelector('#location');
      const locationString = locationInput.dataset.coordinates || locationInput.value;

      if (locationString && this.mapHandler && typeof this.mapHandler.updateRadiusCircle === 'function') {
        const [lat, lng] = locationString.split(',').map((coord) => parseFloat(coord.trim()));
        this.mapHandler.updateRadiusCircle([lat, lng], parseInt(e.target.value));
      }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this._handleSearch();
    });
  },

  _getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  },

  async _getAddress(lat, lon) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      return data.display_name;
    } catch (error) {
      console.error('Error getting address:', error);
      return null;
    }
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

      // Get search results
      const results = await this._fetchResults(searchType, formData);

      // Update UI and map dengan data yang sesuai berdasarkan tipe pencarian
      const displayData = searchType === 'seller' ? results.sellers : results.buyers;

      this.resultsHandler.displayResults(displayData, {
        type: searchType,
        coordinates: results.coordinates
      });

      // Update markers on map
      this.mapHandler.updateMarkers(displayData);

    } catch (error) {
      console.error('Search error:', error);
      alert(`Gagal melakukan pencarian. ${error.message || 'Silakan coba lagi.'}`);
    }
  },

  _getFormData() {
    const form = document.getElementById('searchForm');
    const formData = new FormData(form);
    const locationInput = document.querySelector('#location');

    return {
      location: locationInput.dataset.coordinates || locationInput.value,
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

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Silakan login terlebih dahulu');
      }

      const params = new URLSearchParams({
        longitude: coordinates[0],
        latitude: coordinates[1],
        category: formData.category || '',
        radius: formData.radius || 5
      });

      const endpoint = searchType === 'seller'
        ? API_ENDPOINT.FIND_NEARBY_SELLERS
        : API_ENDPOINT.FIND_NEARBY_BUYERS;

      const response = await fetch(`${endpoint}?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Gagal mencari data');
      }

      const data = await response.json();
      return {
        sellers: searchType === 'seller' ? data.data || [] : [],
        buyers: searchType === 'buyer' ? data.data || [] : [],
        coordinates
      };

    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }
};

export default SearchHandler;
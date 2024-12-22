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
        // Update button state
        const button = document.querySelector('#getCurrentLocation');
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        const position = await this.mapHandler.getCurrentLocation();
        const { latitude, longitude } = position;

        // Set coordinates
        const locationString = `${latitude},${longitude}`;
        locationInput.value = locationString;
        locationInput.dataset.coordinates = locationString;

        // Update map view and radius
        const radius = parseInt(radiusSelect?.value || 5);
        this.mapHandler.updateMapLocation(locationString);
        this.mapHandler.updateRadiusCircle([longitude, latitude], radius);

        // Get and set address
        const address = await this.mapHandler.reverseGeocode(latitude, longitude);
        if (address) {
          locationInput.value = address;
        }

      } catch (error) {
        console.error('Error:', error);
        alert('Gagal mendapatkan lokasi. Pastikan GPS aktif.');
      } finally {
        // Reset button state
        const button = document.querySelector('#getCurrentLocation');
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-location-arrow"></i>';
      }
    });

    // Handle radius change
    const radiusSelect = document.getElementById('radiusFilter');
    radiusSelect?.addEventListener('change', (e) => {
      const locationInput = document.querySelector('#location');
      const coordinates = locationInput.dataset.coordinates;

      if (coordinates && this.mapHandler) {
        const [lat, lng] = coordinates.split(',').map((coord) => parseFloat(coord));
        this.mapHandler.updateRadiusCircle([lng, lat], parseInt(e.target.value));
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
        categoryLabel.textContent = isSellerSearch ? 'Kategori Barang yang Dicari' : 'Kategori Barang yang Ingin Dijual';
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
      const response = await this._fetchResults(searchType, formData);

      // Format results properly
      const displayData = {
        sellers: searchType === 'seller' ? response.data : [],
        buyers: searchType === 'collector' ? response.data : [],
        coordinates: [
          parseFloat(formData.location.split(',')[1]),
          parseFloat(formData.location.split(',')[0])
        ]
      };

      // Update UI dan map
      this.resultsHandler.displayResults(displayData);
      if (this.mapHandler) {
        this.mapHandler.updateMarkers(displayData);
      }

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
    try {
      const [lat, lng] = formData.location.split(',').map((coord) => parseFloat(coord.trim()));
      const token = localStorage.getItem('token');

      const params = new URLSearchParams({
        longitude: lng,
        latitude: lat,
        category: formData.category || '',
        radius: formData.radius || 5,
        _t: Date.now()
      });

      const endpoint = searchType === 'seller' ? API_ENDPOINT.GET_PRODUCTS : API_ENDPOINT.BUY_OFFERS;
      const url = `${endpoint}?${params}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });

      const data = await response.json();

      return data; // Return langsung response dari server
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }
};

export default SearchHandler;
/* eslint-disable linebreak-style */
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const FindCollectorPage = {
  markers: [],
  map: null,
  radiusCircle: null,

  async render() {
    return `
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <section class="pt-24 pb-12">
        <div class="container mx-auto px-4">
          <h1 class="text-3xl font-bold mb-8">Cari Barang Rongsok di Sekitar Anda</h1>
          ${this._searchTypeSection()}
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            ${this._filterSection()}
            ${this._mapSection()}
          </div>
        </div>
      </section>
    `;
  },

  _searchTypeSection() {
    return `
      <div class="mb-8">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-bold mb-4">Saya ingin mencari:</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex items-center p-4 border rounded-lg cursor-pointer hover:border-primary-600" data-type="collector">
              <input type="radio" name="searchType" id="collector" class="mr-3" checked>
              <div>
                <h3 class="font-bold mb-1">Pengepul (Pembeli)</h3>
                <p class="text-sm text-gray-600">Cari pengepul terdekat untuk menjual barang rongsok Anda</p>
              </div>
            </div>
            <div class="flex items-center p-4 border rounded-lg cursor-pointer hover:border-primary-600" data-type="seller">
              <input type="radio" name="searchType" id="seller" class="mr-3">
              <div>
                <h3 class="font-bold mb-1">Penjual</h3>
                <p class="text-sm text-gray-600">Cari penjual barang rongsok di sekitar Anda</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  _filterSection() {
    return `
      <div class="md:col-span-1">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-bold mb-4">Filter Pencarian</h2>
          <form id="searchForm">
            <div class="mb-4">
              <label class="block mb-2">Lokasi</label>
              <div class="relative">
                <input type="text" 
                  id="location" 
                  name="location" 
                  class="w-full p-2 pl-10 border rounded-lg" 
                  placeholder="Mendapatkan lokasi..."
                  readonly>
                <button type="button" 
                  id="getCurrentLocation" 
                  class="absolute left-3 top-1/2 -translate-y-1/2 text-primary-600 hover:text-primary-700">
                  <i class="fas fa-location-arrow"></i>
                </button>
              </div>
            </div>
            
            <div class="mb-4">
              <label class="block mb-2" for="categoryFilter">Kategori Barang</label>
              <select id="categoryFilter" name="category" class="w-full p-2 border rounded-lg">
                <option value="">Semua Kategori</option>
                <option value="Logam">Logam</option>
                <option value="Plastik">Plastik</option>
                <option value="Kertas">Kertas</option>
                <option value="Elektronik">Elektronik</option>
              </select>
            </div>
            
            <div class="mb-4">
              <label class="block mb-2">Radius Pencarian</label>
              <select id="radiusFilter" name="radius" class="w-full p-2 border rounded-lg">
                <option value="1">1 km</option>
                <option value="3">3 km</option>
                <option value="5">5 km</option>
                <option value="10">10 km</option>
              </select>
            </div>
            
            <div id="priceRangeDiv" class="mb-4">
              <label class="block mb-2">Rentang Harga (per kg)</label>
              <div class="flex space-x-4">
                <input type="number" 
                  name="priceMin" 
                  class="w-1/2 p-2 border rounded-lg" 
                  placeholder="Min">
                <input type="number" 
                  name="priceMax" 
                  class="w-1/2 p-2 border rounded-lg" 
                  placeholder="Max">
              </div>
            </div>
            
            <button type="submit" class="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700">
              Cari Sekarang
            </button>
          </form>
        </div>
      </div>
    `;
  },

  _mapSection() {
    return `
      <div class="md:col-span-2">
        <div class="bg-white p-6 rounded-lg shadow-md mb-8">
          <div id="map" class="h-96 rounded-lg bg-gray-100"></div>
        </div>
        <div id="searchResults" class="grid grid-cols-1 gap-4"></div>
      </div>
    `;
  },

  _initializeMap() {
    this.map = L.map('map').setView([-6.2088, 106.8456], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this._initializeLocationSearch();
  },

  async _fetchAddress(lat, lon) {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const data = await response.json();
      document.getElementById('location').value = data.display_name;
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  },

  _updateRadiusCircle(lat, lng, radiusKm) {
    if (this.radiusCircle) {
      this.map.removeLayer(this.radiusCircle);
    }

    this.radiusCircle = L.circle([lat, lng], {
      radius: radiusKm * 1000,
      fill: true,
      fillColor: '#16a34a',
      fillOpacity: 0.1,
      color: '#16a34a',
      weight: 1
    }).addTo(this.map);
  },

  _generateNearbyCollectors(lat, lon) {
    const searchType = document.querySelector('[data-type].active')?.dataset.type;

    if (searchType === 'seller') {
      return [
        {
          id: 1,
          name: 'Pengepul Jaya Abadi',
          rating: 4.8,
          reviews: 120,
          distance: 1.2,
          categories: ['Logam', 'Plastik', 'Kertas'],
          description: 'Menerima semua jenis logam, plastik, dan kertas. Harga bersaing dan pelayanan cepat.',
          location: { lat: lat - 0.002, lng: lon + 0.002 },
          address: 'Jl. Kebon Jeruk No. 15',
          phone: '081234567890'
        },
        {
          id: 2,
          name: 'Rongsok Sejahtera',
          rating: 4.6,
          reviews: 85,
          distance: 2.1,
          categories: ['Elektronik', 'Logam'],
          description: 'Spesialis barang elektronik dan logam bekas. Penawaran harga tertinggi.',
          location: { lat: lat + 0.003, lng: lon - 0.001 },
          address: 'Jl. Mangga Besar No. 45',
          phone: '081234567891'
        }
      ];
    } else {
      return [
        {
          id: 3,
          name: 'Ahmad Fauzi',
          rating: 4.9,
          reviews: 45,
          distance: 0.8,
          categories: ['Plastik', 'Kertas'],
          description: 'Mencari botol plastik dan kertas bekas dalam jumlah besar.',
          location: { lat: lat - 0.001, lng: lon + 0.001 },
          address: 'Jl. Sudirman No. 123',
          phone: '081234567892'
        }
      ];
    }
  },

  _initializeLocationSearch() {
    const categoryLabel = document.querySelector('label[for="categoryFilter"]');
    const priceRangeDiv = document.querySelector('#priceRangeDiv');
    const searchTypes = document.querySelectorAll('[data-type]');

    searchTypes.forEach((type) => {
      type.addEventListener('click', () => {
        searchTypes.forEach((t) => t.classList.remove('active', 'border-primary-500', 'bg-primary-50'));
        type.classList.add('active', 'border-primary-500', 'bg-primary-50');

        if (type.dataset.type === 'seller') {
          categoryLabel.textContent = 'Kategori Barang yang Ingin Dijual';
          priceRangeDiv.classList.remove('hidden');
        } else {
          categoryLabel.textContent = 'Kategori Barang yang Dicari';
          priceRangeDiv.classList.add('hidden');
        }
      });
    });

    document.getElementById('getCurrentLocation').addEventListener('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            this.map.setView([latitude, longitude], 15);

            this.markers.forEach((marker) => marker.remove());

            const radius = parseFloat(document.getElementById('radiusFilter').value);
            this._updateRadiusCircle(latitude, longitude, radius);

            const userMarker = L.marker([latitude, longitude], {
              icon: L.divIcon({
                html: '<i class="fas fa-user-circle fa-2x text-primary-600"></i>',
                className: 'user-location-marker',
                iconSize: [24, 24]
              })
            }).addTo(this.map);
            userMarker.bindPopup('Lokasi Anda').openPopup();

            await this._fetchAddress(latitude, longitude);

            const collectors = this._generateNearbyCollectors(latitude, longitude);
            this._updateMapMarkers(collectors);
            this._displaySearchResults(collectors);
          },
          (error) => {
            console.error('Error getting location:', error);
            alert('Tidak dapat mengakses lokasi Anda. Pastikan GPS aktif dan izin lokasi diberikan.');
          }
        );
      }
    });

    // Add radius change handler
    document.getElementById('radiusFilter').addEventListener('change', (e) => {
      const radius = parseFloat(e.target.value);
      const locationInput = document.getElementById('location').value;
      if (locationInput) {
        const [lat, lng] = locationInput.split(',').map((coord) => parseFloat(coord.trim()));
        this._updateRadiusCircle(lat, lng, radius);
      }
    });
  },

  _createMarkerPopup(collector) {
    return `
      <div class="text-center">
        <h3 class="font-bold">${collector.name}</h3>
        <p class="text-sm">${collector.address}</p>
        <p class="text-sm mb-1">${collector.distance} km</p>
        <p class="text-sm mb-2">
          <span class="text-yellow-500">★</span> 
          ${collector.rating} (${collector.reviews} ulasan)
        </p>
        <div class="flex space-x-2 justify-center">
          <button 
            onclick="window.open('https://maps.google.com?q=${collector.location.lat},${collector.location.lng}', '_blank')"
            class="bg-primary-600 text-white px-2 py-1 rounded text-sm">
            <i class="fas fa-map-marker-alt mr-1"></i>Maps
          </button>
          <button 
            onclick="window.open('tel:${collector.phone}')"
            class="bg-primary-600 text-white px-2 py-1 rounded text-sm">
            <i class="fas fa-phone mr-1"></i>Hubungi
          </button>
        </div>
      </div>
    `;
  },

  _displaySearchResults(collectors) {
    const resultsContainer = document.getElementById('searchResults');

    if (collectors.length === 0) {
      resultsContainer.innerHTML = `
        <div class="bg-white p-4 rounded-lg shadow-md text-center">
          <p>Tidak ada hasil yang ditemukan</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = collectors.map((collector) => `
      <div class="bg-white p-4 rounded-lg shadow-md">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-bold text-lg">${collector.name}</h3>
            <p class="text-gray-600">Jarak: ${collector.distance} km</p>
            <p class="text-gray-600">Kategori: ${collector.categories.join(', ')}</p>
            <p class="text-gray-600">${collector.address}</p>
            <p class="text-sm mt-2">${collector.description}</p>
          </div>
          <div class="flex items-center">
            <span class="text-primary-600 mr-1">${collector.rating}</span>
            <i class="fas fa-star text-yellow-400"></i>
            <span class="text-sm text-gray-500 ml-1">(${collector.reviews})</span>
          </div>
        </div>
        <div class="mt-4 flex justify-between items-center">
          <button class="text-primary-600 hover:text-primary-700" 
                  onclick="window.open('https://maps.google.com?q=${collector.location.lat},${collector.location.lng}', '_blank')">
            <i class="fas fa-map-marker-alt mr-1"></i>Lihat di Maps
          </button>
          <button class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                  onclick="window.open('tel:${collector.phone}')">
            <i class="fas fa-phone mr-1"></i>Hubungi
          </button>
        </div>
      </div>
    `).join('');
  },

  _updateMapMarkers(collectors) {
    this.markers.forEach((marker) => marker.remove());
    this.markers = [];

    collectors.forEach((collector) => {
      const marker = L.marker([collector.location.lat, collector.location.lng])
        .bindPopup(this._createMarkerPopup(collector));
      marker.addTo(this.map);
      this.markers.push(marker);
    });

    if (this.markers.length > 0) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  },

  // Add before afterRender method:
  _initializeSearchHandlers() {
    const searchForm = document.getElementById('searchForm');
    const searchTypes = document.querySelectorAll('[data-type]');

    searchTypes.forEach((type) => {
      type.addEventListener('click', () => {
        const radio = type.querySelector('input[type="radio"]');
        radio.checked = true;
        searchTypes.forEach((t) => t.classList.remove('border-primary-600'));
        type.classList.add('border-primary-600');
      });
    });

    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this._handleSearch();
    });

    document.getElementById('radiusFilter').addEventListener('change', (e) => {
      const radius = parseFloat(e.target.value);
      const locationInput = document.getElementById('location').value;
      if (locationInput) {
        const [lat, lng] = locationInput.split(',').map((coord) => parseFloat(coord.trim()));
        this._updateRadiusCircle(lat, lng, radius);
      }
    });
  },

  async afterRender() {
    this._initializeMap();
    this._initializeSearchHandlers();
  },

  _handleSearch() {
    const formData = new FormData(document.getElementById('searchForm'));
    const searchType = document.querySelector('input[name="searchType"]:checked')?.id;
    const filters = {
      type: searchType,
      location: formData.get('location'),
      category: formData.get('category'),
      radius: parseFloat(formData.get('radius')),
      priceMin: parseFloat(formData.get('priceMin')) || 0,
      priceMax: parseFloat(formData.get('priceMax')) || Infinity
    };

    const [lat, lng] = filters.location.split(',').map((coord) => parseFloat(coord.trim()));

    const collectors = this._generateNearbyCollectors(lat, lng).filter((collector) => {
      const matchesCategory = !filters.category || collector.categories.includes(filters.category);
      const withinRadius = collector.distance <= filters.radius;
      const withinPriceRange = (!filters.priceMin || collector.minPrice >= filters.priceMin) &&
                              (!filters.priceMax || collector.maxPrice <= filters.priceMax);

      return matchesCategory && withinRadius && withinPriceRange;
    });

    this._updateMapMarkers(collectors);
    this._displaySearchResults(collectors);
  }
};

export default FindCollectorPage;
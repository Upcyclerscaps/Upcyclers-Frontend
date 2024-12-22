/* eslint-disable linebreak-style */
import L from 'leaflet';

const MapHandler = {
  map: null,
  marker: null,

  initialize() {
    setTimeout(() => {
      // Get user data untuk initial location
      const user = JSON.parse(localStorage.getItem('user'));
      const mapContainer = document.getElementById('map');

      if (!mapContainer || this.map) return;

      // Set initial view ke lokasi user atau default ke Jakarta
      const defaultLat = user?.latitude || -6.200000;
      const defaultLng = user?.longitude || 106.816666;

      this.map = L.map('map').setView([defaultLat, defaultLng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      // Set initial marker dari data user
      if (user?.latitude && user?.longitude) {
        this.addMarker([user.latitude, user.longitude]);
        this._updateCoordinatesInput(user.latitude, user.longitude);
      }

      // Add click handler
      this.map.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        this.updateLocation(lat, lng);
      });

      // Initialize get location button
      this._initializeLocationButton();
    }, 100);
  },

  addMarker(coordinates) {
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    this.marker = L.marker(coordinates).addTo(this.map);
  },

  async updateLocation(lat, lng) {
    // Update marker
    this.addMarker([lat, lng]);

    // Update hidden inputs
    this._updateCoordinatesInput(lat, lng);

    // Update map view
    this.map.setView([lat, lng], 15);

    // Get and update address
    try {
      const address = await this._getAddress(lat, lng);
      document.getElementById('alamat').value = address;
    } catch (error) {
      console.error('Error getting address:', error);
    }
  },

  _updateCoordinatesInput(lat, lng) {
    document.getElementById('latitude').value = lat;
    document.getElementById('longitude').value = lng;
  },

  async _getAddress(lat, lng) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();

      // Update kota dan kode pos dari hasil reverse geocoding
      const cityInput = document.querySelector('input[name="city"]');
      const postalCodeInput = document.querySelector('input[name="postalCode"]');

      if (cityInput) cityInput.value = data.address?.city || data.address?.town || '';
      if (postalCodeInput) postalCodeInput.value = data.address?.postcode || '';

      return data.display_name;
    } catch (error) {
      console.error('Error fetching address:', error);
      return '';
    }
  },

  _initializeLocationButton() {
    document.getElementById('getCurrentLocation')?.addEventListener('click', () => {
      if (!navigator.geolocation) {
        alert('Browser tidak mendukung geolokasi');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await this.updateLocation(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Gagal mendapatkan lokasi. Pastikan GPS aktif.');
        }
      );
    });
  }
};

export default MapHandler;
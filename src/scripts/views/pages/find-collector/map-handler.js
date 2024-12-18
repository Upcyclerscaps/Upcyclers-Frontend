/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */

import L from 'leaflet';

const MapHandler = {
  map: null,
  markers: [],
  radiusCircle: null,

  initialize(containerId) {
    this.map = L.map(containerId).setView([-6.2088, 106.8456], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  },

  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          this.map.setView([latitude, longitude], 15);

          // Create and add user marker
          if (this.userMarker) {
            this.map.removeLayer(this.userMarker);
          }
          this.userMarker = this.createUserMarker([latitude, longitude]);
          this.userMarker.addTo(this.map);
          this.markers.push(this.userMarker);

          resolve({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
          reject(error);
        }
      );
    });
  },

  createUserMarker(coordinates) {
    const userIcon = L.divIcon({
      html: '<i class="fas fa-user-circle fa-2x text-primary-600"></i>',
      className: 'user-marker-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    });

    this.userMarker = L.marker(coordinates, { icon: userIcon }).bindPopup('Lokasi Anda');
    return this.userMarker;
  },

  updateMapLocation(locationString) {
    const [lat, lng] = locationString.split(',').map((coord) => parseFloat(coord.trim()));
    if (lat && lng) {
      // Update map view
      this.map.setView([lat, lng], 15);

      // Update user marker
      if (this.userMarker) {
        this.map.removeLayer(this.userMarker);
      }
      this.userMarker = this.createUserMarker([lat, lng]);
      this.userMarker.addTo(this.map);

      // Add to markers array
      this.markers = [this.userMarker];
    }
  },

  addMarker(coordinates, popupContent, type = 'default') {
    try {
      if (!Array.isArray(coordinates) || coordinates.length !== 2 ||
          isNaN(coordinates[0]) || isNaN(coordinates[1])) {
        console.error('Invalid coordinates:', coordinates);
        return null;
      }

      // Gunakan marker default Leaflet untuk lokasi lain
      const marker = L.marker(coordinates)
        .bindPopup(popupContent);

      marker.addTo(this.map);
      this.markers.push(marker);
      return marker;

    } catch (error) {
      console.error('Error adding marker:', error);
      return null;
    }
  },

  updateMarkers(results) {
    try {
      this.clearMarkers();
      // Jangan hapus user marker
      if (this.userMarker) {
        this.markers.push(this.userMarker);
      }

      if (!results || (typeof results !== 'object')) {
        console.log('No valid results to display on map');
        return;
      }

      // Handle sellers
      const sellers = results.sellers || [];
      const buyers = results.buyers || [];

      sellers.forEach((seller) => {
        if (seller?.location?.coordinates) {
          const [lng, lat] = seller.location.coordinates;
          this.addMarker(
            [lat, lng],
            this._createSellerPopup(seller),
            'seller'
          );
        }
      });

      buyers.forEach((buyer) => {
        if (buyer?.location?.coordinates) {
          const [lng, lat] = buyer.location.coordinates;
          this.addMarker(
            [lat, lng],
            this._createBuyerPopup(buyer),
            'buyer'
          );
        }
      });

      // Update radius circle dengan radius dari form
      if (results.coordinates && results.radius) {
        this.updateRadiusCircle(results.coordinates, results.radius);
      }

      this.fitMapToMarkers();

    } catch (error) {
      console.error('Error updating markers:', error);
    }
  },

  updateRadiusCircle(coordinates, radiusKm = 5) {
    if (this.radiusCircle) {
      this.map.removeLayer(this.radiusCircle);
    }

    // Validasi coordinates dan radius
    if (!Array.isArray(coordinates) || coordinates.length !== 2 || !radiusKm) {
      console.log('Invalid coordinates or radius');
      return;
    }

    // Pastikan coordinates dan radius adalah angka valid
    const [lng, lat] = coordinates;
    const radius = parseFloat(radiusKm);

    if (isNaN(lat) || isNaN(lng) || isNaN(radius)) {
      console.log('Invalid coordinates or radius values');
      return;
    }

    try {
      this.radiusCircle = L.circle([lat, lng], {
        radius: radius * 1000, // Convert to meters
        fill: true,
        fillColor: '#16a34a',
        fillOpacity: 0.1,
        color: '#16a34a',
        weight: 1
      }).addTo(this.map);

      // Update map view to show the entire circle
      const bounds = this.radiusCircle.getBounds();
      this.map.fitBounds(bounds);
    } catch (error) {
      console.error('Error creating radius circle:', error);
    }
  },

  _createSellerPopup(seller) {
    return `
      <div class="popup-content">
        <h3 class="font-bold">${seller.name || 'Tidak ada nama'}</h3>
        <p>Kategori: ${seller.category || '-'}</p>
        <p>Stok: ${seller.stock?.amount || 0} ${seller.stock?.unit || 'kg'}</p>
        <p>Harga: Rp ${seller.price?.amount?.toLocaleString() || 0}/${seller.stock?.unit || 'kg'}</p>
        <div class="mt-2 flex space-x-2">
          <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${seller.location.coordinates[1]},${seller.location.coordinates[0]}')"
                  class="bg-blue-500 text-white px-2 py-1 rounded text-sm">
            <i class="fas fa-map-marker-alt"></i> Rute
          </button>
          <button onclick="window.location.hash='#/product/${seller._id}'"
                  class="bg-primary-600 text-white px-2 py-1 rounded text-sm">
            Detail
          </button>
        </div>
      </div>
    `;
  },

  _createBuyerPopup(buyer) {
    return `
      <div class="popup-content p-2">
        <h3 class="font-bold mb-2">Dicari: ${buyer.category}</h3>
        <p class="text-sm mb-1">Jumlah: ${buyer.amount?.value || 0} ${buyer.amount?.unit || 'kg'}</p>
        <p class="text-sm mb-1">Harga: Rp ${buyer.price?.amount?.toLocaleString() || 0}/${buyer.amount?.unit || 'kg'}</p>
        <p class="text-sm mb-2">${buyer.description || ''}</p>
        <div class="mt-2 flex space-x-2">
          <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${buyer.location.coordinates[1]},${buyer.location.coordinates[0]}')"
                  class="bg-blue-500 text-white px-2 py-1 rounded text-sm">
            <i class="fas fa-map-marker-alt"></i> Rute
          </button>
          <button onclick="window.open('https://wa.me/${buyer.buyer?.phone?.replace(/\D/g, '')}')"
                  class="bg-green-500 text-white px-2 py-1 rounded text-sm">
            <i class="fab fa-whatsapp"></i> WA
          </button>
          <button onclick="window.open('tel:${buyer.buyer?.phone}')"
                  class="bg-primary-600 text-white px-2 py-1 rounded text-sm">
            <i class="fas fa-phone"></i> Telepon
          </button>
        </div>
      </div>
    `;
  },

  clearMarkers() {
    // Simpan user marker sebelum clear
    const userMarker = this.markers.find((marker) =>
      marker === this.userMarker
    );

    this.markers.forEach((marker) => {
      if (marker !== this.userMarker) {
        marker.remove();
      }
    });

    this.markers = userMarker ? [userMarker] : [];
  },

  fitMapToMarkers() {
    if (this.markers.length > 0) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  },

  async reverseGeocode(lat, lon) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      return data.display_name;
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      return '';
    }
  }
};

export default MapHandler;
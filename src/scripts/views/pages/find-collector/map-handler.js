/* eslint-disable linebreak-style */

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

          // Clear existing markers
          this.clearMarkers();
          if (this.radiusCircle) {
            this.map.removeLayer(this.radiusCircle);
          }

          // Update map view
          this.map.setView([latitude, longitude], 15);

          // Add user marker
          const userMarker = this.createUserMarker([latitude, longitude]);
          userMarker.addTo(this.map);
          this.markers.push(userMarker);

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
    return L.marker(coordinates, {
      icon: L.divIcon({
        html: '<i class="fas fa-user-circle fa-2x text-primary-600"></i>',
        className: 'user-location-marker',
        iconSize: [24, 24]
      })
    }).bindPopup('Lokasi Anda');
  },

  updateMapLocation(locationString) {
    const [lat, lng] = locationString.split(',').map((coord) => parseFloat(coord.trim()));
    if (!isNaN(lat) && !isNaN(lng)) {
      // Clear existing markers and circle
      this.clearMarkers();
      if (this.radiusCircle) {
        this.map.removeLayer(this.radiusCircle);
      }

      // Update map view
      this.map.setView([lat, lng], 15);

      // Add new marker
      this.addMarker([lat, lng], 'Lokasi Anda', 'user');

      // Trigger a map resize
      setTimeout(() => {
        this.map.invalidateSize();
      }, 100);
    }
  },

  addMarker(coordinates, popupContent, type = 'default') {
    try {
      // Validate coordinates
      if (!Array.isArray(coordinates) || coordinates.length !== 2 ||
          isNaN(coordinates[0]) || isNaN(coordinates[1])) {
        console.error('Invalid coordinates:', coordinates);
        return null;
      }

      let icon;
      switch (type) {
      case 'user':
        icon = L.divIcon({
          html: '<i class="fas fa-user-circle fa-2x text-primary-600"></i>',
          className: 'user-location-marker',
          iconSize: [24, 24]
        });
        break;
      case 'seller':
        icon = L.divIcon({
          html: '<i class="fas fa-store fa-2x text-red-600"></i>',
          className: 'seller-location-marker',
          iconSize: [24, 24]
        });
        break;
      case 'buyer':
        icon = L.divIcon({
          html: '<i class="fas fa-shopping-cart fa-2x text-green-600"></i>',
          className: 'buyer-location-marker',
          iconSize: [24, 24]
        });
        break;
      default:
        icon = L.divIcon({
          html: '<i class="fas fa-map-marker-alt fa-2x text-primary-600"></i>',
          className: 'default-location-marker',
          iconSize: [24, 24]
        });
      }

      const marker = L.marker(coordinates, { icon })
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

      // Update radius circle if coordinates exist
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
        <div class="mt-2">
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
    this.markers.forEach((marker) => marker.remove());
    this.markers = [];
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
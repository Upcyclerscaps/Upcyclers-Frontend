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
          this.map.setView([latitude, longitude], 15);
          this.clearMarkers();

          // Add user marker
          const userMarker = this.createUserMarker([latitude, longitude]);
          userMarker.addTo(this.map);

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
    if (lat && lng) {
      this.map.setView([lat, lng], 15);
      this.clearMarkers();
      this.addMarker([lat, lng], 'Lokasi Pencarian');
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
      case 'result':
        icon = L.divIcon({
          html: '<i class="fas fa-map-marker-alt fa-2x text-red-600"></i>',
          className: 'result-location-marker',
          iconSize: [24, 24]
        });
        break;
      default:
        icon = null;
      }

      const marker = L.marker(coordinates, icon ? { icon } : {})
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
    this.clearMarkers();

    // Add markers for sellers
    results.sellers.forEach((seller) => {
      if (seller.location?.coordinates) {
        this.addMarker(
          [seller.location.coordinates[1], seller.location.coordinates[0]],
          `
            <div>
              <strong>${seller.name}</strong><br>
              ${seller.category}<br>
              Rp ${seller.price.amount.toLocaleString()}/${seller.stock.unit}
            </div>
          `,
          'seller'
        );
      }
    });

    // Add markers for buyers
    results.buyers.forEach((buyer) => {
      if (buyer.location?.coordinates) {
        this.addMarker(
          [buyer.location.coordinates[1], buyer.location.coordinates[0]],
          `
            <div>
              <strong>Dicari: ${buyer.category}</strong><br>
              ${buyer.amount.value} ${buyer.amount.unit}<br>
              Rp ${buyer.price.amount.toLocaleString()}/${buyer.amount.unit}
            </div>
          `,
          'buyer'
        );
      }
    });

    if (results.coordinates) {
      this.updateRadiusCircle(results.coordinates[1], results.coordinates[0], results.radius || 5);
    }

    this.fitMapToMarkers();
  },

  updateRadiusCircle(coordinates, radiusKm) {
    if (this.radiusCircle) {
      this.map.removeLayer(this.radiusCircle);
    }

    if (Array.isArray(coordinates) && coordinates.length === 2) {
      const [lat, lng] = coordinates;

      this.radiusCircle = L.circle([lat, lng], {
        radius: radiusKm * 1000,
        fill: true,
        fillColor: '#16a34a',
        fillOpacity: 0.1,
        color: '#16a34a',
        weight: 1
      }).addTo(this.map);

      // Update map view to show the entire circle
      const bounds = this.radiusCircle.getBounds();
      this.map.fitBounds(bounds);
    }
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
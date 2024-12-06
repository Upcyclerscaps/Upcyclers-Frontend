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

  updateRadiusCircle(coordinates, radiusKm) {
    if (this.radiusCircle) {
      this.map.removeLayer(this.radiusCircle);
    }

    this.radiusCircle = L.circle(coordinates, {
      radius: radiusKm * 1000,
      fill: true,
      fillColor: '#16a34a',
      fillOpacity: 0.1,
      color: '#16a34a',
      weight: 1
    }).addTo(this.map);
  },

  addMarker(coordinates, popupContent) {
    const marker = L.marker(coordinates)
      .bindPopup(popupContent);
    marker.addTo(this.map);
    this.markers.push(marker);
    return marker;
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
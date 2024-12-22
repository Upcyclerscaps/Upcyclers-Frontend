/* eslint-disable linebreak-style */
import API_ENDPOINT from '../../../globals/api-endpoint';
import L from 'leaflet';

const BuyItemPage = {
  async render() {
    const user = JSON.parse(localStorage.getItem('user'));

    return `
     <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
     <section class="pt-24 pb-16">
       <div class="container mx-auto px-4">
         <div class="max-w-3xl mx-auto">
           <div class="bg-white rounded-lg shadow-md p-8">
             <h1 class="text-2xl font-bold mb-6">Buat Penawaran Pembelian</h1>
             
             <form id="buyForm" class="space-y-6">
               <div>
                 <label class="block text-gray-700 font-medium mb-2">Kategori</label>
                 <select name="category" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-500" required>
                   <option value="">Pilih Kategori</option>
                   <option value="Elektronik">Elektronik</option>
                   <option value="Plastik">Plastik</option>
                   <option value="Kertas">Kertas</option>
                   <option value="Logam">Logam</option>
                 </select>
               </div>

               <div>
                 <label class="block text-gray-700 font-medium mb-2">Deskripsi Barang yang Dicari</label>
                 <textarea name="description" rows="4" 
                   class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-500"
                   placeholder="Jelaskan detail barang yang Anda cari..." required></textarea>
               </div>

               <div class="grid grid-cols-2 gap-4">
                 <div>
                   <label class="block text-gray-700 font-medium mb-2">Estimasi Jumlah</label>
                   <input type="number" name="amount" 
                     class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-500"
                     required>
                 </div>
                 <div>
                   <label class="block text-gray-700 font-medium mb-2">Satuan</label>
                   <select name="unit" 
                     class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-500"
                     required>
                     <option value="kg">Kg</option>
                     <option value="pcs">Pcs</option>
                   </select>
                 </div>
               </div>

               <div>
                 <label class="block text-gray-700 font-medium mb-2">Estimasi Harga per Satuan</label>
                 <input type="number" name="price"
                   class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-500"
                   placeholder="Masukkan harga per satuan" required>
               </div>

               <!-- Lokasi Section -->
               <div class="space-y-4">
                 <div class="flex justify-between items-center">
                   <label class="block text-gray-700">Lokasi</label>
                   <button type="button" 
                           id="getCurrentLocation"
                           class="text-primary-600 hover:text-primary-700 flex items-center">
                     <i class="fas fa-location-dot mr-2"></i>Gunakan Lokasi Saat Ini
                   </button>
                 </div>

                 <div class="relative w-full h-[300px] bg-gray-100 rounded-lg overflow-hidden">
                   <div id="map" class="absolute inset-0"></div>
                 </div>
                 
                 <input type="hidden" name="latitude" id="latitude">
                 <input type="hidden" name="longitude" id="longitude">

                 <div>
                   <label class="block text-gray-700 font-medium mb-2">Alamat Lengkap</label>
                   <textarea name="address" 
                            id="address"
                            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-500 h-24" 
                            placeholder="Masukkan alamat lengkap">${user?.address || ''}</textarea>
                 </div>
               </div>

               <div class="flex justify-end space-x-4">
                 <button type="button"
                         onclick="window.location.hash = '#/profile'"
                         class="px-6 py-2 border rounded-lg hover:bg-gray-50">
                   Batal
                 </button>
                 <button type="submit"
                         class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                   Simpan Penawaran
                 </button>
               </div>
             </form>
           </div>
         </div>
       </div>
     </section>
   `;
  },

  async afterRender() {
    this._initializeMap();
    this._initializeForm();
  },

  _initializeMap() {
    const user = JSON.parse(localStorage.getItem('user'));
    const defaultLat = user?.latitude || -6.200000;
    const defaultLng = user?.longitude || 106.816666;

    const map = L.map('map').setView([defaultLat, defaultLng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    let marker;

    // Add initial marker if user has location
    if (user?.latitude && user?.longitude) {
      marker = L.marker([user.latitude, user.longitude]).addTo(map);
      document.getElementById('latitude').value = user.latitude;
      document.getElementById('longitude').value = user.longitude;
    }

    // Handle map click
    map.on('click', async (e) => {
      const { lat, lng } = e.latlng;

      if (marker) map.removeLayer(marker);
      marker = L.marker([lat, lng]).addTo(map);

      document.getElementById('latitude').value = lat;
      document.getElementById('longitude').value = lng;

      // Get and update address
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();
        document.getElementById('address').value = data.display_name;
      } catch (error) {
        console.error('Error getting address:', error);
      }
    });

    // Handle get current location
    document.getElementById('getCurrentLocation')?.addEventListener('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            map.setView([latitude, longitude], 15);

            if (marker) map.removeLayer(marker);
            marker = L.marker([latitude, longitude]).addTo(map);

            document.getElementById('latitude').value = latitude;
            document.getElementById('longitude').value = longitude;

            // Get and update address
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              const data = await response.json();
              document.getElementById('address').value = data.display_name;
            } catch (error) {
              console.error('Error getting address:', error);
            }
          },
          (error) => {
            console.error('Error getting location:', error);
            alert('Gagal mendapatkan lokasi. Pastikan GPS aktif.');
          }
        );
      } else {
        alert('Browser tidak mendukung geolokasi');
      }
    });
  },

  _initializeForm() {
    const form = document.getElementById('buyForm');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this._handleSubmit(e);
    });
  },

  async _handleSubmit(event) {
    event.preventDefault();
    try {
      const form = event.target;
      const formData = new FormData(form);
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Silakan login terlebih dahulu');
      }

      // Get coordinates
      const latitude = document.getElementById('latitude').value;
      const longitude = document.getElementById('longitude').value;

      if (!latitude || !longitude) {
        throw new Error('Silakan pilih lokasi pada peta');
      }

      const buyerData = {
        category: formData.get('category'),
        description: formData.get('description'),
        amount: {
          value: parseInt(formData.get('amount')),
          unit: formData.get('unit')
        },
        price: {
          amount: parseInt(formData.get('price')),
          negotiable: true
        },
        location: {
          type: 'Point',
          coordinates: [
            parseFloat(longitude),
            parseFloat(latitude)
          ],
          address: formData.get('address')
        }
      };

      const response = await fetch(API_ENDPOINT.BUY_OFFERS, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(buyerData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Gagal menyimpan data');
      }

      alert('Penawaran berhasil disimpan!');
      window.location.hash = '#/profile';

    } catch (error) {
      console.error('Error submitting buy offer:', error);
      alert(error.message || 'Gagal menyimpan data');
    }
  }
};

export default BuyItemPage;
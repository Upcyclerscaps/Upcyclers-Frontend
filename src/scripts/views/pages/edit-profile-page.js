/* eslint-disable linebreak-style */
import API_ENDPOINT from '../../globals/api-endpoint';
import L from 'leaflet';

const EditProfile = {
  async render() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [firstName = '', lastName = ''] = user?.name ? user.name.split(' ') : ['', ''];

    return `
        <div class="pt-24 min-h-screen bg-gradient-to-br from-primary-500 to-primary-700">
          <div class="container mx-auto px-4 py-8">
            <div class="max-w-2xl mx-auto">
              <!-- Header -->
              <div class="mb-6">
                <h1 class="text-2xl font-bold text-white">Edit Profile</h1>
                <p class="text-white opacity-80">Perbarui informasi profil dan pengaturan akun Anda</p>
              </div>
   
              <!-- Profile Form -->
              <form class="bg-white rounded-lg shadow-md p-6" id="profileForm">
                <!-- Profile Picture Section -->
                <div class="mb-8 text-center">
                  <div class="relative inline-block">
                    <img alt="Profile picture" class="w-32 h-32 rounded-full mx-auto mb-4 object-cover" 
                         id="previewImage"
                         src="${user?.profileImage || 'https://via.placeholder.com/128'}" />
                    <label class="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition-all">
                      <i class="fas fa-camera"></i>
                      <input type="file" class="hidden" accept="image/*" id="profileImageInput" name="profileImage"/>
                    </label>
                  </div>
                  <input type="hidden" id="profileImageUrl" name="profileImage">
                  <p class="text-sm text-gray-600">Klik ikon kamera untuk mengganti foto profil</p>
                </div>
   
                <!-- Personal Information -->
                <div class="space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-gray-700 mb-2">Nama Depan</label>
                      <input type="text" name="firstName" class="w-full border rounded-lg px-4 py-2" 
                             placeholder="Nama depan"
                             value="${firstName}" required />
                    </div>
                    <div>
                      <label class="block text-gray-700 mb-2">Nama Belakang</label>
                      <input type="text" name="lastName" class="w-full border rounded-lg px-4 py-2" 
                             placeholder="Nama belakang"
                             value="${lastName}" required />
                    </div>
                  </div>
   
                  <div>
                    <label class="block text-gray-700 mb-2">Email</label>
                    <input type="email" value="${user?.email || ''}" 
                           placeholder="Email"
                           class="w-full border rounded-lg px-4 py-2 bg-gray-100" readonly />
                    <p class="text-sm text-gray-500 mt-1">Email tidak dapat diubah</p>
                  </div>
   
                  <div>
                    <label class="block text-gray-700 mb-2">Nomor Telepon</label>
                    <input type="tel" name="phone" class="w-full border rounded-lg px-4 py-2" 
                           placeholder="Nomor telepon"
                           value="${user?.phone || ''}" />
                  </div>
   
                  <!-- Location Section -->
                  <div class="space-y-4">
                    <div class="flex justify-between items-center">
                      <label class="block text-gray-700">Alamat</label>
                      <button type="button" 
                              id="getCurrentLocation"
                              class="text-primary-600 hover:text-primary-700 flex items-center">
                        <i class="fas fa-location-dot mr-2"></i>Gunakan Lokasi Saat Ini
                      </button>
                    </div>
   
                    <div id="map" class="h-[300px] w-full rounded-lg border"></div>
   
                    <input type="hidden" name="latitude" id="latitude" value="${user?.latitude || ''}">
                    <input type="hidden" name="longitude" id="longitude" value="${user?.longitude || ''}">
                    
                    <div class="space-y-4">
                      <div>
                        <label class="block text-gray-700 mb-2">Alamat Lengkap</label>
                        <textarea name="address" 
                                  id="fullAddress"
                                  class="w-full border rounded-lg px-4 py-2 h-24" 
                                  placeholder="Masukkan alamat lengkap">${user?.address || ''}</textarea>
                      </div>
                      
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label class="block text-gray-700 mb-2">Kota</label>
                          <input type="text" 
                                 name="city" 
                                 id="city"
                                 value="${user?.city || ''}"
                                 placeholder="Nama kota"
                                 class="w-full border rounded-lg px-4 py-2">
                        </div>
                        <div>
                          <label class="block text-gray-700 mb-2">Kode Pos</label>
                          <input type="text" 
                                 name="postalCode" 
                                 id="postalCode"
                                 value="${user?.postalCode || ''}"
                                 placeholder="Kode pos"
                                 class="w-full border rounded-lg px-4 py-2">
                        </div>
                      </div>
                    </div>
                  </div>
   
                  <!-- Password Change Section -->
                  <div class="pt-6 border-t">
                    <h3 class="text-lg font-medium mb-4">Ubah Password</h3>
                    <div class="space-y-4">
                      <div>
                        <label class="block text-gray-700 mb-2">Password Saat Ini</label>
                        <input type="password" name="currentPassword" class="w-full border rounded-lg px-4 py-2"
                               placeholder="Masukkan password saat ini"/>
                      </div>
                      <div>
                        <label class="block text-gray-700 mb-2">Password Baru</label>
                        <input type="password" name="newPassword" class="w-full border rounded-lg px-4 py-2"
                               placeholder="Masukkan password baru"/>
                      </div>
                      <div>
                        <label class="block text-gray-700 mb-2">Konfirmasi Password Baru</label>
                        <input type="password" name="confirmPassword" class="w-full border rounded-lg px-4 py-2"
                               placeholder="Konfirmasi password baru"/>
                      </div>
                    </div>
                  </div>
   
                  <!-- Save Button -->
                  <div class="flex justify-end space-x-4">
                    <button type="button"
                            onclick="window.location.hash = '#/profile'"
                            class="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-all">
                      Batal
                    </button>
                    <button type="submit"
                            class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all">
                      Simpan Perubahan
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      `;
  },

  async afterRender() {
    this._initializeImageUpload();
    this._initializeMap();
    this._initializeForm();
  },

  _initializeImageUpload() {
    const input = document.getElementById('profileImageInput');
    const preview = document.getElementById('previewImage');
    const hiddenInput = document.getElementById('profileImageUrl');

    input?.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal 2MB');
        input.value = '';
        return;
      }

      try {
        preview.src = 'https://via.placeholder.com/128?text=Loading...';

        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(API_ENDPOINT.UPLOAD_IMAGE, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });

        if (!response.ok) throw new Error('Upload failed');

        const data = await response.json();

        preview.src = data.data.url;
        hiddenInput.value = data.data.url; // Update hidden input with cloudinary URL

      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Gagal mengupload gambar. Silakan coba lagi.');
        preview.src = this._getUserData()?.profileImage || 'https://via.placeholder.com/128';
      }
    });
  },

  _initializeMap() {
    const user = JSON.parse(localStorage.getItem('user'));
    const map = L.map('map').setView([
      user?.latitude || -6.200000,
      user?.longitude || 106.816666
    ], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    const customIcon = L.divIcon({
      className: 'custom-div-icon',
      html: "<div class='marker-pin'></div>",
      iconSize: [30, 42],
      iconAnchor: [15, 42]
    });

    let marker;

    // Set initial marker if user has location
    if (user?.latitude && user?.longitude) {
      marker = L.marker([user.latitude, user.longitude], { icon: customIcon }).addTo(map);
      map.setView([user.latitude, user.longitude], 15);
    }

    // Handle map click
    map.on('click', async (e) => {
      const { lat, lng } = e.latlng;

      if (marker) map.removeLayer(marker);
      marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      document.getElementById('latitude').value = lat;
      document.getElementById('longitude').value = lng;

      await this._getAddress(lat, lng);
    });

    // Handle get current location
    document.getElementById('getCurrentLocation').addEventListener('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            if (marker) map.removeLayer(marker);
            marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
            map.setView([latitude, longitude], 15);

            document.getElementById('latitude').value = latitude;
            document.getElementById('longitude').value = longitude;

            await this._getAddress(latitude, longitude);
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

  async _getAddress(lat, lng) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();

      document.getElementById('fullAddress').value = data.display_name;
      document.getElementById('city').value = data.address.city || data.address.town || '';
      document.getElementById('postalCode').value = data.address.postcode || '';
    } catch (error) {
      console.error('Error getting address:', error);
    }
  },

  _initializeForm() {
    const form = document.getElementById('profileForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this._handleSubmit(e);
      });
    }
  },

  async _handleSubmit(event) {
    event.preventDefault();
    try {
      // Upload image jika ada
      const imageFile = document.querySelector('#profileImageInput').files[0];
      let profileImageUrl = '';

      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);

        const uploadResponse = await fetch(API_ENDPOINT.UPLOAD_IMAGE, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: imageFormData
        });

        if (!uploadResponse.ok) {
          throw new Error('Gagal mengupload foto profil');
        }

        const uploadResult = await uploadResponse.json();
        profileImageUrl = uploadResult.data.url;
      }

      const formData = new FormData(event.target);
      const firstName = formData.get('firstName') || '';
      const lastName = formData.get('lastName') || '';
      const fullName = `${firstName} ${lastName}`.trim();

      const updateData = {
        name: fullName,
        phone: formData.get('phone') || '',
        address: formData.get('address') || '',
        city: formData.get('city') || '',
        postalCode: formData.get('postalCode') || ''
      };

      // Hanya tambahkan profileImage jika berhasil upload
      if (profileImageUrl) {
        updateData.profileImage = profileImageUrl;
      }

      console.log('Sending update data:', updateData); // Debug log

      const response = await fetch(API_ENDPOINT.UPDATE_PROFILE, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const data = await response.json();

      // Verify if update was successful
      if (!data.data.user.profileImage && profileImageUrl) {
        throw new Error('Gagal memperbarui foto profil');
      }

      localStorage.setItem('user', JSON.stringify(data.data.user));
      alert('Profil berhasil diperbarui');
      window.location.hash = '#/profile';

    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.message || 'Gagal memperbarui profil');
    }
  }
};

export default EditProfile;
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
                         src="${user?.profileImage || 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Default-avatar.jpg?20160314221008'}" />
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
    setTimeout(() => {
      if (localStorage.getItem('showWelcomeMessage') === 'true') {
        this._showWelcomeMessage();
        localStorage.removeItem('showWelcomeMessage');
      }
    }, 500); // Delay 500ms

    this._initializeImageUpload();
    this._initializeMap();
    this._initializeForm();
  },

  _validateField(input, form) {
    const errorId = `${input.name}-error`;
    let errorElement = document.getElementById(errorId);

    // Create error element if doesn't exist
    if (!errorElement) {
      errorElement = document.createElement('span');
      errorElement.id = errorId;
      errorElement.className = 'text-red-500 text-sm mt-1 block';
      input.parentNode.appendChild(errorElement);
    }

    // Reset styling
    input.classList.remove('border-red-500');
    errorElement.textContent = '';
    errorElement.classList.add('hidden');

    let isValid = true;
    let errorMessage = '';

    // Validasi required fields
    if (input.hasAttribute('required') && !input.value.trim()) {
      isValid = false;
      errorMessage = 'Field ini wajib diisi';
    }
    // Validasi spesifik
    else if (input.name === 'newPassword' && input.value) {
      if (input.value.length < 8) {
        isValid = false;
        errorMessage = 'Password minimal 8 karakter';
      }
    }
    else if (input.name === 'confirmPassword' && input.value) {
      const newPassword = form.querySelector('[name="newPassword"]').value;
      if (input.value !== newPassword) {
        // eslint-disable-next-line no-unused-vars
        isValid = false;
        errorMessage = 'Password tidak sama';
      }
    }

    // Show error if invalid
    if (!errorMessage) {
      return true;
    }

    input.classList.add('border-red-500');
    errorElement.textContent = errorMessage;
    errorElement.classList.remove('hidden');
    return false;
  },

  _showWelcomeMessage() {
    const messageHTML = `
      <div id="welcomeMessage" 
           class="fixed top-20 right-4 z-50 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-lg max-w-md animate-fade-in">
        <div class="flex justify-between items-start">
          <div class="flex">
            <div class="flex-shrink-0">
              <i class="fas fa-user-plus text-xl text-green-500 mt-1"></i>
            </div>
            <div class="ml-3">
              <h3 class="font-bold text-green-800">Selamat Datang di Upcyclers! 👋</h3>
              <p class="mt-1 text-sm">Lengkapi profil Anda sekarang untuk mengakses semua fitur Upcyclers.</p>
            </div>
          </div>
          <button id="closeWelcomeMessage" 
                  class="ml-4 text-green-500 hover:text-green-700 focus:outline-none">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', messageHTML);

    // Attach event listener to the close button
    document.getElementById('closeWelcomeMessage').addEventListener('click', () => {
      this._hideWelcomeMessage();
    });

    // Auto dismiss setelah 15 detik
    setTimeout(() => this._hideWelcomeMessage(), 15000);
  },

  _hideWelcomeMessage() {
    const message = document.getElementById('welcomeMessage');
    if (message) {
      message.style.opacity = '0';
      message.style.transform = 'translateX(100px)';
      message.style.transition = 'all 0.5s ease-out';

      setTimeout(() => {
        message.remove();
      }, 500);
    }
  },

  _initializeImageUpload() {
    const preview = document.getElementById('previewImage');
    const defaultImage = 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Default-avatar.jpg?20160314221008';

    // Set default image if src is invalid
    preview.onerror = () => {
      preview.src = defaultImage;
    };

    // Handle image upload
    const input = document.getElementById('profileImageInput');
    input?.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        this._showError('Ukuran file maksimal 2MB');
        input.value = '';
        return;
      }

      try {
        preview.src = 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Default-avatar.jpg?20160314221008';

        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(API_ENDPOINT.UPLOAD_IMAGE, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });

        if (!response.ok) throw new Error('Gagal mengupload gambar');

        const data = await response.json();
        preview.src = data.data.url;
        document.getElementById('profileImageUrl').value = data.data.url;

      } catch (error) {
        console.error('Error uploading image:', error);
        this._showError('Gagal mengupload gambar. Silakan coba lagi.');
        preview.src = this._getUserData()?.profileImage || defaultImage;
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

  _formatPhoneNumber(phone) {
    // Hapus semua karakter non-digit
    let cleanNumber = phone.replace(/\D/g, '');

    // Jika nomor dimulai dengan 62, sudah dalam format yang benar
    if (cleanNumber.startsWith('62')) {
      return `+${cleanNumber}`;
    }

    // Jika nomor dimulai dengan 0, hapus 0 dan tambahkan 62
    if (cleanNumber.startsWith('0')) {
      cleanNumber = cleanNumber.substring(1);
      return `+62${cleanNumber}`;
    }

    // Jika nomor dimulai dengan 8, tambahkan 62
    if (cleanNumber.startsWith('8')) {
      return `+62${cleanNumber}`;
    }

    // Untuk kasus lain, asumsikan sebagai nomor lokal dan tambahkan 628
    if (/^[1-9]/.test(cleanNumber))
    {
      return `+628${cleanNumber}`;
    }
  },

  async _handleSubmit(event) {
    event.preventDefault();
    try {
      // Clear previous errors
      document.querySelectorAll('.error-message').forEach((el) => el.remove());

      const form = event.target;
      const formData = new FormData(form);

      // Validate required fields (except password fields)
      const requiredFields = {
        firstName: 'Nama depan',
        lastName: 'Nama belakang',
        phone: 'Nomor telepon',
        address: 'Alamat lengkap',
        city: 'Kota',
        postalCode: 'Kode pos'
      };

      let hasError = false;
      Object.entries(requiredFields).forEach(([fieldName, label]) => {
        const value = formData.get(fieldName)?.trim();
        if (!value) {
          this._showFieldError(fieldName, `${label} harus diisi`);
          hasError = true;
        }
      });

      // Validate location
      const latitude = document.getElementById('latitude').value;
      const longitude = document.getElementById('longitude').value;
      if (!latitude || !longitude) {
        this._showError('Silakan pilih lokasi pada peta');
        hasError = true;
      }

      if (hasError) return;

      // Handle password update if provided
      const currentPassword = formData.get('currentPassword');
      const newPassword = formData.get('newPassword');
      const confirmPassword = formData.get('confirmPassword');

      if (currentPassword || newPassword || confirmPassword) {
        if (!currentPassword) {
          this._showFieldError('currentPassword', 'Password saat ini harus diisi');
          return;
        }
        if (!newPassword) {
          this._showFieldError('newPassword', 'Password baru harus diisi');
          return;
        }
        if (newPassword.length < 8) {
          this._showFieldError('newPassword', 'Password minimal 8 karakter');
          return;
        }
        if (newPassword !== confirmPassword) {
          this._showFieldError('confirmPassword', 'Password tidak sama');
          return;
        }

        // Update password
        try {
          const response = await fetch(API_ENDPOINT.UPDATE_PASSWORD, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ currentPassword, newPassword })
          });

          const data = await response.json();
          if (!response.ok) {
            if (response.status === 401) {
              this._showFieldError('currentPassword', 'Password saat ini salah');
              return;
            }
            throw new Error(data.message || 'Gagal mengubah password');
          }
        } catch (error) {
          this._showError(`Gagal mengubah password: ${  error.message}`);
          return;
        }
      }

      // Update profile data
      const profileData = {
        name: `${formData.get('firstName')} ${formData.get('lastName')}`,
        phone: this._formatPhoneNumber(formData.get('phone')),
        address: formData.get('address'),
        city: formData.get('city'),
        postalCode: formData.get('postalCode'),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        profileImage: document.getElementById('profileImageUrl').value
      };

      const phoneNumber = formData.get('phone');
      if (phoneNumber) {
        const cleanNumber = phoneNumber.replace(/\D/g, '');
        if (cleanNumber.length < 10 || cleanNumber.length > 13) {
          this._showFieldError('phone', 'Nomor telepon tidak valid (10-13 digit)');
          return;
        }
      }

      const profileResponse = await fetch(API_ENDPOINT.UPDATE_PROFILE, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      if (!profileResponse.ok) {
        throw new Error('Gagal memperbarui profil');
      }

      // Update local storage with new user data
      const { data } = await profileResponse.json();
      localStorage.setItem('user', JSON.stringify(data.user));

      // Show success and redirect
      this._showSuccessMessage('Profil berhasil diperbarui');
      setTimeout(() => {
        window.location.hash = '#/profile';
      }, 1500);

    } catch (error) {
      console.error('Error updating profile:', error);
      this._showError(error.message || 'Terjadi kesalahan saat memperbarui profil');
    }
  },

  _showFieldError(fieldName, message) {
    const input = document.querySelector(`[name="${fieldName}"]`);
    if (!input) return;

    input.classList.add('border-red-500');

    const errorElement = document.createElement('span');
    errorElement.className = 'text-red-500 text-sm mt-1 block error-message';
    errorElement.textContent = message;

    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    input.parentNode.appendChild(errorElement);
  },

  _showError(message) {
    const alertDiv = document.createElement('div');
    // Update className, tambahkan mt-16 untuk memberikan margin dari header
    alertDiv.className = `fixed top-16 left-1/2 transform -translate-x-1/2 
      bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg z-50 
      mt-4 w-96 animate-fade-in`;

    alertDiv.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <i class="fas fa-exclamation-circle text-red-500"></i>
          <p class="ml-3">${message}</p>
        </div>
        <button class="text-red-500 hover:text-red-700">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

    // Tambahkan handler untuk tombol close
    alertDiv.querySelector('button').addEventListener('click', () => {
      alertDiv.remove();
    });

    document.body.appendChild(alertDiv);

    // Auto remove dengan animasi
    setTimeout(() => {
      alertDiv.style.opacity = '0';
      alertDiv.style.transform = 'translate(-50%, -20px)';
      setTimeout(() => alertDiv.remove(), 300);
    }, 5000);
  },

  _showSuccessMessage(message) {
    const alertDiv = document.createElement('div');
    // Update className dengan style yang sama
    alertDiv.className = `fixed top-16 left-1/2 transform -translate-x-1/2 
      bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg z-50 
      mt-4 w-96 animate-fade-in`;

    alertDiv.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <i class="fas fa-check-circle text-green-500"></i>
          <p class="ml-3">${message}</p>
        </div>
        <button class="text-green-500 hover:text-green-700">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

    // Tambahkan handler untuk tombol close
    alertDiv.querySelector('button').addEventListener('click', () => {
      alertDiv.remove();
    });

    document.body.appendChild(alertDiv);

    // Auto remove dengan animasi
    setTimeout(() => {
      alertDiv.style.opacity = '0';
      alertDiv.style.transform = 'translate(-50%, -20px)';
      setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
  }
};

export default EditProfile;
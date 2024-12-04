/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
import L from 'leaflet';
import ProductService from '../../services/product.service';

const SellItem = {
  _getUserData() {
    return JSON.parse(localStorage.getItem('user')) || {};
  },

  async render() {
    const userData = this._getUserData();
    return `
        <section class="pt-24 pb-16">
          <div class="container mx-auto px-4">
            <div class="max-w-3xl mx-auto">
              <div class="bg-white rounded-lg shadow-md p-8">
                <h1 class="text-2xl font-bold mb-6">Jual Barang Rongsok</h1>
                
                <!-- Progress Steps -->
                <div class="flex justify-between mb-8">
                  <div class="flex flex-col items-center w-1/3">
                    <div id="step1-indicator" class="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center mb-2">
                      1
                    </div>
                    <span class="text-sm text-gray-600">Informasi Barang</span>
                  </div>
                  <div class="flex flex-col items-center w-1/3">
                    <div id="step2-indicator" class="w-10 h-10 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center mb-2">
                      2
                    </div>
                    <span class="text-sm text-gray-600">Lokasi & Kontak</span>
                  </div>
                  <div class="flex flex-col items-center w-1/3">
                    <div id="step3-indicator" class="w-10 h-10 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center mb-2">
                      3
                    </div>
                    <span class="text-sm text-gray-600">Konfirmasi</span>
                  </div>
                </div>
  
                <!-- Form Steps -->
                <form id="sellForm" class="space-y-6">
                  <!-- Step 1: Informasi Barang -->
                  <div id="step1" class="space-y-6">
                    <div>
                      <label class="block text-gray-700 font-medium mb-2">Kategori</label>
                      <select name="kategori" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500">
                        <option value="">Pilih Kategori</option>
                        <option value="Elektronik">Elektronik</option>
                        <option value="Plastik">Plastik</option>
                        <option value="Kertas">Kertas</option>
                        <option value="Logam">Logam</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-gray-700 font-medium mb-2">Nama Barang</label>
                      <input type="text" name="nama_barang" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500" placeholder="Masukkan nama barang">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-gray-700 font-medium mb-2">Jumlah</label>
                        <input type="number" name="jumlah" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500" placeholder="Masukkan jumlah">
                      </div>
                      <div>
                        <label class="block text-gray-700 font-medium mb-2">Satuan</label>
                        <select name="satuan" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500">
                          <option value="kg">Kg</option>
                          <option value="pcs">Pcs</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label class="block text-gray-700 font-medium mb-2">Harga per Satuan</label>
                      <input type="number" name="harga" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500" placeholder="Masukkan harga per satuan">
                    </div>
                    <div>
                      <label class="block text-gray-700 font-medium mb-2">Deskripsi</label>
                      <textarea name="deskripsi" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500" rows="3" placeholder="Masukkan deskripsi barang"></textarea>
                    </div>
                    <div>
                      <label class="block text-gray-700 font-medium mb-2">Foto Barang</label>
                      <div class="space-y-4">
                        <!-- Main Image Upload -->
                        <div>
                          <div class="flex items-center justify-center w-full">
                            <label class="flex flex-col w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                              <div id="mainImagePreview" class="flex flex-col items-center justify-center h-full">
                                <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
                                <p class="text-gray-500">Unggah Foto Utama</p>
                                <p class="text-sm text-gray-400">Klik atau seret foto ke sini</p>
                              </div>
                              <input type="file" name="mainImage" class="hidden" accept="image/*" id="mainImageInput" />
                            </label>
                          </div>
                          <p class="mt-1 text-sm text-gray-500">Maksimal ukuran 2MB (Format: JPG, PNG)</p>
                        </div>
                      </div>
                    </div>
                  </div>
  
                  <!-- Step 2: Lokasi & Kontak -->
                  <div id="step2" class="space-y-6 hidden">
                    <style>
                      #map {
                        height: 300px;
                        width: 100%;
                        border-radius: 0.5rem;
                        z-index: 1;
                      }
                      .custom-div-icon {
                        background: none;
                        border: none;
                      }
                      .marker-pin {
                        width: 30px;
                        height: 30px;
                        border-radius: 50% 50% 50% 0;
                        background: #16a34a;
                        position: absolute;
                        transform: rotate(-45deg);
                        left: 50%;
                        top: 50%;
                        margin: -15px 0 0 -15px;
                      }
                      .marker-pin::after {
                        content: '';
                        width: 24px;
                        height: 24px;
                        margin: 3px 0 0 3px;
                        background: #fff;
                        position: absolute;
                        border-radius: 50%;
                      }
                    </style>
  
                    <!-- Informasi Kontak -->
                    <div class="space-y-4">
                      <h3 class="text-lg font-semibold">Informasi Kontak</h3>
                      <div>
                        <label class="block text-gray-700 font-medium mb-2">Nama Lengkap</label>
                        <input type="text" name="nama_lengkap"
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500" 
                               placeholder="Masukkan nama lengkap"
                               value="${userData.name || ''}">
                      </div>
                      <div>
                        <label class="block text-gray-700 font-medium mb-2">Nomor Telepon</label>
                        <input type="tel" name="telepon"
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500" 
                               placeholder="Contoh: 08123456789"
                               value="${userData.phone || ''}">
                      </div>
                    </div>
  
                    <!-- Lokasi Barang -->
                    <div class="space-y-4">
                      <div class="flex justify-between items-center">
                        <h3 class="text-lg font-semibold">Lokasi Barang</h3>
                        <button type="button" 
                                id="getCurrentLocation"
                                class="text-primary-600 hover:text-primary-700 flex items-center">
                          <i class="fas fa-location-dot mr-2"></i>
                          Gunakan Lokasi Saat Ini
                        </button>
                      </div>
  
                      <div id="map"></div>
                      
                      <input type="hidden" name="latitude" id="latitude" value="${userData.latitude || ''}">
                      <input type="hidden" name="longitude" id="longitude" value="${userData.longitude || ''}">
  
                      <div>
                        <label class="block text-gray-700 font-medium mb-2">Alamat Lengkap</label>
                        <textarea name="alamat" id="fullAddress"
                                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 h-24" 
                                  placeholder="Masukkan alamat lengkap">${userData.address || ''}</textarea>
                      </div>
  
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <label class="block text-gray-700 font-medium mb-2">Kota</label>
                          <input type="text" name="city" id="city"
                                 class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                                 value="${userData.city || ''}">
                        </div>
                        <div>
                          <label class="block text-gray-700 font-medium mb-2">Kode Pos</label>
                          <input type="text" name="postalCode" id="postalCode"
                                 class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                                 value="${userData.postalCode || ''}">
                        </div>
                      </div>
                    </div>
                  </div>
  
                  <!-- Step 3: Konfirmasi -->
                  <div id="step3" class="space-y-6 hidden">
                    <h3 class="text-lg font-semibold">Ringkasan Penjualan</h3>
                    
                    <!-- Informasi Barang -->
                    <div class="bg-gray-50 p-6 rounded-lg space-y-4">
                      <h4 class="font-medium">Informasi Barang</h4>
                      <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p class="text-gray-600">Kategori:</p>
                          <p class="font-medium" id="summary-category">-</p>
                        </div>
                        <div>
                          <p class="text-gray-600">Nama Barang:</p>
                          <p class="font-medium" id="summary-name">-</p>
                        </div>
                        <div>
                          <p class="text-gray-600">Jumlah:</p>
                          <p class="font-medium" id="summary-quantity">-</p>
                        </div>
                        <div>
                          <p class="text-gray-600">Harga per Satuan:</p>
                          <p class="font-medium" id="summary-price">-</p>
                        </div>
                      </div>
                      <div>
                        <p class="text-gray-600">Deskripsi:</p>
                        <p class="font-medium" id="summary-description">-</p>
                      </div>
                    </div>
  
                    <!-- Informasi Kontak & Lokasi -->
                    <div class="bg-gray-50 p-6 rounded-lg space-y-4">
                      <h4 class="font-medium">Informasi Kontak & Lokasi</h4>
                      <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p class="text-gray-600">Nama:</p>
                          <p class="font-medium" id="summary-contact-name">-</p>
                        </div>
                        <div>
                          <p class="text-gray-600">Telepon:</p>
                          <p class="font-medium" id="summary-contact-phone">-</p>
                        </div>
                      </div>
                      <div>
                        <p class="text-gray-600">Alamat:</p>
                        <p class="font-medium" id="summary-address">-</p>
                      </div>
                    </div>
  
                    <!-- Terms and Conditions -->
                    <div class="space-y-4">
                      <div class="flex items-start space-x-2">
                        <input type="checkbox" name="terms" class="mt-1">
                        <p class="text-sm text-gray-600">
                          Saya menyetujui <a href="#" class="text-primary-600 hover:underline">Syarat dan Ketentuan</a> serta <a href="#" class="text-primary-600 hover:underline">Kebijakan Privasi</a> yang berlaku
                        </p>
                      </div>
                    </div>
                  </div>
  
                  <!-- Navigation Buttons -->
                  <div class="flex justify-between space-x-4 mt-6">
                    <button type="button" id="prevButton" 
                            class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all hidden">
                      Kembali
                    </button>
                    <div class="flex space-x-4 ml-auto">
                      <button type="button" onclick="window.location.hash = '#/profile'"
                              class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all">
                        Batal
                      </button>
                      <button type="button" id="nextButton" 
                              class="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-all">
                        Selanjutnya
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      `;
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

  async afterRender() {
    this._initializeForm();
    this._initializeImageUpload();
    this._initializeStepNavigation();
    // Initialize map setelah tab dibuka
    document.getElementById('nextButton')?.addEventListener('click', () => {
      setTimeout(() => {
        this._initializeMap();
      }, 100);
    });
  },

  _initializeStepNavigation() {
    let currentStep = 1;
    const totalSteps = 3;

    const nextButton = document.getElementById('nextButton');
    const prevButton = document.getElementById('prevButton');

    const updateSummary = () => {
      // Update summary data from form fields
      const form = document.getElementById('sellForm');
      document.getElementById('summary-category').textContent = form.kategori.value || '-';
      document.getElementById('summary-name').textContent = form.nama_barang.value || '-';
      document.getElementById('summary-quantity').textContent = `${form.jumlah.value || '-'} ${form.satuan.value || ''}`;
      document.getElementById('summary-price').textContent = form.harga.value ? `Rp ${form.harga.value}` : '-';
      document.getElementById('summary-description').textContent = form.deskripsi.value || '-';
      document.getElementById('summary-contact-name').textContent = form.nama_lengkap.value || '-';
      document.getElementById('summary-contact-phone').textContent = form.telepon.value || '-';
      document.getElementById('summary-address').textContent = form.alamat.value || '-';
      document.getElementById('summary-pickup-date').textContent = form.tanggal.value || '-';
      document.getElementById('summary-pickup-time').textContent =
       form.waktu.options[form.waktu.selectedIndex]?.text || '-';
    };

    const showStep = (step) => {
      // Hide all steps
      for (let i = 1; i <= totalSteps; i++) {
        const stepElement = document.getElementById(`step${i}`);
        const indicator = document.getElementById(`step${i}-indicator`);

        if (i === step) {
          stepElement.classList.remove('hidden');
          indicator.classList.add('bg-primary-600', 'text-white');
          indicator.classList.remove('bg-gray-200', 'text-gray-600');
        } else {
          stepElement.classList.add('hidden');
          if (i < step) {
            indicator.classList.add('bg-primary-600', 'text-white');
            indicator.classList.remove('bg-gray-200', 'text-gray-600');
          } else {
            indicator.classList.remove('bg-primary-600', 'text-white');
            indicator.classList.add('bg-gray-200', 'text-gray-600');
          }
        }
      }

      // Update navigation buttons
      if (step === 1) {
        prevButton.classList.add('hidden');
        nextButton.textContent = 'Selanjutnya';
      } else {
        prevButton.classList.remove('hidden');
        nextButton.textContent = step === totalSteps ? 'Kirim' : 'Selanjutnya';
      }

      // Update summary if on last step
      if (step === totalSteps) {
        updateSummary();
      }
    };

    // Add event listeners for navigation
    nextButton.addEventListener('click', () => {
      if (currentStep < totalSteps) {
        currentStep++;
        showStep(currentStep);
      } else {
        // Handle form submission
        document.getElementById('sellForm').submit();
      }
    });

    prevButton?.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
      }
    });

    // Initialize first step
    showStep(1);
  },

  _initializeImageUpload() {
    // Main Image Upload
    const mainImageInput = document.getElementById('mainImageInput');
    const mainImagePreview = document.getElementById('mainImagePreview');

    mainImageInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          alert('Ukuran file terlalu besar. Maksimal 2MB');
          mainImageInput.value = '';
          return;
        }

        if (!file.type.startsWith('image/')) {
          alert('File harus berupa gambar');
          mainImageInput.value = '';
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          mainImagePreview.innerHTML = `
           <img src="${e.target.result}" class="h-full w-full object-contain" />
         `;
        };
        reader.readAsDataURL(file);
      }
    });

    // Additional Images Upload
    const additionalImageInputs = document.querySelectorAll('.additionalImageInput');
    additionalImageInputs.forEach((input) => {
      input.addEventListener('change', function (e) {
        const file = e.target.files[0];
        const index = this.dataset.index;
        const previewContainer = document.getElementById(`additionalImagePreview${index}`);
        const removeBtn = this.parentElement.querySelector('.removeImageBtn');

        if (file) {
          if (file.size > 2 * 1024 * 1024) {
            alert('Ukuran file terlalu besar. Maksimal 2MB');
            input.value = '';
            return;
          }

          if (!file.type.startsWith('image/')) {
            alert('File harus berupa gambar');
            input.value = '';
            return;
          }

          const reader = new FileReader();
          reader.onload = (e) => {
            previewContainer.innerHTML = `
             <img src="${e.target.result}" class="h-full w-full object-cover rounded-lg" />
           `;
            removeBtn.classList.remove('hidden');
          };
          reader.readAsDataURL(file);
        }
      });
    });

    // Remove Image Buttons
    const removeButtons = document.querySelectorAll('.removeImageBtn');
    removeButtons.forEach((button) => {
      button.addEventListener('click', function () {
        const container = this.parentElement;
        const input = container.querySelector('input[type="file"]');
        const preview = container.querySelector('[id^="additionalImagePreview"]');

        input.value = '';
        preview.innerHTML = '<i class="fas fa-plus text-gray-400"></i>';
        this.classList.add('hidden');
      });
    });
  },

  _initializeForm() {
    const form = document.getElementById('sellForm');

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();

      try {
        // Validate terms checkbox
        const termsChecked = form.querySelector('input[name="terms"]').checked;
        if (!termsChecked) {
          throw new Error('Anda harus menyetujui Syarat dan Ketentuan');
        }

        // Get form data
        const formData = new FormData(form);
        const token = localStorage.getItem('token');

        if (!token) {
          window.location.hash = '#/auth';
          return;
        }

        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Mengirim...';

        // Send to backend
        await ProductService.createProduct(formData, token);

        // Show success message
        alert('Produk berhasil ditambahkan!');
        window.location.hash = '#/profile';

      } catch (error) {
        console.error('Error submitting form:', error);
        alert(error.message || 'Gagal menambahkan produk. Silakan coba lagi.');

        // Reset submit button
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.textContent = 'Kirim';
      }
    });
  },

  _initializeMap() {
    setTimeout(() => {
      const mapElement = document.getElementById('map');
      if (!mapElement) return;

      const user = this._getUserData();
      const defaultLat = user.latitude || -6.200000;
      const defaultLng = user.longitude || 106.816666;

      const map = L.map('map').setView([defaultLat, defaultLng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: "<div class='marker-pin'></div>",
        iconSize: [30, 42],
        iconAnchor: [15, 42]
      });

      let marker;

      // Set initial marker if user has location
      if (user.latitude && user.longitude) {
        marker = L.marker([user.latitude, user.longitude], { icon: customIcon }).addTo(map);
      }

      // Reset map size after initialization
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }, 100);
  }
};

export default SellItem;
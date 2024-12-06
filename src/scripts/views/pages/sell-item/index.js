/* eslint-disable linebreak-style */
/* eslint-disable no-constant-binary-expression */
/* eslint-disable no-unused-vars */
import FormHandler from './form-handler';
import ImageHandler from './image-handler';
import MapHandler from './map-handler';
import StepsHandler from './steps-handler';

const SellItemPage = {
  async render() {
    return `
      <section class="pt-24 pb-16">
        <div class="container mx-auto px-4">
          <div class="max-w-3xl mx-auto">
            <div class="bg-white rounded-lg shadow-md p-8">
              <h1 class="text-2xl font-bold mb-6">Jual Barang Rongsok</h1>
              
              <!-- Progress Steps -->
              ${this._renderProgressSteps()}
              
              <!-- Form -->
              <form id="sellForm" class="space-y-6">
                ${this._renderStep1()}
                ${this._renderStep2()}
                ${this._renderStep3()}
                
                <!-- Navigation Buttons -->
                ${this._renderNavigationButtons()}
              </form>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  _renderProgressSteps() {
    return `
      <div class="flex justify-between mb-8">
        <div class="flex flex-col items-center w-1/3">
          <div id="step1-indicator" class="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center mb-2">1</div>
          <span class="text-sm text-gray-600">Informasi Barang</span>
        </div>
        <div class="flex flex-col items-center w-1/3">
          <div id="step2-indicator" class="w-10 h-10 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center mb-2">2</div>
          <span class="text-sm text-gray-600">Lokasi & Kontak</span>
        </div>
        <div class="flex flex-col items-center w-1/3">
          <div id="step3-indicator" class="w-10 h-10 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center mb-2">3</div>
          <span class="text-sm text-gray-600">Konfirmasi</span>
        </div>
      </div>
    `;
  },

  _renderStep1() {
    return `
      <div id="step1" class="space-y-6">
        <div>
          <label class="block text-gray-700 font-medium mb-2">Kategori</label>
          <select name="kategori" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-500">
            <option value="">Pilih Kategori</option>
            <option value="Elektronik">Elektronik</option>
            <option value="Plastik">Plastik</option>
            <option value="Kertas">Kertas</option>
            <option value="Logam">Logam</option>
          </select>
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-2">Nama Barang</label>
          <input type="text" name="nama_barang" 
                 class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-500"
                 placeholder="Masukkan nama barang">
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-gray-700 font-medium mb-2">Jumlah</label>
            <input type="number" name="jumlah" 
                   class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-500"
                   placeholder="Masukkan jumlah">
          </div>
          <div>
            <label class="block text-gray-700 font-medium mb-2">Satuan</label>
            <select name="satuan" 
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-500">
              <option value="kg">Kg</option>
              <option value="pcs">Pcs</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-2">Harga per Satuan</label>
          <input type="number" name="harga"
                 class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-500"
                 placeholder="Masukkan harga per satuan">
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-2">Deskripsi</label>
          <textarea name="deskripsi"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-500"
                    rows="3" placeholder="Masukkan deskripsi barang"></textarea>
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-2">Foto Barang</label>
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
    `;
  },

  _renderStep2() {
    return `
      <div id="step2" class="space-y-6 hidden">
        <!-- Informasi Kontak -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold">Informasi Kontak</h3>
          <div>
            <label class="block text-gray-700 font-medium mb-2">Nama Lengkap</label>
            <input type="text" name="nama_lengkap"
                   class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-500" 
                   placeholder="Masukkan nama lengkap">
          </div>
          <div>
            <label class="block text-gray-700 font-medium mb-2">Nomor Telepon</label>
            <input type="tel" name="telepon"
                   class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-500" 
                   placeholder="Contoh: 08123456789">
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

          <div class="relative w-full h-[300px] bg-gray-100 rounded-lg overflow-hidden">
            <div id="map" class="absolute inset-0"></div>
          </div>
          
          <input type="hidden" name="latitude" id="latitude">
          <input type="hidden" name="longitude" id="longitude">

          <div>
            <label class="block text-gray-700 font-medium mb-2">Alamat Lengkap</label>
            <textarea name="alamat" id="alamat"
                      class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-500 h-24" 
                      placeholder="Masukkan alamat lengkap"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 font-medium mb-2">Kota</label>
              <input type="text" name="city" id="city"
                     class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-500">
            </div>
            <div>
              <label class="block text-gray-700 font-medium mb-2">Kode Pos</label>
              <input type="text" name="postalCode" id="postalCode"
                     class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-500">
            </div>
          </div>
        </div>
      </div>
    `;
  },

  _renderStep3() {
    return `
      <div id="step3" class="space-y-6 hidden">
        <h3 class="text-lg font-semibold">Ringkasan Penjualan</h3>
        
        <!-- Container untuk summary -->
        <div id="summary-content"></div>
  
        <!-- Terms & Buttons -->
        <div class="space-y-4">
          <div class="flex items-start space-x-2">
            <input type="checkbox" name="terms" class="mt-1" required>
            <p class="text-sm text-gray-600">
              Saya menyetujui <a href="#" class="text-primary-600 hover:underline">Syarat dan Ketentuan</a> 
              serta <a href="#" class="text-primary-600 hover:underline">Kebijakan Privasi</a> yang berlaku
            </p>
          </div>
        </div>
      </div>
    `;
  },

  _renderNavigationButtons() {
    return `
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
    `;
  },

  async updateSummary() {
    const formData = new FormData(document.getElementById('sellForm'));

    // Update semua field summary
    document.getElementById('summary-category').textContent = formData.get('kategori') || '-';
    document.getElementById('summary-name').textContent = formData.get('nama_barang') || '-';
    document.getElementById('summary-quantity').textContent = `${formData.get('jumlah')} ${formData.get('satuan')}` || '-';
    document.getElementById('summary-price').textContent = `Rp ${parseInt(formData.get('harga')).toLocaleString()}/${formData.get('satuan')}` || '-';
    document.getElementById('summary-description').textContent = formData.get('deskripsi') || '-';
    document.getElementById('summary-contact-name').textContent = formData.get('nama_lengkap') || '-';
    document.getElementById('summary-contact-phone').textContent = formData.get('telepon') || '-';
    document.getElementById('summary-address').textContent = formData.get('alamat') || '-';

    // Update preview image
    const imageUrl = document.getElementById('profileImageUrl').value;
    if (imageUrl) {
      document.getElementById('summary-image').src = imageUrl;
    }

    // Update map jika ada koordinat
    const lat = formData.get('latitude');
    const lng = formData.get('longitude');
    if (lat && lng && this.mapHandler) {
      this.mapHandler.updateMap([lat, lng]);
    }
  },

  async afterRender() {
    StepsHandler.initialize();
    FormHandler.initialize();
    ImageHandler.initializeImageUpload();
  }
};

export default SellItemPage;
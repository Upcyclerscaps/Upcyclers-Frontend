/* eslint-disable linebreak-style */
/* eslint-disable camelcase */
import API_ENDPOINT from '../../../globals/api-endpoint';
import AlertHelper from '../../../utils/alert-helper';

const EditSellItemPage = {
  async render() {
    return `
      <section class="pt-24 pb-16">
        <div class="container mx-auto px-4">
          <div class="max-w-3xl mx-auto">
            <div class="bg-white rounded-lg shadow-md p-8">
              <h1 class="text-2xl font-bold mb-6">Edit Barang Jualan</h1>
              
              <div id="loadingState" class="text-center py-8">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
                <p class="mt-4 text-gray-600">Memuat data...</p>
              </div>

              <form id="editSellForm" class="space-y-6 hidden">
                <!-- Form fields -->
                <div>
                  <label class="block text-gray-700 font-medium mb-2">Kategori</label>
                  <select name="kategori" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-500" required>
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
                         required>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-gray-700 font-medium mb-2">Jumlah</label>
                    <input type="number" name="jumlah" 
                           class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-500"
                           required>
                  </div>
                  <div>
                    <label class="block text-gray-700 font-medium mb-2">Satuan</label>
                    <select name="satuan" 
                            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-500"
                            required>
                      <option value="kg">Kg</option>
                      <option value="pcs">Pcs</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-gray-700 font-medium mb-2">Harga per Satuan</label>
                  <input type="number" name="harga"
                         class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-500"
                         required>
                </div>

                <div>
                  <label class="block text-gray-700 font-medium mb-2">Deskripsi</label>
                  <textarea name="deskripsi"
                          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-500"
                          rows="3" required></textarea>
                </div>

                <div>
                  <label class="block text-gray-700 font-medium mb-2">Foto Barang</label>
                  <div class="flex items-center space-x-4">
                    <img id="currentImage" class="w-24 h-24 object-cover rounded-lg" alt="Current image">
                    <div>
                      <input type="file" name="mainImage" accept="image/*" id="mainImageInput" class="hidden">
                      <label for="mainImageInput" class="cursor-pointer bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                        Ganti Foto
                      </label>
                    </div>
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
                    Simpan Perubahan
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
    const productId = this._getProductId();
    if (!productId) {
      window.location.hash = '#/profile';
      return;
    }

    try {
      const product = await this._fetchProduct(productId);
      this._populateForm(product);
    } catch (error) {
      console.error('Error:', error);
      this._showError(error.message);
    }

    const form = document.getElementById('editSellForm');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this._handleSubmit(e, productId);
    });
  },

  _getProductId() {
    const hash = window.location.hash;
    return hash.split('/edit/')[1];
  },

  async _fetchProduct(id) {
    const response = await fetch(`${API_ENDPOINT.GET_PRODUCT_DETAIL(id)}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Gagal memuat data produk');
    }

    const { data } = await response.json();
    return data;
  },

  _populateForm(product) {
    const form = document.getElementById('editSellForm');
    const loadingState = document.getElementById('loadingState');

    form.querySelector('[name="kategori"]').value = product.category;
    form.querySelector('[name="nama_barang"]').value = product.name;
    form.querySelector('[name="jumlah"]').value = product.stock.amount;
    form.querySelector('[name="satuan"]').value = product.stock.unit;
    form.querySelector('[name="harga"]').value = product.price.amount;
    form.querySelector('[name="deskripsi"]').value = product.description;

    // Update current image
    if (product.images && product.images.length > 0) {
      document.getElementById('currentImage').src = product.images[0].url;
    }

    loadingState.classList.add('hidden');
    form.classList.remove('hidden');
  },

  async _handleSubmit(event, productId) {
    try {
      event.preventDefault();
      const submitButton = event.target.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Menyimpan...';

      const formData = new FormData(event.target);
      let imageUrl = '';

      // Upload new image if selected
      const imageFile = document.querySelector('#mainImageInput').files[0];
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

        if (!uploadResponse.ok) throw new Error('Gagal mengupload gambar');
        const uploadResult = await uploadResponse.json();
        imageUrl = uploadResult.data.url;
      }

      const updateData = {
        name: formData.get('nama_barang'),
        category: formData.get('kategori'),
        description: formData.get('deskripsi'),
        price: {
          amount: parseInt(formData.get('harga')),
          negotiable: true
        },
        stock: {
          amount: parseInt(formData.get('jumlah')),
          unit: formData.get('satuan')
        }
      };

      // Add new image if uploaded
      if (imageUrl) {
        updateData.images = [{
          url: imageUrl,
          is_primary: true
        }];
      }

      const response = await fetch(API_ENDPOINT.UPDATE_PRODUCT(productId), {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Gagal mengupdate produk');
      }

      AlertHelper.showAlert('Produk berhasil diperbarui', 'success');
      setTimeout(() => {
        window.location.hash = '#/profile';
      }, 2000);

    } catch (error) {
      console.error('Error updating product:', error);
      AlertHelper.showAlert(error.message || 'Terjadi kesalahan saat mengupdate produk', 'error');
    } finally {
      const submitButton = event.target.querySelector('button[type="submit"]');
      submitButton.disabled = false;
      submitButton.innerHTML = 'Simpan Perubahan';
    }
  },

  _showError(message) {
    const container = document.querySelector('.container');
    container.innerHTML = `
      <div class="text-center py-8">
        <div class="text-red-500 mb-4">
          <i class="fas fa-exclamation-circle text-4xl"></i>
        </div>
        <p class="text-gray-600">${message}</p>
        <button onclick="window.location.hash = '#/profile'"
                class="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
          Kembali
        </button>
      </div>
    `;
  }
};

export default EditSellItemPage;
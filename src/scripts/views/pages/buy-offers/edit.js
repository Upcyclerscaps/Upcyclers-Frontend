/* eslint-disable linebreak-style */

import API_ENDPOINT from '../../../globals/api-endpoint';

const EditBuyOfferPage = {
  async render() {
    return `
        <section class="pt-24 pb-16">
          <div class="container mx-auto px-4">
            <div class="max-w-3xl mx-auto">
              <div class="bg-white rounded-lg shadow-md p-8">
                <h1 class="text-2xl font-bold mb-6">Edit Penawaran Pembelian</h1>
                
                <div id="loadingState" class="text-center py-8">
                  <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
                  <p class="mt-4 text-gray-600">Memuat data...</p>
                </div>
  
                <form id="editBuyOfferForm" class="space-y-6 hidden">
                  <div>
                    <label class="block text-gray-700 font-medium mb-2">Kategori Barang</label>
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
                      required></textarea>
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
                      required>
                  </div>
  
                  <div>
                    <label class="block text-gray-700 font-medium mb-2">Lokasi Anda</label>
                    <textarea name="address" 
                      class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-500"
                      rows="3" required></textarea>
                  </div>
  
                  <div class="flex justify-end space-x-4">
                    <button type="button"
                      onclick="window.location.hash = '#/buy-offers'"
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
    const offerId = this._getOfferId();
    if (!offerId) {
      window.location.hash = '#/buy-offers';
      return;
    }

    try {
      const offer = await this._fetchBuyOffer(offerId);
      this._populateForm(offer);
    } catch (error) {
      console.error('Error:', error);
      this._showError(error.message);
    }

    const form = document.getElementById('editBuyOfferForm');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this._handleSubmit(e, offerId);
    });
  },

  _getOfferId() {
    const hash = window.location.hash;
    return hash.split('/edit/')[1];
  },

  async _fetchBuyOffer(id) {
    const response = await fetch(`${API_ENDPOINT.BUY_OFFERS}/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Gagal memuat data penawaran');
    }

    const { data } = await response.json();
    return data;
  },

  _populateForm(offer) {
    const form = document.getElementById('editBuyOfferForm');
    const loadingState = document.getElementById('loadingState');

    form.querySelector('[name="category"]').value = offer.category;
    form.querySelector('[name="description"]').value = offer.description;
    form.querySelector('[name="amount"]').value = offer.amount.value;
    form.querySelector('[name="unit"]').value = offer.amount.unit;
    form.querySelector('[name="price"]').value = offer.price.amount;
    form.querySelector('[name="address"]').value = offer.location.address;

    loadingState.classList.add('hidden');
    form.classList.remove('hidden');
  },

  async _handleSubmit(event, offerId) {
    try {
      const form = event.target;
      const formData = new FormData(form);

      const updateData = {
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
          address: formData.get('address')
        }
      };

      const response = await fetch(`${API_ENDPOINT.BUY_OFFERS}/${offerId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Gagal mengupdate penawaran');
      }

      alert('Penawaran berhasil diupdate!');
      window.location.hash = '#/buy-offers';

    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Terjadi kesalahan saat mengupdate penawaran');
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
          <button onclick="window.location.hash = '#/buy-offers'"
                  class="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
            Kembali
          </button>
        </div>
      `;
  }
};

export default EditBuyOfferPage;
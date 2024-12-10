/* eslint-disable linebreak-style */
import API_ENDPOINT from '../../../globals/api-endpoint';

const BuyItemPage = {
  async render() {
    const user = JSON.parse(localStorage.getItem('user'));
    const isEdit = window.location.hash.includes('/edit/');

    return `
      <section class="pt-24 pb-16">
        <div class="container mx-auto px-4">
          <div class="max-w-3xl mx-auto">
            <div class="bg-white rounded-lg shadow-md p-8">
              <h1 class="text-2xl font-bold mb-6">${isEdit ? 'Edit' : 'Buat'} Penawaran Pembelian</h1>
              
              <form id="buyForm" class="space-y-6">
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

                <div>
                  <label class="block text-gray-700 font-medium mb-2">Lokasi Anda</label>
                  <textarea name="address" 
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-500"
                    rows="3" 
                    placeholder="Masukkan alamat lengkap"
                    required>${user?.address || ''}</textarea>
                </div>

                <div class="flex justify-end space-x-4">
                  <button type="button"
                    onclick="window.location.hash = '#/profile'"
                    class="px-6 py-2 border rounded-lg hover:bg-gray-50">
                    Batal
                  </button>
                  <button type="submit"
                    class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    ${isEdit ? 'Simpan Perubahan' : 'Simpan Penawaran'}
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
    const hash = window.location.hash;
    const isEdit = hash.includes('/edit/');

    if (isEdit) {
      const id = hash.split('/edit/')[1];
      await this._loadItemData(id);
    }

    const form = document.getElementById('buyForm');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this._handleSubmit(e, isEdit);
    });
  },

  async _loadItemData(id) {
    try {
      const response = await fetch(`${API_ENDPOINT.BUY_OFFERS}/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Gagal memuat data');

      const { data } = await response.json();
      this._populateForm(data);

    } catch (error) {
      console.error('Error:', error);
      alert('Gagal memuat data');
      window.location.hash = '#/profile';
    }
  },

  _populateForm(data) {
    const form = document.getElementById('buyForm');
    form.querySelector('[name="category"]').value = data.category;
    form.querySelector('[name="description"]').value = data.description;
    form.querySelector('[name="amount"]').value = data.amount.value;
    form.querySelector('[name="unit"]').value = data.amount.unit;
    form.querySelector('[name="price"]').value = data.price.amount;
    form.querySelector('[name="address"]').value = data.location.address;
  },

  async _handleSubmit(event, isEdit) {
    try {
      const form = event.target;
      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Menyimpan...';

      const formData = new FormData(form);
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
          coordinates: [0, 0], // You might want to get actual coordinates
          address: formData.get('address')
        }
      };

      const id = isEdit ? window.location.hash.split('/edit/')[1] : null;
      const method = isEdit ? 'PATCH' : 'POST';
      const endpoint = isEdit
        ? `${API_ENDPOINT.BUY_OFFERS}/${id}`
        : API_ENDPOINT.BUY_OFFERS;

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(buyerData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Gagal menyimpan data');
      }

      alert(`${isEdit ? 'Perubahan' : 'Penawaran'} berhasil disimpan!`);
      window.location.hash = '#/profile';

    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      // eslint-disable-next-line no-undef
      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.disabled = false;
      submitButton.innerHTML = isEdit ? 'Simpan Perubahan' : 'Simpan Penawaran';
    }
  }
};

export default BuyItemPage;
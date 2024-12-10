/* eslint-disable linebreak-style */

import API_ENDPOINT from '../../../globals/api-endpoint';

const BuyOffersPage = {
  async render() {
    return `
        <section class="pt-24 pb-12">
          <div class="container mx-auto px-4">
            <div class="flex justify-between items-center mb-8">
              <h1 class="text-3xl font-bold">Daftar Penawaran Beli</h1>
              <button onclick="window.location.hash = '#/buy-item'"
                      class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                <i class="fas fa-plus mr-2"></i>Buat Penawaran
              </button>
            </div>
  
            <div id="offersList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- Loading placeholder -->
              <div class="text-center col-span-full py-8">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
                <p class="mt-4 text-gray-600">Memuat penawaran...</p>
              </div>
            </div>
          </div>
        </section>
      `;
  },

  async afterRender() {
    try {
      const offers = await this._fetchBuyOffers();
      this._renderOffers(offers);
    } catch (error) {
      console.error('Error:', error);
      this._renderError(error.message);
    }
  },

  async _fetchBuyOffers() {
    const response = await fetch(API_ENDPOINT.BUY_OFFERS, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Gagal memuat penawaran');
    }

    const { data } = await response.json();
    return data;
  },

  _renderOffers(offers) {
    const container = document.getElementById('offersList');

    if (!offers || offers.length === 0) {
      container.innerHTML = `
          <div class="col-span-full text-center py-8">
            <p class="text-gray-500">Belum ada penawaran</p>
            <button onclick="window.location.hash = '#/buy-item'"
                    class="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
              Buat Penawaran
            </button>
          </div>
        `;
      return;
    }

    container.innerHTML = offers.map((offer) => this._createOfferCard(offer)).join('');
  },

  _createOfferCard(offer) {
    return `
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-bold">${offer.category}</h3>
            <div class="flex space-x-2">
              <span class="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm">
                ${offer.amount.value} ${offer.amount.unit}
              </span>
              ${offer.buyer._id === this._getUserId() ? `
                <div class="dropdown relative">
                  <button class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-ellipsis-v"></i>
                  </button>
                  <div class="dropdown-menu hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                    <button onclick="window.location.hash='#/buy-offer/edit/${offer._id}'"
                            class="block w-full text-left px-4 py-2 hover:bg-gray-100">
                      <i class="fas fa-edit mr-2"></i>Edit
                    </button>
                    <button onclick="confirm('Hapus penawaran ini?') && this._deleteBuyOffer('${offer._id}')"
                            class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">
                      <i class="fas fa-trash mr-2"></i>Hapus
                    </button>
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
  
          <p class="text-gray-600 mb-4">${offer.description}</p>
          
          <div class="border-t pt-4">
            <p class="text-lg font-bold text-primary-600 mb-2">
              Rp ${offer.price.amount.toLocaleString()}/${offer.amount.unit}
              ${offer.price.negotiable ? ' (Nego)' : ''}
            </p>
  
            <div class="space-y-2 text-sm text-gray-600">
              <p><i class="fas fa-user mr-2"></i>${offer.buyer.name}</p>
              <p><i class="fas fa-map-marker-alt mr-2"></i>${offer.location.address}</p>
              <p><i class="fas fa-clock mr-2"></i>Posted: ${new Date(offer.createdAt).toLocaleDateString()}</p>
            </div>
  
            <div class="flex space-x-2 mt-4">
              <a href="https://wa.me/${offer.buyer.phone?.replace(/\D/g, '')}" 
                target="_blank"
                class="flex-1 bg-green-500 text-white text-center py-2 rounded-lg hover:bg-green-600">
                <i class="fab fa-whatsapp mr-2"></i>WhatsApp
              </a>
              <a href="tel:${offer.buyer.phone}"
                class="flex-1 bg-primary-600 text-white text-center py-2 rounded-lg hover:bg-primary-700">
                <i class="fas fa-phone mr-2"></i>Telepon
              </a>
            </div>
          </div>
        </div>
      `;
  },

  _getUserId() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?._id;
  },

  async _deleteBuyOffer(offerId) {
    try {
      const response = await fetch(`${API_ENDPOINT.BUY_OFFERS}/${offerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus penawaran');
      }

      // Refresh data
      const offers = await this._fetchBuyOffers();
      this._renderOffers(offers);

    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  },

  _renderError(message) {
    const container = document.getElementById('offersList');
    container.innerHTML = `
        <div class="col-span-full text-center py-8">
          <div class="text-red-500 mb-4">
            <i class="fas fa-exclamation-circle text-4xl"></i>
          </div>
          <p class="text-gray-600">${message}</p>
          <button onclick="location.reload()"
                  class="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
            Coba Lagi
          </button>
        </div>
      `;
  }
};

export default BuyOffersPage;
/* eslint-disable linebreak-style */

import AdminLayout from './components/admin-layout';
import API_ENDPOINT from '../../../globals/api-endpoint';

const AdminBuyOffers = {
  async render() {
    return AdminLayout.render(`
          <div class="p-6 max-w-7xl mx-auto">
            <div class="bg-white rounded-lg shadow-md">
              <div class="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 class="text-xl font-semibold">Buy Offers Management</h2>
                <input type="text"
                       id="searchOffer"
                       placeholder="Search offers..."
                       class="px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-500 w-64">
              </div>
              
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="bg-gray-50 border-b border-gray-200">
                      <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-64">Buyer</th>
                      <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th class="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody id="offersTableBody" class="divide-y divide-gray-200">
                    <tr>
                      <td colspan="6" class="px-6 py-4 text-center text-gray-500">Loading offers...</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        `);
  },

  async afterRender() {
    await this._loadOffers();
    this._initializeEventListeners();
  },

  async _loadOffers() {
    try {
      const response = await fetch(API_ENDPOINT.ADMIN.GET_BUY_OFFERS, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch buy offers');
      }

      const { data } = await response.json();
      const tableBody = document.getElementById('offersTableBody');

      if (!data || data.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="7" class="px-6 py-4 text-center text-gray-500">
              No buy offers found
            </td>
          </tr>
        `;
        return;
      }

      tableBody.innerHTML = data.map((offer) => this._createOfferRow(offer)).join('');
    } catch (error) {
      console.error('Error loading buy offers:', error);
      document.getElementById('offersTableBody').innerHTML = `
        <tr>
          <td colspan="7" class="px-6 py-4 text-center text-red-500">
            Failed to load buy offers. Please try again.
          </td>
        </tr>
      `;
    }
  },

  _createOfferRow(offer) {
    // Fungsi untuk membuat Google Maps URL dari koordinat lokasi
    const createGoogleMapsUrl = (location) => {
      if (location && location.coordinates) {
        return `https://www.google.com/maps/search/?api=1&query=${location.coordinates[1]},${location.coordinates[0]}`; // [0] adalah longitude, [1] adalah latitude di GeoJSON
      }
      return '#'; // Fallback jika tidak ada koordinat
    };

    return `
      <tr class="hover:bg-gray-50">
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center space-x-3">
            <img class="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
                 src="${offer.buyer?.profileImage || 'https://via.placeholder.com/40'}"
                 alt="${offer.buyer?.name}">
            <div>
              <div class="text-sm font-medium text-gray-900">${offer.buyer?.name || 'Unknown'}</div>
              <div class="text-sm text-gray-500">${offer.buyer?.email || ''}</div>
            </div>
          </div>
        </td>
        
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-2 py-1 text-sm font-medium rounded-full bg-primary-100 text-primary-800">
            ${offer.category || '-'}
          </span>
        </td>
        
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900">
            ${offer.amount?.value || 0} ${offer.amount?.unit || 'pcs'}
          </div>
        </td>
        
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900">
            Rp ${(offer.price?.amount || 0).toLocaleString()}/${offer.amount?.unit || 'pcs'}
          </div>
        </td>
        
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-2 py-1 text-xs font-medium rounded-full ${
  offer.status === 'active'
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800'
}">
            ${offer.status || 'inactive'}
          </span>
        </td>
        
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex justify-center space-x-3">
            <button class="text-blue-600 hover:text-blue-800 transition-colors"
                    onclick="window.open('${createGoogleMapsUrl(offer.location)}', '_blank')"
                    title="Lihat lokasi di Google Maps">
              <i class="fas fa-map-marker-alt"></i>
            </button>
            <button class="text-red-600 hover:text-red-900 transition-colors"
                    data-action="delete"
                    data-offer-id="${offer._id}"
                    title="Hapus penawaran">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  },

  _initializeEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchOffer');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('#offersTableBody tr');

        rows.forEach((row) => {
          if (row.querySelector('td[colspan]')) return;
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
      });
    }

    // Delete handler
    document.getElementById('offersTableBody').addEventListener('click', async (e) => {
      const deleteBtn = e.target.closest('button[data-action="delete"]');
      if (deleteBtn) {
        await this._handleDelete(deleteBtn.dataset.offerId);
      }
    });
  },

  async _handleDelete(offerId) {
    if (!confirm('Are you sure you want to delete this buy offer?')) return;

    try {
      const response = await fetch(API_ENDPOINT.ADMIN.DELETE_BUY_OFFER(offerId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete buy offer');
      }

      await this._loadOffers();
      alert('Buy offer deleted successfully');
    } catch (error) {
      console.error('Error deleting buy offer:', error);
      alert(error.message || 'Failed to delete buy offer');
    }
  }
};

export default AdminBuyOffers;
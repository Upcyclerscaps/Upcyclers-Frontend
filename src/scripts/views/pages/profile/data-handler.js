/* eslint-disable linebreak-style */
import API_ENDPOINT from '../../../globals/api-endpoint';

const DataHandler = {
  async loadUserData() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.hash = '#/auth';
        return;
      }

      try {
        const productsResponse = await fetch(API_ENDPOINT.USER_PRODUCTS, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const productsData = await productsResponse.json();
        document.getElementById('productsCount').textContent = productsData.data?.length || 0;
      } catch (error) {
        console.error('Error fetching products:', error);
        document.getElementById('productsCount').textContent = '-';
      }

      try {
        const buyOffersResponse = await fetch(API_ENDPOINT.USER_BUY_OFFERS, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const buyOffersData = await buyOffersResponse.json();
        document.getElementById('buyOffersCount').textContent = buyOffersData.data?.length || 0;
      } catch (error) {
        console.error('Error fetching buy offers:', error);
        document.getElementById('buyOffersCount').textContent = '-';
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  },

  async deleteItem(itemId, type) {
    try {
      let endpoint = '';
      if (type === 'selling') {
        endpoint = `${API_ENDPOINT.DELETE_PRODUCT(itemId)}`;
      } else {
        endpoint = `${API_ENDPOINT.BUY_OFFERS}/${itemId}`;
      }

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Gagal menghapus item. Silakan coba lagi.');
    }
  }
};

export default DataHandler;
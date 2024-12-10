/* eslint-disable linebreak-style */
/* eslint-disable linebreak-style */
import API_ENDPOINT from '../globals/api-endpoint';

const ItemService = {
  async addSellItem(userId, itemData) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Unauthorized');
    }

    const response = await fetch(API_ENDPOINT.ADD_SELL_ITEM, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(itemData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add sell item');
    }

    return await response.json();
  },

  async addBuyItem(userId, itemData) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Unauthorized');
    }

    const response = await fetch(API_ENDPOINT.ADD_BUY_ITEM, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(itemData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add buy item');
    }

    return await response.json();
  },

  async updateSellItemStock(userId, itemId, newStock) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Unauthorized');
    }

    const response = await fetch(API_ENDPOINT.UPDATE_SELL_ITEM_STOCK(itemId), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ stock: newStock })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update stock');
    }

    return await response.json();
  },

  async updateBuyItemAmount(userId, itemId, amount) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Unauthorized');
    }

    const response = await fetch(API_ENDPOINT.UPDATE_BUY_ITEM_AMOUNT(itemId), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ amount })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update amount');
    }

    return await response.json();
  },

  async findNearbySellers(coordinates, category, radius = 5) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Silakan login terlebih dahulu');
      }

      const params = new URLSearchParams({
        longitude: coordinates[0],
        latitude: coordinates[1],
        category: category || '',
        radius: radius || 5
      });

      const response = await fetch(`${API_ENDPOINT.FIND_NEARBY_SELLERS}?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Gagal mencari penjual terdekat');
      }

      const result = await response.json();
      return {
        status: 'success',
        data: result.data || [] // Pastikan selalu mengembalikan array
      };

    } catch (error) {
      console.error('Error finding nearby sellers:', error);
      throw error;
    }
  },

  async findNearbyBuyers(coordinates, category, radius = 5) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Silakan login terlebih dahulu');
    }

    const params = new URLSearchParams({
      longitude: coordinates[0],
      latitude: coordinates[1],
      category,
      radius
    });

    const response = await fetch(`${API_ENDPOINT.FIND_NEARBY_BUYERS}?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Gagal mencari pembeli terdekat');
    }

    return await response.json();
  }
};

export default ItemService;
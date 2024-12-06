/* eslint-disable linebreak-style */
import API_ENDPOINT from '../globals/api-endpoint';

const ItemService = {
  async addSellItem(itemData, token) {
    const response = await fetch(API_ENDPOINT.ADD_SELL_ITEM, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(itemData)
    });

    const responseJson = await response.json();
    if (!response.ok) {
      throw new Error(responseJson.message || 'Failed to add sell item');
    }
    return responseJson.data;
  },

  async addBuyItem(itemData, token) {
    const response = await fetch(API_ENDPOINT.ADD_BUY_ITEM, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(itemData)
    });

    const responseJson = await response.json();
    if (!response.ok) {
      throw new Error(responseJson.message || 'Failed to add buy item');
    }
    return responseJson.data;
  },

  async getAllProducts() {
    try {
      const response = await fetch(API_ENDPOINT.GET_PRODUCTS, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const responseJson = await response.json();
      if (!response.ok) {
        throw new Error(responseJson.message || 'Failed to get products');
      }
      return responseJson;
    } catch (error) {
      console.error('Error in getAllProducts:', error);
      throw error;
    }
  },


  async updateSellItemStock(itemId, newStock, token) {
    const response = await fetch(API_ENDPOINT.UPDATE_SELL_ITEM_STOCK(itemId), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ stock: newStock })
    });

    const responseJson = await response.json();
    if (!response.ok) {
      throw new Error(responseJson.message || 'Failed to update stock');
    }
    return responseJson.data;
  },

  async updateBuyItemAmount(itemId, amount, token) {
    const response = await fetch(API_ENDPOINT.UPDATE_BUY_ITEM_AMOUNT(itemId), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ amount })
    });

    const responseJson = await response.json();
    if (!response.ok) {
      throw new Error(responseJson.message || 'Failed to update amount');
    }
    return responseJson.data;
  },

  async findNearbySellers(coordinates, category, radius) {
    const params = new URLSearchParams({
      longitude: coordinates[0],
      latitude: coordinates[1],
      category,
      radius
    });

    const response = await fetch(`${API_ENDPOINT.FIND_NEARBY_SELLERS}?${params}`);
    const responseJson = await response.json();

    if (!response.ok) {
      throw new Error(responseJson.message || 'Failed to find nearby sellers');
    }
    return responseJson.data;
  },

  async findNearbyBuyers(coordinates, category, radius) {
    const params = new URLSearchParams({
      longitude: coordinates[0],
      latitude: coordinates[1],
      category,
      radius
    });

    const response = await fetch(`${API_ENDPOINT.FIND_NEARBY_BUYERS}?${params}`);
    const responseJson = await response.json();

    if (!response.ok) {
      throw new Error(responseJson.message || 'Failed to find nearby buyers');
    }
    return responseJson.data;
  }
};

export default ItemService;
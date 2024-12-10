/* eslint-disable linebreak-style */

import API_ENDPOINT from '../globals/api-endpoint';

const ProductService = {
  async getAllProducts() {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(API_ENDPOINT.GET_PRODUCTS, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch products');
      }

      const responseJson = await response.json();
      return {
        status: 'success',
        data: responseJson.data || []
      };

    } catch (error) {
      console.error('Error getting products:', error);
      return {
        status: 'error',
        data: []
      };
    }
  },

  async createProduct(productData, token) {
    try {
      const response = await fetch(API_ENDPOINT.CREATE_PRODUCT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      const data = await response.json();
      return data.data;

    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  async uploadImage(file, token) {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(API_ENDPOINT.UPLOAD_IMAGE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return data.data.url;

    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
};

export default ProductService;
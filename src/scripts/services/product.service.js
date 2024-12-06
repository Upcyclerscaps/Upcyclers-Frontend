/* eslint-disable linebreak-style */
import API_ENDPOINT from '../globals/api-endpoint';

const ProductService = {
  async getAllProducts() {
    try {
      const response = await fetch(API_ENDPOINT.GET_PRODUCTS);
      const responseJson = await response.json();

      console.log('Raw product data:', responseJson);

      if (!response.ok) {
        throw new Error(responseJson.message);
      }

      return responseJson;
    } catch (error) {
      console.error('Error getting products:', error);
      throw error;
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

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.message || 'Failed to create product');
      }

      return responseJson.data;
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
      return data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
};

export default ProductService;
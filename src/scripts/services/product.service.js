/* eslint-disable linebreak-style */
/* eslint-disable camelcase */

import API_ENDPOINT from '../globals/api-endpoint';

const ProductService = {
  async createProduct(formData, token) {
    try {
      // Upload images first
      const imageUrls = await this._uploadImages(formData, token);

      // Prepare product data
      const productData = {
        name: formData.get('nama_barang'),
        category: formData.get('kategori'),
        description: formData.get('deskripsi'),
        price: parseInt(formData.get('harga')),
        quantity: `${formData.get('jumlah')} ${formData.get('satuan')}`,
        location: {
          type: 'Point',
          coordinates: [
            parseFloat(formData.get('longitude')),
            parseFloat(formData.get('latitude'))
          ],
          address: formData.get('alamat')
        },
        images: imageUrls,
        contactInfo: {
          name: formData.get('nama_lengkap'),
          phone: formData.get('telepon')
        },
        city: formData.get('city'),
        postalCode: formData.get('postalCode')
      };

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

  async _uploadImages(formData, token) {
    const imageUrls = [];

    // Upload main image
    const mainImage = formData.get('mainImage');
    if (mainImage) {
      const mainImageUrl = await this._uploadSingleImage(mainImage, token);
      imageUrls.push({
        url: mainImageUrl,
        is_primary: true
      });
    }

    // Upload additional images
    for (let i = 0; i < 4; i++) {
      const additionalImage = formData.get(`additionalImage${i}`);
      if (additionalImage) {
        const imageUrl = await this._uploadSingleImage(additionalImage, token);
        imageUrls.push({
          url: imageUrl,
          is_primary: false
        });
      }
    }

    return imageUrls;
  },

  async _uploadSingleImage(file, token) {
    const imageFormData = new FormData();
    imageFormData.append('image', file);

    const response = await fetch(API_ENDPOINT.UPLOAD_IMAGE, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: imageFormData
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  }
};

export default ProductService;
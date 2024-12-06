/* eslint-disable linebreak-style */
/* eslint-disable camelcase */

import ProductService from '../../../services/product.service';
import Validator from './validator';

const FormHandler = {
  initialize() {
    this._initializeForm();
    this._populateUserData();
  },

  _initializeForm() {
    const form = document.getElementById('sellForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this._handleSubmit(e);
    });
  },

  _populateUserData() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    const namaLengkapInput = document.querySelector('input[name="nama_lengkap"]');
    const teleponInput = document.querySelector('input[name="telepon"]');
    const alamatInput = document.querySelector('textarea[name="alamat"]');
    const cityInput = document.querySelector('input[name="city"]');
    const postalCodeInput = document.querySelector('input[name="postalCode"]');

    if (namaLengkapInput) namaLengkapInput.value = user.name || '';
    if (teleponInput) teleponInput.value = user.phone || '';
    if (alamatInput) alamatInput.value = user.address || '';
    if (cityInput) cityInput.value = user.city || '';
    if (postalCodeInput) postalCodeInput.value = user.postalCode || '';

    // Set initial location if user has one
    if (user.latitude && user.longitude) {
      const latitudeInput = document.getElementById('latitude');
      const longitudeInput = document.getElementById('longitude');

      if (latitudeInput) latitudeInput.value = user.latitude;
      if (longitudeInput) longitudeInput.value = user.longitude;
    }
  },

  async _handleSubmit(event) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.hash = '#/auth';
        return;
      }

      const form = event.target;
      const formData = new FormData(form);

      // Validate form
      const validation = Validator.validateForm(formData);
      if (!validation.isValid) {
        alert(validation.errors[0]);
        return;
      }

      // Show loading state
      const submitButton = form.querySelector('button[type="submit"]');
      this._setLoadingState(submitButton, true);

      // Upload image first if exists
      let imageUrl = null;
      const mainImage = formData.get('mainImage');
      if (mainImage) {
        imageUrl = await ProductService.uploadImage(mainImage, token);
      }

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
        images: imageUrl ? [{ url: imageUrl, is_primary: true }] : [],
        city: formData.get('city'),
        postalCode: formData.get('postalCode')
      };

      // Create product
      const result = await ProductService.createProduct(productData, token);
      console.log('Product created:', result);

      // Show success message and redirect
      alert('Produk berhasil ditambahkan!');
      window.location.hash = '#/profile';

    } catch (error) {
      console.error('Error submitting form:', error);
      alert(error.message || 'Gagal menambahkan produk. Silakan coba lagi.');

    } finally {
      const submitButton = document.querySelector('button[type="submit"]');
      this._setLoadingState(submitButton, false);
    }
  },

  _setLoadingState(button, isLoading) {
    if (!button) return;

    button.disabled = isLoading;
    button.innerHTML = isLoading ?
      '<i class="fas fa-spinner fa-spin mr-2"></i>Mengirim...' :
      'Kirim';
  }
};

export default FormHandler;
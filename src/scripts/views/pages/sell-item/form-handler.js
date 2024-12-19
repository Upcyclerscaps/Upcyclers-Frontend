/* eslint-disable linebreak-style */
/* eslint-disable camelcase */

import ProductService from '../../../services/product.service';

const FormHandler = {
  initialize() {
    this._initializeForm();
    this._populateUserData();
  },

  _initializeForm() {
    const form = document.getElementById('sellForm');
    if (!form) return;

    // Validate fields on input/change
    const inputs = form.querySelectorAll('input:not([type="hidden"]), textarea, select');
    inputs.forEach((input) => {
      input.addEventListener('input', () => this._validateField(input));
      input.addEventListener('blur', () => this._validateField(input));
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (this._validateAllFields(form)) {
        await this._handleSubmit(e);
      }
    });
  },

  _validateField(input) {
    const errorId = `${input.name}-error`;
    let errorElement = document.getElementById(errorId);

    // Create error element if doesn't exist
    if (!errorElement) {
      errorElement = document.createElement('span');
      errorElement.id = errorId;
      errorElement.className = 'text-red-500 text-sm mt-1 hidden';
      input.parentNode.appendChild(errorElement);
    }

    // Reset styling
    input.classList.remove('border-red-500');
    errorElement.classList.add('hidden');

    let isValid = true;
    let errorMessage = '';

    // Required validation
    if (input.hasAttribute('required') && !input.value.trim()) {
      isValid = false;
      errorMessage = 'Field ini wajib diisi';
    }
    // Specific validations
    else {
      switch (input.name) {
      case 'nama_barang':
        if (input.value.length < 3) {
          isValid = false;
          errorMessage = 'Nama barang minimal 3 karakter';
        }
        break;
      case 'harga':
        if (isNaN(input.value) || Number(input.value) <= 0) {
          isValid = false;
          errorMessage = 'Harga harus berupa angka positif';
        }
        break;
      case 'jumlah':
        if (isNaN(input.value) || Number(input.value) <= 0) {
          isValid = false;
          errorMessage = 'Jumlah harus berupa angka positif';
        }
        break;
      case 'deskripsi':
        if (input.value.length < 10) {
          isValid = false;
          errorMessage = 'Deskripsi minimal 10 karakter';
        }
        break;
      case 'alamat':
        if (input.value.length < 10) {
          isValid = false;
          errorMessage = 'Alamat minimal 10 karakter';
        }
        break;
      }
    }

    // Show error if invalid
    if (!isValid) {
      input.classList.add('border-red-500');
      errorElement.textContent = errorMessage;
      errorElement.classList.remove('hidden');
    }

    return isValid;
  },

  _validateAllFields(form) {
    const inputs = form.querySelectorAll('input:not([type="hidden"]), textarea, select');
    let isValid = true;

    inputs.forEach((input) => {
      if (!this._validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
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

      // Show loading state
      const submitButton = form.querySelector('button[type="submit"]');
      this._setLoadingState(submitButton, true);

      // Upload image first if exists
      let imageUrl = null;
      const mainImage = formData.get('mainImage');
      if (mainImage && mainImage.size > 0) {
        imageUrl = await ProductService.uploadImage(mainImage, token);
      }

      // Get coordinates
      const latitude = formData.get('latitude');
      const longitude = formData.get('longitude');

      if (!latitude || !longitude) {
        throw new Error('Lokasi belum dipilih. Silakan pilih lokasi di peta.');
      }

      // Prepare product data
      const productData = {
        name: formData.get('nama_barang'),
        category: formData.get('kategori'),
        description: formData.get('deskripsi'),
        price: {
          amount: parseInt(formData.get('harga')),
          negotiable: true
        },
        stock: {
          amount: parseInt(formData.get('jumlah')),
          unit: formData.get('satuan')
        },
        location: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
          address: formData.get('alamat')
        },
        images: imageUrl ? [{ url: imageUrl, is_primary: true }] : [],
        city: formData.get('city'),
        postalCode: formData.get('postalCode')
      };

      // Create product
      await ProductService.createProduct(productData, token);

      // Show success message and redirect
      this._showSuccess('Produk berhasil ditambahkan!');
      setTimeout(() => {
        window.location.hash = '#/profile';
      }, 2000);

    } catch (error) {
      console.error('Error submitting form:', error);
      this._showError(error.message || 'Gagal menambahkan produk. Silakan coba lagi.');
    } finally {
      // eslint-disable-next-line no-undef
      const submitButton = form.querySelector('button[type="submit"]');
      this._setLoadingState(submitButton, false);
    }
  },

  _setLoadingState(button, isLoading) {
    if (!button) return;
    button.disabled = isLoading;
    button.innerHTML = isLoading ?
      '<i class="fas fa-spinner fa-spin mr-2"></i>Mengirim...' :
      'Kirim';
  },

  _showError(message) {
    const alert = this._createAlert(message, 'error');
    document.body.appendChild(alert);
  },

  _showSuccess(message) {
    const alert = this._createAlert(message, 'success');
    document.body.appendChild(alert);
  },

  _createAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `fixed top-4 left-1/2 transform -translate-x-1/2 
     px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50
     ${type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white`;

    alert.innerHTML = `
     <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
     <span>${message}</span>
     <button class="ml-4 hover:text-${type === 'error' ? 'red' : 'green'}-200">
       <i class="fas fa-times"></i>
     </button>
   `;

    // Add close handler
    alert.querySelector('button').addEventListener('click', () => alert.remove());

    // Auto remove after 5 seconds
    setTimeout(() => alert.remove(), 5000);

    return alert;
  }
};

export default FormHandler;
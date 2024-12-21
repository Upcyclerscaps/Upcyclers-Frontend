/* eslint-disable linebreak-style */
/* eslint-disable camelcase */

import API_ENDPOINT from '../../../globals/api-endpoint';
import MapHandler from './map-handler';
import TemplateCreator from './template-creator';

const StepsHandler = {
  currentStep: 1,
  totalSteps: 3,

  initialize() {
    this.resetState(); // Reset state saat inisialisasi
    this._initializeButtons();
    this._initializeForm();
    this.showStep(1);
  },

  resetState() {
    this.currentStep = 1;

    // Reset form jika ada
    const form = document.getElementById('sellForm');
    if (form) form.reset();

    // Reset image preview
    const imagePreview = document.getElementById('mainImagePreview');
    if (imagePreview) imagePreview.innerHTML = '';

    // Reset input fields
    const inputs = document.querySelectorAll('input:not([type="hidden"]), textarea, select');
    inputs.forEach((input) => {
      input.classList.remove('border-red-500');
      const errorSpan = document.getElementById(`${input.name}-error`);
      if (errorSpan) errorSpan.classList.add('hidden');
    });
  },

  _initializeForm() {
    const form = document.getElementById('sellForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (this.currentStep === this.totalSteps) {
          await this._handleSubmit(e);
        }
      });

      // Add realtime validation
      const inputs = form.querySelectorAll('input:not([type="hidden"]), textarea, select');
      inputs.forEach((input) => {
        input.addEventListener('input', () => this._validateField(input));
        input.addEventListener('blur', () => this._validateField(input));
      });
    }
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

  async _handleSubmit(form) {
    try {
      this._showLoading(true);
      this._clearErrors();

      // Validate current step
      if (!this._validateCurrentStep()) {
        this._showError('Harap lengkapi semua field yang diperlukan');
        return;
      }

      // Upload image
      const imageFile = document.querySelector('#mainImageInput').files[0];
      if (!imageFile) {
        throw new Error('Silakan pilih foto produk');
      }

      // Get coordinates
      const user = JSON.parse(localStorage.getItem('user'));
      const formData = new FormData(form);
      const latitude = document.getElementById('latitude').value || user?.latitude;
      const longitude = document.getElementById('longitude').value || user?.longitude;

      if (!latitude || !longitude) {
        throw new Error('Lokasi belum dipilih. Silakan pilih lokasi di peta.');
      }

      // Upload image to cloudinary
      const imageFormData = new FormData();
      imageFormData.append('image', imageFile);

      const uploadResponse = await fetch(API_ENDPOINT.UPLOAD_IMAGE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: imageFormData
      });

      if (!uploadResponse.ok) throw new Error('Gagal mengupload gambar');
      const uploadResult = await uploadResponse.json();
      const imageUrl = uploadResult.data.url;

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
          coordinates: [
            parseFloat(longitude),
            parseFloat(latitude)
          ],
          address: formData.get('alamat')
        },
        images: [{
          url: imageUrl,
          is_primary: true
        }]
      };

      // Send to server
      const response = await fetch(API_ENDPOINT.CREATE_PRODUCT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Gagal menyimpan produk');
      }

      this._showSuccess('Produk berhasil ditambahkan!');
      setTimeout(() => {
        window.location.hash = '#/profile';
      }, 2000);

    } catch (error) {
      console.error('Error submitting form:', error);
      this._showError(error.message || 'Terjadi kesalahan saat menyimpan produk');
    } finally {
      this._showLoading(false);
    }
  },

  _showLoading(isLoading) {
    const nextButton = document.getElementById('nextButton');
    if (nextButton) {
      nextButton.disabled = isLoading;
      nextButton.innerHTML = isLoading ?
        '<i class="fas fa-spinner fa-spin mr-2"></i>Mengirim...' :
        (this.currentStep === this.totalSteps ? 'Kirim' : 'Selanjutnya');
    }
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

    // Auto remove
    setTimeout(() => alert.remove(), 5000);

    return alert;
  },

  _clearErrors() {
    const errorElements = document.querySelectorAll('.text-red-500');
    errorElements.forEach((el) => el.classList.add('hidden'));

    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach((input) => input.classList.remove('border-red-500'));
  },

  _validateCurrentStep() {
    const currentStepEl = document.getElementById(`step${this.currentStep}`);
    if (!currentStepEl) return true;

    const inputs = currentStepEl.querySelectorAll('input:not([type="hidden"]), textarea, select');
    let isValid = true;

    inputs.forEach((input) => {
      if (!this._validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  },

  _initializeButtons() {
    const nextButton = document.getElementById('nextButton');
    const prevButton = document.getElementById('prevButton');

    if (nextButton) {
      nextButton.addEventListener('click', async () => {
        if (this.currentStep === this.totalSteps) {
          const form = document.getElementById('sellForm');
          if (form) {
            await this._handleSubmit(form);
          }
        } else if (this.currentStep < this.totalSteps) {
          // Validate current step before proceeding
          if (this._validateCurrentStep()) {
            // Khusus untuk step 1, cek gambar
            if (this.currentStep === 1) {
              const imageInput = document.querySelector('#mainImageInput');
              if (!imageInput || !imageInput.files.length) {
                this._showError('Silakan pilih foto produk');
                return;
              }
            }
            // Khusus untuk step 2, cek lokasi
            if (this.currentStep === 2) {
              const latitude = document.getElementById('latitude').value;
              const longitude = document.getElementById('longitude').value;
              if (!latitude || !longitude) {
                this._showError('Silakan pilih lokasi pada peta');
                return;
              }
            }

            this.currentStep++;
            this.showStep(this.currentStep);
          } else {
            this._showError('Harap lengkapi semua field yang diperlukan');
          }
        }
      });
    }

    if (prevButton) {
      prevButton.addEventListener('click', () => {
        if (this.currentStep > 1) {
          this.currentStep--;
          this.showStep(this.currentStep);
        }
      });
    }
  },

  showStep(step) {
    // Hide all steps
    for (let i = 1; i <= this.totalSteps; i++) {
      const stepElement = document.getElementById(`step${i}`);
      const indicator = document.getElementById(`step${i}-indicator`);

      if (stepElement && indicator) {
        if (i === step) {
          stepElement.classList.remove('hidden');
          indicator.classList.add('bg-primary-600', 'text-white');
          indicator.classList.remove('bg-gray-200', 'text-gray-600');
        } else {
          stepElement.classList.add('hidden');
          if (i < step) {
            indicator.classList.add('bg-primary-600', 'text-white');
            indicator.classList.remove('bg-gray-200', 'text-gray-600');
          } else {
            indicator.classList.remove('bg-primary-600', 'text-white');
            indicator.classList.add('bg-gray-200', 'text-gray-600');
          }
        }
      }
    }

    // Update navigation buttons
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');

    if (prevButton && nextButton) {
      if (step === 1) {
        prevButton.classList.add('hidden');
        nextButton.textContent = 'Selanjutnya';
      } else {
        prevButton.classList.remove('hidden');
        nextButton.textContent = step === this.totalSteps ? 'Kirim' : 'Selanjutnya';
      }
    }

    // Initialize map on step 2
    if (step === 2) {
      setTimeout(() => {
        MapHandler.initialize();
      }, 100);
    }

    // Update summary on step 3
    if (step === 3) {
      const form = document.getElementById('sellForm');
      const formData = new FormData(form);

      const imageUrl = document.getElementById('mainImagePreview')?.querySelector('img')?.src ||
                     document.getElementById('profileImageUrl')?.value ||
                     'https://via.placeholder.com/200';

      const summaryContainer = document.getElementById('summary-content');
      if (summaryContainer) {
        summaryContainer.innerHTML = TemplateCreator.createSummary(formData, imageUrl);
      }
    }
  }
};

export default StepsHandler;
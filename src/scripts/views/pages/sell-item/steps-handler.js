/* eslint-disable linebreak-style */
/* eslint-disable camelcase */

import API_ENDPOINT from '../../../globals/api-endpoint';

import MapHandler from './map-handler';
import TemplateCreator from './template-creator';

const StepsHandler = {
  currentStep: 1,
  totalSteps: 3,

  initialize() {
    this._initializeButtons();
    this._initializeForm();
    this.showStep(1);
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
    }
  },

  async _handleSubmit(form) {
    try {
      const nextButton = document.getElementById('nextButton');
      nextButton.disabled = true;
      nextButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Mengirim...';

      // Ambil data user dari localStorage
      const user = JSON.parse(localStorage.getItem('user'));

      // Upload image ke Cloudinary
      const imageFile = document.querySelector('#mainImageInput').files[0];
      if (!imageFile) {
        throw new Error('Silakan pilih foto produk');
      }

      let imageUrl = '';
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
      imageUrl = uploadResult.data.url;

      // Get coordinates from form or user data
      const formData = new FormData(form);
      const latitude = document.getElementById('latitude').value || user?.latitude;
      const longitude = document.getElementById('longitude').value || user?.longitude;

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

      console.log('Data to be sent:', productData); // Debug log

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

      alert('Produk berhasil ditambahkan!');
      window.location.hash = '#/profile';

    } catch (error) {
      console.error('Error submitting form:', error);
      alert(error.message || 'Terjadi kesalahan saat menyimpan produk');
    } finally {
      const nextButton = document.getElementById('nextButton');
      nextButton.disabled = false;
      nextButton.textContent = 'Kirim';
    }
  },

  _initializeButtons() {
    const nextButton = document.getElementById('nextButton');
    const prevButton = document.getElementById('prevButton');

    if (nextButton) {
      nextButton.addEventListener('click', async () => {
        // Jika di step terakhir dan klik "Kirim"
        if (this.currentStep === this.totalSteps) {
          const form = document.getElementById('sellForm');
          if (form) {
            await this._handleSubmit(form);
          }
        } else if (this.currentStep < this.totalSteps) {
          this.currentStep++;
          this.showStep(this.currentStep);
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

      // Coba ambil URL gambar dari beberapa sumber
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
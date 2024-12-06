/* eslint-disable linebreak-style */
const ImageHandler = {
  initializeImageUpload() {
    this._initMainImageUpload();
    // Remove this line since we're not using additional images yet
    // this._initAdditionalImagesUpload();
  },

  _initMainImageUpload() {
    const mainImageInput = document.getElementById('mainImageInput');
    const mainImagePreview = document.getElementById('mainImagePreview');

    mainImageInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (!this._validateImage(file)) return;
        this._previewImage(file, mainImagePreview);
      }
    });
  },

  _validateImage(file) {
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file terlalu besar. Maksimal 2MB');
      return false;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar');
      return false;
    }

    return true;
  },

  _previewImage(file, previewElement) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewElement.innerHTML = `
          <img src="${e.target.result}" class="h-full w-full object-contain" />
        `;
    };
    reader.readAsDataURL(file);
  },

  getUploadedImages(formData) {
    const images = [];
    const mainImage = formData.get('mainImage');

    if (mainImage) {
      images.push({
        file: mainImage,
        isPrimary: true
      });
    }

    return images;
  }
};

export default ImageHandler;
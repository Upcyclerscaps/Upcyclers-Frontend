/* eslint-disable linebreak-style */
const Validator = {
  validateForm(formData) {
    return {
      isValid: this._validateRequiredFields(formData) &&
                 this._validateImages(formData) &&
                 this._validateLocation(formData),
      errors: this._getErrors(formData)
    };
  },

  _validateRequiredFields(formData) {
    const requiredFields = ['nama_barang', 'kategori', 'jumlah', 'satuan', 'harga', 'deskripsi'];
    return requiredFields.every((field) => formData.get(field));
  },

  _validateImages(formData) {
    return formData.get('mainImage') !== null;
  },

  _validateLocation(formData) {
    return formData.get('latitude') &&
             formData.get('longitude') &&
             formData.get('alamat');
  },

  _getErrors(formData) {
    const errors = [];
    const requiredFields = ['nama_barang', 'kategori', 'jumlah', 'satuan', 'harga', 'deskripsi'];

    requiredFields.forEach((field) => {
      if (!formData.get(field)) {
        errors.push(`${field.replace('_', ' ')} harus diisi`);
      }
    });

    if (!formData.get('mainImage')) {
      errors.push('Foto utama produk harus diunggah');
    }

    if (!formData.get('latitude') || !formData.get('longitude') || !formData.get('alamat')) {
      errors.push('Lokasi harus dipilih');
    }

    return errors;
  }
};

export default Validator;
/* eslint-disable linebreak-style */
const TemplateCreator = {
  createSummary(formData, imageUrl) {
    return `
        <div class="bg-gray-50 p-6 rounded-lg space-y-4">
          <h4 class="font-medium">Informasi Barang</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-gray-600">Kategori:</p>
              <p class="font-medium">${formData.get('kategori') || '-'}</p>
            </div>
            <div>
              <p class="text-gray-600">Nama Barang:</p>
              <p class="font-medium">${formData.get('nama_barang') || '-'}</p>
            </div>
            <div>
              <p class="text-gray-600">Jumlah:</p>
              <p class="font-medium">${formData.get('jumlah')} ${formData.get('satuan') || '-'}</p>
            </div>
            <div>
              <p class="text-gray-600">Harga per Satuan:</p>
              <p class="font-medium">Rp ${parseInt(formData.get('harga')).toLocaleString()}/${formData.get('satuan') || '-'}</p>
            </div>
          </div>
          <div>
            <p class="text-gray-600">Deskripsi:</p>
            <p class="font-medium">${formData.get('deskripsi') || '-'}</p>
          </div>
          <div>
            <p class="text-gray-600">Foto Barang:</p>
            <img src="${imageUrl || 'https://via.placeholder.com/200'}" 
                 alt="Preview" 
                 class="w-48 h-48 object-cover rounded-lg mt-2">
          </div>
        </div>
        
        <div class="bg-gray-50 p-6 rounded-lg space-y-4">
          <h4 class="font-medium">Informasi Kontak & Lokasi</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-gray-600">Nama:</p>
              <p class="font-medium">${formData.get('nama_lengkap') || '-'}</p>
            </div>
            <div>
              <p class="text-gray-600">Telepon:</p>
              <p class="font-medium">${formData.get('telepon') || '-'}</p>
            </div>
          </div>
          <div>
            <p class="text-gray-600">Alamat:</p>
            <p class="font-medium">${formData.get('alamat') || '-'}</p>
          </div>
        </div>
      `;
  }
};

export default TemplateCreator;
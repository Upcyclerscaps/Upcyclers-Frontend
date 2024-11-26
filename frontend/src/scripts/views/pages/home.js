/* eslint-disable linebreak-style */
const Home = {
  async render() {
    const categories = await this._loadCategories();
    return `
        ${this._heroSection()}
        ${this._featureSection()}
        ${this._categorySection(categories)}
        ${this._workflowSection()}
      `;
  },

  _heroSection() {
    return `
        <section class="bg-primary-600 text-white pt-24 pb-16">
          <div class="container mx-auto px-4">
            <div class="flex flex-col md:flex-row items-center">
              <div class="md:w-1/2 mb-8 md:mb-0">
                <h1 class="text-4xl font-bold mb-4">Jual Beli Barang Rongsok Lebih Mudah</h1>
                <p class="mb-4">Platform digital yang menghubungkan penjual dan pembeli barang rongsok. Daur ulang lebih mudah, lingkungan lebih bersih.</p>
                <button 
                  onclick="window.location.hash = '#/jual-beli'"
                  class="bg-white text-primary-600 px-6 py-2 rounded-lg font-bold hover:bg-primary-100 transition-all">
                  Mulai Sekarang
                </button>
              </div>
              <div class="md:w-1/2">
                <img src="https://storage.googleapis.com/a1aa/image/BTrQiK4GAVKfOC2ZIHIxEyGejmgPmcVrMgoeyyfEZqeJf0f5JA.jpg" 
                     alt="Illustration of people recycling" 
                     class="rounded-lg shadow-xl w-full">
              </div>
            </div>
          </div>
        </section>
      `;
  },

  _featureSection() {
    return `
        <section class="py-16 bg-white">
          <div class="container mx-auto px-4">
            <h2 class="text-3xl font-bold text-center mb-12">Fitur Utama</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer"
                   onclick="window.location.hash = '#/find-collector'">
                <div class="text-primary-600 text-4xl mb-4">
                  <i class="fas fa-map-marker-alt"></i>
                </div>
                <h3 class="text-xl font-bold mb-2">Lokasi Terdekat</h3>
                <p>Temukan pengepul barang rongsok terdekat dengan lokasi Anda.</p>
              </div>
  
              <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer"
                   onclick="window.location.hash = '#/jual-beli'">
                <div class="text-primary-600 text-4xl mb-4">
                  <i class="fas fa-exchange-alt"></i>
                </div>
                <h3 class="text-xl font-bold mb-2">Transaksi Mudah</h3>
                <p>Proses jual beli yang aman dan transparan dengan sistem yang terverifikasi.</p>
              </div>
  
              <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all">
                <div class="text-primary-600 text-4xl mb-4">
                  <i class="fas fa-tag"></i>
                </div>
                <h3 class="text-xl font-bold mb-2">Harga Terbaik</h3>
                <p>Dapatkan harga terbaik untuk barang rongsok Anda.</p>
              </div>
            </div>
          </div>
        </section>
      `;
  },

  async _loadCategories() {
    const CATEGORIES = (await import('../../data/sample-categories.js')).default;
    return CATEGORIES;
  },

  _categorySection(categories) {
    return `
        <section class="bg-gray-50 py-16">
          <div class="container mx-auto px-4">
            <h2 class="text-3xl font-bold text-center mb-12">Kategori Barang</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
              ${categories.map((category) => `
                <div class="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer"
                     onclick="window.location.hash = '#/jual-beli#category=${category.id}'">
                  <img src="${category.image}" 
                       alt="${category.name}"
                       class="w-full rounded-lg mb-4 h-48 object-cover">
                  <h3 class="font-bold text-center">${category.name}</h3>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
      `;
  },

  _workflowSection() {
    return `
        <section class="py-16 bg-white">
          <div class="container mx-auto px-4">
            <h2 class="text-3xl font-bold text-center mb-12">Cara Kerja</h2>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
              ${[
    {
      step: 1,
      title: 'Daftar',
      desc: 'Buat akun Anda sebagai penjual atau pembeli',
      icon: 'fa-user-plus'
    },
    {
      step: 2,
      title: 'Pilih Kategori',
      desc: 'Pilih kategori barang rongsok yang ingin dijual/dibeli',
      icon: 'fa-list'
    },
    {
      step: 3,
      title: 'Temukan Match',
      desc: 'Temukan penjual/pembeli terdekat dengan lokasi Anda',
      icon: 'fa-handshake'
    },
    {
      step: 4,
      title: 'Transaksi',
      desc: 'Lakukan transaksi dengan aman dan mudah',
      icon: 'fa-exchange-alt'
    }
  ].map((item) => `
                <div class="text-center">
                  <div class="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas ${item.icon} text-primary-600 text-xl"></i>
                  </div>
                  <h3 class="font-bold mb-2">${item.title}</h3>
                  <p class="text-gray-600">${item.desc}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
      `;
  },

  async afterRender() {
    // Check if there's a category filter in URL
    const hash = window.location.hash;
    if (hash.includes('#category=')) {
      const category = hash.split('=')[1];
      window.location.hash = `#/jual-beli#category=${category}`;
    }
  }
};

export default Home;
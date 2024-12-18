/* eslint-disable linebreak-style */
const Home = {
  async render() {
    return `
      <!-- Hero Section -->
      <div class="relative bg-primary-800 text-white py-16 md:py-24">
        <div class="container mx-auto px-4">
          <div class="flex flex-col md:flex-row items-center justify-between">
            <div class="md:w-1/2 mb-8 md:mb-0">
              <h1 class="text-3xl md:text-4xl font-bold mb-4">Platform Jual Beli Barang Rongsok</h1>
              <p class="text-lg mb-6">Bantu masyarakat dengan mengoptimalkan pemanfaatan sampah melalui daur ulang.</p>
              <a href="#/jual-beli" class="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-primary-50 transition">
                Mulai Sekarang
              </a>
            </div>
            <div class="md:w-1/2">
              <img src="https://storage.googleapis.com/a1aa/image/BTrQiK4GAVKfOC2ZIHIxEyGejmgPmcVrMgoeyyfEZqeJf0f5JA.jpg" alt="Hero" class="rounded-lg shadow-lg">
            </div>
          </div>
        </div>
      </div>

      <!-- Pentingnya Daur Ulang Section -->
      <div class="py-16 bg-white">
        <div class="container mx-auto px-4">
          <h2 class="text-2xl md:text-3xl font-bold text-center mb-12">Mengapa Daur Ulang Penting?</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="p-6 bg-gray-50 rounded-lg">
              <i class="fas fa-leaf text-4xl text-green-500 mb-4"></i>
              <h3 class="text-xl font-semibold mb-3">Melestarikan Lingkungan</h3>
              <p class="text-gray-600">Mengurangi jumlah sampah di TPA dan mencegah kerusakan lingkungan akibat penumpukan sampah yang tidak terkelola.</p>
            </div>
            <div class="p-6 bg-gray-50 rounded-lg">
              <i class="fas fa-recycle text-4xl text-blue-500 mb-4"></i>
              <h3 class="text-xl font-semibold mb-3">Menghemat Sumber Daya</h3>
              <p class="text-gray-600">Memaksimalkan penggunaan material yang sudah ada, mengurangi kebutuhan sumber daya baru dan energi produksi.</p>
            </div>
            <div class="p-6 bg-gray-50 rounded-lg">
              <i class="fas fa-hands-helping text-4xl text-purple-500 mb-4"></i>
              <h3 class="text-xl font-semibold mb-3">Memberdayakan Masyarakat</h3>
              <p class="text-gray-600">Menciptakan peluang ekonomi bagi pemulung dan pengepul sambil mengedukasi pentingnya pengelolaan sampah.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistik Section -->
      <div class="py-16 bg-gray-50">
        <div class="container mx-auto px-4">
          <h2 class="text-2xl md:text-3xl font-bold text-center mb-12">Dampak Sampah di Indonesia</h2>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-600 mb-2">67.8 Juta</div>
              <p class="text-gray-600">Ton sampah per tahun</p>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-600 mb-2">11.6%</div>
              <p class="text-gray-600">Sampah didaur ulang</p>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-600 mb-2">72%</div>
              <p class="text-gray-600">Sampah berakhir di TPA</p>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-600 mb-2">13%</div>
              <p class="text-gray-600">Sampah tidak terkelola</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="py-16 bg-primary-800 text-white">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-2xl md:text-3xl font-bold mb-6">Mari Bergabung dalam Gerakan Daur Ulang</h2>
          <p class="text-lg mb-8 max-w-2xl mx-auto">Setiap tindakan kecil untuk mendaur ulang sampah memiliki dampak besar bagi lingkungan. Mulai dari diri sendiri, untuk Indonesia yang lebih bersih.</p>
          <div class="flex flex-col md:flex-row justify-center gap-4">
            <a href="#/jual-beli" class="bg-white text-primary-600 px-8 py-3 rounded-lg font-medium hover:bg-primary-50 transition">
              Jual Barang Bekas
            </a>
            <a href="#/find-collector" class="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition">
              Temukan Pengepul
            </a>
          </div>
        </div>
      </div>
    `;
  },

  async afterRender() {
    // Add any necessary event listeners
  }
};

export default Home;
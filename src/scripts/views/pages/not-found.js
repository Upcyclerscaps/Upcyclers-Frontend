/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */
const NotFound = {
  async render() {
    return `
        <div class="min-h-screen pt-24 pb-12 flex flex-col items-center">
          <div class="container mx-auto px-4 flex-grow flex items-center justify-center">
            <div class="max-w-lg w-full text-center">
              <div class="mb-8">
                <h1 class="text-9xl font-bold text-primary-600">404</h1>
                <div class="bg-primary-100 text-primary-600 text-xl font-semibold px-4 py-2 rounded-lg inline-block mt-4">
                  Halaman Tidak Ditemukan
                </div>
              </div>
              
              <p class="text-gray-600 mb-8">
                Maaf, halaman yang Anda cari tidak ditemukan atau telah dipindahkan. 
                Silakan kembali ke halaman utama atau coba pencarian lain.
              </p>
              
              <div class="space-y-4">
                <button 
                  onclick="window.location.hash = '#/'"
                  class="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-all w-full md:w-auto"
                >
                  <i class="fas fa-home mr-2"></i>
                  Kembali ke Beranda
                </button>
                
                <div class="flex flex-col md:flex-row justify-center gap-4 mt-4">
                  <button 
                    onclick="window.location.hash = '#/jual-beli'"
                    class="text-primary-600 hover:text-primary-700 font-medium transition-all"
                  >
                    <i class="fas fa-store mr-2"></i>
                    Jual Beli
                  </button>
                  
                  <button 
                    onclick="window.location.hash = '#/find-collector'"
                    class="text-primary-600 hover:text-primary-700 font-medium transition-all"
                  >
                    <i class="fas fa-map-marker-alt mr-2"></i>
                    Temukan Pengepul
                  </button>
                  
                  <button 
                    onclick="window.location.hash = '#/about'"
                    class="text-primary-600 hover:text-primary-700 font-medium transition-all"
                  >
                    <i class="fas fa-info-circle mr-2"></i>
                    Tentang Kami
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
  },
  
  async afterRender() {
    // Add any additional functionality if needed
  }
};
  
export default NotFound;
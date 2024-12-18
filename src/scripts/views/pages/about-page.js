/* eslint-disable linebreak-style */
const About = {
  async render() {
    return `
        <!-- Header Section -->
        <div class="relative bg-primary-800 text-white py-16">
          <div class="container mx-auto px-4">
            <h1 class="text-3xl md:text-4xl font-bold mb-4 text-center">Tentang Upcyclers</h1>
            <p class="text-lg text-center max-w-3xl mx-auto">Platform yang menghubungkan penjual dan pembeli barang bekas untuk mendukung ekonomi sirkular dan pelestarian lingkungan.</p>
          </div>
        </div>
  
        <!-- Mission Section -->
        <div class="py-16 bg-white">
          <div class="container mx-auto px-4">
            <div class="max-w-2xl mx-auto"> <!-- Tambahkan wrapper dengan max-width dan margin auto -->
              <h2 class="text-2xl md:text-3xl font-bold mb-6 text-center">Misi Kami</h2>
              <div class="space-y-4">
                <div class="flex items-start">
                  <i class="fas fa-check-circle text-primary-600 mt-1 mr-3"></i>
                  <p class="text-gray-600">Memudahkan proses jual beli barang bekas antara masyarakat dan pengepul</p>
                </div>
                <div class="flex items-start">
                  <i class="fas fa-check-circle text-primary-600 mt-1 mr-3"></i>
                  <p class="text-gray-600">Mendorong praktik daur ulang untuk mengurangi sampah di TPA</p>
                </div>
                <div class="flex items-start">
                  <i class="fas fa-check-circle text-primary-600 mt-1 mr-3"></i>
                  <p class="text-gray-600">Memberdayakan pemulung dan pengepul melalui platform digital</p>
                </div>
                <div class="flex items-start">
                  <i class="fas fa-check-circle text-primary-600 mt-1 mr-3"></i>
                  <p class="text-gray-600">Menciptakan ekosistem daur ulang yang berkelanjutan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
  
      <section class="pt-24 pb-12">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12">
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Tim Pengembang</h1>
            <p class="text-gray-600 max-w-2xl mx-auto">Tim yang berdedikasi dalam mengembangkan platform Upcyclers untuk mendukung ekonomi sirkular dan pengelolaan sampah yang lebih baik.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <!-- Zaidan -->
            <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div class="p-4 text-center">
                <img src="https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Zaidan" 
                     alt="Zaidan Rivandani" 
                     class="w-32 h-32 mx-auto rounded-full mb-4 bg-gray-100">
                <h3 class="font-bold text-lg text-gray-900">Zaidan Rivandani</h3>
                <p class="text-primary-600 mb-2">Front-End Developer</p>
                <p class="text-gray-500 text-sm mb-4">F0097YB69</p>
                <div class="flex justify-center space-x-3">
                  <a href="#" class="text-gray-400 hover:text-primary-600">
                    <i class="fab fa-github text-xl"></i>
                  </a>
                  <a href="#" class="text-gray-400 hover:text-primary-600">
                    <i class="fab fa-linkedin text-xl"></i>
                  </a>
                </div>
              </div>
            </div>

            <!-- Shahril -->
            <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div class="p-4 text-center">
                <img src="https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Shahril" 
                     alt="Shahril Wahyu Nugroho" 
                     class="w-32 h-32 mx-auto rounded-full mb-4 bg-gray-100">
                <h3 class="font-bold text-lg text-gray-900">Shahril Wahyu Nugroho</h3>
                <p class="text-primary-600 mb-2">Back-End Developer</p>
                <p class="text-gray-500 text-sm mb-4">F0097YB63</p>
                <div class="flex justify-center space-x-3">
                  <a href="#" class="text-gray-400 hover:text-primary-600">
                    <i class="fab fa-github text-xl"></i>
                  </a>
                  <a href="#" class="text-gray-400 hover:text-primary-600">
                    <i class="fab fa-linkedin text-xl"></i>
                  </a>
                </div>
              </div>
            </div>

            <!-- Herdiansyah -->
            <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div class="p-4 text-center">
                <img src="https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Herdiansyah" 
                     alt="Herdiansyah Ramadhana" 
                     class="w-32 h-32 mx-auto rounded-full mb-4 bg-gray-100">
                <h3 class="font-bold text-lg text-gray-900">Herdiansyah Ramadhana</h3>
                <p class="text-primary-600 mb-2">Back-End Developer</p>
                <p class="text-gray-500 text-sm mb-4">F1287YB32</p>
                <div class="flex justify-center space-x-3">
                  <a href="#" class="text-gray-400 hover:text-primary-600">
                    <i class="fab fa-github text-xl"></i>
                  </a>
                  <a href="#" class="text-gray-400 hover:text-primary-600">
                    <i class="fab fa-linkedin text-xl"></i>
                  </a>
                </div>
              </div>
            </div>

            <!-- Dimas -->
            <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div class="p-4 text-center">
                <img src="https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Dimas" 
                     alt="Dimas Julian" 
                     class="w-32 h-32 mx-auto rounded-full mb-4 bg-gray-100">
                <h3 class="font-bold text-lg text-gray-900">Dimas Julian</h3>
                <p class="text-primary-600 mb-2">Front-End Developer</p>
                <p class="text-gray-500 text-sm mb-4">F1567YB21</p>
                <div class="flex justify-center space-x-3">
                  <a href="#" class="text-gray-400 hover:text-primary-600">
                    <i class="fab fa-github text-xl"></i>
                  </a>
                  <a href="#" class="text-gray-400 hover:text-primary-600">
                    <i class="fab fa-linkedin text-xl"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  async afterRender() {
    // Jika perlu tambahkan event listeners atau logika lain setelah render
  }
};

export default About;
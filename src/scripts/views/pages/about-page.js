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
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 class="text-2xl md:text-3xl font-bold mb-6">Misi Kami</h2>
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
        </div>
  
        <!-- Team Section -->
        <div class="py-16 bg-gray-50">
          <div class="container mx-auto px-4">
            <h2 class="text-2xl md:text-3xl font-bold text-center mb-12">Tim Pengembang</h2>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
              <!-- Team Member 1 -->
              <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <img src="https://via.placeholder.com/300" alt="John Doe" class="w-full h-48 object-cover">
                <div class="p-4">
                  <h3 class="font-semibold text-lg mb-1">John Doe</h3>
                  <p class="text-gray-600 text-sm mb-3">Full Stack Developer</p>
                  <p class="text-gray-500 text-sm">Bertanggung jawab atas pengembangan backend dan database management.</p>
                </div>
                <div class="px-4 pb-4">
                  <div class="flex space-x-3">
                    <a href="#" class="text-gray-400 hover:text-primary-600">
                      <i class="fab fa-github"></i>
                    </a>
                    <a href="#" class="text-gray-400 hover:text-primary-600">
                      <i class="fab fa-linkedin"></i>
                    </a>
                  </div>
                </div>
              </div>
  
              <!-- Team Member 2 -->
              <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <img src="https://via.placeholder.com/300" alt="Jane Smith" class="w-full h-48 object-cover">
                <div class="p-4">
                  <h3 class="font-semibold text-lg mb-1">Jane Smith</h3>
                  <p class="text-gray-600 text-sm mb-3">UI/UX Designer</p>
                  <p class="text-gray-500 text-sm">Mendesain user interface dan user experience yang intuitif.</p>
                </div>
                <div class="px-4 pb-4">
                  <div class="flex space-x-3">
                    <a href="#" class="text-gray-400 hover:text-primary-600">
                      <i class="fab fa-dribbble"></i>
                    </a>
                    <a href="#" class="text-gray-400 hover:text-primary-600">
                      <i class="fab fa-behance"></i>
                    </a>
                  </div>
                </div>
              </div>
  
              <!-- Team Member 3 -->
              <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <img src="https://via.placeholder.com/300" alt="Mike Johnson" class="w-full h-48 object-cover">
                <div class="p-4">
                  <h3 class="font-semibold text-lg mb-1">Mike Johnson</h3>
                  <p class="text-gray-600 text-sm mb-3">Frontend Developer</p>
                  <p class="text-gray-500 text-sm">Mengimplementasikan desain dan fitur interaktif website.</p>
                </div>
                <div class="px-4 pb-4">
                  <div class="flex space-x-3">
                    <a href="#" class="text-gray-400 hover:text-primary-600">
                      <i class="fab fa-github"></i>
                    </a>
                    <a href="#" class="text-gray-400 hover:text-primary-600">
                      <i class="fab fa-codepen"></i>
                    </a>
                  </div>
                </div>
              </div>
  
              <!-- Team Member 4 -->
              <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <img src="https://via.placeholder.com/300" alt="Sarah Lee" class="w-full h-48 object-cover">
                <div class="p-4">
                  <h3 class="font-semibold text-lg mb-1">Sarah Lee</h3>
                  <p class="text-gray-600 text-sm mb-3">Project Manager</p>
                  <p class="text-gray-500 text-sm">Mengkoordinasi tim dan memastikan proyek berjalan sesuai rencana.</p>
                </div>
                <div class="px-4 pb-4">
                  <div class="flex space-x-3">
                    <a href="#" class="text-gray-400 hover:text-primary-600">
                      <i class="fab fa-linkedin"></i>
                    </a>
                    <a href="#" class="text-gray-400 hover:text-primary-600">
                      <i class="fab fa-twitter"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
  },

  async afterRender() {
    // Add any necessary event listeners
  }
};

export default About;
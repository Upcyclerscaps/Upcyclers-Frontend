/* eslint-disable linebreak-style */
class CustomFooter extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
          <footer class="bg-primary-800 text-white py-12 w-full min-h-full">
            <div class="container mx-auto px-4 flex flex-col h-full">
              <!-- Grid container -->
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
                <!-- About Section -->
                <div class="space-y-4">
                  <h4 class="text-xl font-bold">Upcyclers</h4>
                  <p class="text-primary-200 text-sm">
                    Platform jual beli barang rongsok digital yang menghubungkan penjual dan pembeli untuk mendukung ekonomi sirkular.
                  </p>
                  <div class="flex space-x-4 mt-4">
                    <a href="#" class="text-primary-200 hover:text-white transition-colors">
                      <i class="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" class="text-primary-200 hover:text-white transition-colors">
                      <i class="fab fa-twitter"></i>
                    </a>
                    <a href="#" class="text-primary-200 hover:text-white transition-colors">
                      <i class="fab fa-instagram"></i>
                    </a>
                  </div>
                </div>
    
                <!-- Quick Links -->
                <div class="space-y-4">
                  <h4 class="text-xl font-bold">Tautan</h4>
                  <ul class="space-y-2">
                    <li>
                      <a href="#/" class="text-primary-200 hover:text-white transition-colors">Beranda</a>
                    </li>
                    <li>
                      <a href="#/about" class="text-primary-200 hover:text-white transition-colors">Tentang Kami</a>
                    </li>
                    <li>
                      <a href="#/jual-beli" class="text-primary-200 hover:text-white transition-colors">Jual Beli</a>
                    </li>
                    <li>
                      <a href="#/find-collector" class="text-primary-200 hover:text-white transition-colors">Temukan Pengepul</a>
                    </li>
                  </ul>
                </div>
    
                <!-- Contact Info -->
                <div class="space-y-4">
                  <h4 class="text-xl font-bold">Kontak</h4>
                  <ul class="space-y-2">
                    <li class="flex items-center text-primary-200">
                      <i class="fas fa-envelope mr-2"></i>
                      info@upcyclers.id
                    </li>
                    <li class="flex items-center text-primary-200">
                      <i class="fas fa-phone mr-2"></i>
                      +62 123 4567 890
                    </li>
                    <li class="flex items-center text-primary-200">
                      <i class="fas fa-map-marker-alt mr-2"></i>
                      Jakarta, Indonesia
                    </li>
                  </ul>
                </div>
              </div>
    
              <!-- Bottom Bar - Positioned at bottom -->
              <div class="border-t border-primary-700 pt-8 mt-auto w-full">
                <div class="flex flex-col sm:flex-row justify-between items-center">
                  <div class="text-primary-200 text-sm mb-4 sm:mb-0">
                    © ${new Date().getFullYear()} Upcyclers. All rights reserved.
                  </div>
                  <div class="flex gap-4 text-sm">
                    <a href="#" class="text-primary-200 hover:text-white transition-colors">Privacy Policy</a>
                    <span class="text-primary-200">|</span>
                    <a href="#" class="text-primary-200 hover:text-white transition-colors">Terms of Service</a>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        `;
    }
  }
  
  customElements.define('footer-element', CustomFooter);
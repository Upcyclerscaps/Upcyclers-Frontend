/* eslint-disable linebreak-style */
class CustomFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
            <footer class="bg-primary-800 text-white py-12">
                <div class="container mx-auto px-4">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h4 class="text-xl font-bold mb-4">Upcyclers</h4>
                            <p class="text-primary-200">
                                Platform jual beli barang rongsok digital yang menghubungkan penjual dan pembeli.
                            </p>
                        </div>
                        <div>
                            <h4 class="text-xl font-bold mb-4">Tautan</h4>
                            <ul class="space-y-2">
                                <li>
                                    <a class="text-primary-200 hover:text-white transition-all" href="#">Beranda</a>
                                </li>
                                <li>
                                    <a class="text-primary-200 hover:text-white transition-all" href="#">Tentang Kami</a>
                                </li>
                                <li>
                                    <a class="text-primary-200 hover:text-white transition-all" href="#">Jual Beli</a>
                                </li>
                                <li>
                                    <a class="text-primary-200 hover:text-white transition-all" href="#">Kontak</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="text-xl font-bold mb-4">Kontak</h4>
                            <ul class="space-y-2">
                                <li class="flex items-center text-primary-200">
                                    <i class="fas fa-envelope mr-2"></i>
                                    info@upcyclers.id
                                </li>
                                <li class="flex items-center text-primary-200">
                                    <i class="fas fa-phone mr-2"></i>
                                    +62 123 4567 890
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="text-xl font-bold mb-4">Ikuti Kami</h4>
                            <div class="flex space-x-4">
                                <a class="text-primary-200 hover:text-white transition-all text-2xl" href="#">
                                    <i class="fab fa-facebook"></i>
                                </a>
                                <a class="text-primary-200 hover:text-white transition-all text-2xl" href="#">
                                    <i class="fab fa-twitter"></i>
                                </a>
                                <a class="text-primary-200 hover:text-white transition-all text-2xl" href="#">
                                    <i class="fab fa-instagram"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="border-t border-primary-700 mt-8 pt-8 text-center text-primary-200">
                        <p>© 2024 Upcyclers. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        `;
  }
}

customElements.define('footer-element', CustomFooter);
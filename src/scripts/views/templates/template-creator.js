/* eslint-disable linebreak-style */
/* eslint-disable indent */
export function createHeroSection() {
    return `
        <header class="bg-primary-600 text-white pt-24 pb-16">
            <div class="container mx-auto px-4">
                <div class="flex flex-col md:flex-row items-center">
                    <div class="md:w-1/2 mb-8 md:mb-0">
                        <h1 class="text-4xl font-bold mb-4">Jual Beli Barang Rongsok Lebih Mudah</h1>
                        <p class="text-lg mb-6">Platform digital yang menghubungkan penjual dan pembeli barang rongsok. Daur ulang lebih mudah, lingkungan lebih bersih.</p>
                        <button class="bg-white text-primary-600 px-6 py-3 rounded-lg font-bold hover:bg-primary-100 transition-all">Mulai Sekarang</button>
                    </div>
                    <div class="md:w-1/2">
                        <img src="https://storage.googleapis.com/a1aa/image/LD898pxpeTztGqSr9Xtad2GMgMNtOvV2BLexmnayqQoGHM0TA.jpg" alt="Illustration of people recycling and trading scrap materials" class="rounded-lg shadow-xl w-full" width="600" height="400">
                    </div>
                </div>
            </div>
        </header>
    `;
}

export function createFeaturesSection() {
    return `
        <section class="py-16 bg-white">
            <div class="container mx-auto px-4">
                <h2 class="text-3xl font-bold text-center mb-12">Fitur Utama</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all">
                        <div class="text-primary-600 text-4xl mb-4">
                            <i class="fas fa-map-marker-alt"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-2">Lokasi Terdekat</h3>
                        <p class="text-gray-600">Temukan pengepul barang rongsok terdekat dengan lokasi Anda.</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all">
                        <div class="text-primary-600 text-4xl mb-4">
                            <i class="fas fa-exchange-alt"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-2">Transaksi Mudah</h3>
                        <p class="text-gray-600">Proses jual beli yang aman dan transparan dengan sistem yang terverifikasi.</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all">
                        <div class="text-primary-600 text-4xl mb-4">
                            <i class="fas fa-tags"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-2">Harga Terbaik</h3>
                        <p class="text-gray-600">Dapatkan harga terbaik untuk barang rongsok Anda.</p>
                    </div>
                </div>
            </div>
        </section>
    `;
}

export function createCategoriesSection() {
    return `
        <section class="bg-gray-50 py-16">
            <div class="container mx-auto px-4">
                <h2 class="text-3xl font-bold text-center mb-12">Kategori Barang</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div class="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer">
                        <img src="https://storage.googleapis.com/a1aa/image/m4jf3Nghy8UJMCRowg2YsekCFiVL7mBxfkJbMdoLAzxTOYonA.jpg" alt="Scrap metal pieces" class="w-full rounded-lg mb-4" width="100" height="100">
                        <h3 class="font-bold text-center">Logam</h3>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer">
                        <img src="https://storage.googleapis.com/a1aa/image/CpTpSuQOrT7YMhOCJjSUogQCeXpuJfHn7UWgUL2a5fvOOYonA.jpg" alt="Plastic bottles and containers" class="w-full rounded-lg mb-4" width="100" height="100">
                        <h3 class="font-bold text-center">Plastik</h3>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer">
                        <img src="https://storage.googleapis.com/a1aa/image/ChBEmlLhFuZ2KZgODx51R6AFg9AXKOsJsGmty5u0DfNhDG6JA.jpg" alt="Stacks of paper and cardboard" class="w-full rounded-lg mb-4" width="100" height="100">
                        <h3 class="font-bold text-center">Kertas</h3>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer">
                        <img src="https://storage.googleapis.com/a1aa/image/1pflpeqdNrvJ003r1Wf8cCM73NPoirosGVG3YZvPzvsJOYonA.jpg" alt="Old electronic devices" class="w-full rounded-lg mb-4" width="100" height="100">
                        <h3 class="font-bold text-center">Elektronik</h3>
                    </div>
                </div>
            </div>
        </section>
    `;
}

export function createHowItWorksSection() {
    return `
        <section class="py-16 bg-white">
            <div class="container mx-auto px-4">
                <h2 class="text-3xl font-bold text-center mb-12">Cara Kerja</h2>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div class="text-center">
                        <div class="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span class="text-primary-600 text-2xl font-bold">1</span>
                        </div>
                        <h3 class="font-bold mb-2">Daftar</h3>
                        <p class="text-gray-600">Buat akun Anda sebagai penjual atau pembeli</p>
                    </div>
                    <div class="text-center">
                        <div class="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span class="text-primary-600 text-2xl font-bold">2</span>
                        </div>
                        <h3 class="font-bold mb-2">Pilih Kategori</h3>
                        <p class="text-gray-600">Pilih kategori barang rongsok yang ingin dijual/dibeli</p>
                    </div>
                    <div class="text-center">
                        <div class="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span class="text-primary-600 text-2xl font-bold">3</span>
                        </div>
                        <h3 class="font-bold mb-2">Temukan Match</h3>
                        <p class="text-gray-600">Temukan penjual/pembeli terdekat dengan lokasi Anda</p>
                    </div>
                    <div class="text-center">
                        <div class="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span class="text-primary-600 text-2xl font-bold">4</span>
                        </div>
                        <h3 class="font-bold mb-2">Transaksi</h3>
                        <p class="text-gray-600">Lakukan transaksi dengan aman dan mudah</p>
                    </div>
                </div>
            </div>
        </section>
    `;
}
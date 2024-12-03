/* eslint-disable linebreak-style */
const DetailProductPage = {
  async render(productId) {
    const ITEMS = (await import('../../data/sample-items.js')).default;
    const product = ITEMS.find((item) => item.id === productId);

    if (!product) {
      return '<h2>Product Not Found</h2>';
    }

    // Get similar products first
    const similarProducts = ITEMS
      .filter((item) => item.category === product.category && item.id !== product.id)
      .slice(0, 4);

    return `
     <section class="pt-24 pb-12">
       <div class="container mx-auto px-4">
         ${this._breadcrumbSection(product)}
         <div class="bg-white rounded-lg shadow-md p-6">
           <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
             ${this._renderProductImages(product)}
             ${this._renderProductInfo(product)}
           </div>
           ${this._renderReviews(product)}
           ${this._renderSimilarProducts(similarProducts)}
         </div>
       </div>
     </section>
   `;
  },

  _breadcrumbSection(product) {
    return `
        <div class="mb-6">
          <div class="flex items-center text-sm text-gray-600">
            <a href="#/" class="hover:text-primary-600">Beranda</a>
            <span class="mx-2">/</span>
            <a href="#/jual-beli" class="hover:text-primary-600">Jual Beli</a>
            <span class="mx-2">/</span>
            <span class="text-gray-400">${product.name}</span>
          </div>
        </div>
      `;
  },

  _renderProductImages(product) {
    return `
        <div class="space-y-4">
          <img 
            src="${product.mainImage}" 
            alt="${product.name}" 
            class="w-full rounded-lg shadow-md h-96 object-cover"
          >
          <div class="grid grid-cols-4 gap-4">
            ${product.images.map((image) => `
              <img 
                src="${image}" 
                alt="${product.name}" 
                class="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-all"
                onclick="this.parentElement.previousElementSibling.src = this.src"
              >
            `).join('')}
          </div>
        </div>
      `;
  },

  _renderProductInfo(product) {
    return `
        <div class="space-y-6">
          <div>
            <div class="flex justify-between items-start">
              <h1 class="text-3xl font-bold text-gray-900">${product.name}</h1>
              <span class="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm">
                ${product.category}
              </span>
            </div>
            <p class="text-2xl font-bold text-primary-600 mt-2">
              Rp ${product.price}${product.category === 'Elektronik' ? '/unit' : '/kg'}
            </p>
          </div>
  
          <div class="space-y-4">
            <div class="flex items-center">
              <i class="fas fa-box-open text-gray-600 w-6"></i>
              <span class="text-gray-600 ml-2">${product.quantity} tersedia</span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-map-marker-alt text-gray-600 w-6"></i>
              <span class="text-gray-600 ml-2">${product.location}</span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-clock text-gray-600 w-6"></i>
              <span class="text-gray-600 ml-2">Diposting ${product.postedTime}</span>
            </div>
          </div>
  
          <div class="border-t border-gray-200 pt-6">
            <h2 class="text-xl font-bold mb-4">Deskripsi Produk</h2>
            <p class="text-gray-700 whitespace-pre-line">${product.description}</p>
          </div>
  
          <div class="border-t border-gray-200 pt-6">
            <h2 class="text-xl font-bold mb-4">Informasi Penjual</h2>
            <div class="flex items-center space-x-4">
              <img 
                src="${product.seller.image}" 
                alt="${product.seller.name}" 
                class="w-16 h-16 rounded-full object-cover"
              >
              <div>
                <h3 class="font-bold">${product.seller.name}</h3>
                <p class="text-gray-600">Bergabung sejak ${product.seller.joinDate}</p>
                <div class="flex items-center mt-1">
                  <span class="text-yellow-400">★</span>
                  <span class="text-gray-600 ml-2">${product.seller.rating}</span>
                </div>
              </div>
            </div>
            <div class="flex space-x-4 mt-4">
              <button 
                onclick="window.open('https://wa.me/${product.seller.phone}', '_blank')"
                class="flex-1 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-all flex items-center justify-center"
              >
                <i class="fab fa-whatsapp mr-2"></i> WhatsApp
              </button>
              <button 
                onclick="window.open('tel:${product.seller.phone}')"
                class="flex-1 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-all flex items-center justify-center"
              >
                <i class="fas fa-phone mr-2"></i> Telepon
              </button>
            </div>
          </div>
        </div>
      `;
  },

  _renderReviews(product) {
    if (!product.reviews || product.reviews.length === 0) {
      return '';
    }

    return `
        <div class="mt-12">
          <h2 class="text-2xl font-bold mb-6">Ulasan Produk</h2>
          <div class="space-y-6">
            ${product.reviews.map((review) => `
              <div class="bg-gray-50 p-4 rounded-lg shadow-md">
                <div class="flex items-center mb-2">
                  <img 
                    src="${review.image}" 
                    alt="${review.name}" 
                    class="w-10 h-10 rounded-full object-cover"
                  >
                  <div class="ml-4">
                    <h3 class="font-bold">${review.name}</h3>
                    <div class="flex items-center">
                      <span class="text-yellow-400">★</span>
                      <span class="text-gray-600 ml-2">${review.rating}</span>
                    </div>
                  </div>
                </div>
                <p class="text-gray-700">${review.comment}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
  },

  _renderSimilarProducts(similarProducts) {
    if (!similarProducts || similarProducts.length === 0) {
      return '';
    }

    return `
      <div class="mt-12">
        <h2 class="text-2xl font-bold mb-6">Produk Serupa</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          ${similarProducts.map((item) => `
            <div 
              class="bg-white rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer"
              onclick="window.location.hash = '#/product?id=${item.id}'"
            >
              <img 
                src="${item.image}" 
                alt="${item.name}"
                class="w-full h-48 object-cover rounded-t-lg"
              >
              <div class="p-4">
                <div class="flex justify-between items-start mb-2">
                  <h3 class="font-bold text-lg">${item.name}</h3>
                  <span class="bg-primary-100 text-primary-600 px-2 py-1 rounded-full text-sm">
                    ${item.category}
                  </span>
                </div>
                <p class="text-gray-600 mb-2">${item.quantity} tersedia</p>
                <p class="text-gray-600 mb-3">${item.location}</p>
                <div class="flex justify-between items-center">
                  <span class="text-lg font-bold text-primary-600">
                    Rp ${item.price}${item.category === 'Elektronik' ? '/unit' : '/kg'}
                  </span>
                  <button class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                    Detail
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  async afterRender() {
    // Add event listeners for image gallery if needed
    const thumbnails = document.querySelectorAll('.product-thumbnail');
    const mainImage = document.querySelector('.product-main-image');

    thumbnails.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        mainImage.src = thumb.src;
      });
    });
  }
};

export default DetailProductPage;
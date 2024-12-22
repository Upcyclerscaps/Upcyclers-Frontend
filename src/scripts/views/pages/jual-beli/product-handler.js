/* eslint-disable linebreak-style */
import TemplateCreator from './template-creator';

const ProductHandler = {
  initialize(dataHandler) {
    this.dataHandler = dataHandler;
    this.productsContainer = document.querySelector('.products-grid');
  },

  async renderProducts() {
    try {
      // Get products and ensure it's an array
      const products = this.dataHandler.getProducts() || [];

      if (!this.productsContainer) {
        console.error('Products container not found');
        return;
      }

      if (!Array.isArray(products) || products.length === 0) {
        this.productsContainer.innerHTML = TemplateCreator.createNoProductsFound();
        return;
      }

      this.productsContainer.innerHTML = products
        .map((product) => TemplateCreator.createProductCard(product))
        .join('');

    } catch (error) {
      console.error('Error rendering products:', error);
      this._showError('Gagal menampilkan produk');
    }
  },

  filterProducts(filters) {
    const filteredProducts = this.dataHandler.filterProducts(filters);

    if (this.productsContainer) {
      if (filteredProducts.length === 0) {
        this.productsContainer.innerHTML = TemplateCreator.createNoProductsFound();
        return;
      }

      this.productsContainer.innerHTML = filteredProducts
        .map((product) => TemplateCreator.createProductCard(product))
        .join('');
    }
  },

  async refreshProducts() {
    try {
      await this.dataHandler.refreshProducts();
      await this.renderProducts();
    } catch (error) {
      console.error('Error refreshing products:', error);
      this._showError('Gagal memperbarui data produk');
    }
  },

  _showError(message) {
    if (this.productsContainer) {
      this.productsContainer.innerHTML = `
        <div class="col-span-full text-center py-8">
          <p class="text-red-500">${message}</p>
          <button 
            onclick="window.location.reload()"
            class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            Coba Lagi
          </button>
        </div>
      `;
    }
  }
};

export default ProductHandler;
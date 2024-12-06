/* eslint-disable linebreak-style */
import DataHandler from './data-handler';
import FilterHandler from './filter-handler';
import ProductHandler from './product-handler';
import TemplateCreator from './template-creator';

const JualBeliPage = {
  async render() {
    return `
      <section class="pt-24 pb-8">
        <div class="container mx-auto px-4">
          ${TemplateCreator.createFilters()}
          <div class="products-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <!-- Products will be rendered here -->
          </div>
        </div>
      </section>
    `;
  },

  async afterRender() {
    try {
      // Initialize handlers
      ProductHandler.initialize(DataHandler);
      FilterHandler.initialize(ProductHandler);

      // Fetch initial data
      await DataHandler.fetchProducts();

      // Render products
      await ProductHandler.renderProducts();

      // Check URL for filters
      FilterHandler.checkUrlFilters();

    } catch (error) {
      console.error('Error initializing page:', error);
    }
  }
};

export default JualBeliPage;
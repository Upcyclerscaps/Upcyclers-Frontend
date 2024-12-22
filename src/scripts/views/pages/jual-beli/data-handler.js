/* eslint-disable linebreak-style */
// eslint-disable-next-line no-unused-vars
import ItemService from '../../../services/item.service';
import ProductService from '../../../services/product.service';

const DataHandler = {
  _products: [],

  async fetchProducts() {
    try {
      const response = await ProductService.getAllProducts();
      this._products = Array.isArray(response.data) ? response.data : [];
      return this._products;
    } catch (error) {
      console.error('Error fetching products:', error);
      this._products = []; // Set empty array if error
      throw error;
    }
  },

  getProducts() {
    return this._products || [];  // Pastikan selalu return array
  },

  filterProducts(filters) {
    if (!Array.isArray(this._products)) return [];

    return this._products.filter((product) => {
      const matchesSearch = !filters.search ||
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase());

      const matchesCategory = !filters.category ||
        product.category === filters.category;

      const matchesLocation = !filters.location ||
        product.location.address.toLowerCase().includes(filters.location.toLowerCase());

      const matchesPrice = product.price.amount >= filters.priceMin &&
        (filters.priceMax === Infinity || product.price.amount <= filters.priceMax);

      return matchesSearch && matchesCategory && matchesLocation && matchesPrice;
    });
  },

  async refreshProducts() {
    await this.fetchProducts();
  }
};

export default DataHandler;
/* eslint-disable linebreak-style */
import ItemService from '../../../services/item.service';

const DataHandler = {
  _products: [],

  async fetchProducts() {
    try {
      const response = await ItemService.getAllProducts();
      // Pastikan response.data adalah array
      this._products = Array.isArray(response.data) ? response.data : [];
      console.log('Fetched products:', this._products); // Debug
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
      const matchesSearch = product.name.toLowerCase().includes(filters.search) ||
                           product.description.toLowerCase().includes(filters.search);

      const matchesCategory = !filters.category || product.category === filters.category;

      const matchesLocation = !filters.location ||
                             product.location.address.toLowerCase().includes(filters.location);

      const matchesPrice = product.price >= filters.priceMin &&
                          (filters.priceMax === Infinity || product.price <= filters.priceMax);

      return matchesSearch && matchesCategory && matchesLocation && matchesPrice;
    });
  },

  async refreshProducts() {
    await this.fetchProducts();
  }
};

export default DataHandler;
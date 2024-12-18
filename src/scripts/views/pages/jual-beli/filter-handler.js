/* eslint-disable linebreak-style */
const FilterHandler = {
  initialize(productHandler) {
    this.productHandler = productHandler;
    this._initializeForm();
    this._initializeRealTimeFilter();
  },

  _initializeForm() {
    const form = document.getElementById('filterForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this._applyFilters();
      });
    }
  },

  _initializeRealTimeFilter() {
    const inputs = ['searchInput', 'categoryFilter', 'priceMin', 'priceMax'];
    inputs.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('input', () => this._applyFilters());
      }
    });
  },

  _applyFilters() {
    const filters = {
      search: document.getElementById('searchInput')?.value.toLowerCase() || '',
      category: document.getElementById('categoryFilter')?.value || '',
      priceMin: parseFloat(document.getElementById('priceMin')?.value) || 0,
      priceMax: parseFloat(document.getElementById('priceMax')?.value) || Infinity
    };

    this.productHandler.filterProducts(filters);
  },

  // Check if product matches all filters
  matchesFilters(product, filters) {
    const matchesSearch = product.name.toLowerCase().includes(filters.search) ||
                           product.description.toLowerCase().includes(filters.search);

    const matchesCategory = !filters.category || product.category === filters.category;
    const matchesPrice = product.price >= filters.priceMin &&
                          (filters.priceMax === Infinity || product.price <= filters.priceMax);

    return matchesSearch && matchesCategory && matchesPrice;
  },

  // Check URL for initial filters
  checkUrlFilters() {
    const hash = window.location.hash;
    if (hash.includes('#category=')) {
      const category = hash.split('=')[1];
      const categoryFilter = document.getElementById('categoryFilter');
      if (categoryFilter) {
        categoryFilter.value = decodeURIComponent(category);
        this._applyFilters();
      }
    }
  }
};

export default FilterHandler;
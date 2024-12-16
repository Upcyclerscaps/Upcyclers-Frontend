/* eslint-disable linebreak-style */

import AdminLayout from './components/admin-layout';
import API_ENDPOINT from '../../../globals/api-endpoint';

const AdminProducts = {
  async render() {
    return AdminLayout.render(`
      <div class="p-6 max-w-7xl mx-auto">
        <div class="bg-white rounded-lg shadow-md">
          <div class="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 class="text-xl font-semibold">Products Management</h2>
            <input type="text"
                   id="searchProduct"
                   placeholder="Search products..."
                   class="px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-500 w-64">
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-200">
                  <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-64">Product</th>
                  <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                  <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Actions</th>
                </tr>
              </thead>
              <tbody id="productsTableBody" class="divide-y divide-gray-200">
                <tr>
                  <td colspan="6" class="px-6 py-4 text-center text-gray-500">Loading products...</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `);
  },

  async afterRender() {
    await this._loadProducts();
    this._initializeEventListeners();
  },

  async _loadProducts() {
    try {
      const response = await fetch(API_ENDPOINT.ADMIN.GET_PRODUCTS, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const { data: products } = await response.json();
      const tableBody = document.getElementById('productsTableBody');

      if (!products || products.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="6" class="px-6 py-4 text-center text-gray-500">
              No products found
            </td>
          </tr>
        `;
        return;
      }

      tableBody.innerHTML = products.map((product) => this._createProductRow(product)).join('');
    } catch (error) {
      console.error('Error loading products:', error);
      document.getElementById('productsTableBody').innerHTML = `
        <tr>
          <td colspan="6" class="px-6 py-4 text-center text-red-500">
            Failed to load products. Please try again.
          </td>
        </tr>
      `;
    }
  },

  _createProductRow(product) {
    return `
      <tr class="hover:bg-gray-50">
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center space-x-3">
            <img class="h-12 w-12 rounded object-cover border border-gray-200"
                 src="${product.images?.[0]?.url || 'https://via.placeholder.com/48'}"
                 alt="${product.name}">
            <div>
              <div class="text-sm font-medium text-gray-900">${product.name || '-'}</div>
              <div class="text-sm text-gray-500">${product.description?.substring(0, 50) || ''}...</div>
            </div>
          </div>
        </td>
        
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-2 py-1 text-sm font-medium rounded-full bg-primary-100 text-primary-800">
            ${product.category || '-'}
          </span>
        </td>
        
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900">
            Rp ${(product.price?.amount || 0).toLocaleString()}
          </div>
          <div class="text-sm text-gray-500">
            per ${product.price?.unit || 'pcs'}
          </div>
        </td>

        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center space-x-3">
            <img class="h-8 w-8 rounded-full object-cover"
                 src="${product.seller?.profileImage || 'https://via.placeholder.com/32'}"
                 alt="${product.seller?.name}">
            <div class="text-sm text-gray-900">${product.seller?.name || 'Unknown'}</div>
          </div>
        </td>
        
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-2 py-1 text-xs font-medium rounded-full ${
  product.status === 'available'
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800'
}">
            ${product.status || 'inactive'}
          </span>
        </td>
        
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex justify-center space-x-3">
            <button class="text-blue-600 hover:text-blue-800 transition-colors"
                    onclick="window.location.hash = '#/product/${product._id}'"
                    title="View Details">
              <i class="fas fa-eye"></i>
            </button>
            <button class="text-red-600 hover:text-red-900 transition-colors"
                    data-action="delete"
                    data-product-id="${product._id}"
                    title="Delete Product">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  },

  _initializeEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchProduct');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('#productsTableBody tr');
        rows.forEach((row) => {
          if (row.querySelector('td[colspan]')) return;
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
      });
    }

    // Delete handler
    document.getElementById('productsTableBody').addEventListener('click', async (e) => {
      const deleteBtn = e.target.closest('button[data-action="delete"]');
      if (deleteBtn) {
        await this._handleDelete(deleteBtn.dataset.productId);
      }
    });
  },

  async _handleDelete(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(API_ENDPOINT.ADMIN.DELETE_PRODUCT(productId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      await this._loadProducts();
      alert('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert(error.message || 'Failed to delete product');
    }
  }
};

export default AdminProducts;
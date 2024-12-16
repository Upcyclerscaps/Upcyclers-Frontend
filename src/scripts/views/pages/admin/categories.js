/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
import AdminLayout from './components/admin-layout';
import API_ENDPOINT from '../../../globals/api-endpoint';

const AdminCategories = {
  async render() {
    return AdminLayout.render(`
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b flex justify-between items-center">
            <h2 class="text-xl font-bold">Category Management</h2>
            <div class="flex space-x-4">
              <input type="search" 
                     placeholder="Search categories..." 
                     class="border rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500">
              <button id="addCategoryBtn" class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                <i class="fas fa-plus mr-2"></i>Add Category
              </button>
            </div>
          </div>
  
          <div class="p-6">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody id="categoriesTableBody" class="divide-y divide-gray-200">
                  <!-- Categories will be loaded here -->
                </tbody>
              </table>
            </div>
          </div>
        </div>
  
        <!-- Add/Edit Category Modal -->
        <div id="categoryModal" class="hidden fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div class="mt-3">
              <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4" id="modalTitle">Add Category</h3>
              <form id="categoryForm">
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2">Name</label>
                  <input type="text" name="name" 
                         class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500" 
                         required>
                </div>
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2">Description</label>
                  <textarea name="description" 
                           class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500" 
                           rows="3"></textarea>
                </div>
                <div class="mt-4 flex justify-end space-x-3">
                  <button type="button" id="cancelCategoryBtn" 
                          class="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" 
                          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      `);
  },

  async afterRender() {
    this._initializeEventListeners();
    this._initializeModalHandlers();
    await this._loadCategories();
  },

  _initializeEventListeners() {
    // Modal handlers
    const addBtn = document.getElementById('addCategoryBtn');
    const modal = document.getElementById('categoryModal');
    const cancelBtn = document.getElementById('cancelCategoryBtn');
    const form = document.getElementById('categoryForm');

    addBtn.addEventListener('click', () => {
      document.getElementById('modalTitle').textContent = 'Add Category';
      form.reset();
      delete form.dataset.categoryId;
      modal.classList.remove('hidden');
    });

    cancelBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      form.reset();
      delete form.dataset.categoryId;
    });

    // Form submit
    form.addEventListener('submit', (e) => this._handleSubmit(e));

    // Table action handlers
    document.getElementById('categoriesTableBody').addEventListener('click', (e) => {
      const button = e.target.closest('button[data-action]');
      if (!button) return;

      const { action, id } = button.dataset;
      if (action === 'edit') {
        this._handleEdit(id);
      } else if (action === 'delete') {
        this._handleDelete(id);
      }
    });

    // Search functionality
    const searchInput = document.querySelector('input[type="search"]');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('#categoriesTableBody tr');

        rows.forEach((row) => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
      });
    }
  },

  _initializeModalHandlers() {
    const modal = document.getElementById('categoryModal');

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
        document.getElementById('categoryForm').reset();
      }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        modal.classList.add('hidden');
        document.getElementById('categoryForm').reset();
      }
    });
  },

  async _loadCategories() {
    try {
      const response = await fetch(API_ENDPOINT.ADMIN.CATEGORIES, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const { data } = await response.json();

      const tableBody = document.getElementById('categoriesTableBody');
      tableBody.innerHTML = data.map((category) => this._createCategoryRow(category)).join('');
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  },

  _createCategoryRow(category) {
    return `
        <tr>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900">${category.name}</div>
          </td>
          <td class="px-6 py-4">
            <div class="text-sm text-gray-500">${category.description || '-'}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <button class="text-primary-600 hover:text-primary-900 mr-3" data-action="edit" data-id="${category._id}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="text-red-600 hover:text-red-900" data-action="delete" data-id="${category._id}">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
  },

  async _handleSubmit(event) {
    try {
      event.preventDefault();
      const form = event.target;
      const formData = new FormData(form);
      const modal = document.getElementById('categoryModal');
      const submitBtn = form.querySelector('button[type="submit"]');
      const categoryId = form.dataset.categoryId;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Saving...';

      const categoryData = {
        name: formData.get('name'),
        description: formData.get('description')
      };

      const url = categoryId ?
        API_ENDPOINT.ADMIN.UPDATE_CATEGORY(categoryId) :
        API_ENDPOINT.ADMIN.CATEGORIES;

      const method = categoryId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryData)
      });
      if (!response.ok) {
        throw new Error('Failed to save category');
      }

      form.reset();
      modal.classList.add('hidden');
      delete form.dataset.categoryId;

      await this._loadCategories();
      alert('Category saved successfully');

    } catch (error) {
      console.error('Error saving category:', error);
      alert(error.message || 'Failed to save category');
    } finally {
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Save';
    }
  },

  async _handleEdit(categoryId) {
    try {
      const response = await fetch(`/api/v1/admin/categories/${categoryId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch category');

      const { data: category } = await response.json();

      const form = document.getElementById('categoryForm');
      form.dataset.categoryId = categoryId;
      form.querySelector('[name="name"]').value = category.name;
      form.querySelector('[name="description"]').value = category.description || '';

      document.getElementById('modalTitle').textContent = 'Edit Category';
      document.getElementById('categoryModal').classList.remove('hidden');

    } catch (error) {
      console.error('Error editing category:', error);
      alert(error.message);
    }
  },

  async _handleDelete(categoryId) {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch(API_ENDPOINT.ADMIN.DELETE_CATEGORY(categoryId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete category');

      await this._loadCategories();
      alert('Category deleted successfully');

    } catch (error) {
      console.error('Error deleting category:', error);
      alert(error.message);
    }
  }
};

export default AdminCategories;
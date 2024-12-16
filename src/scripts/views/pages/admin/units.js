/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
import AdminLayout from './components/admin-layout';
import API_ENDPOINT from '../../../globals/api-endpoint';

const AdminUnits = {
  async render() {
    return AdminLayout.render(`
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b flex justify-between items-center">
            <h2 class="text-xl font-bold">Unit Management</h2>
            <button id="addUnitBtn" class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
              <i class="fas fa-plus mr-2"></i>Add Unit
            </button>
          </div>
  
          <div class="p-6">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody id="unitsTableBody" class="divide-y divide-gray-200">
                  <!-- Units will be loaded here -->
                </tbody>
              </table>
            </div>
          </div>
        </div>
  
        <!-- Add/Edit Unit Modal -->
        <div id="unitModal" class="hidden fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div class="mt-3">
              <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4" id="modalTitle">Add Unit</h3>
              <form id="unitForm">
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2">Name</label>
                  <select name="name" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500" required>
                    <option value="">Select Name</option>
                    <option value="Kilogram">Kilogram</option>
                    <option value="Pieces">Pieces</option>
                    <option value="Lusin">Lusin</option>
                    <option value="Ton">Ton</option>
                  </select>
                </div>
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2">Symbol</label>
                  <select name="symbol" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500" required>
                    <option value="">Select Symbol</option>
                    <option value="kg">kg</option>
                    <option value="pcs">pcs</option>
                    <option value="lsn">lsn</option>
                    <option value="ton">ton</option>
                  </select>
                </div>
                <div class="mt-4 flex justify-end space-x-3">
                  <button type="button" id="cancelUnitBtn" 
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
    await this._loadUnits();
  },

  _initializeEventListeners() {
    // Modal handlers
    const addBtn = document.getElementById('addUnitBtn');
    const modal = document.getElementById('unitModal');
    const cancelBtn = document.getElementById('cancelUnitBtn');
    const form = document.getElementById('unitForm');

    addBtn.addEventListener('click', () => {
      document.getElementById('modalTitle').textContent = 'Add Unit';
      form.reset();
      delete form.dataset.unitId;
      modal.classList.remove('hidden');
    });

    cancelBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      form.reset();
      delete form.dataset.unitId;
    });

    // Form submit
    form.addEventListener('submit', (e) => this._handleSubmit(e));

    // Table action handlers
    document.getElementById('unitsTableBody').addEventListener('click', (e) => {
      const button = e.target.closest('button[data-action]');
      if (!button) return;

      const { action, id } = button.dataset;
      if (action === 'edit') {
        this._handleEdit(id);
      } else if (action === 'delete') {
        this._handleDelete(id);
      }
    });

    // Sync name and symbol selects
    const nameSelect = form.querySelector('[name="name"]');
    const symbolSelect = form.querySelector('[name="symbol"]');

    nameSelect.addEventListener('change', (e) => {
      const index = e.target.selectedIndex;
      symbolSelect.selectedIndex = index;
    });

    symbolSelect.addEventListener('change', (e) => {
      const index = e.target.selectedIndex;
      nameSelect.selectedIndex = index;
    });
  },

  _initializeModalHandlers() {
    const modal = document.getElementById('unitModal');

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
        document.getElementById('unitForm').reset();
      }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        modal.classList.add('hidden');
        document.getElementById('unitForm').reset();
      }
    });
  },

  async _loadUnits() {
    try {
      const response = await fetch(API_ENDPOINT.ADMIN.UNITS, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const { data } = await response.json();

      const tableBody = document.getElementById('unitsTableBody');
      tableBody.innerHTML = data.map((unit) => this._createUnitRow(unit)).join('');
    } catch (error) {
      console.error('Error loading units:', error);
    }
  },

  _createUnitRow(unit) {
    return `
        <tr>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900">${unit.name}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-500">${unit.symbol}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <button class="text-primary-600 hover:text-primary-900 mr-3" data-action="edit" data-id="${unit._id}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="text-red-600 hover:text-red-900" data-action="delete" data-id="${unit._id}">
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
      const modal = document.getElementById('unitModal');
      const submitBtn = form.querySelector('button[type="submit"]');
      const unitId = form.dataset.unitId;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Saving...';

      const unitData = {
        name: formData.get('name'),
        symbol: formData.get('symbol')
      };

      const url = unitId ?
        API_ENDPOINT.ADMIN.UPDATE_UNIT(unitId) :
        API_ENDPOINT.ADMIN.UNITS;

      const method = unitId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(unitData)
      });

      if (!response.ok) {
        throw new Error('Failed to save unit');
      }

      form.reset();
      modal.classList.add('hidden');
      delete form.dataset.unitId;

      await this._loadUnits();
      alert('Unit saved successfully');

    } catch (error) {
      console.error('Error saving unit:', error);
      alert(error.message || 'Failed to save unit');
    } finally {
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Save';
    }
  },

  async _handleEdit(unitId) {
    try {
      const response = await fetch(`/api/v1/admin/units/${unitId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch unit');

      const { data: unit } = await response.json();

      const form = document.getElementById('unitForm');
      form.dataset.unitId = unitId;
      form.querySelector('[name="name"]').value = unit.name;
      form.querySelector('[name="symbol"]').value = unit.symbol;

      document.getElementById('modalTitle').textContent = 'Edit Unit';
      document.getElementById('unitModal').classList.remove('hidden');

    } catch (error) {
      console.error('Error editing unit:', error);
      alert(error.message);
    }
  },

  async _handleDelete(unitId) {
    if (!confirm('Are you sure you want to delete this unit?')) return;

    try {
      const response = await fetch(API_ENDPOINT.ADMIN.DELETE_UNIT(unitId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete unit');

      await this._loadUnits();
      alert('Unit deleted successfully');

    } catch (error) {
      console.error('Error deleting unit:', error);
      alert(error.message);
    }
  }
};

export default AdminUnits;
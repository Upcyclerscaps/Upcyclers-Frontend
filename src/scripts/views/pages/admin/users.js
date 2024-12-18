/* eslint-disable linebreak-style */

import AdminLayout from './components/admin-layout';
import API_ENDPOINT from '../../../globals/api-endpoint';

// src/scripts/views/pages/admin/users.js
const AdminUsers = {
  constructor() {
    this.currentPage = 1;
    this.usersPerPage = 5;
    this.totalUsers = 0;
  },

  async render() {
    return AdminLayout.render(`
        <div class="p-2 md:p-6 max-w-7xl mx-auto">
          <div class="bg-white rounded-lg shadow-md">
            <!-- Header Section -->
            <div class="p-3 md:p-6 border-b border-gray-200">
              <h2 class="text-lg md:text-xl font-semibold mb-3 md:mb-4">User Management</h2>
              <div class="flex flex-col md:flex-row gap-4">
                <input type="text"
                       id="searchUser"
                       placeholder="Search users..."
                       class="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-primary-500">
              </div>
            </div>
   
            <!-- User List Section -->
            <div class="divide-y divide-gray-200">
              <!-- Mobile-First User List -->
              <div class="block md:hidden">
                <div id="usersMobileList" class="divide-y divide-gray-100">
                  <!-- Users will be loaded here for mobile -->
                </div>
              </div>
   
              <!-- Desktop Table -->
              <div class="hidden md:block overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody id="usersTableBody" class="bg-white divide-y divide-gray-200">
                    <!-- Users will be loaded here for desktop -->
                  </tbody>
                </table>
              </div>
            </div>
   
            <!-- Pagination -->
            <div class="px-4 py-3 border-t border-gray-200">
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="text-sm text-gray-500 text-center md:text-left">
                  Showing <span id="startIndex">0</span> to <span id="endIndex">0</span> of <span id="totalUsers">0</span> users
                </div>
                <div class="flex items-center justify-center space-x-2">
                  <button id="prevPage" 
                          class="px-3 py-1 border rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Previous
                  </button>
                  <div id="pageNumbers" class="flex space-x-1">
                    <!-- Page numbers will be inserted here -->
                  </div>
                  <button id="nextPage" 
                          class="px-3 py-1 border rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `);
  },

  _createUserRow(user) {
    // Mobile view
    const mobileCard = `
        <div class="p-4 hover:bg-gray-50">
          <div class="flex items-start justify-between">
            <div class="flex items-center space-x-3">
              <img class="h-10 w-10 rounded-full object-cover" 
                   src="${user.profileImage || 'https://via.placeholder.com/40'}" 
                   alt="${user.name}">
              <div>
                <div class="font-medium">${user.name}</div>
                <div class="text-sm text-gray-500">${user.email}</div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button class="p-1 text-primary-600 hover:text-primary-900"
                      data-action="edit"
                      data-user-id="${user._id}">
                <i class="fas fa-edit"></i>
              </button>
              <button class="p-1 text-red-600 hover:text-red-900"
                      data-action="delete"
                      data-user-id="${user._id}">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
          <div class="mt-3">
            <select class="w-full text-sm border rounded px-2 py-1"
                    data-user-id="${user._id}"
                    data-action="changeRole">
              <option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
              <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
            </select>
          </div>
        </div>
      `;

    // Desktop view
    const desktopRow = `
        <tr class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center space-x-3">
              <img class="h-10 w-10 rounded-full object-cover" 
                   src="${user.profileImage || 'https://via.placeholder.com/40'}" 
                   alt="${user.name}">
              <div>
                <div class="text-sm font-medium text-gray-900">${user.name}</div>
                <div class="text-sm text-gray-500">${user.email}</div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.email}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <select class="text-sm border rounded px-2 py-1"
                    data-user-id="${user._id}"
                    data-action="changeRole">
              <option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
              <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
            </select>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
              Active
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button class="text-primary-600 hover:text-primary-900 mr-3"
                    data-action="edit"
                    data-user-id="${user._id}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="text-red-600 hover:text-red-900"
                    data-action="delete"
                    data-user-id="${user._id}">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `;

    return window.innerWidth < 768 ? mobileCard : desktopRow;
  },

  async afterRender() {
    this.currentPage = 1;
    this.usersPerPage = 5;
    await this._loadUsers();
    this._initializeEventListeners();
  },

  async _loadUsers() {
    try {
      const response = await fetch(API_ENDPOINT.ADMIN.USERS, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const { data } = await response.json();
      this.totalUsers = data.length;

      // Calculate pagination
      const startIndex = (this.currentPage - 1) * this.usersPerPage;
      const endIndex = Math.min(startIndex + this.usersPerPage, this.totalUsers);
      const paginatedUsers = data.slice(startIndex, endIndex);

      // Update display
      const container = window.innerWidth < 768 ?
        document.getElementById('usersMobileList') :
        document.getElementById('usersTableBody');

      if (container) {
        container.innerHTML = paginatedUsers.map((user) => this._createUserRow(user)).join('');
      }

      // Update pagination
      this._updatePaginationInfo(startIndex + 1, endIndex, this.totalUsers);
      this._updatePaginationButtons();
      this._renderPageNumbers();

    } catch (error) {
      console.error('Error loading users:', error);
    }
  },

  _updatePaginationInfo(start, end, total) {
    const startEl = document.getElementById('startIndex');
    const endEl = document.getElementById('endIndex');
    const totalEl = document.getElementById('totalUsers');

    if (startEl) startEl.textContent = start;
    if (endEl) endEl.textContent = end;
    if (totalEl) totalEl.textContent = total;
  },

  _updatePaginationButtons() {
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');

    if (prevButton && nextButton) {
      prevButton.disabled = this.currentPage === 1;
      nextButton.disabled = this.currentPage >= Math.ceil(this.totalUsers / this.usersPerPage);
    }
  },

  _renderPageNumbers() {
    const pageNumbers = document.getElementById('pageNumbers');
    if (!pageNumbers) return;

    const pageCount = Math.ceil(this.totalUsers / this.usersPerPage);
    let html = '';

    for (let i = 1; i <= pageCount; i++) {
      html += `
          <button class="px-3 py-1 border rounded-lg text-sm 
                        ${this.currentPage === i ? 'bg-primary-600 text-white' : 'hover:bg-gray-50'}"
                  data-page="${i}">
            ${i}
          </button>
        `;
    }

    pageNumbers.innerHTML = html;
  },

  _initializeEventListeners() {
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    const pageNumbers = document.getElementById('pageNumbers');
    const searchInput = document.getElementById('searchUser');

    if (prevButton) {
      prevButton.addEventListener('click', () => {
        if (this.currentPage > 1) {
          this.currentPage--;
          this._loadUsers();
        }
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        if (this.currentPage < Math.ceil(this.totalUsers / this.usersPerPage)) {
          this.currentPage++;
          this._loadUsers();
        }
      });
    }

    if (pageNumbers) {
      pageNumbers.addEventListener('click', (e) => {
        const pageButton = e.target.closest('button[data-page]');
        if (pageButton) {
          this.currentPage = parseInt(pageButton.dataset.page, 10);
          this._loadUsers();
        }
      });
    }

    if (searchInput) {
      // eslint-disable-next-line no-unused-vars
      searchInput.addEventListener('input', (e) => {
        this.currentPage = 1;
        this._loadUsers();
      });
    }
  }
};

export default AdminUsers;
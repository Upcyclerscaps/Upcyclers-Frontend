/* eslint-disable linebreak-style */

const TemplateCreator = {
  createProfilePage(user) {
    return `
        <div class="container mx-auto px-4 pt-24">
          <div class="max-w-4xl mx-auto">
            ${this._createProfileHeader(user)}
            ${this._createStats()}
            ${this._createTabs()}
          </div>
        </div>
      `;
  },

  _createProfileHeader(user) {
    return `
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <div class="flex items-center space-x-6">
            <img src="${user?.profileImage || 'https://via.placeholder.com/128'}" 
                 alt="Profile picture" 
                 class="w-32 h-32 rounded-full bg-gray-200">
            
            <div class="flex-1">
              <h1 class="text-2xl font-bold">${user?.name || 'User'}</h1>
              <p class="text-gray-600 mb-4">Bergabung sejak ${user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : 'Invalid Date'}</p>
              
              <div class="flex flex-wrap gap-2">
                <button onclick="window.location.hash = '#/edit-profile'"
                        class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all">
                  <i class="fas fa-edit mr-2"></i> Edit Profile
                </button>
                <button onclick="window.location.hash = '#/sell-item'"
                        class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all">
                  <i class="fas fa-plus mr-2"></i> Jual Barang
                </button>
                <button onclick="window.location.hash = '#/buy-item'"
                        class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all">
                  <i class="fas fa-shopping-cart mr-2"></i> Buat Penawaran
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
  },

  _createStats() {
    return `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-white rounded-lg shadow-md p-6">
            <p class="text-gray-600">Rongsokan Sedang Dijual</p>
            <p class="text-2xl font-bold" id="productsCount">-</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6">
            <p class="text-gray-600">Rongsokan Yang Dicari</p>
            <p class="text-2xl font-bold" id="buyOffersCount">-</p>
          </div>
        </div>
      `;
  },

  _createTabs() {
    return `
        <div class="bg-white rounded-lg shadow-md">
          <div class="flex border-b">
            <button class="text-gray-600 px-6 py-4 border-b-2 border-primary-600" data-tab="selling">
              Sedang Dijual
            </button>
            <button class="text-gray-600 px-6 py-4" data-tab="buying">
              Sedang Dicari
            </button>
          </div>
          <div class="p-6">
            <div id="tabContent">
              <div class="text-center py-8 text-gray-500">
                <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
                <p class="mt-2">Memuat data...</p>
              </div>
            </div>
          </div>
        </div>
      `;
  },

  createLoadingTemplate() {
    return `
        <div class="text-center py-4">
          <i class="fas fa-spinner fa-spin"></i> Loading...
        </div>
      `;
  },

  createErrorTemplate() {
    return `
        <div class="text-center py-8 text-red-500">Gagal memuat data</div>
      `;
  },

  createEmptyTemplate() {
    return `
        <div class="text-center py-8 text-gray-500">Belum ada data</div>
      `;
  },

  createTabContent(tabName, items) {
    if (!items || items.length === 0) {
      return `
          <div class="text-center py-8 text-gray-500">
            <p>Belum ada ${tabName === 'selling' ? 'barang yang dijual' : 'penawaran pembelian'}</p>
            <button 
              onclick="window.location.hash='#/${tabName === 'selling' ? 'sell' : 'buy'}-item'"
              class="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
              ${tabName === 'selling' ? 'Jual Barang' : 'Buat Penawaran'}
            </button>
          </div>
        `;
    }

    return `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${items.map((item) => this._createItemCard(item, tabName)).join('')}
        </div>
      `;
  },

  _createItemCard(item, type) {
    return `
        <div class="border rounded-lg p-4">
          <div class="flex items-start space-x-4">
            ${type === 'selling' ? `
              <img src="${item.images[0]?.url || 'https://via.placeholder.com/80'}" 
                   alt="${item.name}"
                   class="w-20 h-20 object-cover rounded-lg">
            ` : ''}
            <div class="flex-1">
              <h3 class="font-medium">${type === 'selling' ? item.name : item.category}</h3>
              <p class="text-gray-600">Rp ${item.price.amount.toLocaleString()}</p>
              ${type === 'selling' ?
    `<p class="text-sm text-gray-500">${item.status}</p>` :
    `<p class="text-sm text-gray-500">${item.amount.value} ${item.amount.unit}</p>`
}
            </div>
            <div class="flex space-x-2">
              <button onclick="window.location.hash='#/${type === 'selling' ? 'sell' : 'buy'}-item/edit/${item._id}'"
                      class="text-primary-600 hover:text-primary-700">
                <i class="fas fa-edit"></i>
              </button>
              <button data-delete-id="${item._id}" data-type="${type}" class="text-red-600 hover:text-red-700">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      `;
  }
};

export default TemplateCreator;
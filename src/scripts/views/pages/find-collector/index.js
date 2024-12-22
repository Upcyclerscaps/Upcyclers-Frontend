/* eslint-disable linebreak-style */
import MapHandler from './map-handler';
import SearchHandler from './search-handler';
import ResultsHandler from './results-handler';

const FindCollectorPage = {
  async render() {
    return `
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <section class="pt-24 pb-12">
        <div class="container mx-auto px-4">
          <h1 class="text-3xl font-bold mb-8">Temukan Pengepul/Penjual di Sekitar Anda</h1>
          ${this._createSearchTypeSection()}
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            ${this._createFilterSection()}
            ${this._createMapSection()}
          </div>
        </div>
      </section>
    `;
  },

  _createSearchTypeSection() {
    return `
      <div class="mb-8">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-bold mb-4">Saya ingin mencari:</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex items-center p-4 border rounded-lg cursor-pointer hover:border-primary-600" data-type="collector">
              <input type="radio" name="searchType" id="collector" class="mr-3" checked>
              <div>
                <h3 class="font-bold mb-1">Pengepul (Pembeli)</h3>
                <p class="text-sm text-gray-600">Cari pengepul terdekat untuk menjual barang rongsok Anda</p>
              </div>
            </div>
            <div class="flex items-center p-4 border rounded-lg cursor-pointer hover:border-primary-600" data-type="seller">
              <input type="radio" name="searchType" id="seller" class="mr-3">
              <div>
                <h3 class="font-bold mb-1">Penjual</h3>
                <p class="text-sm text-gray-600">Cari penjual barang rongsok di sekitar Anda</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  _createFilterSection() {
    return `
      <div class="md:col-span-1">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-bold mb-4">Filter Pencarian</h2>
          <form id="searchForm">
            <div class="mb-4">
              <label class="block mb-2">Lokasi</label>
              <div class="relative">
                <input type="text" 
                  id="location" 
                  name="location" 
                  class="w-full p-2 pl-10 border rounded-lg" 
                  placeholder="Mendapatkan lokasi..."
                  readonly>
                <button type="button" 
                  id="getCurrentLocation" 
                  class="absolute left-3 top-1/2 -translate-y-1/2 text-primary-600 hover:text-primary-700">
                  <i class="fas fa-location-arrow"></i>
                </button>
              </div>
            </div>
            
            <div class="mb-4">
              <label class="block mb-2" for="categoryFilter">Kategori Barang</label>
              <select id="categoryFilter" name="category" class="w-full p-2 border rounded-lg">
                <option value="">Semua Kategori</option>
                <option value="Logam">Logam</option>
                <option value="Plastik">Plastik</option>
                <option value="Kertas">Kertas</option>
                <option value="Elektronik">Elektronik</option>
              </select>
            </div>
            
            <div class="mb-4">
              <label class="block mb-2">Radius Pencarian</label>
              <select id="radiusFilter" name="radius" class="w-full p-2 border rounded-lg">
                <option value="1">1 km</option>
                <option value="3">3 km</option>
                <option value="5" selected>5 km</option>
                <option value="10">10 km</option>
              </select>
            </div>
            
            <div id="priceRangeDiv" class="mb-4 hidden">
              <label class="block mb-2">Rentang Harga (per kg)</label>
              <div class="flex space-x-4">
                <input type="number" 
                  name="priceMin" 
                  class="w-1/2 p-2 border rounded-lg" 
                  placeholder="Min">
                <input type="number" 
                  name="priceMax" 
                  class="w-1/2 p-2 border rounded-lg" 
                  placeholder="Max">
              </div>
            </div>
            
            <button type="submit" class="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700">
              Cari Sekarang
            </button>
          </form>
        </div>
      </div>
    `;
  },

  _createMapSection() {
    return `
      <div class="md:col-span-2">
        <div class="bg-white p-6 rounded-lg shadow-md mb-8">
          <div id="map" class="h-[400px] w-full rounded-lg bg-gray-100"></div>
        </div>
        <div id="searchResults" class="grid grid-cols-1 gap-4"></div>
      </div>
    `;
  },

  async afterRender() {
    // Initialize handlers
    MapHandler.initialize('map');
    ResultsHandler.initialize(MapHandler);
    SearchHandler.initialize(MapHandler, ResultsHandler);
  }
};

export default FindCollectorPage;
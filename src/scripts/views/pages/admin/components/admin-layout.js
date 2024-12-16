/* eslint-disable linebreak-style */

const AdminLayout = {
  render(content) {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || user.role !== 'admin') {
      window.location.hash = '#/';
      return '';
    }

    return `
        <div class="flex bg-gray-100 min-h-screen">
          <!-- Sidebar -->
          <div id="sidebar" class="w-64 bg-primary-800 text-white fixed h-full overflow-y-auto pt-16 transition-all duration-300 ease-in-out transform">
            <div class="p-4">
              <h2 class="text-lg font-semibold mb-6 pl-2">Admin Dashboard</h2>
              <nav class="space-y-1">
                <a href="#/admin" 
                    class="flex items-center px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors group">
                    <i class="fas fa-chart-line text-gray-300 group-hover:text-white mr-3"></i>
                    <span>Dashboard</span>
                </a>
                <a href="#/admin/users" 
                    class="flex items-center px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors group">
                    <i class="fas fa-users text-gray-300 group-hover:text-white mr-3"></i>
                    <span>Users</span>
                </a>
                <a href="#/admin/products" 
                    class="flex items-center px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors group">
                    <i class="fas fa-boxes text-gray-300 group-hover:text-white mr-3"></i>
                    <span>Products</span>
                </a>
                <a href="#/admin/buy-offers" 
                    class="flex items-center px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors group">
                    <i class="fas fa-shopping-cart text-gray-300 group-hover:text-white mr-3"></i>
                    <span>Buy Offers</span>
                </a>
              </nav>
            </div>
          </div>
  
          <!-- Main Content Area -->
          <div id="mainContent" class="flex-1 transition-all duration-300 ease-in-out ml-64">
            <div class="py-6 px-8 pt-24">
              ${content}
            </div>
          </div>
        </div>
      `;
  },

  afterRender() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');

    // Fungsi untuk toggle sidebar
    const toggleSidebar = () => {
      sidebar.classList.toggle('-translate-x-full');
      if (sidebar.classList.contains('-translate-x-full')) {
        // Sidebar tersembunyi
        mainContent.classList.remove('ml-64');
        mainContent.classList.add('ml-0');
      } else {
        // Sidebar tampil
        mainContent.classList.remove('ml-0');
        mainContent.classList.add('ml-64');
      }

      // Update toggle button icon
      if (toggleSidebarBtn) {
        const icon = toggleSidebarBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    };

    // Event listener untuk tombol toggle
    if (toggleSidebarBtn) {
      toggleSidebarBtn.addEventListener('click', toggleSidebar);
    }

    // Set initial state dari localStorage
    const sidebarState = localStorage.getItem('adminSidebarOpen');
    if (sidebarState === 'false') {
      toggleSidebar();
    }

    // Handler untuk responsive
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        if (sidebar.classList.contains('-translate-x-full')) {
          mainContent.classList.remove('ml-64');
          mainContent.classList.add('ml-0');
        } else {
          mainContent.classList.remove('ml-0');
          mainContent.classList.add('ml-64');
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check initial size
  }
};

export default AdminLayout;
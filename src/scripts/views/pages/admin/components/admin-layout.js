/* eslint-disable linebreak-style */

const AdminLayout = {
  render(content) {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || user.role !== 'admin') {
      window.location.hash = '#/';
      return '';
    }

    return `
      <div class="flex min-h-screen bg-gray-100">
        <!-- Sidebar -->
        <div class="admin-sidebar fixed h-full bg-primary-800 text-white w-64 pt-16 transition-transform duration-300 ease-in-out transform md:translate-x-0 z-30">
          <div class="p-4">
            <nav class="space-y-2">
              <a href="#/admin" class="flex items-center px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors">
                <i class="fas fa-chart-line w-6"></i>
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
  
        <!-- Main Content -->
        <div class="admin-content flex-1 transition-all duration-300 ease-in-out ml-64 pt-16">
          <div class="p-6">
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
/* eslint-disable linebreak-style */
const AlertHelper = {
  showAlert(message, type = 'success') {
    // Remove existing alerts first
    const existingAlerts = document.querySelectorAll('.alert-message');
    existingAlerts.forEach((alert) => alert.remove());

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert-message fixed top-4 left-1/2 transform -translate-x-1/2 
        px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50
        ${type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white
        transition-all duration-300 ease-in-out opacity-0`;

    alertDiv.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'} mr-2"></i>
        <span>${message}</span>
        <button class="ml-4 hover:text-${type === 'error' ? 'red' : 'green'}-200">
          <i class="fas fa-times"></i>
        </button>
      `;

    document.body.appendChild(alertDiv);

    // Add close button handler
    alertDiv.querySelector('button').addEventListener('click', () => {
      alertDiv.classList.remove('opacity-100');
      setTimeout(() => alertDiv.remove(), 300);
    });

    // Trigger animation
    setTimeout(() => alertDiv.classList.add('opacity-100'), 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
      alertDiv.classList.remove('opacity-100');
      setTimeout(() => alertDiv.remove(), 300);
    }, 5000);
  }
};

export default AlertHelper;
/* eslint-disable linebreak-style */
const CONFIG = {
  BASE_URL: window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api/v1'
    : 'https://upcyclers.servehttp.com/api/v1',
  BASE_IMAGE_URL: window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/images'
    : 'https://upcyclers.servehttp.com/images',
  CACHE_NAME: 'upcyclers-v1',
  DATABASE_NAME: 'upcyclers-database',
  DATABASE_VERSION: 1,
  OBJECT_STORE_NAME: 'items',
};

export default CONFIG;
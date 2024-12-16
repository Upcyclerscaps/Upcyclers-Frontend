/* eslint-disable linebreak-style */
import CONFIG from './config';

const API_ENDPOINT = {
  // Auth endpoints
  REGISTER: `${CONFIG.BASE_URL}/auth/register`,
  LOGIN: `${CONFIG.BASE_URL}/auth/login`,
  LOGOUT: `${CONFIG.BASE_URL}/auth/logout`,
  USER_PROFILE: `${CONFIG.BASE_URL}/auth/profile`,
  UPDATE_PROFILE: `${CONFIG.BASE_URL}/auth/profile`,
  UPDATE_PASSWORD: `${CONFIG.BASE_URL}/auth/profile/password`,

  // Product endpoints
  CREATE_PRODUCT: `${CONFIG.BASE_URL}/products`,
  GET_PRODUCTS: `${CONFIG.BASE_URL}/products`,
  GET_PRODUCT_DETAIL: (id) => `${CONFIG.BASE_URL}/products/${id}`,
  UPDATE_PRODUCT: (id) => `${CONFIG.BASE_URL}/products/${id}`,
  DELETE_PRODUCT: (id) => `${CONFIG.BASE_URL}/products/${id}`,
  USER_PRODUCTS: `${CONFIG.BASE_URL}/products/user`,

  //BUY OFFERS
  ADD_BUY_ITEM: `${CONFIG.BASE_URL}/users/buy-items`,
  BUY_OFFERS: `${CONFIG.BASE_URL}/buy-offers`,
  BUY_OFFER_DETAIL: (id) => `${CONFIG.BASE_URL}/buy-offers/${id}`,
  USER_BUY_OFFERS: `${CONFIG.BASE_URL}/buy-offers/user`,

  // Upload endpoint
  UPLOAD_IMAGE: `${CONFIG.BASE_URL}/uploads`,

  // Location-based search
  FIND_NEARBY_SELLERS: `${CONFIG.BASE_URL}/users/nearby-sellers`,
  FIND_NEARBY_BUYERS: `${CONFIG.BASE_URL}/users/nearby-buyers`,

  // Admin endpoints
  ADMIN: {
    DASHBOARD_STATS: `${CONFIG.BASE_URL}/admin/dashboard-stats`,
    USERS: `${CONFIG.BASE_URL}/admin/users`,
    GET_USER: (id) => `${CONFIG.BASE_URL}/admin/users/${id}`,
    UPDATE_USER: (id) => `${CONFIG.BASE_URL}/admin/users/${id}`,
    UPDATE_USER_ROLE: (id) => `${CONFIG.BASE_URL}/admin/users/${id}/role`,
    DELETE_USER: (id) => `${CONFIG.BASE_URL}/admin/users/${id}`,
    GET_PRODUCTS: `${CONFIG.BASE_URL}/admin/products`,
    DELETE_PRODUCT: (id) => `${CONFIG.BASE_URL}/admin/products/${id}`,
    GET_BUY_OFFERS: `${CONFIG.BASE_URL}/admin/buy-offers`,
    DELETE_BUY_OFFER: (id) => `${CONFIG.BASE_URL}/admin/buy-offers/${id}`,
  }
};

export default API_ENDPOINT;
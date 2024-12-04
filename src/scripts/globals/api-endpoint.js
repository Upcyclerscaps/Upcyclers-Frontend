/* eslint-disable linebreak-style */
import CONFIG from './config';

const API_ENDPOINT = {
  REGISTER: `${CONFIG.BASE_URL}/auth/register`,
  LOGIN: `${CONFIG.BASE_URL}/auth/login`,
  LOGOUT: `${CONFIG.BASE_URL}/auth/logout`,
  USER_PROFILE: `${CONFIG.BASE_URL}/auth/profile`,
  UPDATE_PROFILE: `${CONFIG.BASE_URL}/auth/profile`,
  CREATE_PRODUCT: `${CONFIG.BASE_URL}/products`,
  UPLOAD_IMAGE: `${CONFIG.BASE_URL}/upload/image`,
};

export default API_ENDPOINT;
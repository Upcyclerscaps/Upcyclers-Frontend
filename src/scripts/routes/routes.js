/* eslint-disable linebreak-style */
const routes = {
  '/': () => import('../views/pages/home'),
  '/auth': () => import('../views/pages/auth-page'),
  '/profile': () => import('../views/pages/profile-page'),
  '/edit-profile': () => import('../views/pages/edit-profile-page'),
  '/sell-item': () => import('../views/pages/sell-item'),
  '/buy-item': () => import('../views/pages/buy-item'),
  '/jual-beli': () => import('../views/pages/jual-beli'),
  '/product/:id': () => import('../views/pages/detail-product-page'),
  '/find-collector': () => import('../views/pages/find-collector'),
  '/about': () => import('../views/pages/about-page'),
  '/404': () => import('../views/pages/not-found'),
  '/buy-offers': () => import('../views/pages/buy-offers'),
  '/buy-offer/edit/:id': () => import('../views/pages/buy-offers/edit'),
  '/sell-item/edit/:id': () => import('../views/pages/sell-item/edit'),
  '/buy-item/edit/:id': () => import('../views/pages/buy-item/edit'),

  // Admin routes
  '/admin': () => import('../views/pages/admin/dashboard'),
  '/admin/users': () => import('../views/pages/admin/users'),
  '/admin/products': () => import('../views/pages/admin/products'),
  '/admin/buy-offers': () => import('../views/pages/admin/buy-offers')
};

export default routes;
/* eslint-disable linebreak-style */
import Home from '../views/pages/home';
import JualBeliPage from '../views/pages/jual-beli/index';
import FindCollectorPage from '../views/pages/find-collector/index';
import Auth from '../views/pages/auth-page';
import About from '../views/pages/about-page';
import Profile from '../views/pages/profile-page';
// import ProfilePage from '../views/pages/profile';
import EditProfile from '../views/pages/edit-profile-page';
import SellItemPage from '../views/pages/sell-item/index';
import BuyItemPage from '../views/pages/buy-item';
import DetailProduct from '../views/pages/detail-product-page';
import NotFound from '../views/pages/not-found';

import BuyOffersPage from '../views/pages/buy-offers';
import EditBuyOfferPage from '../views/pages/buy-offers/edit';

import EditSellItemPage from '../views/pages/sell-item/edit';
import EditBuyItemPage from '../views/pages/buy-item/edit';

const routes = {
  '/': Home,
  '/auth': Auth,
  '/profile': Profile,
  '/edit-profile': EditProfile,
  '/sell-item': SellItemPage,
  '/buy-item': BuyItemPage,
  '/jual-beli': JualBeliPage,
  '/find-collector': FindCollectorPage,
  '/about': About,
  '/product/:id': DetailProduct,
  '/404': NotFound,

  '/buy-offers': BuyOffersPage,
  '/buy-offer/edit/:id': EditBuyOfferPage,
  '/sell-item/edit/:id': EditSellItemPage,
  '/buy-item/edit/:id': EditBuyItemPage,
};

export default routes;
/* eslint-disable linebreak-style */
import Home from '../views/pages/home';
import JualBeli from '../views/pages/jual-beli-page';
import FindCollector from '../views/pages/find-collector-page';
import Auth from '../views/pages/auth-page';
import About from '../views/pages/about-page';
import Profile from '../views/pages/profile-page';
import EditProfile from '../views/pages/edit-profile-page';
import SellItem from '../views/pages/sell-item-page';
import DetailProduct from '../views/pages/detail-product-page';
import NotFound from '../views/pages/not-found';

const routes = {
  '/': Home,
  '/auth': Auth,
  '/profile': Profile,
  '/edit-profile': EditProfile,
  '/sell-item': SellItem,
  '/jual-beli': JualBeli,
  '/find-collector': FindCollector,
  '/about': About,
  '/product': DetailProduct,
  '/404': NotFound,
};

export default routes;
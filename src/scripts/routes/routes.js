/* eslint-disable linebreak-style */
import Home from '../views/pages/home';
import JualBeliPage from '../views/pages/jual-beli/index';
import FindCollectorPage from '../views/pages/find-collector/index';
import Auth from '../views/pages/auth-page';
import About from '../views/pages/about-page';
import Profile from '../views/pages/profile-page';
import EditProfile from '../views/pages/edit-profile-page';
import SellItemPage from '../views/pages/sell-item/index';
import DetailProduct from '../views/pages/detail-product-page';
import NotFound from '../views/pages/not-found';

const routes = {
  '/': Home,
  '/auth': Auth,
  '/profile': Profile,
  '/edit-profile': EditProfile,
  '/sell-item': SellItemPage,
  '/jual-beli': JualBeliPage,
  '/find-collector': FindCollectorPage,
  '/about': About,
  '/product': DetailProduct,
  '/404': NotFound,
};

export default routes;
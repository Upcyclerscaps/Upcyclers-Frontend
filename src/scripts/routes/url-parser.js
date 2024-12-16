/* eslint-disable linebreak-style */
const UrlParser = {
  parseActiveUrlWithCombiner() {
    const url = window.location.hash.slice(1).toLowerCase();
    const splitedUrl = this._splitUrl(url);
    return this._urlCombiner(splitedUrl);
  },

  parseActiveUrlWithoutCombiner() {
    const url = window.location.hash.slice(1).toLowerCase();
    return this._splitUrl(url);
  },

  _splitUrl(url) {
    const urlsSplit = url.split('/');

    // Handle admin routes
    if (urlsSplit[1] === 'admin') {
      return {
        resource: urlsSplit.length > 2 ? `/admin/${urlsSplit[2]}` : '/admin',
        id: urlsSplit[3] || null
      };
    }

    // Handle existing route patterns
    if (urlsSplit.length === 4 && urlsSplit[2] === 'edit') {
      return {
        resource: `/${urlsSplit[1]}/edit`,
        id: urlsSplit[3]
      };
    } else if (urlsSplit.length === 3) {
      return {
        resource: `/${urlsSplit[1]}`,
        id: urlsSplit[2]
      };
    }

    return {
      resource: `/${urlsSplit[1] || ''}`,
      id: null
    };
  },

  _urlCombiner(splitedUrl) {
    if (splitedUrl.id) {
      return `${splitedUrl.resource}/:id`;
    }
    return splitedUrl.resource;
  }
};

export default UrlParser;
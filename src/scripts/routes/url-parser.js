/* eslint-disable linebreak-style */
const UrlParser = {
  // Parses the active URL and combines it with the appropriate route
  parseActiveUrlWithCombiner() {
    const url = window.location.hash.slice(1).toLowerCase();
    const splitedUrl = this._splitUrl(url);
    return this._urlCombiner(splitedUrl);
  },

  // Parses the active URL without combining it
  parseActiveUrlWithoutCombiner() {
    const url = window.location.hash.slice(1).toLowerCase();
    return this._splitUrl(url);
  },

  // Splits the URL into resource and id
  _splitUrl(url) {
    const urlsSplit = url.split('/');
    const resource = `/${urlsSplit[1]}${urlsSplit[2] ? `/${urlsSplit[2]}` : ''}`;
    const id = urlsSplit[3] || this._parseId(urlsSplit[4]); // Handle query string if present

    return {
      resource,
      id,
    };
  },

  // Parses the ID from the query string
  _parseId(queryString) {
    if (!queryString) return null;

    const params = new URLSearchParams(queryString);
    return params.get('id');
  },

  // Combines the resource and id into a full route
  _urlCombiner(splitedUrl) {
    const editRoutes = {
      '/sell-item/edit': '/sell-item/edit/:id',
      '/buy-item/edit': '/buy-item/edit/:id',
    };

    return editRoutes[splitedUrl.resource] && splitedUrl.id
      ? editRoutes[splitedUrl.resource]
      : splitedUrl.resource;
  },
};

export default UrlParser;
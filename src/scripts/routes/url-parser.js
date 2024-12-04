/* eslint-disable linebreak-style */
const UrlParser = {
  parseActiveUrlWithCombiner() {
    const url = window.location.hash.slice(1).toLowerCase();
    const splitedUrl = this._urlSplitter(url);
    return this._urlCombiner(splitedUrl);
  },

  parseActiveUrlWithoutCombiner() {
    const url = window.location.hash.slice(1).toLowerCase();
    return this._urlSplitter(url);
  },

  _urlSplitter(url) {
    const [resource, id] = url.split('?');
    return {
      resource: resource || '/',
      id: this._parseId(id),
    };
  },

  _parseId(queryString) {
    if (!queryString) return null;

    const params = new URLSearchParams(queryString);
    return params.get('id');
  },

  _urlCombiner(splitedUrl) {
    return splitedUrl.resource;
  },
};

export default UrlParser;
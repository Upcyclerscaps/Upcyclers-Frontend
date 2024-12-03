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
    // Split URL and query parameters
    const [resource, queryString] = url.split('?');
    const params = new URLSearchParams(queryString || '');

    return {
      resource: resource.split('/')[1] || null,
      id: params.get('id') || null,
    };
  },

  _urlCombiner(splitedUrl) {
    return splitedUrl.resource ? `/${splitedUrl.resource}` : '/';
  }
};

export default UrlParser;
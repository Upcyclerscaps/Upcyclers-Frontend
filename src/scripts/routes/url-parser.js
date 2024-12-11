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

    // Handle berbagai pola URL
    if (urlsSplit.length === 4 && urlsSplit[2] === 'edit') {
      // Format: /resource/edit/id
      return {
        resource: `/${urlsSplit[1]}/edit`,
        id: urlsSplit[3]
      };
    } else if (urlsSplit.length === 3) {
      // Format: /resource/id
      return {
        resource: `/${urlsSplit[1]}`,
        id: urlsSplit[2]
      };
    }

    // Format: /resource
    return {
      resource: `/${urlsSplit[1]}`,
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
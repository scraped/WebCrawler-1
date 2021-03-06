// Generated by CoffeeScript 1.11.1
var Package, Request, request;

Package = require('../../../package.json');

request = require('request');

Request = (function() {
  function Request(opts) {
    this.opts = opts != null ? opts : {};
    this.defaults = {
      uri: this.opts.uri || null,
      method: this.opts.method || 'GET',
      timeout: this.opts.timeout || 3000,
      followRedirect: this.opts.followRedirect || true,
      maxRedirects: this.opts.maxRedirects || 2,
      json: this.opts.json || false,
      headers: {
        'User-Agent': Package.name + " " + Package.version
      }
    };
  }

  Request.prototype.getLang = function(res) {
    var langs, langs_header;
    langs = [];
    if (res !== void 0) {
      langs_header = res.headers['accept-language'];
      if (langs_header !== void 0) {
        langs = langs_header.split(':')[1].match(/[a-zA-z\-]{2,10}/g) || [];
      }
    }
    return langs;
  };

  Request.prototype.get = function(url) {
    var start;
    this.defaults.uri = url;
    start = new Date();
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return request(_this.defaults, function(error, res) {
          var lang;
          if (!error && res.statusCode === 200) {
            res.responseTime = new Date() - start;
            lang = _this.getLang(res);
            return resolve(res, lang);
          } else {
            return reject(error);
          }
        });
      };
    })(this));
  };

  return Request;

})();

module.exports = Request;

//# sourceMappingURL=request.js.map

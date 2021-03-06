// Generated by CoffeeScript 1.11.1
var Request, Root;

Request = require('./Requests/request');

Root = 'http://localhost:5001';

module.exports = {
  getAll: (function(_this) {
    return function() {
      return new Promise(function(resolve, reject) {
        return Request.get(Root + "/domains").then(function(res) {
          return resolve(res);
        })["catch"](function(err) {
          return reject(err);
        });
      });
    };
  })(this),
  get: (function(_this) {
    return function(domain) {
      return new Promise(function(resolve, reject) {
        return Request.get(Root + "/domains/" + domain).then(function(res) {
          return resolve(res);
        })["catch"](function(err) {
          return reject(err);
        });
      });
    };
  })(this),
  add: (function(_this) {
    return function(data) {
      return new Promise(function(resolve, reject) {
        return Request.post(Root + "/domains", data).then(function(res) {
          return resolve(res);
        })["catch"](function(err) {
          return reject(err);
        });
      });
    };
  })(this),
  update: (function(_this) {
    return function(domain, data) {
      return new Promise(function(resolve, reject) {
        return Request.put(Root + "/domains/" + domain, data).then(function(res) {
          return resolve(res);
        })["catch"](function(err) {
          return reject(err);
        });
      });
    };
  })(this),
  "delete": (function(_this) {
    return function(domain) {
      return new Promise(function(resolve, reject) {
        return Request["delete"](Root + "/domains/" + domain).then(function(res) {
          return resolve(res);
        })["catch"](function(err) {
          return reject(err);
        });
      });
    };
  })(this)
};

//# sourceMappingURL=Domains.js.map

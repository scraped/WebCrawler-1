// Generated by CoffeeScript 1.11.1
var RedisStore, Session, redis, session;

redis = require('redis');

session = require('express-session');

RedisStore = require('connect-redis')(session);

module.exports = Session = (function() {
  function Session(app) {
    this.app = app;
    this.config = {
      secret: this.app.config.jwt_secret,
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000
      },
      name: 'session',
      secure: true,
      resave: false,
      saveUninitialized: false
    };
    this.app.use((function(_this) {
      return function(req, res, next) {
        if (!req.decoded) {
          req.decoded = {
            role: 'guest'
          };
        }
        return next();
      };
    })(this));
    this.app.use(session(this.config));
    this.app.logger.info('✓ '.bold.green + 'Start session middleware.');
  }

  return Session;

})();

//# sourceMappingURL=Session.js.map
// Generated by CoffeeScript 1.11.1
var Engine, Renderer, colors, fs, hogan;

fs = require('fs');

colors = require('colors');

hogan = require('hogan-express');

Renderer = require('../rendering/Renderer.coffee');

module.exports = Engine = (function() {
  function Engine(app) {
    this.app = app;
    this.config = {
      views: __dirname + "/../../api",
      layout: __dirname + "/../../layouts/default.html",
      partials: __dirname + "/../../layouts/partials"
    };
    this.setup();
    this.app.use((new Renderer({})).render);
    this.app.logger.info('✓ '.bold.green + 'Started render engine.');
  }

  Engine.prototype.setup = function() {
    this.app.set('view engine', 'html');
    this.app.set('views', this.config.views);
    this.app.set('layout', this.config.layout);
    this.app.set('partials', this.getPartials());
    this.app.locals.delimiters = '<% %>';
    this.app.enable('view cache');
    this.app.engine('html', hogan);
    return this.app.logger.info('✓ '.bold.green + 'Load render engine configuration.');
  };

  Engine.prototype.getPartials = function() {
    var partials;
    partials = {};
    fs.readdirSync(this.config.partials).forEach((function(_this) {
      return function(file) {
        var name;
        if (file.toLowerCase().indexOf('.html')) {
          name = (file.split('.')[0]).toLowerCase();
          return partials[name] = _this.config.partials + "/" + file;
        }
      };
    })(this));
    this.app.logger.info('✓ '.bold.green + 'Render partials loaded.');
    return partials;
  };

  return Engine;

})();

//# sourceMappingURL=Engine.js.map
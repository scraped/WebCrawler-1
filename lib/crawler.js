// Generated by CoffeeScript 1.11.1
var Crawler, Parser, PriorityQueue, Request, robots, robots_parser, sitemaps, urlParser,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

PriorityQueue = require('./Crawler/Queue/PriorityQueue');

Request = require('./Crawler/Requests/request');

Parser = require('./parser');

urlParser = require('url-parse');

robots = require('robots');

robots_parser = new robots.RobotsParser;

sitemaps = require('sitemap-stream-parser');

Crawler = (function() {
  function Crawler() {
    this.getSitemap = bind(this.getSitemap, this);
    this.canFetch = bind(this.canFetch, this);
    this.processed = 0;
    this.crawled = [];
    this.delay = 250;
    this.domain = null;
    this.parser = new Parser();
    this.request = new Request();
    this.q = PriorityQueue();
    this.exclude = ['free.fr', 'statcounter', 'doubleclick', 'feedburner', 't.co', 'facebook', 'google', 'youtube', 'twitter', 'github'];
    this.start();
  }

  Crawler.prototype.start = function() {
    return this.interval = setInterval((function(_this) {
      return function() {
        if (_this.q.size() > 0) {
          return _this.getPage(_this.q.pop());
        }
      };
    })(this), this.delay);
  };

  Crawler.prototype.isAllowed = function(url) {
    var allowed, exclude, i, len, ref;
    allowed = true;
    ref = this.exclude;
    for (i = 0, len = ref.length; i < len; i++) {
      exclude = ref[i];
      if (url.indexOf(exclude) >= 0) {
        allowed = false;
      }
    }
    return allowed;
  };

  Crawler.prototype.stop = function() {
    return clearInterval(this.interval);
  };

  Crawler.prototype.canFetch = function(robots_url, url, cb) {
    return robots_parser.setUrl(robots_url, (function(_this) {
      return function(parser, success) {
        if (success) {
          return robots_parser.canFetch('*', url, function(access) {
            return cb(access);
          });
        }
      };
    })(this));
  };

  Crawler.prototype.getDomain = function(url) {
    return urlParser(url).hostname;
  };

  Crawler.prototype.getSitemap = function(domain) {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return sitemaps.parseSitemaps(domain + "/sitemap.xml", console.log, function(err, sitemaps) {
          if (!err(resolve(sitemaps))) {

          } else {
            return reject(err);
          }
        });
      };
    })(this));
  };

  Crawler.prototype.getPage = function(url) {
    if (this.crawled.indexOf(url === -1 && this.isAllowed(url))) {
      if (this.processed === 0) {
        this.domain = this.getDomain(url);
      }
      return this.request.get(url).then((function(_this) {
        return function(page, langs) {
          var data;
          _this.processed++;
          _this.crawled.push(url);
          process.send({
            job: url,
            done: _this.processed,
            queue: _this.q.size(),
            domain: _this.domain,
            metrics: true
          });
          data = [_this.parser.getLinks(page, url), _this.parser.getWords(page, langs)];
          return Promise.all(data).then(function(res) {
            var links, words;
            links = res[0];
            words = res[1];
            return links.forEach(function(link) {
              if (_this.domain !== _this.getDomain(link)) {
                return process.send({
                  job: link,
                  metrics: false
                });
              } else {
                console.log(link);
                return _this.q.push(1, link);
              }
            });
          })["catch"](function(err) {
            return console.log("Failed to parse page: '" + url + "'", err);
          });
        };
      })(this))["catch"]((function(_this) {
        return function(err) {};
      })(this));
    }
  };

  return Crawler;

})();

module.exports = Crawler;

//# sourceMappingURL=Crawler.js.map

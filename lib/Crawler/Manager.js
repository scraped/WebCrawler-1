// Generated by CoffeeScript 1.11.1
var Cluster, Manager, PACKETS, PriorityQueue, os;

os = require('os');

Cluster = require('cluster');

PriorityQueue = require('./Queue/PriorityQueue');

PACKETS = {
  JOB: 0
};

Manager = (function() {
  function Manager(options) {
    this.options = options;
    this.queue = PriorityQueue();
    this.workers = [];
    this.loop = 0;
  }

  Manager.prototype.start = function() {
    this.createWorkers();
    console.log("Spawned " + this.workers.length + " workers");
    return this.loop = setInterval((function(_this) {
      return function() {
        var job, worker;
        if (_this.queue.size() > 0) {
          worker = _this.getRandomWorker();
          if (worker) {
            job = _this.queue.pop();
            if (_this.isJobAllowed(job)) {
              return worker.send({
                type: PACKETS.JOB,
                job: job
              });
            }
          }
        }
      };
    })(this), this.options.managerDelay);
  };

  Manager.prototype.stop = function() {
    return clearInterval(this.loop);
  };

  Manager.prototype.isJobAllowed = function(job) {
    return true;
  };

  Manager.prototype.createWorkers = function() {
    var i, j, ref, results, worker;
    results = [];
    for (i = j = 1, ref = this.getMaxWorkers(); 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
      worker = Cluster.fork();
      worker.on('message', (function(_this) {
        return function(pkt) {
          return console.log(pkt);
        };
      })(this));
      worker.on('exit', (function(_this) {
        return function(id) {
          return console.log("Worker " + id + " died...");
        };
      })(this));
      results.push(this.workers.push(worker));
    }
    return results;
  };

  Manager.prototype.getRandomWorker = function() {
    return this.workers[~~(this.workers.length * Math.random())];
  };

  Manager.prototype.getMaxWorkers = function() {
    if (this.options.workers === 'auto') {
      return os.cpus().length;
    }
    return this.options.workers;
  };

  return Manager;

})();

module.exports = Manager;

//# sourceMappingURL=Manager.js.map

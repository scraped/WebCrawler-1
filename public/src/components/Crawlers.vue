<template>
  <div>
    <h1 class="page-header">Crawlers</h1>
      <div class="row">
          <div class="col-sm-3">
              <div class="row">
                  <div class="col-sm-12">
                      <div class="ibox-title">
                          <h5>Master </h5>
                          <div class="ibox-tools">
                              <span class="pull-right label label-primary" v-if="started == true">Running</span>
                              <span class="pull-right label label-danger" v-if="started == false">Stopped</span>
                          </div>
                      </div>
                      <div class="ibox-content">
                          <div class="row">
                              <div class="col-md-8">
                                  <label for="maxWorkers" style="height: 27px;line-height: 27px;">Max Workers</label>
                              </div>
                              <div class="col-md-4">
                                  <input type="number" class="form-control" v-model="maxWorkers" id="maxWorkers">
                              </div>
                          </div>
                          <br>
                          <button class="btn btn-primary btn-block btn-sm" @click="start()" v-if="started == false">
                              <i class="fa fa-power-off"></i> START
                          </button>
                          <button class="btn btn-danger  btn-block btn-sm" @click="stop()" v-if="started == true">
                              <i class="fa fa-power-off"></i> STOP
                          </button>

                          <div class="input-group">
                              <input type="text" class="form-control" v-model="job">
                              <span class="input-group-btn">
                            <button class="btn btn-default" @click="addJob()">Add job</button>
                      </span>
                          </div>
                          <table class="table">
                              <tbody>
                              <tr>
                                  <td>Master queue size</td>
                                  <td class="text-right">{{masterMetrics.queue}}</td>
                              </tr>
                              <tr>
                                  <td>Total jobs done</td>
                                  <td class="text-right">{{masterMetrics.totalLinks}}</td>
                              </tr>
                              <tr>
                                  <td>Current jobs</td>
                                  <td class="text-right">
                                      <a :href="job" target="_blank" style="width: 100%;display:block" v-for="job in masterMetrics.jobs">{{job}}</a>
                                  </td>
                              </tr>
                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>

              <transition-group name="flip-list">
                  <div class="row" v-for="crawler in workers" :key="crawler.id" >
                      <div class="col-sm-12">
                          <div class="ibox-title">
                              <h5>Worker #{{crawler.id}}</h5>
                              <div class="ibox-tools">
                                  <a class="collapse-link">
                                      <i class="fa fa-chevron-up"></i>
                                  </a>
                                  <a class="close-link">
                                      <i class="fa fa-times"></i>
                                  </a>
                              </div>
                          </div>
                          <div class="ibox-content" style="padding:0">
                              <table class="table table-striped" style="margin-bottom: 0">
                                  <tbody>
                                      <tr>
                                          <td>Current domain</td>
                                          <td class="truncate">
                                              <div class="truncate">
                                                  <a :href="crawler.domain" target="_blank">{{crawler.domain}}</a>
                                              </div>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td>Current url</td>
                                          <td>
                                              <div class="truncate">
                                                  <a :href="crawler.url" target="_blank">{{crawler.url | url}}</a>
                                              </div>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td>Jobs in queue</td>
                                          <td class="text-center">{{crawler.queue}}</td>
                                      </tr>
                                      <tr>
                                          <td>Jobs done</td>
                                          <td class="text-center">{{crawler.done}}</td>
                                      </tr>
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  </div>
              </transition-group>
          </div>
          <div class="col-sm-9">

          </div>
      </div>
  </div>

</template>
<style>
.flip-list-move {
    transition: transform 0.2s;
}
</style>
<script>
export default {
  name: 'Crawlers',
  sockets:
  {
      connect() {
          console.log('socket connected')
      },
      workers: function(workers) {
          this.crawlers = workers
      },
      masterStarted: function() {
          this.started = true
      },
      masterStopped: function() {
          this.started = false
      },
      masterMetrics: function(data) {
          this.masterMetrics = data;
      },
      crawlerMetrics: function(data) {
          for(var crawler in this.crawlers) {
              if(this.crawlers[crawler].id == data.id) {
                  this.$set(this.crawlers, crawler, data)
              }
          }
      }
  },
  created() {
        this.$socket.emit('crawler:getWorkers')
  },
  computed: {
        workers: function() {
            let ascDesc = this.sortAsc ? 1 : -1;
            let data = [];
            for(var crawler in this.crawlers)
                data.push(this.crawlers[crawler]);
            return data.sort((a, b) => ascDesc * (parseInt(a.done) - parseInt(b.done)));
        }
  },
  filters: {
        url(value) {
            if(typeof value !== 'undefined') {
                var a = document.createElement('a');
                a.href = value;
                return a.pathname;
            }
        }
  },
  methods:
  {
      start() {
          this.$socket.emit('crawler:start', {
              workers: this.maxWorkers
          })
      },
      stop() {
          this.$socket.emit('crawler:stop')
      },
      addJob() {
        this.$socket.emit('crawler:job', this.job);
        this.job = ''
      }
  },
  data()
  {
    return {
        maxWorkers: 2,
        sortAsc: false,
        masterMetrics: {},
        started: false,
        crawlers: [],
        job: ''
    }
  }
}
</script>

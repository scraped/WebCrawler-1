'use strict'
_			  = require 'lodash'
os            = require 'os'
urlParser     = require 'url-parse'
cluster       = require 'cluster'
simpleTimer   = require 'node-timers/simple'
Crawler       = require './Crawler'
PriorityQueue = require './Crawler/Queue/PriorityQueue'
ipLocation    = require 'ip-location'
timer         = simpleTimer()

class Master
	constructor: (opts = {}) ->
		@cfg =
			delay: 16
			max_workers: opts.maxWorkers or 'auto'
		@stats = {}
		@jobs = []
		@currentWorker = 0
		@exclude = [
		  	'free.fr'
			'statcounter'
		  	'doubleclick'
			'feedburner'
		  	't.co'
			'facebook'
			'google'
		  	'youtube'
			'twitter'
			'github'
		]

		if cluster.isMaster
			@q = PriorityQueue()
			@workers = []

			for i in [1 .. @getMaxWorkers()]
				worker = @spawn()
				@stats[worker.id] =
					domain: null
					queue: 0
					done: 0
				@workers.push worker

			@start()
			@listenEvents () =>
				@io.on 'connection', (socket) =>
					socket.emit 'started'
					socket.emit 'workers', @getWorkersInfos()

					socket.on 'stop', () =>
						@stop()

					socket.on 'getWorkers', () =>
						socket.emit 'workers', @getWorkersInfos()

					socket.on 'job', (job) =>
						@jobs.push job
						@q.push 1, job
		else
			crawler = new Crawler()
			process.on 'message', (pkt) =>
				if pkt.job
					domain = @getDomain pkt.job
#					console.log  pkt.job
					crawler.q.push 1, pkt.job

	getWorkersInfos: () =>
		infos = {}
		for worker in @workers
			process.stdout.write(@stats[worker.id].toString())
			if @stats[worker.id] isnt undefined
				stat = @stats[worker.id]


			infos[worker.id] =
				id: worker.id
				domain: stat.domain if stat isnt undefined
				queue: stat.queue if stat isnt undefined
				done: stat.done if stat isnt undefined
				status: worker.status
		infos

	listenEvents: (cb) ->
		@io = require('socket.io')()
		@io.listen 5002
		cb()

	getDomain: (url) ->
		urlParser(url).hostname

	isAllowed: (url) ->
		allowed = true
		for exclude in @exclude
			if url.indexOf(exclude) >= 0
				allowed = false
		return allowed

	start: ->
		setInterval () =>
			total = 0
			@workers.forEach (w) =>
				if @stats[w.id]
					total += @stats[w.id].done

					@io.sockets.emit 'metrics',
						done: @stats[w.id].done
						queue: @stats[w.id].queue
						url: @stats[w.id].job
						domain: @stats[w.id].domain
						id: w.id

			@io.sockets.emit 'masterMetrics',
				totalLinks: total
				queue: @q.size()
				jobs: @jobs
		, 100

		@interval = setInterval () =>
			if @q.size() > 0
				worker = @getRandomWorker()
				if worker
					job = @q.pop()

	#				ipLocation @getDomain(job), (err, data) =>
	#					console.log data

					if @isAllowed(@getDomain(job)) && (@stats[worker.id].domain == @getDomain(job) || @stats[worker.id].domain is null)
						worker.send job: job
		, @cfg.delay

	stop: ->
		clearInterval @interval
		@io.sockets.emit 'stopped'

	getMaxWorkers: () ->
		return os.cpus().length if @cfg.max_workers == 'auto'
		return @cfg.max_workers

	spawn: () ->
		fork = cluster.fork()

		fork.on 'message', (pkt) =>
			if pkt.queue and pkt.domain and pkt.done and pkt.job
				@q.push 1, pkt.job

				if !@stats[fork.id]
					@stats[fork.id] =
						done: 0
						url: null
						queue: 0
						id: fork.id
						domain: null

				@stats[fork.id].done = pkt.done
				@stats[fork.id].queue = pkt.queue
				@stats[fork.id].job = pkt.job
				@stats[fork.id].domain = pkt.domain

		fork.on 'exit', (id) =>
#			cluster.fork()
			console.log "Worker #{id} died... respawning worker !"

	getNextWorker: () ->
		@currentWorker++
		if @currentWorker > @getMaxWorkers()
			@currentWorker = 0

		@workers.forEach (w) =>
			if w.id == @currentWorker
				return w

	getLazyWorker: () ->
#		worker = _.sortBy(@stats, 'queue')[0]
#		if worker
#			return @workers[worker.id]
#		else
		return @workers[0]

	getRandomWorker: () ->
		@workers[~~(@workers.length * Math.random())]

module.exports = Master

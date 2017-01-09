os     = require 'os'
Cluster = require 'cluster'
PriorityQueue = require './Queue/PriorityQueue'

PACKETS =
	JOB: 0

class Manager
	constructor: (@options) ->
		@queue   = PriorityQueue()
		@workers = []
		@loop    = 0

	start: ->
		@createWorkers()
		console.log "Spawned #{@workers.length} workers"
		@loop = setInterval () =>
			if @queue.size() > 0
				worker = @getRandomWorker()
				if worker
					job = @queue.pop()
					if @isJobAllowed(job)
						worker.send(type: PACKETS.JOB, job: job)
		, @options.managerDelay

	stop: -> clearInterval(@loop)

	isJobAllowed: (job) ->
		return true

	createWorkers: ->
		for i in [1 .. @getMaxWorkers()]
			worker = Cluster.fork()

			worker.on 'message', (pkt) =>
				console.log(pkt)

			worker.on 'exit', (id) =>
				console.log "Worker #{id} died..."

			@workers.push worker

	getRandomWorker: () ->
		@workers[~~(@workers.length * Math.random())]

	getMaxWorkers: () ->
		return os.cpus().length if @options.workers == 'auto'
		return @options.workers

module.exports = Manager

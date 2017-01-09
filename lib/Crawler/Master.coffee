Cluster = require 'cluster'
Events  = require './Events/Events'
Manager = require './Manager'
Worker  = require './Worker'

class Master
	constructor: (options) ->
		@options =
			port         : options.port         or 5002
			managerDelay : options.managerDelay or 10
			workerDelay  : options.workerDelay  or 150
			workers      : options.workers      or 'auto'

		@manager = new Manager(@options)
		@events  = new Events(@manager, @options)

		if Cluster.isMaster
			@manager.start()
			@events.listen()
		else
			worker = new Worker(@options)

	start: ->

module.exports = Master

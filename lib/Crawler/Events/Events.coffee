class Events
	constructor: (@manager, @options) ->
		@io = require('socket.io')()

	listen: ->
		@io.listen @options.port
		@io.on 'connection', (socket) =>
			socket.emit 'started'
#			socket.emit 'workers', @getWorkersInfos()

			socket.on 'stop', () =>
				@stop()

			socket.on 'getWorkers', () =>
#				socket.emit 'workers', @getWorkersInfos()

			socket.on 'job', (job) =>
				@manager.queue.push 1, job

module.exports = Events

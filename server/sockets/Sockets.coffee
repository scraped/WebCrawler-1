io            = require 'socket.io'
jwt           = require 'jsonwebtoken'
clientManager = require 'client-manager'
SocketManager = require './SocketManager'
childProcess  = require('child_process')

module.exports = class Sockets
	constructor: (@app, @server) ->
		@app.io            = io @server
		@manager           = clientManager()
		@socketManager     = new SocketManager @manager
		@app.socketManager = @socketManager

		@listenEvents()
		@app.logger.info '✓ '.bold.green + 'Started sockets handler.'

	listenEvents: () ->
		@crawler_socket = require('socket.io-client')('http://localhost:5002');

		@app.io.on 'connection', (socket) =>

			@crawler_socket.on 'started', () =>
				socket.emit 'masterStarted'

			@crawler_socket.on 'stopped', () =>
				socket.emit 'masterStopped'

			@crawler_socket.on 'workers', (workers) =>
			  	socket.emit 'workers', workers

			@crawler_socket.on 'metrics', (metrics) =>
				socket.emit 'crawlerMetrics', metrics

			@crawler_socket.on 'masterMetrics', (metrics) =>
				socket.emit 'masterMetrics', metrics

			socket.on 'join', (data) =>
				jwt.verify data.authorization, @app.config.jwt_secret, (err, user) =>
					if err is null
						user.status = 'online'
						socket.user = user;
						@manager.addClient user.id, socket

						@socketManager.getClients().forEach (client) ->
							socket.emit 'onUserStatus', client

						socket.broadcast.emit 'onUserStatus', @socketManager.getClient user.id

			socket.on 'crawler:start', (opts) =>
				crawler = childProcess.spawn 'node', ['crawler.js', JSON.stringify opts]

				crawler.stdout.on 'data', (data) =>
					console.log new Buffer(data).toString('utf8')

				crawler.stderr.on 'data', (err) =>
					console.log new Buffer(err).toString('utf8')

			socket.on 'crawler:getWorkers', () =>
				@crawler_socket.emit('getWorkers')

			socket.on 'crawler:job', (job) =>
				@crawler_socket.emit('job', job)

			socket.on 'crawler:stop', () =>
				@crawler_socket.emit('stop')

			socket.on 'disconnect', =>
				client = @socketManager.getClientBySocketId socket.id
				if client isnt null
					client.status = 'offline'
					socket.broadcast.emit 'onUserstatus', client
					@manager.removeClient client.id

					@app.logger.info "#{client.firstname} #{client.lastname} has disconnected"

		@manager.on 'add', (client) =>
			@app.logger.info "#{client.user.firstname} #{client.user.lastname} is connected"

		@manager.on 'empty', =>
			@app.logger.info 'No more sockets connected'

class SocketManager
	constructor: (manager) ->
		@clients = manager.clients
		@fields = [
			'id'
			'firstname'
			'lastname'
			'role'
			'email_md5'
			'status'
		]

	_getFields: (data) ->
		client = {}
		for f of data.user
			if @fields.indexOf f >= 0
				client[f] = data.user[f]
		client

	getClientBySocketId: (id) ->
		for s of @clients
			if @clients[s] and @clients[s].id == id
				return @_getFields @clients[s]
		null

	getClientSocket: (id) ->
		for s of @clients
			if @clients[s] and @clients[s].user.id == id
				return @clients[s]
		null

	getClient: (id) ->
		for s of @clients
			if @clients[s] and @clients[s].user.id == id
				return @_getFields @clients[s]
		null

	getClients: () ->
		clients = []
		for s of @clients
			if @clients[s]
				clients.push @_getFields @clients[s]
		clients

module.exports = SocketManager

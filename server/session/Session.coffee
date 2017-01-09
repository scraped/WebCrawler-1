redis       = require 'redis'
session     = require 'express-session'
RedisStore  = require('connect-redis')(session)
module.exports = class Session
	constructor: (@app) ->
		@config =
#			store: new RedisStore
#				host   : 'http://127.0.0.1'
#				port   : 6379,
#				client : redis.createClient()
#				ttl    : 999999
			secret : @app.config.jwt_secret
			cookie :
				maxAge: 7 * 24 * 60 * 60 * 1000
			name   : 'session'
			secure : true
			resave : false
			saveUninitialized: false

		@app.use (req, res, next) =>
			if !req.decoded
				req.decoded = role: 'guest'
			next()

		@app.use session @config
		@app.logger.info '✓ '.bold.green + 'Start session middleware.'

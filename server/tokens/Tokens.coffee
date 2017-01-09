expressJwt   = require 'express-jwt'
pathToRegexp = require 'path-to-regexp'

module.exports = class Tokens
	constructor: (@app) ->
		@config =
			jwt:
				secret: @app.config.jwt_secret
				requestProperty: 'decoded'
			exclude:
				path: [
					'/'
					'/locales'
					pathToRegexp '/.well_known/acme-challenge/'
					pathToRegexp 'locales/:code'
					pathToRegexp '/domains'
					pathToRegexp '/domains:id'
					'/users/auth'
					'/users/logout'
					'/users/register'
					'/users/recover'
				]

		@app.use(expressJwt(@config.jwt).unless(@config.exclude))

		@app.use (err, req, res, next) =>
			if err.name == 'UnauthorizedError'
				@app.error res, statusCode: 403, message: 'Invalid Access-Token'

		@app.logger.info '✓ '.bold.green+'Setup JSON Web Tokens.'



pathToRegexp  = require 'path-to-regexp'
expressAcl    = require 'express-acl'

class Security
	constructor: (@app) ->
		@config =
			exclude:
				path: [
					'/'
					'/locales'
					pathToRegexp '/.well_known/acme-challenge/'
					pathToRegexp '/locales/:code'
					'/users/auth'
					'/users/logout'
					'/users/register'
					'/users/recover'
				]

		expressAcl.config baseUrl: '/'
		@app.use expressAcl.authorize.unless @config.exclude

		@app.use (req, res, next) =>
			res.setHeader 'Application-Name', @app.config.name
			res.header 'Access-Control-Allow-Origin', '*'
			res.header 'Access-Control-Allow-Headers', 'X-Requested-Width'
			res.header 'Access-Control-Allow-Headers', 'Content-Type'
			res.header 'Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE'
			next()

		@app.logger.info '✓ '.bold.green+'Loaded users permissions.'

module.exports = Security

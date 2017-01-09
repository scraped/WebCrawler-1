qt           = require 'quickthumb'
colors       = require 'colors'
express      = require 'express'
cookieParser = require 'cookie-parser'
bodyParser   = require 'body-parser'
compression  = require 'compression'
helmet 		 = require 'helmet'

module.exports = class Request
	constructor: (@app) ->
		@config =
			dirs:
				public : "#{__dirname}/../../public"
				bower  : "#{__dirname}/../../public/bower_components"

		@enableHelmet()
		@enableImagesResize()
		@enableCompression()
		@setResponseMethods()
		@setParsers()
		@setStaticDirs()

	setResponseMethods: ->
		@app.success = (res, data, msg) ->
			res.json
				code: 200,
				success: true,
				message: msg or null,
				data: data

		@app.error = (res, error) ->
			res.json
				code: error.statusCode
				success: false
				message: error.message
				data: null

	setParsers: ->
		@app.use cookieParser()
		@app.use bodyParser.json()
		@app.use bodyParser.urlencoded(extended: true)
		@app.logger.info '✓ '.bold.green+'Loaded requests parsers.'

	setStaticDirs: ->
		@app.use('/', express.static @config.dirs.public)
		@app.use('/', express.static @config.dirs.bower)
		@app.logger.info '✓ '.bold.green+'Loaded static directories.'

	enableHelmet: ->
		@app.use helmet()
		@app.logger.info '✓ '.bold.green+'Security protocols enabled.'

	enableCompression: ->
		@app.use compression()
		@app.logger.info '✓ '.bold.green+'Enabled gzip compression on requests.'

	enableImagesResize: ->
		@app.use('/', qt.static(__dirname + '/../../public'));
		@app.logger.info '✓ '.bold.green+'Enabled images resize on requests.'

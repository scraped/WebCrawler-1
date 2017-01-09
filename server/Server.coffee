http     = require 'http'
colors   = require 'colors'
express  = require 'express'
Config   = require "#{__dirname}/../config"

Logger   = require './logger/Logger'
Mailer   = require './mailer/Mailer'
Engine   = require './rendering/Engine'
Request  = require './requests/Request'
Locales  = require './locales/Locales'
Session  = require './session/Session'
Sockets  = require './sockets/Sockets'
Tokens   = require './tokens/Tokens'
Security = require './security/Security'
Database = require './database/Database'
Api      = require './api/Api'

module.exports = class Server
	constructor: (options = {}) ->
		@port = options.port or process.env.PORT || 5001
		@app = express()
		@app.config = Config
		@app.logger = Logger

	start: ->
		@app.logger.info '\u279F'.red.bold+' Starting server...'

		@engine   = new Engine @app
		@request  = new Request @app
		@session  = new Session @app
		@locales  = new Locales @app
		@tokens   = new Tokens @app
		@security = new Security @app
		@mailer   = new Mailer @app

		@instance = http.createServer @app
		@sockets  = new Sockets @app, @instance
		@api 	  = new Api @app, => @listen()

		@app.mailer = @mailer;

	listen: ->
		@instance.listen @port, =>
			char = '*'
			str = 'Server started on port: %s'

			@app.logger.info char.repeat(str.length + @port.toString().length + 2).cyan
			@app.logger.info char.cyan+' '.repeat(str.length + @port.toString().length) + char.cyan
			@app.logger.info char.cyan+' '+str+' '+char.cyan, @port.toString().bold.green
			@app.logger.info char.cyan+' '.repeat(str.length + @port.toString().length) + char.cyan
			@app.logger.info char.repeat(str.length + @port.toString().length + 2).cyan

Sequelize   = require 'sequelize'
SeqFixtures = require 'sequelize-fixtures'
Database    = require '../database/Database'
Router      = require '../requests/Router'

module.exports = class Api
	constructor: (@app, @cb) ->
		@config   = path: "#{__dirname}/../../api"
		@db       = new Database(@app)
		@app.api  = Router.getModules @config.path, @db, @app
		@models   = @app.api.models
		@fixtures = @app.api.fixtures

		@loadModels()
		sync = @db.instance.sync()
		sync.then () =>
			@loadFixtures()
			Router.getRoutes @config.path, @app, Sequelize, @db
			@app.logger.info '✓ '.bold.green+'Rest API started.'
			@cb()

	loadModels: ->
		for m of @models
			if typeof @models[m].associate == 'function'
				@models[m].associate @models

	loadFixtures: ->
		for f of @fixtures
			@app.logger.info '✓ '.bold.green+'Loaded fixtures for model : %s.', f
			SeqFixtures.loadFixtures @fixtures[f], @models

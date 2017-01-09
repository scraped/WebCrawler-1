fs = require 'fs'
path = require 'path'

Router =
	getRoutes: (dir, app, Sequelize, db) ->
		fs.readdirSync(dir).forEach (file) ->
			name = path.join dir, file
			stat = fs.lstatSync name

			if stat.isDirectory()
				Router.getRoutes name, app, Sequelize, db
			else if file.toLowerCase() == 'routes.js'
				require(name)(app, Sequelize, db)

	getModules: (dir, db, app) ->
		modules = controllers: {}, models: {}, fixtures: {}

		fs.readdirSync(dir).forEach (file) =>
			name       = path.join dir, file
			stat       = fs.lstatSync name
			controller = path.join name, 'index.js'
			model      = path.join name, 'model.js'
			fixtures   = path.join name, 'fixtures.json'

			if stat.isDirectory()
				if fs.existsSync controller
					modules.controllers[file] = require(controller)(app, db.sequelize, db.instance)
				if fs.existsSync fixtures
					modules.fixtures[file] = require fixtures
				if fs.existsSync model
					m = require model
					if typeof m == 'function'
						modules.models[file] = m db.instance, db.sequelize, app

		return modules

module.exports = Router

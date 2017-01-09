Sequelize = require 'sequelize'

module.exports = class Database
	constructor: (@app) ->
		if @app.logger
			@app.logger.info '✓ '.bold.green+'Selected new database : %s.',
				@app.config.db.dev.database

		return instance: new Sequelize(
			@app.config.db.dev.database,
			@app.config.db.dev.user,
			@app.config.db.dev.password,
				logging: false
				dialect: @app.config.db.dev.adapter
				dialectOptions:
					charset: 'utf8mb4'
				define:
					timestamps: true
					charset: 'utf8',
					collate: 'utf8_general_ci',

		),
		sequelize: Sequelize

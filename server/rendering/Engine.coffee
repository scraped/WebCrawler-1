fs       = require 'fs'
colors   = require 'colors'
hogan    = require 'hogan-express'
Renderer = require '../rendering/Renderer.coffee'

module.exports = class Engine
	constructor: (@app) ->
		@config =
			views    : "#{__dirname}/../../api"
			layout   : "#{__dirname}/../../layouts/default.html"
			partials : "#{__dirname}/../../layouts/partials"

		@setup();
		@app.use((new Renderer({})).render)
		@app.logger.info '✓ '.bold.green+'Started render engine.'

	setup: ->
		@app.set 'view engine', 'html'
		@app.set 'views', @config.views
		@app.set 'layout', @config.layout
		@app.set 'partials', @getPartials()

		@app.locals.delimiters = '<% %>'
		@app.enable 'view cache'
		@app.engine 'html', hogan

		@app.logger.info '✓ '.bold.green+'Load render engine configuration.'

	getPartials: ->
		partials = {}
		fs.readdirSync(@config.partials).forEach (file) =>
			if file.toLowerCase().indexOf '.html'
				name = (file.split('.')[0]).toLowerCase()
				partials[name] = "#{@config.partials}/#{file}"

		@app.logger.info '✓ '.bold.green+'Render partials loaded.'
		return partials

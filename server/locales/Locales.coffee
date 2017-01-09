fs   = require 'fs'
path = require 'path'
glob = require 'glob'

module.exports = class Locales
	constructor: (@app) ->
		@app.get '/locales/:code', (req, res) =>
			lang = "#{__dirname}/../../locales/#{req.params.code}.json"
			fs.readFile lang, 'utf8', (err, data) =>
				if err is null
					@app.success res, JSON.parse(data).app
				else
					@app.error res, statusCode: 404, message: 'Lang not found'

		@app.get '/locales', (req, res) =>
			dir = "#{__dirname}/../../locales"
			glob "#{dir}/*.json", {}, (err, files) =>
				if err is null
					langs = {}
					files.forEach (file) =>
						lang = path.basename file, '.json'
						data = fs.readFileSync file, 'utf8'
						langs[lang] = JSON.parse(data).app

					@app.success res, langs

		@app.logger.info '✓ '.bold.green + 'Locales loaded.'

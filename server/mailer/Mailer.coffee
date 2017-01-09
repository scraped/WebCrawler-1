fs       = require 'fs'
_        = require 'lodash'
mustache = require 'mustache'
mailgun  = require 'mailgun-js'

class Mailer
	constructor: (@app, options = {}) ->
		@from     = options.from or "no-reply@#{@app.config.domain}"
		@ext      = options.ext  or 'html'
		@dir      = options.dir  or "#{__dirname}/../../layouts/emails/templates"
		@instance = mailgun apiKey: @app.config.mailgun_key, domain: @app.config.domain
		@vars     =
			title: @app.config.name
			appName: @app.config.name
			year: new Date().getFullYear()
			domain:
				url: "http://#{@app.config.domain}"
				name: @app.config.domain
			header: null
			content: null
			action:
				url: null
				text: null

		@app.logger.info '✓ '.bold.green+'Started mailer daemon.'

	loadTemplate: (file, cb) ->
		fs.readFile "#{@dir}/#{file}.#{@ext}", 'utf8', (err, data) ->
			cb data if err is null

	parse: (template, vars) ->
		return mustache.to_html template, vars

	loadPrefab: (prefab, options, cb) ->
		vars = require "#{__dirname}/../../layouts/emails/prefabs/#{prefab}.json"

		@loadTemplate vars.template, (html) =>
			parsed = @parse html, _.merge(_.merge(@vars, vars), options)
			console.log(_.merge(_.merge(@vars, vars), options))
			cb({
				from    : options.from or @from
				to      : options.to
				subject : options.subject or vars.subject
				html    : parsed
			})

	send: (prefab, options, cb) ->
		@loadPrefab prefab, options, (data) =>
			@instance.messages().send data, (err, body) ->
				console.log err, body
				cb err, body if typeof cb == 'function'

module.exports = Mailer

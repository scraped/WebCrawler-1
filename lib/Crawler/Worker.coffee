_             = require 'lodash'
PriorityQueue = require './Queue/PriorityQueue'
Request       = require './Requests/request'
Parser        = require './Parser'
ContentType   = require 'content-type'

PACKETS =
	JOB: 0

class Worker
	constructor: (@options) ->

		@loop      = 0
		@processed = 0
		@domain    = null
		@discovery = true
		@queue     = PriorityQueue()
		@request   = new Request()
		@parser    = new Parser()
		@crawledAt = null
		@sitemap   = null
		@mode      = 'email'
		@emails    = []

		@start()

		process.on 'message', (packet) =>
			if packet.type == PACKETS.JOB
				@addJob packet.job

	start: ->
		@loop = setInterval () =>
			if @queue.size() > 0
				@getUrl @queue.pop()
		, @options.workerDelay

	stop: ->
		clearInterval @loop

	addEmail: (emails) =>
		emails.forEach (email) =>
			if @emails.indexOf(email) == -1
				@emails.push @parser.cleanEmail email

	addJob: (job) ->

		@crawledAt = new Date()
		@domain = @parser.getDomain job

		@parser.getSitemap(job).then (sitemap) =>
			if sitemap.sites.length > 0
				@discovery = false
				sitemap.sites.forEach (link, index) =>
					@queue.push index, link
			else
				@queue.push 1, job
		.catch (err) =>
			#console.log err

	getUrl: (url) =>
		stats =
			techs        : []
			metas        : {}
			url          : ''
			nbLinks      : 0
			nbWords      : 0
			pageSize     : 0
			responseTime : 0
			parsingTime  : 0
			statusCode   : 0
			contentType  : null
			charset      : null
			langs        : null

		@request.get(url).then (data, langs) =>
			@processed++
			if @mode == 'email'
				body = @parser.removeScriptsTags(@parser.removeStyleTags(data.body))
				@addEmail(_.uniq(@parser.getEmails(body)))
				process.stdout.write("\u001b[2J\u001b[0;0H")
				console.log @emails, @emails.length

			else if @mode == 'url'
				timer = new Date()
				stats.responseTime = data.responseTime / 1000
				content = ContentType.parse data.headers['content-type']

				if content.parameters.charset isnt undefined
					stats.charset = content.parameters.charset.toLowerCase()

				stats.url         = @parser.getPathname url
				stats.statusCode  = data.statusCode
				stats.contentType = content.type
				stats.langs       = langs or null

				promises = [
					@parser.getLinks data.body, @domain
					@parser.getWords data.body, langs, 20
					@parser.getMeta url
					@parser.getTechnologies url
				]

				Promise.all(promises).then (res) =>
					links = res[0]
					words = res[1]
					metas = res[2]
					techs = res[3]

					stats.nbLinks     = (links.internals.length + links.externals.length) or 0
					stats.pageSize    = @parser.byteCount data.body or 0
					stats.nbWords     = words.length or 0
					stats.parsingTime = (new Date() - timer) / 1000
					stats.metas	      = metas or null
					stats.techs	      = techs or null
					stats.words	      = words or null

					console.log @processed, stats

				.catch (err) => {}
		.catch (err) => {}

module.exports = Worker

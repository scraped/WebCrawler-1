PriorityQueue = require './Crawler/Queue/PriorityQueue'
Request       = require './Crawler/Requests/request'
Parser        = require './parser'
urlParser     = require 'url-parse'
robots        = require 'robots'
robots_parser = new robots.RobotsParser
sitemaps      = require 'sitemap-stream-parser'

class Crawler
	constructor: ->
		@processed = 0
		@crawled   = []
		@delay     = 250
		@domain    = null
		@parser    = new Parser()
		@request   = new Request()
		@q         = PriorityQueue()
		@exclude = [
			'free.fr'
			'statcounter'
			'doubleclick'
			'feedburner'
			't.co'
			'facebook'
			'google'
			'youtube'
			'twitter'
			'github'
		]

		@start()

	start: ->
		@interval = setInterval () =>
			if @q.size() > 0
				@getPage @q.pop()
		, @delay

	isAllowed: (url) ->
		allowed = true
		for exclude in @exclude
			if url.indexOf(exclude) >= 0
				allowed = false
		return allowed

	stop: ->
		clearInterval @interval

	canFetch: (robots_url, url, cb) =>
		robots_parser.setUrl robots_url, (parser, success) =>
			if success
				robots_parser.canFetch '*', url, (access) =>
					cb access

	getDomain: (url) ->
		urlParser(url).hostname

	getSitemap: (domain) =>
		return new Promise (resolve, reject) =>
			sitemaps.parseSitemaps "#{domain}/sitemap.xml", console.log, (err, sitemaps) =>
				if !err resolve sitemaps
				else reject err

	getPage: (url) ->

		if @crawled.indexOf url == -1 && @isAllowed url
			if @processed == 0
				@domain = @getDomain url

			@request.get url
			.then (page, langs) =>
				@processed++
				@crawled.push url
				process.send
					job: url,
					done: @processed
					queue: @q.size()
					domain: @domain
					metrics: true

				data = [
					@parser.getLinks page, url
					@parser.getWords page, langs
				]

				Promise.all data
				.then (res) =>
					links = res[0]
					words = res[1]

					links.forEach (link) =>
						if @domain != @getDomain link
							process.send(job: link, metrics: false)
						else
							console.log link
							@q.push 1, link

				.catch (err) =>
					console.log "Failed to parse page: '#{url}'", err
			.catch (err) =>
	#			console.log "Failed to load url: '#{url}'", err

module.exports = Crawler

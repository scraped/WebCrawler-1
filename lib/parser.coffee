_         = require 'lodash'
Url 	  = require 'url'
Cheerio   = require 'cheerio'
StopWords = require '../data/stopwords-all.json'

class Parser
	constructor: ->

	getLinks: (body, domain) ->
		domain = domain.replace /^https?:\/\//, ''
		return new Promise (resolve) =>
			urls = []
			console.log(@removeScriptsTags(body))
			@$ = Cheerio.load body

			@$('a').each (index, link) =>
				url = @$(link).attr('href')
				if url and url isnt undefined
					urls.push url

			urls.forEach (url, index) =>
				if url and url isnt undefined
					url = @url url, domain

					if url and url isnt undefined
						url_domain = url.replace(/.*?:\/\//g, '').replace(/\/$/, '')

						if url_domain != domain
							urls[index] = url
						else
							urls.splice index, 1

			urls.forEach (url, index) =>
				if url == '/'
					urls.splice index, 1

			resolve _.uniq urls

	isStopWord: (word) ->
		locales = ['en', 'fr']
		for locale of StopWords
			if locales.indexOf(locale) >= 0
				return StopWords[locale].indexOf(word) >= 0

	getWords: (body, langs, limit = 20) ->
		words = []
		corpus = []
		text  = @$('body').text()
		text  = text.replace(/\s+/g, " ")
		.replace(/[^a-zA-Z ]/g, "")
		.toLowerCase();

		text.split(' ').forEach (word) =>
			if @isStopWord(word)
				return
			if word.length < 4 or word.length > 20
				return

			if corpus[word]
				corpus[word]++
			else
				corpus[word] = 1

		for w of corpus
			words.push word: w, count: corpus[w]

		words.sort (a, b) ->
			return b.count - a.count

		return words.slice 0, limit

	url: (url, domain) ->
		if url and url isnt undefined
			url = Url.parse url

			if url.protocol is null
				url.protocol = 'http:'

			if url.href.substring(0, 1) == '/' && url.href.substring(0, 2) != '//'
				url.href = "#{url.protocol}//#{domain}#{url.href}"
			else if url.href.substring(0, 2) == '//'
				url.href = url.protocol + url.href
			else if url.href == '/'
				url.href = domain
			else if url.href.substring(0, 2) == './'
				url.href = "#{url.protocol}//#{domain}#{url.href}"
			else if url.href.substring(0, 1) == '#'
				url.href = "#{url.protocol}//#{domain}#{url.href}"
			else if url.href.substring(0, 3) == '../'
				url.href = "#{url.protocol}//#{domain}/#{url.href}"
			else if url.href.substring(0, 11) == 'javascript:'
				return undefined
			else if url.href.substring(0, 7) == 'mailto:'
				return undefined

			return url.href

module.exports = Parser

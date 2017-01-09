Package = require '../../../package.json'
request = require 'request'

class Request
	constructor: (@opts = {}) ->
		@defaults =
			uri            : @opts.uri            || null
			method         : @opts.method         || 'GET'
			timeout        : @opts.timeout        || 3000
			followRedirect : @opts.followRedirect || true
			maxRedirects   : @opts.maxRedirects   || 2
			json           : @opts.json           || false
			headers:
				'User-Agent': "#{Package.name} #{Package.version}"

	getLang: (res) ->
		langs = []
		if res isnt undefined
			langs_header = res.headers['accept-language']
			if langs_header isnt undefined
				langs = langs_header.split(':')[1].match(/[a-zA-z\-]{2,10}/g) || []
		return langs

	get: (url) ->
		@defaults.uri = url;
		start = new Date()
		return new Promise (resolve, reject) =>
			request @defaults, (error, res) =>
				if !error && res.statusCode == 200
					res.responseTime = new Date() - start
					lang = @getLang res
					resolve res, lang
				else
					reject error

module.exports = Request

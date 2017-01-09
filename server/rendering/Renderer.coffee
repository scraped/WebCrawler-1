_ = require 'lodash'

Renderer = (config) ->
	@render = (req, res, next) =>
		render = res.render
		res.render = (view, locals, cb) =>
			settings =
				f_dateY: () -> () -> new Date()
				f_ucfirst: () -> (str) -> _.upperFirst str
			render.call res, view, _.merge(settings, locals), cb
		next()

	return this

module.exports = Renderer

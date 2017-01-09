winston = require 'winston'
moment  = require 'moment'

moment.locale 'fr'
winston.cli()

logger = new winston.Logger
	transports: [
		new (winston.transports.Console)(
			timestamp: -> moment().format 'DD-MM-YYYY HH:mm:ss'
		)
	]

logger.cli()
module.exports = logger


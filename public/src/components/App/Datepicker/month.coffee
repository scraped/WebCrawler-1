moment = require 'moment'
require 'moment-range'

class Month
	constructor: (@date) ->
		@start = moment(@date)
		@month = @start.get 'month'
		@year  = @start.get 'year'
		@end   = @start.clone().endOf 'month'

	getWeekStart: ->
		return @start.weekday()

	getDays: ->
		return moment.range(@start, @end).toArray 'days'

	getFormatted: ->
		return @start.format 'MMMM YYYY'

module.exports = Month

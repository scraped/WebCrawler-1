PriorityQueue = ->
	@q = []

	_best = (a, b) ->
		@q[a].priority < @q[b].priority

	_swap = (a, b) ->
		[@q[a], @q[b]] = [@q[b], @q[a]]

	_shift_down = ->
		n   = 0
		max = @q.length

		while n < max
			c1   = 2 * n + 1
			c2   = c1 + 1
			best = n
			best = c1 if c1 < max and _best c1, best
			best = c2 if c2 < max and _best c2, best
			return if best == n
			_swap n, best
			n = best

	_shift_up = ->
		n = q.length - 1

		while n > 0
			parent = ~~((n - 1) * .5)
			return if _best parent, n
			_swap n, parent
			n = parent

	get: -> q

	size: -> q.length

	push: (priority, value) ->
		q.push priority: priority, value: value
		_shift_up()

	pop: ->
		console.log 'Cannot pop from empty queue' if q.length == 0
		value = q[0].value
		last = q.pop()
		if q.length > 0
			q[0] = last
			_shift_down()
		value

module.exports = PriorityQueue

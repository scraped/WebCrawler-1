Request = require './Requests/request'
Root    = 'http://localhost:5001'

module.exports =

	getAll: () =>
		return new Promise (resolve, reject) =>
			Request.get("#{Root}/domains")
			.then (res)  => resolve res
			.catch (err) => reject err

	get: (domain) =>
		return new Promise (resolve, reject) =>
			Request.get("#{Root}/domains/#{domain}")
			.then (res)  => resolve res
			.catch (err) => reject err

	add: (data) =>
		return new Promise (resolve, reject) =>
			Request.post("#{Root}/domains", data)
			.then (res)  => resolve res
			.catch (err) => reject err

	update: (domain, data) =>
		return new Promise (resolve, reject) =>
			Request.put("#{Root}/domains/#{domain}", data)
			.then (res)  => resolve res
			.catch (err) => reject err

	delete: (domain) =>
		return new Promise (resolve, reject) =>
			Request.delete("#{Root}/domains/#{domain}")
			.then (res)  => resolve res
			.catch (err) => reject err

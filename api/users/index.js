/**
 * Created by Mel on 04/08/2016.
 */

var _            = require('lodash');
var sha512       = require('js-sha512');
var md5          = require('md5');
var jwt          = require('jsonwebtoken');
var moment       = require('moment');
var config       = require(__dirname+'/../../config');
var jwtBlacklist = require('express-jwt-blacklist');

module.exports = function(app, Sequelize, db)
{
    return controller = {
        index: function(req, res)
        {
            let limit = req.query.limit || 10;
            let page  = req.query.page  || 1;

            app.api.models.users.findAndCountAll(
            {
                attributes: [
                    'id',
                    'firstname',
                    'lastname',
                    'email',
                    'role',
                    'createdAt',
                    'updatedAt'
                ],
                limit: limit,
                offset: (page - 1) * limit,
                order: 'createdAt DESC, updatedAt DESC',
            })
            .then(function(data)
            {
                var users = [];
                data.rows.forEach((u) =>
                {
                    var user = {
                        id: u.id,
                        firstname: u.firstname,
                        lastname: u.lastname,
                        email: u.email,
                        email_md5 : md5(u.email),
                        role: u.role,
                        status: 'offline',
                        createdAt: u.createdAt,
                        updatedAt: u.updatedAt
                    };

                   var clients = app.socketManager.getClients();
                   clients.forEach((c) => {
                        if(c.id == u.id)
                            user.status = 'online';
                   });

                   users.push(user)
                });

                app.success(res, {
                    count   : data.count,
                    rows    : users,
                    nbPages : Math.ceil(data.count / limit)
                });
            })
            .catch(function(error)
                { app.error(res, error) })
        },
        search: (req, res) =>
        {
			app.api.models.users.findAll(
			{
				attributes: [
					'id',
					'firstname',
					'lastname',
					'email',
					'role'
				],
				where: {
					$or: [{
							firstname: {$like: '%'+req.body.q+'%'}
						}, {
							lastname: {$like: '%'+req.body.q+'%'}
						}
					]
				},
				order: 'createdAt DESC, updatedAt DESC'
			})
			.then(function(data)
			{
				var users = [];
				data.forEach((u) =>
				{
					var user = {
						id: u.id,
						firstname: u.firstname,
						lastname: u.lastname,
						fullname: [u.firstname, u.lastname].join(' '),
						email: u.email,
						email_md5: md5(u.email),
						role: u.role,
						status: 'offline',
					};

					var clients = app.socketManager.getClients();
					clients.forEach((c) => {
						if(c.id == u.id)
							user.status = 'online';
					});

					users.push(user)
				});

				app.success(res, users);
			})
			.catch(function(error)
			{ app.error(res, error) })
        },
        delete: function(req, res)
        {
            app.api.models.users.destroy({
                where: {
                    id: req.params.id
                }
            })
            .then(function(user)
            {
                if(user > 0)
                {
                    app.success(res, user, 'Deleted');
                    app.logger.warn('The user "%s" has unregister' , req.params.id);
                }
                else
                    app.error(res, {statusCode: 404, message: 'Not found'});
            })
            .catch(function(error)
            { app.error(res, error); })
        },
        logout: function(req, res)
        {
            if(typeof req.session.user !== 'undefined')
            {
                var client = app.socketManager.getClientSocket(req.session.user.id);
                req.session.user.status = 'offline';
                if(client)
                    client.broadcast.emit('onUserStatus', req.session.user);

                //Todo: revoke jwt token
                app.logger.info('%s %s has disconnected' , req.session.user.firstname, req.session.user.lastname);
                delete req.session.user;
                app.success(res, null, 'Disconnected');

            }
            else
                app.error(res, {statusCode: 404, message: 'No session to logout'});
        },
        email: function(req, res)
        {

        },
        isAuth: function(req, res)
        {
            if(typeof req.session.user !== 'undefined')
                app.success(res, null, 'Authentified');
            else
                app.error(res, {statusCode: 401, message: 'Not authentified'});
        },
        auth: function(req, res)
        {
            app.api.models.users.findAndCountAll(
            {
                attributes: [
                    'id',
                    'firstname',
                    'lastname',
                    'biography',
                    'email',
                    'activated',
                    'role'
                ],
                where:
                {
                    email    : req.body.email || '',
                    password : sha512(req.body.password || '')
                }
            }).then(function(data)
            {
                if(data.rows.length == 0)
                    app.error(res, {statusCode: 401, message: 'Invalid credentials'});
                else
                {
                	data = data.rows[0];

                    var user = {
                    	id: data.get('id'),
						firstname: data.get('firstname'),
						lastname: data.get('lastname'),
						biography: data.get('biography'),
						email: data.get('email'),
                        email_md5 : md5(data.get('email')),
						role: data.get('role'),
						activated: data.get('activated')
					};
                    console.log(req.session);

                    if(user.activated)
                    {
                        user.email_md5 = md5(user.email);
                        delete user.activated;
                        delete user.email;

                        user.token = jwt.sign(user, config.jwt_secret, {
							expiresIn: 7 * 24 * 60 * 60
						});

                        req.session.user = user;
                        app.logger.info(
                            '%s %s has just connected',
                            req.session.user.firstname,
                            req.session.user.lastname
                        );
                        app.success(res, user, 'Authentified');
                    }
                    else
                        app.error(res, {
                            statusCode: 401,
                            message: 'Your account is not activated. Please check your emails.'
                    });
                }
            })
            .catch(function(error)
            { app.error(res, error) });
        },
        recover: function(req, res)
        {

        },
        view: function(req, res)
        {
            app.api.models.users.findAndCountAll({
                where: {
                    id: req.params.id
                }
            })
            .then(function(data)
            {
            	if(data)
	            {
	                var u = data.rows[0];
		            var user = {
			            id: u.id,
			            firstname   : u.firstname,
			            lastname    : u.lastname,
			            fullname    : [u.firstname, u.lastname].join(' '),
			            biography   : u.biography,
			            birthdate   : u.birthdate,
			            phone       : u.phone,
			            city        : u.city,
			            country     : u.country,
			            postal_code : u.postal_code,
			            road_number : u.road_number,
			            road_name   : u.road_name,
			            createdAt   : u.createdAt,
			            updatedAt   : u.updatedAt,
                        activated   : u.activated,
			            email       : u.email,
			            email_md5   : md5(u.email),
			            role        : u.role,
			            status      : 'offline'
		            };

                    var clients = app.socketManager.getClients();
                    clients.forEach((c) => {
                        if(c.id == u.id)
                            user.status = 'online';
                    });

                    app.success(res, user);
	            }
               else
		            app.error(res, {statusCode: 404, message: 'User not found'});
            })
            .catch(function(error)
            { app.error(res, error) })
        },
        getFriends: userId => {
            return new Promise((resolve, reject) => {
                db.query
                (`
                    SELECT
                        m.id         as friend_id,
                        m.firstname  as friend_firstname,
                        m.lastname   as friend_lastname,
                        md5(m.email) as friend_email_md5,
                        
                        x.id         as friendship_id,
                        x.author     as friendship_author,
                        x.createdAt  as friendship_createdAt,
                        x.updatedAt  as friendship_updatedAt,
                        x.status     as friendship_status
                    
                    FROM 
                        users m
                    JOIN
                    (
                        (
                            SELECT
                                f.id,
                                f.friendId as user_id,
                                f.status,
                                f.author,
                                f.createdAt,
                                f.updatedAt
                            FROM 
                                friends f
                            WHERE
                                f.userId = ?
                        )
                        UNION
                        (
                            SELECT
                                t.id,
                                t.userId as user_id,
                                t.status,
                                t.author,
                                t.createdAt,
                                t.updatedAt
                            FROM
                                friends t
                            WHERE
                                t.friendId = ?
                        )
                    ) x
                    ON 
                        x.user_id = m.id`,
                    {
                        replacements: [userId, userId]
                    }
                ).then(friendships =>
                {
                    resolve(_.uniqBy(friendships, 'friend_id')[0]);
                })
                    .catch(error => {
                        reject(error);
                    })
            });
        },
        setActivationKey: function(email, key, cb) {
            app.api.models.users.update({activationKey: key}, {where: {email: email}}).then(data =>
            {
                if(typeof cb == 'function')
                    cb(data);
            }).catch(error => { console.log(error) });
        },
        setResetKey: function(email, key, cb) {
            app.api.models.users.update({resetKey: key}, {where: {email: email}}).then(data =>
            {
                if(typeof cb == 'function')
                    cb(data);
            }).catch(error => { console.log(error) });
        },
        generateToken: function(cb) {
            require('crypto').randomBytes(48, function(err, buffer) {
                if(!err && typeof cb == 'function')
                    cb(buffer.toString('hex'));
                else
                    cb(false);
            });
        },
        activation: function(req, res) {
            app.success(res, {}, 'Ok');
        },
        request: function(req, res)
        {
        app.api.models.users.findOne({
                where: {email: req.body.email}
            }).then(exists =>
            {
                if(exists !== null)
                {
                    controller.generateToken(token =>
                    {
                        let template =  null, action = {};
                        if(req.params.type == 'activation') {
                            template = 'register';
                            action.url = `http://${app.config.domain}/activation/${exists.email}/${token}`;
                            controller.setActivationKey(exists.email, token);
                        }
                        else if(req.params.type == 'password') {
                            template = 'password';
                            action.url = `http://${app.config.domain}/passwordReset/${exists.email}/${token}`;
                            controller.setResetKey(exists.email, token);
                        }

                        if(template)
                        {
                            app.mailer.send(template, {
                                to: exists.email,
                                action: action
                            }, (err, body) => console.log(err, body));

                            app.success(res, {}, 'Email sent');
                        }
                    });
                }
                else
                    app.error(res, {statusCode: 409, message: 'This user doesn\'t exists'});
            });
        },
        save: function(req, res)
        {
            if(!req.body.id)
                app.error(res, {statusCode: 409, message: 'This user doesn\'t exists'});
            else {
                app.api.models.users.findOne({
                    where: {id: req.body.id}
                }).then(exists =>
                {
                    if(exists !== null)
                    {
                        let user = {
                            updatedAt: new Date()
                        };
                        if(req.body.firstname)
                            user.firstname = req.body.firstname;
                        if(req.body.lastname)
                            user.lastname = req.body.lastname;
                        if(req.body.biography)
                            user.biography = req.body.biography;
                        if(req.body.birthdate)
                            user.birthdate = moment(req.body.birthdate).format('YYYY-MM-DD');
                        if(req.body.email)
                            user.email = req.body.email;
                        if(req.body.activated)
                            user.activated = req.body.activated === true ? 1 : 0;
                        if(req.body.role)
                            user.role = req.body.role;
                        if(req.body.phone)
                            user.phone = req.body.phone;
                        if(req.body.city)
                            user.city = req.body.city;
                        if(req.body.country)
                            user.country = req.body.country;
                        if(req.body.postal_code)
                            user.postal_code = req.body.postal_code;
                        if(req.body.road_number)
                            user.road_number = req.body.road_number;
                        if(req.body.road_name)
                            user.road_name = req.body.road_name;


                        app.api.models.users.update(user, {where: {id: exists.id}}).then(function(data)
                        {
                            app.success(res, user, 'Saved');
                        })
                        .catch(error => { app.error(res, error); });
                    }
                    else
                        app.error(res, {statusCode: 409, message: 'This user doesn\'t exists'});
                });
            }
        },
        create: function(req, res)
        {
            app.api.models.users.findOne(
            {
                where: {email: req.body.email}
            }).then(function(exists)
            {
                if(exists === null)
                {
                    req.body.password  = sha512(req.body.password);
                    req.body.activated = 1;
                    req.body.role      = 'user';

                    app.api.models.users.create(req.body)
                    .then(function(user)
                    {
                        var u =
                        {
                            id        : user.id,
                            firstname : user.firstname,
                            lastname  : user.lastname,
                            birthdate : '0000-00-00 00:00:00',
                            email_md5 : md5(user.email),
                            role      : user.role,
                            status : 'offline'
                        };

	                    // app.mailer.send('register', {
	                    // 	to: user.email,
	                    // }, (err, body) => console.log(err, body));

                        app.logger.info('%s %s has just register' , user.firstname, user.lastname);
                        app.io.sockets.emit('onUserRegister', u);
                        app.success(res, u, 'Created');
                    })
                    .catch(function(error)
                    { app.error(res, error); });
                }
                else
                    app.error(res, {statusCode: 409, message: 'Email already used'});
            });
        }
    };
};

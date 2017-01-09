/**
 * Created by Mel on 01/08/2016.
 */

module.exports = function(app)
{
    var endpoint = '/users';
    var ctrl = app.api.controllers.users;

    app.delete(endpoint+'/:id',    ctrl.delete);
    app.get(endpoint,              ctrl.index);
    app.get(endpoint+'/activation/:email/:key',ctrl.activation);
    app.post(endpoint+'/request/:type', ctrl.request);
    app.post(endpoint+'/search',   ctrl.search);
    app.get(endpoint+'/logout',    ctrl.logout);
    app.post(endpoint+'/email',    ctrl.email);
    app.get(endpoint+'/auth',      ctrl.isAuth);
    app.post(endpoint+'/auth',     ctrl.auth);
    app.get(endpoint+'/:id',       ctrl.view);
    app.put(endpoint+'/:id',       ctrl.save);
    app.post(endpoint+'/register', ctrl.create);
    app.post(endpoint+'/recover',  ctrl.recover);
};

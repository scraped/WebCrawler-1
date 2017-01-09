/**
 * Created by Mel on 01/08/2016.
 */

module.exports = function(app)
{
    var ctrl = app.api.controllers.home;
    app.get('/', ctrl.index);
};

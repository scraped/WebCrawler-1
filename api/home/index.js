/**
 * Created by Mel on 01/08/2016.
 */
module.exports = function(app, Sequelize)
{
    return controller = {
        index: function(req, res)
        {
            res.render('home/views/index.html', {
                page_name: app.config.name
            });
        }
    }
};

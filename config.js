module.exports =
{
    name: 'Web Crawler',
    domain: 'localhost',
    mailgun_key: '',
    jwt_secret: '651zcazcze6a366z5f0czzczczccaz4e354ze4fé54fé591222345f1zer',
    jwt_expires: '365d',
    db:
    {
        dev: {
            host     : 'localhost',
            user     : 'root',
            password : '',
            database : 'crawler',
            adapter  : 'mysql'
        },
        prod: {

        }
    }
};

import api from './api'

export default
{
    getDomains(cb)
    {
        api.get('/domains').then((res) =>
        {
            if(res.status == 200)
                cb(res.data.data.rows)
        })
        .catch((error) => console.log(error));
    },

    getUsers(cb)
    {
        api.get('/users').then((res) =>
        {
            if(res.status == 200)
                cb(res.data.data.rows)
        })
        .catch((error) => console.log(error));
    }
}

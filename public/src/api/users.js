import api from './api'
let ENDPOINT = '/users/';

export default
{
    getUsers(page, cb)
    {
        api.get(ENDPOINT + '?page=' + page).then(res => {
            if(res.status == 200)
                cb(res.data.data)
        }).catch(error => console.log(error));
    },

    getUser(id, cb)
    {
        api.get(ENDPOINT + id).then(res =>
        {
            if(res.status == 200)
                cb(res.data.data)
        }).catch(error => console.log(error));
    },

    saveUser(user, cb)
    {
        api.put(ENDPOINT + user.id, user).then(res => {
            if(res.status == 200)
                cb(true)
        }).catch(error => console.log(error));
    },

    searchUser(query, cb)
    {
        api.post(ENDPOINT + 'search', {q: query}).then(res => {
            if(res.status == 200)
                cb(res.data.data)
        }).catch(error => console.log(error));
    },

    activate(email, key, cb)
    {
        api.get(ENDPOINT + [email, key].join('/')).then(res => {
            if(res.status == 200)
                cb(true)
        }).catch(error => console.log(error));
    },

    sendActivationRequest(email, cb)
    {
        api.post(ENDPOINT + 'request/activation', {email: email}).then(res => {
            if(res.status == 200)
                cb(true)
        }).catch(error => console.log(error));
    },

    sendPasswordRequest(email, cb)
    {
        api.post(ENDPOINT + 'request/password', {email: email}).then(res => {
            if(res.status == 200)
                cb(true)
        }).catch(error => console.log(error));
    }
}

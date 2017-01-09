const API_URL    = 'http://localhost:5001';
const LOGIN_URL  = API_URL + '/users/auth';
const LOGOUT_URL = API_URL + '/users/logout';
const SIGNUP_URL = API_URL + '/users/register';

const auth =
{
    user: {
        authenticated: false,
        profile: {}
    },

    login(ctx, data)
    {
        ctx.$http.post(LOGIN_URL, data).then((res) =>
        {
            ctx.loading = false;
            if(res.body.success)
            {
                localStorage.setItem('session_token', res.body.data.token);
                localStorage.setItem('session_profile', JSON.stringify(res.body.data));

                ctx.$socket.emit('join', {
                    channel: 'default',
                    authorization: res.body.data.token
                });

                this.user.profile = res.body.data;
                this.user.authenticated = true;
                axios.defaults.headers.common['Authorization'] = auth.getToken();
                ctx.$router.replace(ctx.$route.query.redirect || '/')
            }
            else
                ctx.error = res.body.message;
        });
    },

    register(ctx, data, redirect)
    {
        ctx.$http.post(SIGNUP_URL, data).then((res) =>
        {
            ctx.loading = false;
            if(res.body.success)
            {
                ctx.success = res.body.message;
                ctx.$router.replace(redirect || '/');
            }
            else
                ctx.error = res.body.message;
        }).error((err) => { });
    },

    clearSession() {
        localStorage.removeItem('session_token');
        localStorage.removeItem('session_profile');
        this.user.profile = {};
        this.user.authenticated = false;
    },

    logout(ctx)
    {
        ctx.$http.get(LOGOUT_URL).then(_ => {
            auth.clearSession();
            ctx.$router.replace('/login')
        });
    },

    checkAuth(cb)
    {
        $.getJSON(LOGIN_URL, {}, (res) =>
        {
            if(res.success)
            {
                this.user.profile = JSON.parse(localStorage.getItem('session_profile'));
                axios.defaults.headers.common['Authorization'] = auth.getToken();
                this.user.authenticated = true;
            }
            else
                auth.clearSession();

            if(typeof cb == 'function')
                cb()
        });
    },

    isAuth() {
        return !!localStorage.getItem('session_token');
    },

    getToken() {
        return 'Bearer ' + localStorage.getItem('session_token')
    }
};

export default auth

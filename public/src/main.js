import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import VueSocketio from 'vue-socket.io'
import VueTimeago from 'vue-timeago'
import VueRouter from 'vue-router'

Vue.use(Vuex);
Vue.use(VueSocketio, 'http://localhost:5001');
Vue.use(VueResource);
Vue.use(VueRouter);

Vue.use(VueTimeago, {
    name: 'timeago',
    locale: 'en-US',
    locales: {
        'en-US': require('json-loader!vue-timeago/locales/en-US.json')
    }
});

import store from './store'
import auth from './auth'
import Home from './components/Home.vue'
import Login from './components/Users/front/Login.vue'
import Register from './components/Users/front/Register.vue'
import Activation from './components/Users/front/Activation.vue'
import Crawlers from './components/Crawlers.vue'

import Users from './components/Users/back/Users.vue'

var router = new VueRouter({
    mode: 'hash',
    linkActiveClass: 'active',
    base: __dirname,
    routes: [
        {path: '/', name:'home', component: Home},
        {path: '/login', name: 'login', component: Login},
        {path: '/register', name: 'register', component: Register},
        {path: '/activation/:email/:key', name: 'activation', component: Activation},

        {path: '/users', name: 'users', component: Users},
        {path: '/crawlers', name: 'crawlers', component: Crawlers},

        {path: '*', redirect: '/'}
    ]
});

var whitelist = [
    '/activation',
    '/login',
    '/register'
];

router.beforeEach( (to, from, next) =>
{
    if(to.path.match(/activation/))
        next();
    else {
        if(whitelist.indexOf(to.path) == -1 && !auth.isAuth())
        {
            next({
                path: '/login',
                query: {redirect: to.fullPath}
            });
        }
        else
            next()
    }
});

auth.checkAuth( _=>
{
    new Vue(Vue.util.extend(
        {
            router,
            store
        },
        require('./App.vue'))
    )
    .$mount('#app');
});


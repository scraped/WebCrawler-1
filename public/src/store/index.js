import Vue from 'vue'
import Vuex from 'vuex'

import * as actions from './actions'
import * as getters from './getters'

import Domains from './modules/domains'
import Users from './modules/users'

Vue.use(Vuex);

export default new Vuex.Store({
    actions,
    getters,
    modules: {
        Domains,
        Users
    },
    strict: process.env.NODE_ENV !== 'production'
});

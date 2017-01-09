import api from '../../api/users'
import * as types from '../mutations-types'

export default {
    state: {
        edited  : {},
        users   : [],
        count   : 0,
        page    : 1,
        nbPages : 0
    },
    getters: {
        usersCount  : state => state.count,
        user        : state => state.edited,
        users       : state => state.users,
        currentPage : state => state.page,
        nbPages     : state => state.nbPages
    },
    actions: {
        sendActivationRequest(store, email) {
            api.sendActivationRequest(email, success => {
                window.alert('Email sent!');
            })
        },
        sendPasswordRequest(store, email) {
            api.sendPasswordRequest(email, success => {
                window.alert('Email sent!');
            })
        },
        saveUser(store, user) {
            api.saveUser(user, success => {
                if(success)
                    store.commit(types.SAVE_USER, user)
            })
        },
        searchUser(store, query) {
            api.searchUser(query, data => {
                store.commit(types.ADD_USERS, data);
                store.commit(types.SET_USERS_COUNT, data.length);
            })
        },
        setUsers(store, ctx) {
            api.getUsers(ctx.page, data => {
                ctx.loading = false;
                store.commit(types.ADD_USERS, data.rows);
                store.commit(types.SET_NB_PAGES, data.nbPages);
                store.commit(types.SET_USERS_COUNT, data.count);
            })
        },
        clearEdited(store) {
            store.commit(types.CLEAR_EDITED_USER);
        },
        setEdited(store, id) {
            api.getUser(id, user => {
                store.commit(types.SET_EDITED_USER, user);
            });
        },
        setNbPages(store, nbPages) {
            store.commit(types.SET_NB_PAGES, nbPages);
        },
        setPage(store, page) {
            store.commit(types.SET_PAGE, page);
        },
        setBirthdate(store, birthdate) {
            store.commit(types.SET_USER_BIRTHDATE, birthdate);
        }
    },
    mutations: {
        [types.SAVE_USER](state, user) {
            state.edited = user;
            let index = state.users.findIndex((u) => u.id == user.id);
            if(index >= 0)
                state.users.splice(index, 1, user);
        },
        [types.CLEAR_EDITED_USER](state) {
            state.edited = {};
        },
        [types.SET_PAGE](state, page) {
            state.page = page
        },
        [types.SET_NB_PAGES](state, nbPages) {
            state.nbPages = nbPages;
        },
        [types.SET_USERS_COUNT](state, count) {
            state.count = count
        },
        [types.SET_EDITED_USER](state, user) {
            state.edited = user
        },
        [types.ADD_USERS](state, users) {
            state.users = users;
        },
        [types.SET_USER_BIRTHDATE](state, birthdate) {
            state.edited.birthdate = birthdate
        }
    }
}

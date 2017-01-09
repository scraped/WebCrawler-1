import api from '../../api/domains'
import * as types from '../mutations-types'

export default {
    state: {
        domains: []
    },
    getters: {
        domains: state => state.domains
    },
    actions: {
        setDomains(store) {
            api.getDomains(domains => {
                store.commit(types.ADD_DOMAINS, domains)
            })
        }
    },
    mutations: {
        [types.ADD_DOMAIN](state, domain) {
            state.domains.push(domain)
        },
        [types.ADD_DOMAINS](state, domains) {
            state.domains = [...domains]
        }
    }
}

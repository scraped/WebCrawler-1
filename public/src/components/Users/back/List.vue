<template>
    <tr style="cursor:pointer" v-bind:class="{'warning': u.id == user.id}">
        <td class="client-avatar">
            <img alt="image" :src="u.email_md5 | gravatar">
        </td>
        <td class="client-link">
            {{u.firstname}} {{u.lastname}}
        </td>
        <td>
            <i class="fa fa-envelope"> </i> {{u.email}}
        </td>
        <td>
            <span class="label" v-bind:class="{'label-default': u.role == 'user', 'label-danger': u.role == 'admin'}">&nbsp;&nbsp;
                <i class="fa" v-bind:class="{'fa-user': u.role == 'user', 'fa-star': u.role == 'admin'}"></i> {{u.role}}
            </span>
        </td>
        <td style="padding-right: 20px">
            <span class="label pull-right" v-bind:class="{'label-default': u.status == 'offline', 'label-primary': u.status == 'online'}">{{u.status}}</span>
        </td>
        <td>
            <button class="btn btn-xs btn-primary" @click="showModalEditUser = true">
                <i class="fa fa-edit"></i>
            </button>
            <modalEditUser :show="showModalEditUser"></modalEditUser>
        </td>
    </tr>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import ModalEditUser from '../../App/Modal/ModalEditUser.vue'
export default {
    props: {
        u: {}
    },
    computed: mapGetters({
        user: 'user',
        users: 'users'
    }),
    data() {
        return {
            showModalEditUser: false
        }
    },
    components: {
        'modalEditUser': ModalEditUser
    },
    filters: {
        gravatar: (email) => {
            return '//www.gravatar.com/avatar/'+email+'?s=48&r=x&d=identicon';
        }
    }
}
</script>

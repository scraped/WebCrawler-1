<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
    <div>
        <div class="row">
            <div class="col-md-8">
                <div class="ibox-title">
                    <h5>Users</h5>
                    <div class="ibox-tools">
                        <button class="btn btn-primary btn-xs" id="show-modal" @click="showModalAddUser = true">
                            <i class="fa fa-plus"></i> Add new user
                        </button>
                        <modalAddUser :show="showModalAddUser"></modalAddUser>
                    </div>
                </div>
                <div class="ibox-content">
                    <div class="input-group">
                        <input type="text" placeholder="Search..." class="input form-control" v-model="searchQuery" @keyup="search()">
                        <span class="input-group-btn">
                            <button type="button" class="btn btn btn-default"><i class="fa fa-search"></i></button>
                        </span>
                    </div>
                    <br>
                    <span class="small text-muted"><strong>{{usersCount}}</strong> users found</span>
                    <div class="btn-group pull-right" role="group" aria-label="...">
                        <button type="button" disabled class="btn btn-xs"><i class="fa fa-filter" aria-hidden="true"></i></button>

                        <div class="btn-group" role="group">
                            <button type="button" class="btn btn-xs btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Sort by
                                <span class="caret"></span>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a href="#">Name</a></li>
                                <li><a href="#">Firstname</a></li>
                                <li><a href="#">Email</a></li>
                                <li><a href="#">Role</a></li>
                                <li><a href="#">Status</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="table-responsive" style="margin-top: 20px">
                        <table class="table table-striped">
                            <tr v-if="loading">
                                <td colspan="6">
                                    <div class="sk-spinner sk-spinner-double-bounce">
                                        <div class="sk-double-bounce1"></div>
                                        <div class="sk-double-bounce2"></div>
                                    </div>
                                </td>
                            </tr>
                            <tbody v-for="u in users" @click="loadUser(u.id)" v-bind:class="{'warning': u.id == user.id}">
                                <List :u="u"></List>
                            </tbody>
                        </table>
                    </div>
                    <div class="row">
                        <div class="col-xs-12">
                            <ul class="pagination">
                                <li v-for="page in nbPages" v-if="Math.abs(page - currentPage) < 3 || page == nbPages - 1 || page == 0" :class="{active: currentPage === page, last: (page == nbPages - 1 && Math.abs(page - currentPage) > 3), first:(page == 1 && Math.abs(page - currentPage) > 3)}">
                                    <a href="#" @click.prevent="setPage(page)"  >{{ page }}</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="ibox-title">
                    <h5>Informations</h5>
                </div>
                <div class="ibox-content">
                    <div v-if="user.id">
                        <div class="row m-b-lg">
                            <div class="col-lg-4 text-center">
                                <h2>{{user.firstname}} {{user.lastname}}</h2>
                                <div class="m-b-sm">
                                    <img alt="image" class="img-circle" :src="user.email_md5 | gravatar" style="width: 62px">
                                </div>
                            </div>
                            <div class="col-lg-8">
                                <p>
                                    <strong>Age</strong>
                                    {{user.birthdate | age }}
                                    <span class="label pull-right" v-bind:class="{'label-default': user.status == 'offline', 'label-primary': user.status == 'online'}">{{user.status}}</span>
                                </p>
                                <strong>Biography</strong>
                                <br>
                                <p>{{user.biography}}</p>
                                <strong>Contact</strong>
                                <br>
                                <p><a href="#">{{user.email}}</a></p>
                            </div>
                        </div>
                        <div class="btn-group btn-group-justified" role="group">
                            <div class="btn-group" role="group">
                                <button type="button" class="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="fa fa-send"></i> Send <span class="caret"></span>
                                </button>
                                <ul class="dropdown-menu">
                                    <li><a @click="sendActivationRequest(user.email)">Activation link</a></li>
                                    <li><a @click="sendPasswordRequest(user.email)">Password request</a></li>
                                </ul>
                            </div>
                            <div class="btn-group" role="button">
                                <button type="button" class="btn btn-primary btn-sm dropdown-toggle"  aria-haspopup="true" aria-expanded="false"data-toggle="dropdown">
                                    <i class="fa fa-envelope"></i> Message <span class="caret"></span>
                                </button>
                                <ul class="dropdown-menu">
                                    <li><a @click="showModalMessage = true">Private</a></li>
                                    <li><a @click="showModalEmail = true">Email</a></li>
                                </ul>
                                <modalMessage :show="showModalMessage"></modalMessage>
                                <modalEmail :show="showModalEmail"></modalEmail>
                            </div>
                            <div class="btn-group" role="button">
                                <button type="button" class="btn btn-default btn-sm">
                                    <i class="fa fa-ban"></i> Ban
                                </button>
                            </div>
                        </div>
                        <br>
                        <h4>Last activity</h4>
                        <ul class="list-group clear-list">
                            <li class="list-group-item fist-item">
                                        <span class="pull-right">
                                            <timeago :since="user.createdAt" :auto-update="1"></timeago>
                                        </span>
                                Registered
                            </li>
                            <li class="list-group-item">
                                        <span class="pull-right">
                                            <timeago :since="user.updatedAt" :auto-update="1"></timeago>
                                        </span>
                                Last modification
                            </li>
                        </ul>
                    </div>
                    <div v-else>
                        <h3 class="text-center text-muted" style="font-weight: 300; color: #c1c1c1">
                            <i class="fa fa-3x fa-info-circle"></i><br><br>
                            Select a user to view his profile
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import ModalAddUser from '../../App/Modal/ModalAddUser.vue'
import ModalMessage from '../../App/Modal/ModalMessage.vue'
import ModalEmail from '../../App/Modal/ModalEmail.vue'
import Edit from './Edit.vue'
import List from './List.vue'

export default
{
    name: 'Users',
    computed: {
        ...mapGetters({
            usersCount: 'usersCount',
            user: 'user',
            users: 'users',
            nbPages: 'nbPages',
            currentPage: 'currentPage'
        })
    },
    created () {
        this.loadUsers();
    },
    filters: {
        age: (date) => {
            return parseInt(new Date().getFullYear()) - parseInt(new Date(date).getFullYear());
        },
        gravatar: (email) => {
            return '//www.gravatar.com/avatar/'+email+'?s=48&r=x&d=identicon';
        }
    },
    methods: {
        ...mapActions({
            sendActivationRequest: 'sendActivationRequest',
            sendPasswordRequest: 'sendPasswordRequest'
        }),
        setPage: function(page) {
            this.$store.dispatch('setPage', page);
            this.page = this.currentPage;
            this.$store.dispatch('setUsers', this);
        },
        search: function() {
            this.$store.dispatch('searchUser', this.searchQuery);
        },
        loadUser: function(id) {
            this.edited = id;
            this.$store.dispatch('setEdited', id);
        },
        loadUsers: function() {
            this.page = this.currentPage;
            this.$store.dispatch('setUsers', this);
        }
    },
    components: {
        'modalAddUser' : ModalAddUser,
        'modalMessage' : ModalMessage,
        'modalEmail'   : ModalEmail,
        'Edit'         : Edit,
        'List'         : List
    },
    data() {
        return {
            searchQuery: '',
            page: 1,
            edited: null,
            showModalAddUser: false,
            showModalMessage: false,
            showModalEmail: false,
            loading: true
        }
    }
}
</script>

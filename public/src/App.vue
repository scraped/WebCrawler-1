<template>
  <div>
    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">{{name}}</a>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
            <ul class="nav navbar-nav navbar-right" v-if="user.authenticated">
                <li><a>{{user.profile.firstname}} {{user.profile.lastname}}</a></li>
                <li><a href="#" @click.prevent="logout()">Logout</a></li>
            </ul>
            <ul class="nav navbar-nav navbar-right" v-if="!user.authenticated">
                <router-link tag="li" :to="{ name: 'login'}" exact><a>Login</a></router-link>
                <router-link tag="li" :to="{ name: 'register'}" exact><a>Register</a></router-link>
            </ul>
        </div>
      </div>
    </nav>
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-3 col-md-2 sidebar" v-if="user.authenticated">
          <ul class="nav nav-sidebar">
              <router-link tag="li" :to="{ name: 'home'}" exact><a>Dashboard</a></router-link>
              <router-link tag="li" :to="{ name: 'crawlers'}" exact><a>Crawlers</a></router-link>
              <router-link tag="li" :to="{ name: 'users'}" exact><a>Users</a></router-link>
          </ul>
        </div>
        <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
            <transition :name="transitionName" mode="out-in">
                <router-view class="child-view"></router-view>
            </transition>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import cfg from '../../config'
import auth from './auth'

export default {
  name: 'app',
  data() {
        return {
            user: auth.user,
            name: cfg.name,
            transitionName: 'slide-left'
        }
  },
    sockets: {
        connect()
        {
            this.$socket.emit('join', {
                channel: 'default',
                authorization: localStorage.getItem('session_token')
            });
        },
    },
    methods: {
        logout() {
            auth.logout(this)
        }
    },
    watch: {
        '$route' (to, from) {
            const toDepth = to.path.split('/').length;
            const fromDepth = from.path.split('/').length;
            this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
        }
    }
}
</script>

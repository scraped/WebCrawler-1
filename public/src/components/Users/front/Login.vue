<template>
    <div class="row">
        <div class="col-md-4 col-sm-6 col-xs-12 center-block">
            <p v-if="$route.query.redirect">
                You need to login first.
            </p>
            <form class="form-signin" @submit.prevent="login">
                <h2 class="form-signin-heading">Please sign in</h2>
                <label for="inputEmail" class="sr-only">Email address</label>
                <input type="email" id="inputEmail" class="form-control" placeholder="Email address" v-model="email" required autofocus>
                <label for="inputPassword" class="sr-only">Password</label>
                <input type="password" id="inputPassword" class="form-control" placeholder="Password" v-model="password" required>
                <div class="checkbox">
                    <label>
                        <input type="checkbox" value="remember-me"> Remember me
                    </label>
                </div>
                <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
                <p v-if="error !== ''" class="error">{{error}}</p>
            </form>
        </div>
    </div>
</template>
<script>
import auth from '../../../auth'
import Vue from 'vue'

export default
{
    data()
    {
        return {
            user: null,
            email: '',
            password: '',
            error: ''
        }
    },
    methods:
    {
        login()
        {
            auth.login(this,
            {
                email: this.email,
                password: this.password
            })
        }
    }
}
</script>

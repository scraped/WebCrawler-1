<template>
    <div class="row">
        <div class="col-md-4 col-sm-6 col-xs-12 center-block">
            <form class="form-signin" @submit.prevent="register">
                <h2 class="form-signin-heading">Registration</h2>
                <label for="inputFirstname" class="sr-only">Firstname</label>
                <input type="text" id="inputFirstname" class="form-control" placeholder="Firstname" v-model="firstname" required autofocus>
                <label for="inputLastname" class="sr-only">Lastname</label>
                <input type="text" id="inputLastname" class="form-control" placeholder="Lastname" v-model="lastname" required autofocus>
                <label for="inputEmail" class="sr-only">Email address</label>
                <input type="email" id="inputEmail" class="form-control" placeholder="Email address" v-model="email" required autofocus>
                <label for="inputPassword" class="sr-only">Password</label>
                <input type="password" id="inputPassword" class="form-control" placeholder="Password" v-model="password" required>
                <button class="btn btn-lg btn-primary btn-block" type="submit">Register</button>
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
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            error: ''
        }
    },
    methods:
    {
        register()
        {
            auth.register(this,
            {
                firstname: this.firstname,
                lastname: this.lastname,
                email: this.email,
                password: this.password
            })
        }
    }
}
</script>

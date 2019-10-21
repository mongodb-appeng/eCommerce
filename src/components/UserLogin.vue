<template>
    <div class="container" id="login" tabindex="0" v-on:keydown.esc="quit">
        <div class="notification is-primary">
            <h1 class="title is-2">Log into your existing account</h1>
            <div class="field is-horizontal">
                <div class="field-body">
                    <div class="field is-expanded">
                        <div class="field">
                            <p class="control is-expanded has-icons-left">
                                <input v-model="email" class="input" type="email" placeholder="Email" ref="email">
                                <span class="icon is-small is-left">
                                    <i class="fas fa-envelope"></i>
                                </span>
                            </p>
                        </div>
                    </div>
                    <div class="field is-expanded">
                        <div class="field">
                            <p class="control is-expanded has-icons-left">
                                <input 
                                    v-model="password" 
                                    class="input" 
                                    type="password" 
                                    placeholder="Password"
                                     v-on:keyup.enter="Login">
                                <span class="icon is-small is-left">
                                    <i class="fas fa-key"></i>
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="field is-grouped is-grouped-centered">
                <p class="control">
                    <button v-on:click="Login" class="button is-success is-medium is-focused">
                        <span class="icon is-small">
                            <i class="fas fa-check"></i>
                        </span>
                        <span>Login</span>
                    </button>
                </p>
                <p class="control">
                    <router-link to="/register">
                        <button class="button is-medium has-background-grey-lighter">
                            <span class="icon is-small">
                                <i class="fas fa-edit"></i>
                            </span>
                            <span>Register a new account</span>
                        </button>
                    </router-link>
                </p>
            </div>
        </div>      
        <Status v-bind:status="status"></Status>
    </div>
</template>

<script>
import Status from './Status.vue'
import { UserPasswordCredential } from "mongodb-stitch-browser-sdk"
import {
    mapActions
    } from 'vuex'

export default {
    name: "UserLogin",
    components: {
        Status
    },
    data() {
        return {
            status: null,
            email: '',
            password: ''
        }
    },
    methods: {
        ...mapActions([
            'setUserLoggedIn'
        ]),
        Login() {
            this.status = {state: 'progress', text: 'Attempting to log you in...'};
            const credential = new UserPasswordCredential(this.email, this.password);
            this.$root.$data.stitchClient.auth.loginWithCredential(credential)
            .then (authedUser => {
                this.$store.dispatch('setUserLoggedIn', {
                    database: this.$root.$data.database,
                    user: authedUser
                })
                .then (() => {
                    this.status = null;
                    this.$emit("close-modal");
                },
                (error => {
                    this.status = {state: 'error', text: `Failed to log in user: ${error}`};
                }))
            },
            (error) => {
                this.status = {state: 'error', text: `Failed to log in user: ${error}`};
            })
        },
        quit () {
            this.$emit('close-modal');
        }
    },
    mounted() {
        this.$refs.email.focus();
    }
}
</script>

<style scoped>
.notification a:not(.button):not(.dropdown-item) {
    text-decoration: none;
}
</style>
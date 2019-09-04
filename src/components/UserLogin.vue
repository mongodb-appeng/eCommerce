<template>
    <div class="container" id="login">
        <div class="notification is-primary">
            <h1 class="title is-2">Log into your existing account</h1>
            <div class="field is-horizontal">
                <div class="field-body">
                    <div class="field is-expanded">
                        <div class="field">
                            <p class="control is-expanded has-icons-left">
                                <input v-model="email" class="input" type="email" placeholder="Email">
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
        <div v-if="error" class="notification is-danger">
            <strong>{{ error }}</strong>
        </div>
        <div v-if="error" class="notification is-primary">
            <strong>{{ progress }}</strong>
        </div>
        <div v-if="success" class="notification is-success">
            {{ success }}
        </div>
    </div>
</template>

<script>
import { UserPasswordCredential } from "mongodb-stitch-browser-sdk"
import {
    mapState,
    mapMutations,
    mapActions
    } from 'vuex'

export default {
    name: "UserLogin",
    props: [
        // "stitchClient"
    ], 
    data() {
        return {
            error: '',
            success: '',
            progress: '',
            email: '',
            password: ''
            // localUser: null
        }
    },
    computed: {
        ...mapState([
            'stitchClient'
        ]),
    },
    methods: {
        ...mapMutations([
            // 'setUser'
        ]),
        ...mapActions([
            'setUserLoggedIn'
        ]),
        Login() {
            this.error = '';
            this.success = '';
            this.progress = 'Attempting to log you in...'
            const credential = new UserPasswordCredential(this.email, this.password);
            this.stitchClient.auth.loginWithCredential(credential)
            .then (authedUser => {
                // this.user = authedUser;
                // this.setUser(authedUser);
                // TODO: should change the action to return a promise.
                this.$store.dispatch('setUserLoggedIn', authedUser)
                .then (() => {
                    this.progress = 'This window will close in 2 seconds';
                    this.success = `Successfully logged in with id: ${authedUser.id}`;
                    // this.$emit('user-logged-in', this.user);
                    /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
                    console.log(this.success);
                    const _this = this;
                    setTimeout(function(){
                        _this.$emit("close-modal");
                    }, 2000);
                },
                (error => {
                    this.progress = '';
                    this.error = `Failed to log in user: ${error.message}`;
                    /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
                    console.error(this.error);
                }))
            },
            (error) => {
                this.error = `Failed to log in user: ${error.message}`;
                this.progress = '';
                /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
                console.error(this.error);
            })
        }
    },
    created() {
    }
}
</script>
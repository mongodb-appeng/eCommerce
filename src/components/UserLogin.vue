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
        <div v-if="success" class="notification is-success">
            {{ success }}
        </div>
    </div>
</template>

<script>
import { UserPasswordCredential } from "mongodb-stitch-browser-sdk"

export default {
    name: "UserLogin",
    props: [
        "stitchClient"
    ], 
    data() {
        return {
            error: '',
            success: '',
            email: '',
            password: '',
            user: null
        }
    },
    methods: {
        Login() {
            const credential = new UserPasswordCredential(this.email, this.password);
            this.stitchClient.auth.loginWithCredential(credential)
            .then (authedUser => {
                    this.success = `Successfully logged in with id: ${authedUser.id}`;
                    this.error = '';
                    this.user = authedUser;
                    this.$emit('user-logged-in', this.user);
                    /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
                    console.log(this.success);
                },
                (err) => {
                    this.error = `Failed to log in user: ${err.message}`;
                    /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
                    console.error(this.error);
                })
        }
    },
    created() {
    }
}
</script>
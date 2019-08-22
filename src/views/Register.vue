<template>
  <div class="register">
    <MyHeader
        v-bind:stitchClient="stitchClient"
        v-bind:userLoggedIn="userLoggedIn" v-on:user-logged-in="setUserLoggedIn"
        v-bind:userFirstName="userFirstName"></MyHeader>
    <div class="section">
        <h1 class="title is-2">Register new user</h1>
        <div class="field is-horizontal">
            <div class="field-label is-normal">
                <label class="label">ID</label>
            </div>
            <div class="field-body">
                <div class="field">
                    <p class="control is-expanded has-icons-left">
                        <input v-model="email" class="input" type="email" placeholder="Email">
                        <span class="icon is-small is-left">
                            <i class="fas fa-envelope"></i>
                        </span>
                    </p>
                </div>
            </div>
        </div>
        <div class="field is-horizontal">
            <div class="field-label is-normal">
                <label class="label">Password</label>
            </div>
            <div class="field-body">
                <div class="field is-expanded">
                    <div class="field">
                        <p class="control is-expanded has-icons-left">
                            <input v-model="password" class="input" type="password" placeholder="Password">
                            <span class="icon is-small is-left">
                                <i class="fas fa-key"></i>
                            </span>
                        </p>
                    </div>
                </div>
                    <div class="field">
                        <p class="control is-expanded has-icons-left">
                            <input v-model="password2" class="input" type="password" placeholder="Repeat password">
                            <span class="icon is-small is-left">
                                <i class="fas fa-key"></i>
                            </span>
                        </p>
                    </div>
            </div>
        </div>
        <div class="field is-grouped is-grouped-centered">
            <p class="control">
                <button v-on:click="register" class="button is-success">
                    Register
                </button>
            </p>
        </div>
        <div v-if="error" class="notification is-danger">
            <strong>{{ error }}</strong>
        </div>
        <div v-if="success" class="notification is-success">
            {{ success }}
        </div>
    </div>
</div>
</template>

<script>

import MyHeader from '../components/Header.vue'
import {UserPasswordAuthProviderClient} from "mongodb-stitch-browser-sdk"

export default {
    name: 'register',
    props: [
        "stitchClient",
        "userLoggedIn",
        "userFirstName"
    ],
    components: {
        MyHeader
    },
    data() {
        return {
            error: '',
            success: '',
            email: '',
            password: '',
            password2: ''
        }
    },
    methods: {
        register() {
            /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
            console.log('Registering user');
            this.error = '';
            if (this.password != this.password2)
            {
                this.error = 'Error, passwords must match.';
            } else {
                const emailPassClient = this.stitchClient.auth.getProviderClient(UserPasswordAuthProviderClient.factory);
                emailPassClient.registerWithEmail(this.email, "this.password")
                .then(() => {
                    this.success = "Registration request being processed – check your inbox";
                    /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
                    console.log("Successfully sent account confirmation email!");
                },
                (err) => {
                    this.error = `Could not register user: ${err.message}`;
                    /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
                    console.error(this.error);
                });
            }
        },
        setUserLoggedIn(user) {
            this.$emit("user-logged-in", user)
        }
    },
    mounted() {
    }
}
</script>

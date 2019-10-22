<template>
<!-- Registers a new user with MongoDB Stitch (using username/password),
but DOES NOT create the customer document in Atlas. -->
  <div class="register">
    <MyHeader></MyHeader>
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
        <Status v-bind:status="status"></Status>
    </div>
</div>
</template>

<script>
import MyHeader from '../components/Header.vue'
import Status from '../components/Status.vue'
import {UserPasswordAuthProviderClient} from "mongodb-stitch-browser-sdk"

export default {
    name: 'register',
    components: {
        MyHeader,
        Status
    },
    data() {
        return {
            status: null,
            email: '',
            password: '',
            password2: ''
        }
    },
    methods: {
        /**
         * Register with Stitch using the provided email address and password. DOES NOT
         * create the customer document in Atlas
         */
        register() {
            this.status = null;
            if (this.password != this.password2)
            {
                this.status = {state: 'error', text: 'Error, passwords must match.'};                
            } else {
                this.status = {state: 'progress', text: `Registering ${this.email}`};
                const emailPassClient = this.$root.$data.stitchClient.auth.getProviderClient(
                    UserPasswordAuthProviderClient.factory);
                emailPassClient.registerWithEmail(this.email, this.password)
                .then(() => {
                    this.status = {state: 'success', text: 'Registration complete'};
                    let _this = this;
                    setTimeout(function(){
                        // Return to the home 'page'
                        _this.$router.push({name: 'home'});
                    }, 1000);
                },
                (err) => {
                    this.status = {state: 'error', text: `Could not register user: ${err.message}`};
                });
            }
        }
    }
}
</script>

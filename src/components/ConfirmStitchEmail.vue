<template>
    <div class="container">
        <h1 class="title is-1">Confirming email address</h1>
        <div v-if="error" class="notification is-danger">
            <strong>{{ error }}</strong>
        </div>
        <div v-if="success" class="notification is-success">
            {{ success }}
        </div>
        <div v-if="cta" class="notification is-primary">
            <div class="content">
                {{ cta }}                
            </div>
        </div>
    </div>
</template>

<script>
import {UserPasswordAuthProviderClient} from "mongodb-stitch-browser-sdk";

export default {
    name: "ConfirmStitchEmail",
    data() {
        return {
            error:'',
            success:'',
            cta: ''
        }
    },
  created() {
    let token, tokenId = '';
    try {
        // Parse the URL query parameters
        const url = window.location.search;
        const params = new URLSearchParams(url);
        token = params.get('token');
        tokenId = params.get('tokenId');
    }
    catch (err) {
        this.error = `Failed to parse URL parameters: ${err.message}`;
        /*eslint no-console: ["error", { allow: ["warn", "error"] }] */
        console.error(this.error);
    }

    try {
        // Confirm the user's email/password account (at this point, the user hasn't logged 
        // in and doesn't appear in the Stitch UI)
        const emailPassClient = this.$root.$data.stitchClient.auth.getProviderClient(
            UserPasswordAuthProviderClient.factory);
        emailPassClient.confirmUser(token, tokenId)
        .then ( () => {
            this.success = "Password confirmed.";
            this.cta = 'Return to <router-link to="/">Home page</router-link> and login to continue.';
        }, error => {
            this.error = `Failed to confirm email address: ${error}`;
            /*eslint no-console: ["error", { allow: ["warn", "error"] }] */
            console.error(this.error);
        })
    }
    catch (err) {
        this.error = `Failed to confirm email address: ${err.message}`;
        /*eslint no-console: ["error", { allow: ["warn", "error"] }] */
        console.error(this.error);
    }
  }
}
</script>

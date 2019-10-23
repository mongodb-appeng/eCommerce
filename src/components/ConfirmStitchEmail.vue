<template>
<!-- Vue.js component that's used if the Stitch application has been configured to
requires a user to confirm their email address when registering (an email will
have been sent to them that included a url with `token` and `tokenId` query
paramaters).  -->
    <div class="container">
        <h1 class="title is-1">Confirming email address</h1>
        <Status v-bind:status="status"></Status>
        <div v-if="cta" class="notification is-primary">
            <div class="content">
                {{ cta }}                
            </div>
        </div>
    </div>
</template>

<script>
import Status from './Status.vue'
import {UserPasswordAuthProviderClient} from "mongodb-stitch-browser-sdk";

export default {
    name: "ConfirmStitchEmail",
    components: {
        Status
    },
    data() {
        return {
            status: null,
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
    catch (error) {
        this.status = {state: 'error', text: `Failed to parse URL parameters: ${error}`};
    }
    try {
        // Confirm the user's email/password account (at this point, the user hasn't logged 
        // in and doesn't appear in the Stitch UI)
        const emailPassClient = this.$root.$data.stitchClient.auth.getProviderClient(
            UserPasswordAuthProviderClient.factory);
        emailPassClient.confirmUser(token, tokenId)
        .then ( () => {
            this.status = {state: 'success', text: "Password confirmed."};
            this.cta = 'Return to <router-link to="/">Home page</router-link> and login to continue.';
        }, error => {
            this.status = {state: 'error', text: `Failed to confirm email address: ${error}`};
        })
    }
    catch (error) {
        this.status = {state: 'error', text: `Failed to confirm email address: ${error}`};
    }
  }
}
</script>

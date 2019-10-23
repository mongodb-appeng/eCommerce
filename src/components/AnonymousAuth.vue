<template>
<!-- Vue.js component to ensure that the web app is authenticated with MongoDB Stitch.
Anonymous authentication allows the application to browse product data held in 
Atlas (via Stitch) without the user needing to first log in (authenticate). The user
will need to log in before they can do other things such as submitting an order.
If a user is already authenticated then this component doesn't 'downgrade' the app
to an anonymous user. -->
    <div>
        <Status v-bind:status="status"></Status>
    </div>
</template>

<script>
import config from '../config'
import Status from './Status.vue'
import {
    Stitch,
    AnonymousCredential,
    RemoteMongoClient
} from "mongodb-stitch-browser-sdk"
import { 
    mapActions
    } from 'vuex';

export default {
    name: "AnonymousAuth",
    components: {
        Status
    },
    data() {
        return {
            status: null,
            localStitchClient: {}
        }
    },
    methods: {
        ...mapActions([
            'refreshCustomer'
        ]),

        /**
         * If the application isn't already authenticated with Stitch then authenticate
         * as an anonymous user.
         * Makes the `stitchClient` available for any view or component to use when
         * working with the Stitch app.
         * Once authenticated calls function to connect to the Atlas database (via Stitch)
         */
        anonymousLogin() {
            if (!this.localStitchClient.auth.isLoggedIn) {
                this.status = {state: 'progress', text: `Authing app...`};
                this.localStitchClient.auth.loginWithCredential(new AnonymousCredential())
                .then(() => {
                    this.status = null;
                    this.connectDatabase();
                    this.$root.$data.stitchClient = this.localStitchClient;
                })
                .catch(error => {
                    this.status = {state: 'error', text: `Anonymous Stitch authentication failed: ${error}`};
                });
            } else {
                this.$root.$data.stitchClient = this.localStitchClient;
                this.connectDatabase();
            }
        },

        /**
         * Connects to the Atlas database and makes the `database` connection available to all views 
         * and components
         */
        connectDatabase() {
            try {
                const database = this.localStitchClient.getServiceClient(
                    RemoteMongoClient.factory, "mongodb-atlas").db(config.database);
                this.$root.$data.database = database;
                this.refreshCustomer(this.$root.$data.database);
            }
            catch (error) {
                this.status = {state: 'error', text: `Failed to connect to the database: ${error}`};
            }
        }
    },
    mounted() {
        try {
            this.localStitchClient = Stitch.getAppClient(config.appId);
        }
        catch {
            this.localStitchClient = Stitch.initializeDefaultAppClient(config.appId);
        }
        this.anonymousLogin();
    }
}
</script>

<template>
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
            // The default client hasn't been set yet
            this.localStitchClient = Stitch.initializeDefaultAppClient(config.appId);
        }
        this.anonymousLogin();
    }
}
</script>

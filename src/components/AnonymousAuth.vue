<template>
    <div>
      <!-- TODO: Move these to a status component -->
      <div v-if="error" class="notification is-danger">
          <strong>{{ error }}</strong>
      </div>
      <div v-if="success" class="notification is-success">
          {{ success }}
      </div>
      <div v-if="progress" class="notification is-primary">
          {{ progress }}
      </div>
    </div>
</template>

<script>
import config from '../config'
import {
    Stitch,
    AnonymousCredential,
    RemoteMongoClient
} from "mongodb-stitch-browser-sdk"
import { 
    mapState, 
    mapMutations 
    } from 'vuex';

export default {
    name: "AnonymousAuth",
    data() {
        return {
            error: '',
            progress: '',
            success: '',
            localStitchClient: {}
        }
    },
    computed: {
        ...mapState([
            'stitchClient',
            'database'
        ]),
    },
    methods: {
        ...mapMutations([
            'setDatabase',
            'setStitchClient'
        ]),
        anonymousLogin() {
            /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
            console.log('logging in');
            /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
            console.log(`this.localStitchClient.auth.isLoggedIn: ${this.localStitchClient.auth.isLoggedIn}`);
            if (!this.localStitchClient.auth.isLoggedIn) {
                /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
                console.log('not already logged in');
                this.progress = 'Authing app...'
                this.localStitchClient.auth.loginWithCredential(new AnonymousCredential())
                .then(() => {
                    /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
                    console.log('logged in');
                    this.progress = '';
                    this.connectDatabase();
                    /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
                    console.log('logged in');
                    this.setStitchClient(this.localStitchClient);
                    /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
                    console.log('returned from setting client');
                })
                .catch(err => {
                    /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
                    console.log('hit error');
                    this.progress = '';
                    this.error = `Anonymous Stitch authentication failed: ${err.message}`;
                    /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
                    console.error(this.error);
                });
            } else {
                /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
                console.log('already logged in');
                this.setStitchClient(this.localStitchClient);
                /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
                console.log('set Stitch client');
                this.connectDatabase();
                /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
                console.log('connected to database');
            }
        },
        connectDatabase() {
            try {
                /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
                console.log('trying to connect to database');
                const database = this.localStitchClient.getServiceClient(RemoteMongoClient.factory, "mongodb-atlas").db(config.database);
                /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
                console.log('setting database');
                this.setDatabase(database);
                /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
                console.log('database set');
            }
            catch (err) {
                /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
                console.log('failed to set database');
                this.error = `Failed to connect to the database: ${err.message}`;
                /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
                console.error(this.error);
            }
        }
    },
    mounted() {
        try {
            /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
            console.log('Trying to fetch client');
            this.localStitchClient = Stitch.getAppClient(config.appId);
        }
        catch {
            /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
            console.log('client not set');
            // The default client hasn't been set yet
            this.localStitchClient = Stitch.initializeDefaultAppClient(config.appId);
            /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
            console.log('initialised client');
        }
        /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
        console.log('about to log in');
        this.anonymousLogin();
    }
}
</script>

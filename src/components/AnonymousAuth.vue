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
    mapMutations,
    mapActions
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
        ]),
    },
    methods: {
        ...mapMutations([
            // 'setDatabase',
            // 'setStitchClient'
        ]),
        ...mapActions([
            'refreshCustomer'
        ]),
        anonymousLogin() {
            if (!this.localStitchClient.auth.isLoggedIn) {
                this.progress = 'Authing app...';
                this.localStitchClient.auth.loginWithCredential(new AnonymousCredential())
                .then(() => {
                    this.progress = '';
                    this.connectDatabase();
                    this.$root.$data.stitchClient = this.localStitchClient;
                })
                .catch(err => {
                    this.progress = '';
                    this.error = `Anonymous Stitch authentication failed: ${err.message}`;
                });
            } else {
                this.$root.$data.stitchClient = this.localStitchClient;
                this.connectDatabase();
            }
        },
        connectDatabase() {
            try {
                const database = this.localStitchClient.getServiceClient(RemoteMongoClient.factory, "mongodb-atlas").db(config.database);
                this.$root.$data.database = database;
                /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
                console.log('Connected to DB from AnonymousAuth');
                this.refreshCustomer(this.$root.$data.database);
                // TODO Fetch the customer document and write it to the
                // store. If userLoggedIn then fetch and store customer.
            }
            catch (err) {
                this.error = `Failed to connect to the database: ${err.message}`;
                /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
                console.error(this.error);
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

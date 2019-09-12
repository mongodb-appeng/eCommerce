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
            if (!this.localStitchClient.auth.isLoggedIn) {
                this.progress = 'Authing app...'
                this.localStitchClient.auth.loginWithCredential(new AnonymousCredential())
                .then(() => {
                    /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
                    console.log('Authed');
                    this.progress = '';
                    this.connectDatabase();
                    this.setStitchClient(this.localStitchClient);
                })
                .catch(err => {
                    this.progress = '';
                    this.error = `Anonymous Stitch authentication failed: ${err.message}`;
                    /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
                    console.error(this.error);
                });
            } else {
                this.setStitchClient(this.localStitchClient);
                this.connectDatabase();
            }
        },
        connectDatabase() {
            try {
                const database = this.localStitchClient.getServiceClient(RemoteMongoClient.factory, "mongodb-atlas").db("ecommerce");
                this.setDatabase(database);
            }
            catch (err) {
                this.error = `Failed to connect to the database: ${err.message}`;
                /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
                console.error(this.error);
            }
        }
    },
    mounted() {
        if (this.database) {
            // Not strictly needed but helps clean things up during development
            // TODO Remove this for production
            this.localStitchClient = Stitch.getAppClient("ecommerce-iukkg");
            this.setStitchClient(this.localStitchClient);
        } else {
            this.localStitchClient = Stitch.initializeDefaultAppClient("ecommerce-iukkg");
            this.anonymousLogin();
        }
    }
}
</script>

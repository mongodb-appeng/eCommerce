<template>
    <div>

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
    // props: ["stitchClient"], 
    data() {
        return {
            error: '',
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
                this.localStitchClient.auth.loginWithCredential(new AnonymousCredential())
                .then(() => {
                })
                .catch(err => {
                    this.error = `Anonymous Stitch authentication failed: ${err.message}`;
                    /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
                    console.error(this.error);
                });
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
        if (!this.database) {
            this.localStitchClient = Stitch.initializeDefaultAppClient("ecommerce-iukkg");
            this.setStitchClient(this.localStitchClient);
            this.anonymousLogin();
            if (this.error) {
                /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
                console.error(this.error);
            } else {
                this.connectDatabase();
            }
        }
    }
}
</script>

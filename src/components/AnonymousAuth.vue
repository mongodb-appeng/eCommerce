<template>
    <div>

    </div>
</template>

<script>
import {
    AnonymousCredential,
    RemoteMongoClient
} from "mongodb-stitch-browser-sdk"

export default {
    name: "AnonymousAuth",
    props: ["stitchClient"], 
    data() {
        return {
            error:'',

        }
    },
    methods: {
        anonymousLogin() {
        if (!this.stitchClient.auth.isLoggedIn) {
            this.stitchClient.auth.loginWithCredential(new AnonymousCredential())
            .then(() => {
            })
            .catch(err => {
                this.error = `Anonymous Stitch authentication failed: ${err.message}`;
            });
        }
    },
    connectDatabase() {
        try {
            const database = this.stitchClient.getServiceClient(RemoteMongoClient.factory, "mongodb-atlas").db("ecommerce");
            this.$emit('setDatabase', database);
        }
        catch (err) {
            this.error = `Failed to connect to the database: ${err.message}`;
            /*eslint no-console: ["error", { allow: ["warn", "error"] }] */
            console.error(this.error);
        }
    }
  },
  created() {
    this.anonymousLogin();
    if (this.error) {
        /*eslint no-console: ["error", { allow: ["warn", "error"] }] */
        console.error(this.error);
    } else {
        this.connectDatabase();
    }
  }
}
</script>

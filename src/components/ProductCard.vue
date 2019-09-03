<template>
    <div>
        <div class="box">
            <article class="media">
                <div class="media-left">
                    <figure class="image is-128x128">
                        <img :src="productDetails.productThumbnails[0]" alt="product thumbnail">
                    </figure>
                </div>
                <div class="media-content">
                    <div class="content">
                        <h5 class="title is-5">{{ productDetails.productName }}</h5>
                        <small>{{ productDetails.category }}</small>
                        <h6 class="title is-6">{{ productDetails.price.value }} {{ productDetails.price.currency }}</h6>
                        <p>{{ productSummary }}</p>
                    </div>
                    <nav class="level is-mobile">
                        <div class="level-left">
                        <a class="level-item" aria-label="reply">
                            <span class="icon is-small">
                            <i class="fas fa-reply" aria-hidden="true"></i>
                            </span>
                        </a>
                        <a class="level-item" aria-label="retweet">
                            <span class="icon is-small">
                            <i class="fas fa-retweet" aria-hidden="true"></i>
                            </span>
                        </a>
                        <a class="level-item" aria-label="like">
                            <span class="icon is-small">
                            <i class="fas fa-heart" aria-hidden="true"></i>
                            </span>
                        </a>
                        </div>
                    </nav>
                    <div v-if="progress" class="notification is-info">
                        {{ progress }}
                    </div>
                    <div v-if="error" class="notification is-danger">
                        <strong>{{ error }}</strong>
                    </div>
                    <div v-if="success" class="notification is-success">
                        {{ success }}
                    </div>
                </div>
            </article>
        </div>
    </div>
</template>

<script>
import { 
    mapState, 
    // mapMutations 
    } from 'vuex';

export default {
    name: "ProductCard",
    props: [
        // "userLoggedIn",
        // "userFirstName",
        // "stitchClient",
        // "customer",
        "productId",
        // "database"
    ], 
    components: {
    },
    data() {
        return {
            success: '',
            progress: '',
            error: '',
            productDetails: {
                productName: "Loading...",
                productThumbnails: [],
                price: {
                }
            },
            productSummary: ""
        }
    },
    computed: {
        ...mapState([
            'database'
        ]),
    },
    methods: {
        fetchProductDetails (database) {
            this.error = '';
            this.success = '';
            this.progress = "Fetching product data";

            database.collection("products")
            .findOne({"productID": this.$props.productId}) 
            .then (productDoc => {
                if (productDoc) {
                    this.productDetails = productDoc;
                    this.productSummary = productDoc.description.substring(0 ,252) + '...';
                    this.progress = ''
                    /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
                    console.log('Read a product document from the database.');
                } else {
                    this.progress = ''
                    this.error = 'Error: Product not found.'
                    /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
                    console.error(`No matching product document found in the database for productID: ${this.$props.productId}.`);
                }
            }, 
            (err) => {
                this.progress = ''
                this.error = `Error: attempt to read product document failed: ${err.message}`
                /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
                console.error(this.error);
            })
        }
    },
    mounted() {
        // this.localDatabase = this.$props.database;
        // this.fetchProductDetails(this.localDatabase);
        this.fetchProductDetails(this.database);
  }
}
</script>

<style scoped>
</style>
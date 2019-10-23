<template> 
<!-- View.js component to display a single "wathced" product (user waiting for a notification 
when this product is back in stock). Also gives the option to stop watching the product. -->
    <div>
        <div v-if="product" class="box">
            <article class="media">
                <div class="media-left">
                    <figure class="image is-64x64">
                        <img :src="product.productImages[0]">
                    </figure>
                </div>
                <div class="media-content">
                    <div class="columns">
                        <div class="column is-10">
                            <h6 class="title is-6">{{ product.productName }}</h6>
                        </div>
                        <div class="column is-2">
                            <strong>${{ product.price.sale  }}</strong>
                        </div>
                    </div>
                    <nav class="level is-mobile">
                        <div class="level-left">
                            <a class="level-item" aria-label="unwatch" v-on:click="stopWatching">
                                <span class="icon is-small">
                                <i class="fas fa-eye-slash" aria-hidden="true"></i>
                                </span>
                            </a>
                        </div>
                    </nav>
                    <Status v-bind:status="status"></Status>
                </div>
            </article>
        </div>
    </div>
</template>

<script>
import Status from '../Status.vue'
import { mapActions } from 'vuex';

export default {
    name: "watchingCard",
    components: {
        Status
    },
    props: [
        'productID',
    ], 
    data() {
        return {
            status: null,
            product: null
        }
    },
    methods: {
        ...mapActions([
            'unWatch'
        ]),

        stopWatching () {
            this.status = {state: 'progress', text: 'Unwatching product'};
            this.unWatch ({
                database: this.$root.$data.database,
                productID: this.productID
            })
            .then (() => {
                this.status = {state: 'success', text: `Unwatched product`, time: 1000};
                this.product = null;
            })
        }
    },
    mounted() {
        this.status = {state: 'progress', text: 'Fetching product'};
        this.$root.$data.database.collection('products').findOne(
                {productID: this.productID}
            )
        .then ((product) => {
            this.product = product;
            this.status = null;
        },
        (error) => {
            this.status = {state: 'error', text: `Failed to fetch document for productID ${this.productID}: ${error}`};
        })
  }
}
</script>
<style scoped>
    .title.is-6 {
        margin-bottom: 0px;
    }
    .box {
        margin-bottom: .75em; 
    }
</style>
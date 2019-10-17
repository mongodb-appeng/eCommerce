<template>
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
    mapActions,
    // mapMutations 
    } from 'vuex';

export default {
    name: "watchingCard",
    props: [
        'productID',
    ], 
    components: {
    },
    data() {
        return {
            success: '',
            progress: '',
            error: '',
            product: null
        }
    },
    computed: {
        ...mapState([
            // 'database'
        ]),
    },
    methods: {
        ...mapActions([
            'unWatch'
        ]),

        fetchProduct () {
            return this.$root.$data.database.collection('products').findOne(
                {productID: this.productID}
            );
        },

        stopWatching () {
            this.progress = 'Unwatching product';
            this.unWatch ({
                database: this.$root.data.database,
                productID: this.productID
            })
            .then (() => {
                this.progress = '';
                this.product = null;
            })
        }
    },
    mounted() {
        this.progress = 'Fetching product';
        this.fetchProduct()
        .then ((product) => {
            this.product = product;
            this.progress = '';
        },
        (error) => {
            this.progress = '';
            this.error = `Failed to fetch document for productID ${this.productID}: ${error}`;
            /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
            console.error(this.error);
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
<template>
    <div>
        <div class="box">
            <article class="media">
                <div class="media-left">
                    <figure class="image is-128x128">
                        <img :src="product.productImages[0]">
                    </figure>
                </div>
                <div class="media-content">
                    <div class="content">
                        <h6 class="title is-6">{{ product.productName }}</h6>
                        <span class="tag" v-if="product.category">{{ product.category }}</span>
                        <p><strong>${{ product.price.sale }}</strong>
                        <span v-if="product.price.list > product.price.sale">
                            <small> Reduced from ${{ product.price.list }}</small>
                        </span>
                        <br>
                        {{ productSummary }}</p>

                        <Rank
                            v-bind:score="product.reviews.averageReviewScore"
                            v-bind:numberReviews="product.reviews.numberOfReviews"
                        ></Rank>
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
import Rank from './Ranking.vue';
import { 
    mapState, 
    // mapMutations 
    } from 'vuex';

export default {
    name: "ProductCard",
    props: [
        'product',
    ], 
    components: {
        Rank
    },
    data() {
        return {
            success: '',
            progress: '',
            error: '',
            productDetails: {
                productName: "Loading...",
                productImages: [],
                price: '--'
            },
            productSummary: ""
        }
    },
    computed: {
        ...mapState([
            // 'database'
        ]),
    },
    methods: {
        prepareProductData () {
            this.productSummary = this.product.description.substring(0 ,252) + '...';
        },
    },
    created() {
        this.prepareProductData();
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
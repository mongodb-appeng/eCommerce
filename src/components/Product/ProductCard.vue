<template>
<!-- Vue.js component to display the product summary for a single product. -->
    <div>
        <div class="box">
            <article class="media">
                <div class="media-left">
                    <figure class="image is-128x128">
                        <img :src="product.productImages[0]">
                    </figure>
                </div>
                <div class="media-content">
                    <div>
                        <h6 class="title is-6">{{ product.productName }}</h6>
                        <span class="tag" v-if="product.category">{{ product.category }}</span>
                        <p><strong>${{ product.price.sale.toFixed(2) }}</strong>
                        <span v-if="product.price.list > product.price.sale">
                            <small> Reduced from ${{ product.price.list.toFixed(2) }}</small>
                        </span>
                        </p>
                        <div >
                            <p v-html="productSummary"></p>
                        </div>
                        <Rank
                            v-bind:score="product.reviews.averageReviewScore"
                            v-bind:numberReviews="product.reviews.numberOfReviews"
                        ></Rank>
                    </div>
                </div>
            </article>
        </div>
    </div>
</template>
<script>
import Rank from './Ranking.vue';

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
            productSummary: ''
        }
    },
    methods: {
        highlightText (highlights) {
            let result = '';
            highlights.forEach ((para) => {
            para.texts.forEach ((snippet) => {
                if (snippet.type == 'hit') {
                result += `<span class="has-text-primary has-text-weight-bold">${snippet.value}</span>`;
                } else {
                result += snippet.value;
                }
            })
            result += ' ';
            })
            return result;
        },
        
        prepareProductData () {
            if (this.product.highlights) {
                this.productSummary = this.highlightText(this.product.highlights).substring(0, 450) + '...';
            } else {
                this.productSummary = this.product.description.substring(0, 300) + '...';
            }
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
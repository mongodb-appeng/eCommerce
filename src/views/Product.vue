<template>
<!-- Vue.js view that displays information about a single product.
The product's `productID` is passed in via the `productID` query
parameter. -->
  <div class="home">
    <MyHeader></MyHeader>
    <section class="section">
      <div v-if="stitchReady && product" class="columns">
        <div class="column is-5 ">
          <div class="container">
            <ImageBox
              v-bind:productImages="product.productImages"
            ></ImageBox>
          </div>
        </div>
        <div class="column is-4">
          <div class="container">
            <ProductSummary
              v-bind:productName="product.productName"
              v-bind:category="product.category"
              v-bind:categoryHierarchy="product.categoryHierarchy"
              v-bind:price="product.price"
              v-bind:averageReviewScore="product.reviews.averageReviewScore"
              v-bind:numberOfReviews="product.reviews.numberOfReviews"
              v-bind:productDescription="product.description"
            ></ProductSummary>
          </div>
        </div>
        <div class="column is-3">
          <div class="container">
            <PurchaseBox
              v-bind:stockLevel="product.stockLevel"
              v-bind:productID="product.productID"
              v-bind:productName="product.productName"
              v-bind:price="product.price.sale"
              v-bind:productImage="product.productImages[0]"
            ></PurchaseBox>
          </div>
        </div>
      </div>
      <div v-if="stitchReady && product">
        <ProductReviews
            v-bind:reviews="product.reviews"
            v-bind:productID="product.productID"
            v-on:reviewStats="newReviewStats"
        ></ProductReviews>
      </div>
    </section>
    <Status v-bind:status="status"></Status>
  </div>
</template>

<script>
import MyHeader from '../components/Header.vue'
import ImageBox from '../components/Product/ImageBox.vue'
import ProductSummary from '../components/Product/ProductSummary.vue'
import PurchaseBox from '../components/Product/PurchaseBox.vue'
import ProductReviews from '../components/Product/Reviews.vue'
import Status from '../components/Status.vue'
import { setTimeout } from 'timers';

export default {
  name: 'product',
  components: {
    MyHeader,
    Status,
    ImageBox,
    ProductSummary,
    PurchaseBox,
    ProductReviews
  },
  data() {
    return {
      status: null,
      stitchReady: false,
      productID: null,
      product: null
    }
  },
  methods: {

    /**
     * Use the `productID` to fetch the product details from the database
     */
    fetchProduct() {
      if (this.productID) {
        this.status = {state: 'progress', text: 'Fetching product details'};
        this.$root.$data.database.collection('products').findOne({productID: this.productID})
        .then ((doc) => {
          if (doc) {
            this.status = null;
            this.product = doc;
          }
          else {
            this.status = {state: 'error', text: `No product found with productId ${this.productID}`};
          }
        },
        (error) => {
          this.status = {state: 'error', text: `Error: failed to read product data: ${error.message}`};
        })
      } else {
        this.status = {state: 'error', text: `Error, no productID included in URL query parameters`};
      }
    },

    /**
     * Store the review meta data for this product
     * @param {object} reviewStats - sent via an event from the `ProductReviews` component as a 
     * result of this user submitting a new review
     * @param {number} reviewStats.averageReviewScore - Average score from all reviews for this produc
     * @param {number} reviewStats.averageRevienumberOfReviewswScore - Number of reviews for this produc
     */
    newReviewStats(reviewStats) {
      this.product.reviews.averageReviewScore = reviewStats.averageReviewScore;
      this.product.reviews.numberOfReviews = reviewStats.numberOfReviews;
    },

    /**
     * Hold off on rendering anything until we've authenticated with Stitch and have a client
     * connection to use
     */
    waitUntilStitchReady() {
      if (this.$root.$data.stitchClient && this.$root.$data.stitchClient.auth.isLoggedIn) {
        this.stitchReady = true;
        this.fetchProduct();
      } else {
        let _this = this;
        setTimeout(_this.waitUntilStitchReady, 100);
      }
    }
  },
  mounted() {
    // Extract the `productID` from the URL query parameter.
    this.productID = this.$route.query.productID;
    this.waitUntilStitchReady();
  }
}
</script>

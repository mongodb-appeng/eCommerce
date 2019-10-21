<template>
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
import MyHeader from '../components/Header.vue'
import ImageBox from '../components/Product/ImageBox.vue'
import ProductSummary from '../components/Product/ProductSummary.vue'
import PurchaseBox from '../components/Product/PurchaseBox.vue'
import ProductReviews from '../components/Product/Reviews.vue'
import { setTimeout } from 'timers';

export default {
  name: 'product',
  components: {
    MyHeader,
    ImageBox,
    ProductSummary,
    PurchaseBox,
    ProductReviews
  },
  data() {
    return {
      error: '',
      progress: '',
      success: '',
      stitchReady: false,
      productID: null,
      product: null
    }
  },
  methods: {

    fetchProduct() {
      if (this.productID) {
        this.progress = 'Fetching product details';
        this.$root.$data.database.collection('products').findOne({productID: this.productID})
        .then ((doc) => {
          if (doc) {
            this.progress = '';
            this.product = doc;
          }
          else {
            this.progress = '';
            this.error = `No product found with productId ${this.productID}`;
          }
        },
        (error) => {
          this.progress = '';
          this.error = `Error: failed to read product data: ${error.message}`;
          /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
          console.error(this.error);
        })
      } else {
        this.error = 'Error, no productID included in URL query parameters';
      }
    },

    newReviewStats(reviewStats) {
      this.product.reviews.averageReviewScore = reviewStats.averageReviewScore;
      this.product.reviews.numberOfReviews = reviewStats.numberOfReviews;
    },

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
    this.productID = this.$route.query.productID;
    this.waitUntilStitchReady();
  }
}
</script>

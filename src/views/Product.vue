<template>
  <div class="home">
    <MyHeader></MyHeader>
    <div>
      <AnonymousAuth></AnonymousAuth>
    </div>
    <section class="section">
      <div v-if="stitchReady && product" class="columns">
        <div class="column is-5 restrict-height">
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
import {
    mapState,
    // mapMutations
    } from 'vuex';
import MyHeader from '../components/Header.vue'
import AnonymousAuth from '../components/AnonymousAuth.vue'
import ImageBox from '../components/Product/ImageBox.vue'
import ProductSummary from '../components/Product/ProductSummary.vue'
import PurchaseBox from '../components/Product/PurchaseBox.vue'
import ProductReviews from '../components/Product/Reviews.vue'
import { setTimeout } from 'timers';

export default {
  name: 'product',
  props: [
  ],
  components: {
    AnonymousAuth,
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
  computed: {
      ...mapState([
          'userLoggedIn',
          'stitchClient',
          'database'
      ]),
  },
  methods: {
    fetchProduct() {
      if (this.productID) {
        this.progress = 'Fetching product details';
        this.database.collection('products').findOne({productID: this.productID})
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
      // TODO
      this.product.reviews.averageReviewScore = reviewStats.averageReviewScore;
      this.product.reviews.numberOfReviews = reviewStats.numberOfReviews;
    },
    waitUntilStitchReady() {
      if (this.stitchClient && this.stitchClient.auth.isLoggedIn) {
        this.stitchReady = true;
        this.fetchProduct();
      } else {
        /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
        console.log('Waiting');
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

<style scoped>
.restrict-height {
  height: 600px;
  overflow: scroll;
}
</style>

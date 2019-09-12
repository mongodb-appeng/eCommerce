<template>
  <div class="home">
    <MyHeader></MyHeader>
    <!-- Check if this v is needed -->
    <!-- <div v-if="!userLoggedIn"> -->
    <div>
      <AnonymousAuth></AnonymousAuth>
    </div>
    <section class="section">
      <h1 class="title is-1">Welcome to the product page for productID {{ productID }}</h1>
      <div v-if="stitchReady" class="columns">
        <div class="column is-3 half-height">
          <div class="container">
          </div>
        </div>
        <div class="column scroll" id="products">
          <div class="container">      
          </div>
        </div>
      </div>

    </section>
  </div>
</template>

<script>
import {
    mapState,
    // mapMutations
    } from 'vuex';
import MyHeader from '../components/Header.vue'
import AnonymousAuth from '../components/AnonymousAuth.vue'
import { setTimeout } from 'timers';

export default {
  name: 'product',
  props: [
  ],
  components: {
    AnonymousAuth,
    MyHeader
  },
  data() {
    return {
      stitchReady: false,
      productID: ''
    }
  },
  computed: {
      ...mapState([
          'userLoggedIn',
          'stitchClient'
      ]),
  },
  methods: {
    waitUntilStitchReady() {
       if (this.stitchClient && this.stitchClient.auth.isLoggedIn) {
         this.stitchReady = true;
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

</style>

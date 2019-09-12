<template>
  <div class="home">
    <MyHeader></MyHeader>
    <div v-if="!userLoggedIn">
      <AnonymousAuth></AnonymousAuth>
    </div>
    <section class="section">
      <div v-if="stitchReady" class="columns">
        <div class="column is-3 no-scroll">
          <div class="container">
            <CategoryMenu v-on:set-category-filter="setCategoryFilter"></CategoryMenu>
          </div>
        </div>
        <div class="column scroll" id="products">
          <div class="container">
            <ProductCards
              v-bind:path="path"
            >
            </ProductCards>           
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
import ProductCards from '../components/ProductCards.vue'
import CategoryMenu from "../components/CategoryMenu.vue"
import { setTimeout } from 'timers';

export default {
  name: 'home',
  props: [
  ],
  components: {
    AnonymousAuth,
    MyHeader,
    ProductCards,
    CategoryMenu
  },
  data() {
    return {
      path: [],
      stitchReady: false
    }
  },
  computed: {
      ...mapState([
          'userLoggedIn',
          'stitchClient'
      ]),
  },
  methods: {
    setCategoryFilter(path) {
      this.path = path;
    },
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
    this.waitUntilStitchReady();
  }
}
</script>

<style scoped>

</style>

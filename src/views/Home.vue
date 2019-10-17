<template>
  <div class="home">
    <MyHeader
      v-bind:homePage="home"
      v-on:search-term="search"
    ></MyHeader>
    <!-- <div v-if="!userLoggedIn"> -->
    <div>
      <AnonymousAuth></AnonymousAuth>
    </div>
    <section class="section">
      <div v-if="stitchReady" class="columns">
        <div class="column is-3 restrict-height">
          <div class="container">
            <CategoryMenu></CategoryMenu>
          </div>
        </div>
        <div class="column scroll" id="products">
          <div class="container">
            <ProductCards
              v-bind:path="path"
              v-bind:searchTerm="searchTerm"
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
import ProductCards from '../components/Product/ProductCards.vue'
import CategoryMenu from "../components/Product/CategoryMenu.vue"
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
      stitchReady: false,
      home: true,
      searchTerm: ''
    }
  },
  computed: {
      ...mapState([
          // 'userLoggedIn'
          // 'stitchClient'
      ]),
  },
  methods: {
    waitUntilStitchReady() {
       if (this.$root.$data.stitchClient && this.$root.$data.stitchClient.auth.isLoggedIn) {
         this.stitchReady = true;
       } else {
         let _this = this;
         setTimeout(_this.waitUntilStitchReady, 100);
       }
    },
    search (searchTerm) {
      this.searchTerm = searchTerm;
    }
  },
  mounted() {
    this.waitUntilStitchReady();
  }
}
</script>

<style scoped>
.restrict-height {
  height: 75vh;
  overflow: scroll;
}
</style>

<template>
  <div class="home">
    <MyHeader
      v-bind:homePage="true"
      v-on:search-term="search"
    ></MyHeader>
    <section class="section">
      <div v-if="stitchReady" class="columns">
        <div v-if="windowWidth >= 800" class="column is-3 restrict-height">
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
import MyHeader from '../components/Header.vue'
import ProductCards from '../components/Product/ProductCards.vue'
import CategoryMenu from "../components/Product/CategoryMenu.vue"
import { setTimeout } from 'timers';

export default {
  name: 'home',
  components: {
    MyHeader,
    ProductCards,
    CategoryMenu
  },
  data() {
    return {
      path: [],
      stitchReady: false,
      windowWidth: 100,
      searchTerm: ''
    }
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
    },

    handleResize() {
      this.windowWidth = window.innerWidth;
    }
  },
  created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  mounted() {
    this.waitUntilStitchReady();
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  }
}
</script>

<style scoped>
.restrict-height {
  height: 75vh;
  overflow: scroll;
}
</style>

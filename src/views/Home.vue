<template>
<!-- Home 'page' for the application. This is the store front where you:
- View and select products to look at in more detail
- Filter based on product categories
- Search for products using MongoDB Atlas full-text search -->
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
    /**
     * Hold off on rendering anything until we've authenticated with Stitch and have a client
     * connection to use
     */
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

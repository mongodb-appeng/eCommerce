<template>
<div>
  <div v-if="!userLoggedIn">
    <AnonymousAuth></AnonymousAuth>
  </div>
  <ul id="category-list">
  <li
    v-for="category in categories"
    v-bind:key="category">
      {{category}}           
  </li>
</ul> 
</div>
</template>

<script>
import {
    mapState,
    // mapMutations
    } from 'vuex';
// import MyHeader from '../components/Header.vue'
import AnonymousAuth from '../components/AnonymousAuth.vue'
// import ProductCards from '../components/ProductCards.vue'

export default {
  name: 'test',
  props: [
  ],
  components: {
    AnonymousAuth,
    // MyHeader,
    // ProductCards
  },
  data() {
    return {
      categories: ['numpty', 'fish'],
      categoryHierarchies: []
    }
  },
  computed: {
      ...mapState([
        'userLoggedIn',
        'database'
      ]),
  },
  methods: {
    // populateCategories () {
    //   const products = this.database.collection("products");
    //   // const meta = database.collection("meta");

    //   /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
    //   console.log(`Fetching product categories`);
    //   try {
    //     products.find(
    //       {},
    //       {projection:
    //         {category: 1}
    //       }).toArray()
    //     .then ((docArray) => {
    //       // this.categories.push(docArray[3].category);
    //       /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
    //       console.log(`${docArray.length} elements`);
    //       docArray.forEach((item) => {
    //         this.categories.push(item.category);
    //       },
    //       (error) => {
    //         /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
    //         console.error(`Processing product failed: ${error.message}`); 
    //       });
    //     },
    //     (error) => {
    //       /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
    //       console.error(`Find failed: ${error.message}`);        
    //     })
    //   }
    //   catch (error) {
    //     /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
    //     console.error (`Failed building category tree: ${error.message}`);
    //   }
    // },
    populateCategoryTree () {
      const products = this.database.collection("products");
      // const meta = database.collection("meta");

      /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
      console.log(`Fetching product categories`);
      try {
        products.find(
          {},
          {projection:
            {categoryHierarchy: 1}
          }).toArray()
        .then ((docArray) => {
          // this.categories.push(docArray[3].category);
          /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
          console.log(`${docArray.length} elements`);
          docArray.forEach((item) => {
            this.categoryHierarchies.push(item.categoryHierarchy);
          },
          (error) => {
            /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
            console.error(`Processing product failed: ${error.message}`); 
          });
        },
        (error) => {
          /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
          console.error(`Find failed: ${error.message}`);        
        })
      }
      catch (error) {
        /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
        console.error (`Failed building category tree: ${error.message}`);
      }
    }
  },
  
  mounted() {
    // this.populateCategories();
    this.populateCategoryTree();
  }
}
</script>

<style scoped>
  /* .columns {
    height: 100%;
    margin-top: 0;
    margin-bottom: 0;
  } */
  .column.no-scroll {
    /* overflow: auto; */
    overflow:visible;
    position:sticky;
    top: 3.2rem;
  }

  .column.scroll {
    display: flex;
    justify-content: center;
    align-items: center;
   }
</style>

<template>
<div>
  <!-- <div v-if="!userLoggedIn">
    <AnonymousAuth></AnonymousAuth>
  </div>
  <div>
    <ul class="category-list level-1">
      <li v-for="category in categoryTree.children[0].children" v-bind:key="category.name">
        {{category.name}}
        <ul v-if="category.children" class="category-list level-2">

        </ul>
      </li>
    </ul>
  </div>
  <div v-if="error" class="notification is-danger">
      <strong>{{ error }}</strong>
  </div>
  <div v-if="success" class="notification is-success">
      {{ success }}
  </div>
  <div v-if="progress" class="notification is-primary">
      {{ progress }}
  </div> -->
</div>
</template>

<script>
// import {
//     mapState,
//     // mapMutations
//     } from 'vuex';
// import AnonymousAuth from '../components/AnonymousAuth.vue'

export default {
  name: 'test',
  props: [
  ],
  components: {
    // AnonymousAuth
  },
  data() {
    return {
    // error: '',
    // progress: '',
    // success: '',
    // categoryTree: null
    }
  },
  computed: {
      // ...mapState([
      //   // 'userLoggedIn',
      //   // 'database'
      // ]),
  },
  methods: {
    // fetchTree() {
    //   if (!this.categoryTree) {
    //     this.progress = 'Fetching product categories';
    //     /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
    //     console.log('Fetching category tree');
    //     this.database.collection('meta').findOne({name: 'categoryTree'})
    //     .then ((tree) => {
    //       this.progress = '';
    //       this.categoryTree = tree;
    //     },
    //     (error) => {
    //       this.progress = '';
    //       this.error = `Failed to fetch the product categories: ${error.message}`;
    //       /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */ 
    //       console.error(this.error);
    //     })
    //   }
    // } 
  },
  
  mounted() {
    // this.fetchTree();
  }
}
</script>

<style scoped>

</style>

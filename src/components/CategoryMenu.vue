<template>
<div>
  <!-- <div v-if="!userLoggedIn">
    <AnonymousAuth></AnonymousAuth>
  </div> -->
  <div v-if="categoryTree">
    <CategoryNode
      v-bind:nodes="categoryTree.children"
      v-bind:name="categoryTree.name"
      v-bind:depth="0"
      v-bind:path="[]"
      v-on:set-category-filter="setCategoryFilter"
    >
    </CategoryNode>
  </div>
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
import CategoryNode from '../components/CategoryNode.vue'

export default {
  name: 'CategoryMenu',
  props: [
  ],
  components: {
    CategoryNode
  },
  data() {
    return {
    error: '',
    progress: '',
    success: '',
    categoryTree: null
    }
  },
  computed: {
      ...mapState([
        'userLoggedIn',
        'database'
      ]),
  },
  methods: {
    fetchTree() {
      if (!this.categoryTree) {
        this.progress = 'Fetching product categories';
        /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
        console.log('Fetching category tree');
        this.database.collection('meta').findOne(
          {name: 'categoryTree'}
        )
        .then ((tree) => {
          this.progress = '';
          // Root node just identifies that the tree contains
          // categories
          if (tree && tree.children) {
            tree = tree.children[0];
            // tree.name = 'Categories';
          }
          this.categoryTree = tree;
        },
        (error) => {
          this.progress = '';
          this.error = `Failed to fetch the product categories: ${error.message}`;
          /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */ 
          console.error(this.error);
        })
      }
    },
    setCategoryFilter(path) {
        this.$emit('set-category-filter', path);
    }
  },
  
  mounted() {
    this.fetchTree();
  }
}
</script>

<style scoped>

</style>

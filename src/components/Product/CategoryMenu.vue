<template>
<div>
  <div v-if="saleCategoryTree">
    <CategoryNode
      v-bind:nodes="saleCategoryTree.children"
      v-bind:name="saleCategoryTree.name"
      v-bind:count="saleCategoryTree.count"
      v-bind:depth="0"
      v-bind:path="[]"
    >
    </CategoryNode>
  </div>
    <div v-if="categoryTree">
    <CategoryNode
      v-bind:nodes="categoryTree.children"
      v-bind:name="categoryTree.name"
      v-bind:count="categoryTree.count"
      v-bind:depth="0"
      v-bind:path="[]"
      v-on:set-category-filter="setCategoryFilter"
    >
    </CategoryNode>
  </div>
  <Status v-bind:status="status"></Status>
</div>
</template>

<script>
import {mapMutations} from "vuex";
import CategoryNode from './CategoryNode.vue'
import Status from '../Status.vue'

export default {
  name: 'CategoryMenu',
  components: {
    CategoryNode,
    Status
  },
  data() {
    return {
      status: null,
      categoryTree: null,
      saleCategoryTree: null
    }
  },
  methods: {
    ...mapMutations([
      'setCategoryFilter'
    ]),
    
    fetchTree() {
      if (!this.categoryTree) {
        this.status = {state: 'progress', text: 'Fetching product categories'};
        this.$root.$data.database.collection('meta').findOne(
          {name: 'categoryTree'}
        )
        .then ((tree) => {
          this.status = null;
          // Root node just identifies that the tree contains
          // categories
          if (tree && tree.children) {
            tree = tree.children[0];
          }
          this.categoryTree = tree;
        },
        (error) => {
          this.status = {state: 'error', text: `Failed to fetch the product categories: ${error}`};
        })
      }
    },

    fetchSaleTree() {
      if (!this.saleCategoryTree) {
        this.$root.$data.database.collection('meta').findOne(
          {name: 'saleCategoryTree'}
        )
        .then ((tree) => {
          // Root node just identifies that the tree contains
          // categories
          if (tree && tree.children) {
            tree = tree.children[0];
          }
          this.saleCategoryTree = tree;
        },
        (error) => {
          this.status = {state: 'error', text: `Failed to fetch the sales product categories: ${error}`};
        })
      }
    }
  },
  mounted() {
    this.fetchTree();
    this.fetchSaleTree();
  }
}
</script>
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
import CategoryNode from './CategoryNode.vue'

export default {
  name: 'CategoryMenu',
  components: {
    CategoryNode
  },
  data() {
    return {
      error: '',
      progress: '',
      success: '',
      categoryTree: null,
      saleCategoryTree: null
    }
  },
  methods: {
    fetchTree() {
      if (!this.categoryTree) {
        this.progress = 'Fetching product categories';
        this.$root.$data.database.collection('meta').findOne(
          {name: 'categoryTree'}
        )
        .then ((tree) => {
          this.progress = '';
          // Root node just identifies that the tree contains
          // categories
          if (tree && tree.children) {
            tree = tree.children[0];
          }
          this.categoryTree = tree;
        },
        (error) => {
          this.progress = '';
          this.error = `Failed to fetch the product categories: ${error}`;
          /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */ 
          console.error(this.error);
        })
      }
    },

    fetchSaleTree() {
      if (!this.saleCategoryTree) {
        this.progress = 'Fetching sales product categories';
        this.$root.$data.database.collection('meta').findOne(
          {name: 'saleCategoryTree'}
        )
        .then ((tree) => {
          this.progress = '';
          // Root node just identifies that the tree contains
          // categories
          if (tree && tree.children) {
            tree = tree.children[0];
          }
          this.saleCategoryTree = tree;
        },
        (error) => {
          this.progress = '';
          this.error = `Failed to fetch the sales product categories: ${error}`;
          /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */ 
          console.error(this.error);
        })
      }
    }
  },
  mounted() {
    this.fetchSaleTree();
    this.fetchTree();
  }
}
</script>
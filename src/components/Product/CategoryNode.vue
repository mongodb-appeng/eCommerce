<template>
  <div>
    <div class="category-menu">
      <div
        v-bind:style="indent"
        v-on:click="categoryClicked"
      >
        <div class="control">
          <a class="button is-not-outlined">
            <span class="icon">
              <i v-if="nodes.length > 0" v-bind:class="iconClasses"></i>
            </span>
            <span>{{ name }} </span><span v-if="count"><small>&nbsp; ({{ count }})</small></span>
          </a>
        </div>
      </div>
      <div v-if="showChildren">
        <CategoryNode
            v-for="node in nodes"
            v-bind:key="node.name"
            v-bind:name="node.name"
            v-bind:count="node.count"
            v-bind:nodes="node.children"
            v-bind:depth="depth + 1"
            v-bind:path="newPath"
            v-on:set-category-filter="setCategoryFilter"
        >
        </CategoryNode>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mapState,
  mapMutations
} from "vuex";

export default {
  name: "CategoryNode",
  props: [
      "nodes",
      "name",
      'count',
      "depth",
      "path"
      ],
  components: {},
  data() {
    return {
      showChildren: false
    };
  },
  computed: {
    ...mapState(["userLoggedIn", "database"]),
    indent() {
        return {
            transform: `translate(${this.depth * 10}px)`
        }
    },
    labelClasses() {
      return { 'has-children': this.$children }
    },
    iconClasses() {
      return {
        'far fa-plus-square': !this.showChildren,
        'far fa-minus-square': this.showChildren
      }
    },
    newPath() {
      let path = [...this.path];
      if (this.depth > 0) {
        path.push(this.name);
      }
      return path;
    }
  },
  methods: {
      ...mapMutations([
        'setCategoryFilter'
      ]),
      categoryClicked() {
        this.showChildren = !this.showChildren;
        this.$emit('set-category-filter', this.newPath);
      }
  },

  mounted() {}
};
</script>

<style scoped>
  .button {
    border: none
  }
</style>

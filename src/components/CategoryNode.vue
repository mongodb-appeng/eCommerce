<template>
  <div>
    <div class="category-menu">
      <div
        v-bind:style="indent"
        v-on:click="categoryClicked"
      >
        <div class="control">
          <a class="button is-small is-not-outlined">
            <span class="icon is-small">
              <i v-if="nodes.length > 0" v-bind:class="iconClasses"></i>
            </span>
            <span>{{ name }}</span>
          </a>
        </div>
      </div>
      <div v-if="showChildren">
        <CategoryNode
            v-for="node in nodes"
            v-bind:key="node.name"
            v-bind:name="node.name"
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
  mapState
  // mapMutations
} from "vuex";

export default {
  name: "CategoryNode",
  props: [
      "nodes",
      "name",
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
            transform: `translate(${this.depth * 20}px)`
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
      categoryClicked() {
        this.showChildren = !this.showChildren;
        this.$emit('set-category-filter', this.newPath);
      },
      setCategoryFilter(path) {
        this.$emit('set-category-filter', path);
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

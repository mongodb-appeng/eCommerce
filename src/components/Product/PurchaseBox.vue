<template>
  <div class>
    <section class="section">
      <h3 class="title is-3">Placeholder for purchase panel</h3>
    </section>
    <span v-if="stockLevel > 0" class="has-text-primary">{{ stockLevel }} units in stock</span>
    <span v-else class="has-text-danger">Product is out of stock</span>
  </div>
</template>

<script>
import {
    mapState,
    // mapMutations
    } from 'vuex';

export default {
  name: 'purchase-box',
  props: [
    'stockLevel'
  ],
  components: {
  },
  data() {
    return {
    }
  },
  computed: {
      ...mapState([
      ]),
  },
  methods: {
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>

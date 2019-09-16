<template>
  <div class="container">
    <section class="section">
      <h3 class="title is-3">Reviews</h3>
      <ul id="review-list">
        <li
          v-for="review in reviews"
          v-bind:key="review">
            <div class="box"> {{ review.review }}</div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import {
    mapState,
    // mapMutations
    } from 'vuex';

export default {
  name: 'product-reviews',
  props: [
    'reviews'
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
    .box {
        margin-bottom: .75em; 
    }
</style>

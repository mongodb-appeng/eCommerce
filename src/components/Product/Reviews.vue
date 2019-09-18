<template>
  <div class="container">
    <section class="section">
      <h3 class="title is-3">Reviews</h3>
      <ul id="review-list">
        <li
          v-for="review in reviews"
          v-bind:key="review.review">
            <div class="box">
              {{ review.review }} <br/><br/>
                <div class="level-left">
                  <a class="level-item" aria-label="reply">
                    <span v-if="review.score >= 1" class="icon is-small has-text-warning">
                      <i class="fas fa-star" aria-hidden="true"></i>
                    </span>
                    <span v-else class="icon is-small has-text-warning">
                      <i class="far fa-star" aria-hidden="true"></i>
                    </span>
                  </a>
                  <a class="level-item" aria-label="reply">
                    <span v-if="review.score >= 2" class="icon is-small has-text-warning">
                      <i class="fas fa-star" aria-hidden="true"></i>
                    </span>
                    <span v-else class="icon is-small has-text-warning">
                      <i class="far fa-star" aria-hidden="true"></i>
                    </span>
                  </a>
                  <a class="level-item" aria-label="reply">
                    <span v-if="review.score >= 3" class="icon is-small has-text-warning">
                      <i class="fas fa-star" aria-hidden="true"></i>
                    </span>
                    <span v-else class="icon is-small has-text-warning">
                      <i class="far fa-star" aria-hidden="true"></i>
                    </span>
                  </a>
                  <a class="level-item" aria-label="reply">
                    <span v-if="review.score >= 4" class="icon is-small has-text-warning">
                      <i class="fas fa-star" aria-hidden="true"></i>
                    </span>
                    <span v-else class="icon is-small has-text-warning">
                      <i class="far fa-star" aria-hidden="true"></i>
                    </span>
                  </a>
                  <a class="level-item" aria-label="reply">
                    <span v-if="review.score >= 5" class="icon is-small has-text-warning">
                      <i class="fas fa-star" aria-hidden="true"></i>
                    </span>
                    <span v-else class="icon is-small has-text-warning">
                      <i class="far fa-star" aria-hidden="true"></i>
                    </span>
                  </a>
                </div>
            </div>
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

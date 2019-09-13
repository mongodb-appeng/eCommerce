<template>
  <div class>
    <section class="section">
      <h3 class="title is-3">{{ productName }}</h3>
      <!-- TODO: make clickable -->
      <span class="tag" v-if="category">{{ category }}</span>
      <Rank
        v-bind:score="averageReviewScore"
        v-bind:numberReviews="numberOfReviews"
      >
      </Rank>
      <table class="table" cellspacing="0" id="pricing">
        <tbody>
          <tr v-if="price.list">
            <td class="right">List price:</td>
            <td>${{ price.list }}</td>
          </tr>
          <tr>
            <td class="right last-child">Our price:</td>
            <td><strong>${{ price.sale }}</strong>&nbsp; <span class="tag is-danger" v-if="saleTag">{{ saleTag }}</span></td>
          </tr>
          <tr v-if="saving > 0">
            <td class="right">You save:</td>
            <td>${{ saving }} (%{{ savingPC }})</td>
          </tr>
        </tbody>
      </table>
      <!-- TODO: make these links -->
      <nav class="breadcrumb has-arrow-separator" aria-label="breadcrumbs">
        <ul id="category-breadcrumbs">
          <li
            v-for="category in categoryHierarchy.slice(1, categoryHierarchy.length)"
            v-bind:key="category"
          >
            <span class="tag">{{ category }}</span>
          </li>
        </ul>
      </nav>
      <div class="content" id="product-description">
        {{ productDescription }}
      </div>

    </section>
  </div>
</template>

<script>
import {
    mapState,
    // mapMutations
    } from 'vuex';
import Rank from './Ranking.vue'

export default {
  name: 'product-summary',
  props: [
    'productName',
    'category',
    'categoryHierarchy',
    'price',
    'averageReviewScore',
    'numberOfReviews',
    'productDescription'
  ],
  components: {
    Rank
  },
  data() {
    return {
      saving: 0,
      savingPC: 0,
      saleTag: null
    }
  },
  computed: {
      ...mapState([
      ]),
  },
  methods: {
    calculateSaving() {
      if (this.price && this.price.sale > 0 && this.price.list > 0) {
        this.saving = (this.price.list - this.price.sale).toFixed(2);
        this.savingPC = 100 * ((this.price.list - this.price.sale)/this.price.list).toFixed(2);
        if (this.categoryHierarchy.includes('sale')) {
          this.saleTag = 'sale';
        }
      }
      
    }
  },
  mounted() {
    this.calculateSaving();
  }
}
</script>

<style scoped>
td.right {
  text-align: right;
}
td {
  border:none;
}
</style>

<template>
  <div class="home">
    <MyHeader></MyHeader>
    <div v-if="!userLoggedIn">
      <AnonymousAuth></AnonymousAuth>
    </div>
    <section class="section">
      <div class="columns">
        <div class="column is-3 no-scroll">
          <!-- TODO: the category menu goes here -->
        </div>
        <div class="column scroll" id="products">
          <div class="container">
            <ProductCards></ProductCards>           
          </div>
        </div>
      </div>

    </section>
  </div>
</template>

<script>
import {
    mapState,
    // mapMutations
    } from 'vuex';
import MyHeader from '../components/Header.vue'
import AnonymousAuth from '../components/AnonymousAuth.vue'
import ProductCards from '../components/ProductCards.vue'

export default {
  name: 'home',
  props: [
  ],
  components: {
    AnonymousAuth,
    MyHeader,
    ProductCards
  },
  data() {
    return {
    }
  },
  computed: {
      ...mapState([
          'userLoggedIn'
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

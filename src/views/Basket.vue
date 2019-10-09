<template>
  <div class="basket">
    <MyHeader></MyHeader>
    <div v-if="!userLoggedIn">
      <AnonymousAuth></AnonymousAuth>
    </div>
    <section class="section">
      <div v-if="stitchReady" class="columns">
        <div class="column is-9 scroll" id="products">
          <div class="container">
            <BasketCards>
            </BasketCards>           
          </div>
        </div>
        <div class="column is-3 restrict-height">
          <div class="container">
              <strong>Basket Total: ${{ metaCustomer.shoppingBasketValue.toFixed(2) }}</strong>
          </div>
            <div class="buttons">
            <p>
              <a 
                v-if="metaCustomer.shoppingBasketSize > 0" 
                v-on:click="checkout" 
                class="button is-primary  is-focused">
                  <span class="icon">
                      <i class="fas fa-wallet"></i>
                  </span>
                  <span>Checkout</span>
              </a>
              <a v-else class="button is-grey" disabled>
                  <span class="icon">
                      <i class="fas fa-wallet"></i>
                  </span>
                  <span>Checkout</span>
              </a>
            </p>
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
import BasketCards from '../components/Basket/BasketCards.vue'
import { setTimeout } from 'timers';

export default {
  name: 'basket',
  props: [
  ],
  components: {
    AnonymousAuth,
    MyHeader,
    BasketCards
  },
  data() {
    return {
      path: [],
      stitchReady: false
    }
  },
  computed: {
      ...mapState([
          'userLoggedIn',
          'stitchClient',
          'customer',
          'metaCustomer'
      ])
  },
  methods: {
    waitUntilStitchReady() {
       if (this.stitchClient && this.stitchClient.auth.isLoggedIn) {
         this.stitchReady = true;
       } else {
         let _this = this;
         setTimeout(_this.waitUntilStitchReady, 100);
       }
    },
    checkout () {
      this.$router.push({name: 'checkout'})
    }
  },
  mounted() {
    this.waitUntilStitchReady();
  }
}
</script>

<style scoped>
.restrict-height {
  height: 75vh;
  overflow: scroll;
}
</style>

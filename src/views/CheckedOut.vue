<template>
  <div class="checked-out">
    <MyHeader></MyHeader>
    <section class="section">
      <div class="container">
        <h3 class="title is-3">Payment complete</h3>
      </div>
    </section>
    <div class="container">
      <div v-if="progress" class="notification is-primary">
          {{ progress }}
      </div>
      <div v-if="error" class="notification is-danger">
          <strong>{{ error }}</strong>
      </div>
    </div>
  </div>
</template>

<script>
import {
    mapMutations,
    mapActions
    } from 'vuex';
import MyHeader from '../components/Header.vue'
import { setTimeout } from 'timers';

export default {
  name: 'checkedout',
  props: [
  ],
  components: {
    MyHeader
  },
  data() {
    return {
      progress: '',
      error: ''
    }
  },
  methods: {
    ...mapMutations([
      'clearBasket'
    ]),
    ...mapActions([
        'fetchOrders',
        'calcBasketStats'
    ]),
    
    updateBasketAndOrders () {
      this.clearBasket();
      this.calcBasketStats();
      this.fetchOrders(this.$root.$data.database)
      .then(() => {
        this.progress = 'Taking you back to the store...';
        let _this = this;
        setTimeout(function () {_this.$router.push({name: 'home'})}, 3000);
      },
      (error) => {
        this.error = `Failed to fetch your orders from the database: ${error}`;
        /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
        console.log(this.error);
      });
    },

    waitUntilStitchReady() {
      if (this.$root.$data.stitchClient && this.$root.$data.stitchClient.auth.isLoggedIn) {
        this.updateBasketAndOrders();
      } else {
        let _this = this;
        setTimeout(_this.waitUntilStitchReady, 100);
      }
    }
  },
  mounted() {
    this.waitUntilStitchReady();
  }
}
</script>
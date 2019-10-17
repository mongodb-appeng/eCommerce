<template>
  <div class="checked-out">
    <MyHeader></MyHeader>
    <!-- <div>
      <AnonymousAuth></AnonymousAuth>
    </div> -->
    <section class="section">
      <div class="container">
        <h3 class="title is-3">Payment complete</h3>
      </div>
      <div v-if="stitchReady">
          
      </div>
    </section>
    <div class="container">
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
  </div>
</template>

<script>
import {
    mapState,
    mapMutations,
    mapActions
    } from 'vuex';
import MyHeader from '../components/Header.vue'
// import AnonymousAuth from '../components/AnonymousAuth.vue'
import { setTimeout } from 'timers';

export default {
  name: 'checkedout',
  props: [
  ],
  components: {
    // AnonymousAuth,
    MyHeader
  },
  data() {
    return {
      error: '',
      progress: '',
      success: '',
      stitchReady: false,
      stripeSessionID: null
    }
  },
  computed: {
      ...mapState([
          // 'userLoggedIn',
          // 'stitchClient',
          // 'database'
      ]),
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
      });
    },

    waitUntilStitchReady() {
      if (this.$root.$data.stitchClient && this.$root.$data.stitchClient.auth.isLoggedIn) {
        this.updateBasketAndOrders();
        this.stitchReady = true;
      } else {
        let _this = this;
        setTimeout(_this.waitUntilStitchReady, 100);
      }
    }
  },
  mounted() {
    this.stripeSessionID = this.$route.query.session_id;
    this.waitUntilStitchReady();
  }
}
</script>

<style scoped>
</style>
